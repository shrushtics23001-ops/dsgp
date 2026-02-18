from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import uuid
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('game_database.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Game progress table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS game_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            data_structure TEXT NOT NULL,
            level_id INTEGER NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            best_score INTEGER DEFAULT 0,
            best_time INTEGER DEFAULT 0,
            best_moves INTEGER DEFAULT 0,
            attempts INTEGER DEFAULT 0,
            last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, data_structure, level_id)
        )
    ''')
    
    # User stats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_score INTEGER DEFAULT 0,
            total_time INTEGER DEFAULT 0,
            levels_completed INTEGER DEFAULT 0,
            total_attempts INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Utility functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_db_connection():
    conn = sqlite3.connect('game_database.db')
    conn.row_factory = sqlite3.Row
    return conn

# User authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        if len(username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', (username, email))
        existing_user = cursor.fetchone()
        
        if existing_user:
            conn.close()
            return jsonify({'error': 'Username or email already exists'}), 409
        
        # Create new user
        password_hash = hash_password(password)
        cursor.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            (username, email, password_hash)
        )
        
        user_id = cursor.lastrowid
        
        # Initialize user stats
        cursor.execute(
            'INSERT INTO user_stats (user_id) VALUES (?)',
            (user_id,)
        )
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user_id,
                'username': username,
                'email': email
            }
        }), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed. Please try again.'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400
        
        password_hash = hash_password(password)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'SELECT id, username, email FROM users WHERE username = ? AND password_hash = ?',
            (username, password_hash)
        )
        
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed. Please try again.'}), 500

# Game progress routes
@app.route('/api/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get user stats
        cursor.execute('SELECT * FROM user_stats WHERE user_id = ?', (user_id,))
        stats = cursor.fetchone()
        
        # Get detailed progress for each data structure
        cursor.execute('''
            SELECT data_structure, 
                   COUNT(*) as total_levels,
                   SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_levels,
                   SUM(best_score) as total_ds_score
            FROM game_progress 
            WHERE user_id = ?
            GROUP BY data_structure
        ''', (user_id,))
        
        ds_progress = cursor.fetchall()
        
        # Get all level progress
        cursor.execute('SELECT * FROM game_progress WHERE user_id = ?', (user_id,))
        all_progress = cursor.fetchall()
        
        conn.close()
        
        result = {
            'stats': dict(stats) if stats else {
                'total_score': 0,
                'total_time': 0,
                'levels_completed': 0,
                'total_attempts': 0
            },
            'data_structure_progress': [dict(row) for row in ds_progress],
            'all_progress': [dict(row) for row in all_progress]
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/progress', methods=['POST'])
def update_progress():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        data_structure = data.get('data_structure')
        level_id = data.get('level_id')
        completed = data.get('completed', False)
        score = data.get('score', 0)
        time_taken = data.get('time_taken', 0)
        moves = data.get('moves', 0)
        
        if not all([user_id, data_structure, level_id]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if progress record exists
        cursor.execute('''
            SELECT * FROM game_progress 
            WHERE user_id = ? AND data_structure = ? AND level_id = ?
        ''', (user_id, data_structure, level_id))
        
        existing = cursor.fetchone()
        
        if existing:
            # Update existing record
            new_best_score = max(existing['best_score'], score)
            new_best_time = min(existing['best_time'], time_taken) if time_taken > 0 else existing['best_time']
            new_best_moves = min(existing['best_moves'], moves) if moves > 0 else existing['best_moves']
            
            cursor.execute('''
                UPDATE game_progress 
                SET completed = ?,
                    best_score = ?,
                    best_time = ?,
                    best_moves = ?,
                    attempts = attempts + 1,
                    last_played = CURRENT_TIMESTAMP
                WHERE user_id = ? AND data_structure = ? AND level_id = ?
            ''', (completed, new_best_score, new_best_time, new_best_moves, 
                  user_id, data_structure, level_id))
        else:
            # Create new record
            cursor.execute('''
                INSERT INTO game_progress 
                (user_id, data_structure, level_id, completed, best_score, best_time, best_moves, attempts)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            ''', (user_id, data_structure, level_id, completed, score, time_taken, moves))
        
        # Update user stats
        if completed:
            cursor.execute('''
                UPDATE user_stats 
                SET total_score = total_score + ?,
                    total_time = total_time + ?,
                    levels_completed = levels_completed + 1,
                    total_attempts = total_attempts + 1,
                    last_updated = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ''', (score, time_taken, user_id))
        else:
            cursor.execute('''
                UPDATE user_stats 
                SET total_attempts = total_attempts + 1,
                    last_updated = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ''', (user_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Progress updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT u.username, us.total_score, us.levels_completed, us.total_time
            FROM users u
            JOIN user_stats us ON u.id = us.user_id
            ORDER BY us.total_score DESC
            LIMIT 10
        ''')
        
        leaderboard = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(leaderboard), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/levels/<data_structure>', methods=['GET'])
def get_levels(data_structure):
    try:
        # Return the level definitions from the frontend
        levels = {
            'stack': [
                {'id': 1, 'name': 'Basic Push', 'difficulty': 'Easy'},
                {'id': 2, 'name': 'Simple Pop', 'difficulty': 'Easy'},
                {'id': 3, 'name': 'Push Multiple', 'difficulty': 'Easy'},
                {'id': 4, 'name': 'Pop to Empty', 'difficulty': 'Easy'},
                {'id': 5, 'name': 'Push and Pop', 'difficulty': 'Easy'},
                {'id': 6, 'name': 'Single Element', 'difficulty': 'Easy'},
                {'id': 7, 'name': 'Clear Stack', 'difficulty': 'Easy'},
                {'id': 8, 'name': 'Build Stack', 'difficulty': 'Easy'},
                {'id': 9, 'name': 'Remove Top', 'difficulty': 'Easy'},
                {'id': 10, 'name': 'Add One', 'difficulty': 'Easy'},
                {'id': 11, 'name': 'Reverse Two', 'difficulty': 'Medium'},
                {'id': 12, 'name': 'Stack Swap', 'difficulty': 'Medium'},
                {'id': 13, 'name': 'Insert Middle', 'difficulty': 'Medium'},
                {'id': 14, 'name': 'Duplicate Top', 'difficulty': 'Medium'},
                {'id': 15, 'name': 'Move Bottom', 'difficulty': 'Medium'},
                {'id': 16, 'name': 'Stack Rotation', 'difficulty': 'Medium'},
                {'id': 17, 'name': 'Replace Top', 'difficulty': 'Medium'},
                {'id': 18, 'name': 'Sort Two', 'difficulty': 'Medium'},
                {'id': 19, 'name': 'Triple Reverse', 'difficulty': 'Medium'},
                {'id': 20, 'name': 'Insert Between', 'difficulty': 'Medium'},
                {'id': 21, 'name': 'Perfect Shuffle', 'difficulty': 'Hard'},
                {'id': 22, 'name': 'Stack Tower', 'difficulty': 'Hard'},
                {'id': 23, 'name': 'Complex Reverse', 'difficulty': 'Hard'},
                {'id': 24, 'name': 'Palindrome', 'difficulty': 'Hard'},
                {'id': 25, 'name': 'Stack Permutation', 'difficulty': 'Hard'},
                {'id': 26, 'name': 'Mirror Image', 'difficulty': 'Hard'},
                {'id': 27, 'name': 'Stack Merge', 'difficulty': 'Hard'},
                {'id': 28, 'name': 'Fibonacci Stack', 'difficulty': 'Hard'},
                {'id': 29, 'name': 'Tower of Hanoi', 'difficulty': 'Hard'},
                {'id': 30, 'name': 'Master Stack', 'difficulty': 'Hard'}
            ],
            'queue': [
                {'id': 1, 'name': 'Basic Enqueue', 'difficulty': 'Easy'},
                {'id': 2, 'name': 'Simple Dequeue', 'difficulty': 'Easy'},
                {'id': 3, 'name': 'Queue Build', 'difficulty': 'Easy'},
                {'id': 4, 'name': 'Empty Queue', 'difficulty': 'Easy'},
                {'id': 5, 'name': 'Queue Replace', 'difficulty': 'Easy'},
                {'id': 6, 'name': 'Single Item', 'difficulty': 'Easy'},
                {'id': 7, 'name': 'Clear Queue', 'difficulty': 'Easy'},
                {'id': 8, 'name': 'Build Three', 'difficulty': 'Easy'},
                {'id': 9, 'name': 'Remove Front', 'difficulty': 'Easy'},
                {'id': 10, 'name': 'Add Back', 'difficulty': 'Easy'},
                {'id': 11, 'name': 'Queue Rotation', 'difficulty': 'Medium'},
                {'id': 12, 'name': 'Move Front', 'difficulty': 'Medium'},
                {'id': 13, 'name': 'Insert Middle', 'difficulty': 'Medium'},
                {'id': 14, 'name': 'Queue Duplicate', 'difficulty': 'Medium'},
                {'id': 15, 'name': 'Rearrange Queue', 'difficulty': 'Medium'},
                {'id': 16, 'name': 'Queue Circle', 'difficulty': 'Medium'},
                {'id': 17, 'name': 'Replace Front', 'difficulty': 'Medium'},
                {'id': 18, 'name': 'Queue Sort', 'difficulty': 'Medium'},
                {'id': 19, 'name': 'Triple Rotate', 'difficulty': 'Medium'},
                {'id': 20, 'name': 'Queue Insert', 'difficulty': 'Medium'},
                {'id': 21, 'name': 'Queue Reversal', 'difficulty': 'Hard'},
                {'id': 22, 'name': 'Queue Tower', 'difficulty': 'Hard'},
                {'id': 23, 'name': 'Complex Queue', 'difficulty': 'Hard'},
                {'id': 24, 'name': 'Queue Palindrome', 'difficulty': 'Hard'},
                {'id': 25, 'name': 'Queue Shuffle', 'difficulty': 'Hard'},
                {'id': 26, 'name': 'Queue Mirror', 'difficulty': 'Hard'},
                {'id': 27, 'name': 'Queue Merge', 'difficulty': 'Hard'},
                {'id': 28, 'name': 'Queue Pattern', 'difficulty': 'Hard'},
                {'id': 29, 'name': 'Queue Permutation', 'difficulty': 'Hard'},
                {'id': 30, 'name': 'Master Queue', 'difficulty': 'Hard'}
            ],
            'linkedlist': [
                {'id': 1, 'name': 'Basic Insert', 'difficulty': 'Easy'},
                {'id': 2, 'name': 'Simple Delete', 'difficulty': 'Easy'},
                {'id': 3, 'name': 'Build List', 'difficulty': 'Easy'},
                {'id': 4, 'name': 'Empty List', 'difficulty': 'Easy'},
                {'id': 5, 'name': 'Replace Element', 'difficulty': 'Easy'},
                {'id': 6, 'name': 'Single Node', 'difficulty': 'Easy'},
                {'id': 7, 'name': 'Clear List', 'difficulty': 'Easy'},
                {'id': 8, 'name': 'Build Three', 'difficulty': 'Easy'},
                {'id': 9, 'name': 'Remove Last', 'difficulty': 'Easy'},
                {'id': 10, 'name': 'Add End', 'difficulty': 'Easy'},
                {'id': 11, 'name': 'Insert Middle', 'difficulty': 'Medium'},
                {'id': 12, 'name': 'Delete Middle', 'difficulty': 'Medium'},
                {'id': 13, 'name': 'List Swap', 'difficulty': 'Medium'},
                {'id': 14, 'name': 'Insert Start', 'difficulty': 'Medium'},
                {'id': 15, 'name': 'Delete Start', 'difficulty': 'Medium'},
                {'id': 16, 'name': 'List Reverse', 'difficulty': 'Medium'},
                {'id': 17, 'name': 'Insert Position', 'difficulty': 'Medium'},
                {'id': 18, 'name': 'Delete Position', 'difficulty': 'Medium'},
                {'id': 19, 'name': 'List Rotation', 'difficulty': 'Medium'},
                {'id': 20, 'name': 'Complex Insert', 'difficulty': 'Medium'},
                {'id': 21, 'name': 'List Permutation', 'difficulty': 'Hard'},
                {'id': 22, 'name': 'List Tower', 'difficulty': 'Hard'},
                {'id': 23, 'name': 'Complex List', 'difficulty': 'Hard'},
                {'id': 24, 'name': 'List Palindrome', 'difficulty': 'Hard'},
                {'id': 25, 'name': 'List Shuffle', 'difficulty': 'Hard'},
                {'id': 26, 'name': 'List Mirror', 'difficulty': 'Hard'},
                {'id': 27, 'name': 'List Merge', 'difficulty': 'Hard'},
                {'id': 28, 'name': 'List Pattern', 'difficulty': 'Hard'},
                {'id': 29, 'name': 'List Sort', 'difficulty': 'Hard'},
                {'id': 30, 'name': 'Master List', 'difficulty': 'Hard'}
            ],
            'tree': [
                {'id': 1, 'name': 'Basic Insert', 'difficulty': 'Easy'},
                {'id': 2, 'name': 'Simple Search', 'difficulty': 'Easy'},
                {'id': 3, 'name': 'Build BST', 'difficulty': 'Easy'},
                {'id': 4, 'name': 'Find Element', 'difficulty': 'Easy'},
                {'id': 5, 'name': 'Insert Left', 'difficulty': 'Easy'},
                {'id': 6, 'name': 'Insert Right', 'difficulty': 'Easy'},
                {'id': 7, 'name': 'Single Node', 'difficulty': 'Easy'},
                {'id': 8, 'name': 'Build Three', 'difficulty': 'Easy'},
                {'id': 9, 'name': 'Search Found', 'difficulty': 'Easy'},
                {'id': 10, 'name': 'Insert Multiple', 'difficulty': 'Easy'},
                {'id': 11, 'name': 'Balanced Tree', 'difficulty': 'Medium'},
                {'id': 12, 'name': 'Search Multiple', 'difficulty': 'Medium'},
                {'id': 13, 'name': 'Insert Complex', 'difficulty': 'Medium'},
                {'id': 14, 'name': 'Tree Traversal', 'difficulty': 'Medium'},
                {'id': 15, 'name': 'Build Complete', 'difficulty': 'Medium'},
                {'id': 16, 'name': 'Search Path', 'difficulty': 'Medium'},
                {'id': 17, 'name': 'Insert Deep', 'difficulty': 'Medium'},
                {'id': 18, 'name': 'Tree Height', 'difficulty': 'Medium'},
                {'id': 19, 'name': 'Search All', 'difficulty': 'Medium'},
                {'id': 20, 'name': 'Insert Skewed', 'difficulty': 'Medium'},
                {'id': 21, 'name': 'Complex BST', 'difficulty': 'Hard'},
                {'id': 22, 'name': 'Tree Search', 'difficulty': 'Hard'},
                {'id': 23, 'name': 'Perfect Tree', 'difficulty': 'Hard'},
                {'id': 24, 'name': 'Tree Patterns', 'difficulty': 'Hard'},
                {'id': 25, 'name': 'Search Challenge', 'difficulty': 'Hard'},
                {'id': 26, 'name': 'Tree Mirror', 'difficulty': 'Hard'},
                {'id': 27, 'name': 'Deep Search', 'difficulty': 'Hard'},
                {'id': 28, 'name': 'Fibonacci Tree', 'difficulty': 'Hard'},
                {'id': 29, 'name': 'Tree Balance', 'difficulty': 'Hard'},
                {'id': 30, 'name': 'Master Tree', 'difficulty': 'Hard'}
            ],
            'graph': [
                {'id': 1, 'name': 'Basic Vertex', 'difficulty': 'Easy'},
                {'id': 2, 'name': 'Simple Remove', 'difficulty': 'Easy'},
                {'id': 3, 'name': 'Build Graph', 'difficulty': 'Easy'},
                {'id': 4, 'name': 'Empty Graph', 'difficulty': 'Easy'},
                {'id': 5, 'name': 'Replace Vertex', 'difficulty': 'Easy'},
                {'id': 6, 'name': 'Single Node', 'difficulty': 'Easy'},
                {'id': 7, 'name': 'Clear Graph', 'difficulty': 'Easy'},
                {'id': 8, 'name': 'Build Three', 'difficulty': 'Easy'},
                {'id': 9, 'name': 'Remove One', 'difficulty': 'Easy'},
                {'id': 10, 'name': 'Add Vertex', 'difficulty': 'Easy'},
                {'id': 11, 'name': 'Graph Build', 'difficulty': 'Medium'},
                {'id': 12, 'name': 'Graph Remove', 'difficulty': 'Medium'},
                {'id': 13, 'name': 'Graph Swap', 'difficulty': 'Medium'},
                {'id': 14, 'name': 'Graph Replace', 'difficulty': 'Medium'},
                {'id': 15, 'name': 'Graph Expand', 'difficulty': 'Medium'},
                {'id': 16, 'name': 'Graph Contract', 'difficulty': 'Medium'},
                {'id': 17, 'name': 'Graph Mix', 'difficulty': 'Medium'},
                {'id': 18, 'name': 'Graph Transform', 'difficulty': 'Medium'},
                {'id': 19, 'name': 'Graph Cycle', 'difficulty': 'Medium'},
                {'id': 20, 'name': 'Graph Path', 'difficulty': 'Medium'},
                {'id': 21, 'name': 'Complex Graph', 'difficulty': 'Hard'},
                {'id': 22, 'name': 'Graph Tower', 'difficulty': 'Hard'},
                {'id': 23, 'name': 'Graph Network', 'difficulty': 'Hard'},
                {'id': 24, 'name': 'Graph Complete', 'difficulty': 'Hard'},
                {'id': 25, 'name': 'Graph Sparse', 'difficulty': 'Hard'},
                {'id': 26, 'name': 'Graph Dense', 'difficulty': 'Hard'},
                {'id': 27, 'name': 'Graph Merge', 'difficulty': 'Hard'},
                {'id': 28, 'name': 'Graph Pattern', 'difficulty': 'Hard'},
                {'id': 29, 'name': 'Graph Web', 'difficulty': 'Hard'},
                {'id': 30, 'name': 'Master Graph', 'difficulty': 'Hard'}
            ]
        }
        
        return jsonify(levels.get(data_structure, [])), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

if __name__ == '__main__':
    # Initialize database if it doesn't exist
    if not os.path.exists('game_database.db'):
        init_db()
        print("Database initialized successfully!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
