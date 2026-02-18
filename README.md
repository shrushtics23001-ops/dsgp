# Data Structure Puzzle Game

A comprehensive educational game that teaches data structures through interactive puzzles. Built with HTML, CSS, JavaScript frontend and Python Flask backend.

## 🎮 Game Features

### Core Functionality
- **User Authentication**: Login and registration system
- **Multiple Data Structures**: Stack, Queue, Linked List, Tree, Graph
- **Progressive Levels**: Increasing difficulty across multiple levels
- **Score System**: Points based on moves, time, and efficiency
- **Progress Tracking**: Save and monitor user progress
- **Visual Feedback**: Animated operations and real-time updates

### Educational Value
- Learn data structure operations through hands-on practice
- Understand LIFO/FIFO concepts
- Master insertion, deletion, and traversal operations
- Develop problem-solving skills
- Track learning progress over time

## 🏗️ Project Structure

```
data-structure-puzzle-game/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styling
│   └── script.js           # JavaScript game logic
├── backend/
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.7 or higher
- Modern web browser
- Node.js (optional, for development tools)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in your web browser, or use a local server:
```bash
# Using Python's built-in server
python -m http.server 8000
```

The frontend will be available at `http://localhost:8000`

## 🎯 Game Flow

1. **Login/Register**: Create an account or login to existing one
2. **Main Menu**: Choose to start game, view progress, or read instructions
3. **Data Structure Selection**: Pick from Stack, Queue, Linked List, Tree, or Graph
4. **Level Selection**: Choose difficulty level based on progress
5. **Gameplay**: Perform operations to transform initial state to target state
6. **Scoring**: Earn points based on efficiency and time
7. **Progress Tracking**: Monitor improvement over time

## 🧩 Data Structures & Operations

### Stack
- **Push**: Add element to top
- **Pop**: Remove element from top
- **LIFO**: Last In, First Out

### Queue
- **Enqueue**: Add element to rear
- **Dequeue**: Remove element from front
- **FIFO**: First In, First Out

### Linked List
- **Insert**: Add element at position
- **Delete**: Remove element from position
- **Dynamic**: Flexible size and structure

### Tree (Binary Search Tree)
- **Insert**: Add element maintaining BST property
- **Search**: Find element in tree
- **Hierarchical**: Parent-child relationships

### Graph
- **Add Vertex**: Add new node
- **Remove Vertex**: Remove existing node
- **Network**: Connected nodes with edges

## 📊 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Progress
- `GET /api/progress/<user_id>` - Get user progress
- `POST /api/progress` - Update game progress
- `GET /api/leaderboard` - Get top players

### Game Data
- `GET /api/levels/<data_structure>` - Get levels for data structure
- `GET /api/health` - Health check

## 🎨 UI Features

### Modern Design
- Responsive layout for all devices
- Smooth animations and transitions
- Intuitive navigation
- Visual feedback for all actions

### Interactive Elements
- Drag-and-drop operations (planned)
- Real-time structure visualization
- Animated operation feedback
- Progress indicators

## 🏆 Scoring System

- **Base Completion**: 50 points
- **Move Efficiency**: Up to 50 points bonus
- **Time Bonus**: Up to 30 points
- **Hint Penalty**: -5 points per hint

## 📈 Progress Tracking

### User Statistics
- Total score accumulated
- Levels completed
- Time spent playing
- Best scores per level

### Data Structure Progress
- Individual progress for each data structure
- Completion percentages
- Performance trends

## 🔧 Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with animations
- **JavaScript ES6+**: Game logic and interactions
- **Font Awesome**: Icon library

### Backend Technologies
- **Python 3.7+**: Backend language
- **Flask**: Web framework
- **SQLite**: Database for user data
- **Flask-CORS**: Cross-origin resource sharing

### Data Structures Implementation
- Custom implementations in JavaScript
- Visual representation algorithms
- State management system
- Operation validation

## 🎓 Educational Benefits

### Learning Objectives
- Understand data structure properties
- Master common operations
- Develop algorithmic thinking
- Improve problem-solving skills

### Assessment Features
- Real-time feedback
- Performance metrics
- Progress visualization
- Adaptive difficulty

## 🚀 Future Enhancements

### Planned Features
- Multiplayer support
- Advanced levels
- Custom puzzle creation
- Achievement system
- Sound effects and music

### Technical Improvements
- WebSocket for real-time updates
- Database optimization
- Mobile app development
- AI-powered hints

## 🐛 Troubleshooting

### Common Issues

1. **Backend not connecting**
   - Ensure Flask server is running on port 5000
   - Check firewall settings
   - Verify CORS configuration

2. **Database errors**
   - Delete `game_database.db` to reinitialize
   - Check file permissions
   - Verify SQLite installation

3. **Frontend not loading**
   - Check browser console for errors
   - Ensure all files are in correct directories
   - Try hard refresh (Ctrl+F5)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions, issues, or suggestions, please open an issue on the repository.

---

**Built with ❤️ for educational purposes**
