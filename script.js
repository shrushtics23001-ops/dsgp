// Game State Management
class GameState {
    constructor() {
        this.currentUser = null;
        this.currentDataStructure = null;
        this.currentLevel = null;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.currentStructure = null;
        this.targetStructure = null;
        this.score = 0;
        this.hints = 0;
    }
}

const gameState = new GameState();

// Data Structure Classes
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clone() {
        const newStack = new Stack();
        newStack.items = [...this.items];
        return newStack;
    }
    
    toArray() {
        return [...this.items];
    }
}

class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(item) {
        this.items.push(item);
    }
    
    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }
    
    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clone() {
        const newQueue = new Queue();
        newQueue.items = [...this.items];
        return newQueue;
    }
    
    toArray() {
        return [...this.items];
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    insert(data, position = null) {
        const newNode = { data, next: null };
        
        if (position === 0 || !this.head) {
            newNode.next = this.head;
            this.head = newNode;
        } else if (position === null || position >= this.size) {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        } else {
            let current = this.head;
            for (let i = 0; i < position - 1; i++) {
                current = current.next;
            }
            newNode.next = current.next;
            current.next = newNode;
        }
        this.size++;
    }
    
    delete(position = null) {
        if (!this.head) return null;
        
        if (position === 0) {
            const data = this.head.data;
            this.head = this.head.next;
            this.size--;
            return data;
        }
        
        let current = this.head;
        let prev = null;
        let count = 0;
        
        while (current && (position === null || count < position)) {
            prev = current;
            current = current.next;
            count++;
        }
        
        if (current) {
            prev.next = current.next;
            this.size--;
            return current.data;
        }
        
        return null;
    }
    
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
    
    clone() {
        const newList = new LinkedList();
        const array = this.toArray();
        array.forEach(item => newList.insert(item));
        return newList;
    }
}

class TreeNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    insert(data) {
        const newNode = new TreeNode(data);
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }
    
    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
    
    search(data) {
        return this.searchNode(this.root, data);
    }
    
    searchNode(node, data) {
        if (!node) return false;
        if (data === node.data) return true;
        return data < node.data ? 
            this.searchNode(node.left, data) : 
            this.searchNode(node.right, data);
    }
    
    toArray() {
        const result = [];
        this.inOrderTraversal(this.root, result);
        return result;
    }
    
    inOrderTraversal(node, result) {
        if (node) {
            this.inOrderTraversal(node.left, result);
            result.push(node.data);
            this.inOrderTraversal(node.right, result);
        }
    }
    
    clone() {
        const newTree = new BinarySearchTree();
        const array = this.toArray();
        array.forEach(item => newTree.insert(item));
        return newTree;
    }
}

class Graph {
    constructor() {
        this.vertices = new Map();
    }
    
    addVertex(vertex) {
        if (!this.vertices.has(vertex)) {
            this.vertices.set(vertex, []);
        }
    }
    
    addEdge(vertex1, vertex2) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        this.vertices.get(vertex1).push(vertex2);
        this.vertices.get(vertex2).push(vertex1);
    }
    
    removeVertex(vertex) {
        if (this.vertices.has(vertex)) {
            this.vertices.delete(vertex);
            this.vertices.forEach(edges => {
                const index = edges.indexOf(vertex);
                if (index > -1) {
                    edges.splice(index, 1);
                }
            });
        }
    }
    
    toArray() {
        return Array.from(this.vertices.keys());
    }
    
    clone() {
        const newGraph = new Graph();
        this.vertices.forEach((edges, vertex) => {
            newGraph.addVertex(vertex);
            edges.forEach(edge => newGraph.addEdge(vertex, edge));
        });
        return newGraph;
    }
}

// Level Definitions - 30 levels per data structure
const levels = {
    stack: [
        // Easy Levels (1-10)
        { id: 1, name: "Basic Push", difficulty: "Easy", initial: [], target: ["A"], operations: ["push"], maxMoves: 3 },
        { id: 2, name: "Simple Pop", difficulty: "Easy", initial: ["A"], target: [], operations: ["pop"], maxMoves: 3 },
        { id: 3, name: "Push Multiple", difficulty: "Easy", initial: [], target: ["A", "B"], operations: ["push"], maxMoves: 5 },
        { id: 4, name: "Pop to Empty", difficulty: "Easy", initial: ["A", "B"], target: [], operations: ["pop"], maxMoves: 5 },
        { id: 5, name: "Push and Pop", difficulty: "Easy", initial: ["A"], target: ["B"], operations: ["push", "pop"], maxMoves: 4 },
        { id: 6, name: "Single Element", difficulty: "Easy", initial: [], target: ["X"], operations: ["push"], maxMoves: 2 },
        { id: 7, name: "Clear Stack", difficulty: "Easy", initial: ["X", "Y"], target: [], operations: ["pop"], maxMoves: 4 },
        { id: 8, name: "Build Stack", difficulty: "Easy", initial: [], target: ["1", "2", "3"], operations: ["push"], maxMoves: 6 },
        { id: 9, name: "Remove Top", difficulty: "Easy", initial: ["A", "B", "C"], target: ["A", "B"], operations: ["pop"], maxMoves: 2 },
        { id: 10, name: "Add One", difficulty: "Easy", initial: ["A", "B"], target: ["A", "B", "C"], operations: ["push"], maxMoves: 2 },
        
        // Medium Levels (11-20)
        { id: 11, name: "Reverse Two", difficulty: "Medium", initial: ["A", "B"], target: ["B", "A"], operations: ["push", "pop"], maxMoves: 6 },
        { id: 12, name: "Stack Swap", difficulty: "Medium", initial: ["A", "B", "C"], target: ["A", "C", "B"], operations: ["push", "pop"], maxMoves: 8 },
        { id: 13, name: "Insert Middle", difficulty: "Medium", initial: ["A", "D"], target: ["A", "B", "C", "D"], operations: ["push", "pop"], maxMoves: 10 },
        { id: 14, name: "Duplicate Top", difficulty: "Medium", initial: ["A"], target: ["A", "A"], operations: ["push", "pop"], maxMoves: 6 },
        { id: 15, name: "Move Bottom", difficulty: "Medium", initial: ["A", "B", "C"], target: ["B", "C", "A"], operations: ["push", "pop"], maxMoves: 10 },
        { id: 16, name: "Stack Rotation", difficulty: "Medium", initial: ["A", "B", "C"], target: ["C", "A", "B"], operations: ["push", "pop"], maxMoves: 12 },
        { id: 17, name: "Replace Top", difficulty: "Medium", initial: ["A", "B"], target: ["A", "C"], operations: ["push", "pop"], maxMoves: 6 },
        { id: 18, name: "Sort Two", difficulty: "Medium", initial: ["B", "A"], target: ["A", "B"], operations: ["push", "pop"], maxMoves: 8 },
        { id: 19, name: "Triple Reverse", difficulty: "Medium", initial: ["A", "B", "C"], target: ["C", "B", "A"], operations: ["push", "pop"], maxMoves: 10 },
        { id: 20, name: "Insert Between", difficulty: "Medium", initial: ["A", "D"], target: ["A", "B", "C", "D"], operations: ["push", "pop"], maxMoves: 12 },
        
        // Hard Levels (21-30)
        { id: 21, name: "Perfect Shuffle", difficulty: "Hard", initial: ["A", "B", "C", "D"], target: ["A", "C", "B", "D"], operations: ["push", "pop"], maxMoves: 15 },
        { id: 22, name: "Stack Tower", difficulty: "Hard", initial: [], target: ["A", "B", "C", "D", "E"], operations: ["push", "pop"], maxMoves: 12 },
        { id: 23, name: "Complex Reverse", difficulty: "Hard", initial: ["A", "B", "C", "D", "E"], target: ["E", "D", "C", "B", "A"], operations: ["push", "pop"], maxMoves: 20 },
        { id: 24, name: "Palindrome", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "A"], operations: ["push", "pop"], maxMoves: 10 },
        { id: 25, name: "Stack Permutation", difficulty: "Hard", initial: ["1", "2", "3", "4"], target: ["2", "4", "1", "3"], operations: ["push", "pop"], maxMoves: 18 },
        { id: 26, name: "Mirror Image", difficulty: "Hard", initial: ["A", "B", "C"], target: ["C", "B", "A", "B", "C"], operations: ["push", "pop"], maxMoves: 16 },
        { id: 27, name: "Stack Merge", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "A", "B"], operations: ["push", "pop"], maxMoves: 14 },
        { id: 28, name: "Fibonacci Stack", difficulty: "Hard", initial: ["1", "1"], target: ["1", "1", "2", "3"], operations: ["push", "pop"], maxMoves: 12 },
        { id: 29, name: "Tower of Hanoi", difficulty: "Hard", initial: ["A", "B", "C"], target: ["C", "B", "A"], operations: ["push", "pop"], maxMoves: 25 },
        { id: 30, name: "Master Stack", difficulty: "Hard", initial: ["X"], target: ["X", "Y", "Z", "Y", "X"], operations: ["push", "pop"], maxMoves: 20 }
    ],
    queue: [
        // Easy Levels (1-10)
        { id: 1, name: "Basic Enqueue", difficulty: "Easy", initial: [], target: ["A"], operations: ["enqueue"], maxMoves: 3 },
        { id: 2, name: "Simple Dequeue", difficulty: "Easy", initial: ["A"], target: [], operations: ["dequeue"], maxMoves: 3 },
        { id: 3, name: "Queue Build", difficulty: "Easy", initial: [], target: ["A", "B"], operations: ["enqueue"], maxMoves: 5 },
        { id: 4, name: "Empty Queue", difficulty: "Easy", initial: ["A", "B"], target: [], operations: ["dequeue"], maxMoves: 5 },
        { id: 5, name: "Queue Replace", difficulty: "Easy", initial: ["A"], target: ["B"], operations: ["enqueue", "dequeue"], maxMoves: 4 },
        { id: 6, name: "Single Item", difficulty: "Easy", initial: [], target: ["X"], operations: ["enqueue"], maxMoves: 2 },
        { id: 7, name: "Clear Queue", difficulty: "Easy", initial: ["X", "Y"], target: [], operations: ["dequeue"], maxMoves: 4 },
        { id: 8, name: "Build Three", difficulty: "Easy", initial: [], target: ["1", "2", "3"], operations: ["enqueue"], maxMoves: 6 },
        { id: 9, name: "Remove Front", difficulty: "Easy", initial: ["A", "B", "C"], target: ["B", "C"], operations: ["dequeue"], maxMoves: 2 },
        { id: 10, name: "Add Back", difficulty: "Easy", initial: ["A", "B"], target: ["A", "B", "C"], operations: ["enqueue"], maxMoves: 2 },
        
        // Medium Levels (11-20)
        { id: 11, name: "Queue Rotation", difficulty: "Medium", initial: ["A", "B"], target: ["B", "A"], operations: ["enqueue", "dequeue"], maxMoves: 6 },
        { id: 12, name: "Move Front", difficulty: "Medium", initial: ["A", "B", "C"], target: ["B", "C", "A"], operations: ["enqueue", "dequeue"], maxMoves: 8 },
        { id: 13, name: "Insert Middle", difficulty: "Medium", initial: ["A", "D"], target: ["A", "B", "C", "D"], operations: ["enqueue", "dequeue"], maxMoves: 10 },
        { id: 14, name: "Queue Duplicate", difficulty: "Medium", initial: ["A"], target: ["A", "A"], operations: ["enqueue", "dequeue"], maxMoves: 6 },
        { id: 15, name: "Rearrange Queue", difficulty: "Medium", initial: ["A", "B", "C"], target: ["C", "A", "B"], operations: ["enqueue", "dequeue"], maxMoves: 10 },
        { id: 16, name: "Queue Circle", difficulty: "Medium", initial: ["A", "B", "C"], target: ["B", "C", "A"], operations: ["enqueue", "dequeue"], maxMoves: 8 },
        { id: 17, name: "Replace Front", difficulty: "Medium", initial: ["A", "B"], target: ["X", "B"], operations: ["enqueue", "dequeue"], maxMoves: 6 },
        { id: 18, name: "Queue Sort", difficulty: "Medium", initial: ["B", "A"], target: ["A", "B"], operations: ["enqueue", "dequeue"], maxMoves: 8 },
        { id: 19, name: "Triple Rotate", difficulty: "Medium", initial: ["A", "B", "C"], target: ["B", "C", "A"], operations: ["enqueue", "dequeue"], maxMoves: 10 },
        { id: 20, name: "Queue Insert", difficulty: "Medium", initial: ["A", "D"], target: ["A", "B", "C", "D"], operations: ["enqueue", "dequeue"], maxMoves: 12 },
        
        // Hard Levels (21-30)
        { id: 21, name: "Queue Reversal", difficulty: "Hard", initial: ["A", "B", "C"], target: ["C", "B", "A"], operations: ["enqueue", "dequeue"], maxMoves: 15 },
        { id: 22, name: "Queue Tower", difficulty: "Hard", initial: [], target: ["A", "B", "C", "D", "E"], operations: ["enqueue", "dequeue"], maxMoves: 12 },
        { id: 23, name: "Complex Queue", difficulty: "Hard", initial: ["A", "B", "C", "D"], target: ["B", "D", "A", "C"], operations: ["enqueue", "dequeue"], maxMoves: 18 },
        { id: 24, name: "Queue Palindrome", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "A"], operations: ["enqueue", "dequeue"], maxMoves: 12 },
        { id: 25, name: "Queue Shuffle", difficulty: "Hard", initial: ["1", "2", "3", "4"], target: ["2", "4", "1", "3"], operations: ["enqueue", "dequeue"], maxMoves: 20 },
        { id: 26, name: "Queue Mirror", difficulty: "Hard", initial: ["A", "B", "C"], target: ["A", "B", "C", "B", "A"], operations: ["enqueue", "dequeue"], maxMoves: 16 },
        { id: 27, name: "Queue Merge", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "A", "B"], operations: ["enqueue", "dequeue"], maxMoves: 14 },
        { id: 28, name: "Queue Pattern", difficulty: "Hard", initial: ["1", "2"], target: ["1", "2", "3", "5"], operations: ["enqueue", "dequeue"], maxMoves: 12 },
        { id: 29, name: "Queue Permutation", difficulty: "Hard", initial: ["A", "B", "C", "D"], target: ["D", "C", "B", "A"], operations: ["enqueue", "dequeue"], maxMoves: 25 },
        { id: 30, name: "Master Queue", difficulty: "Hard", initial: ["X"], target: ["X", "Y", "Z", "Y", "X"], operations: ["enqueue", "dequeue"], maxMoves: 20 }
    ],
    linkedlist: [
        // Easy Levels (1-10)
        { id: 1, name: "Basic Insert", difficulty: "Easy", initial: ["A"], target: ["A", "B"], operations: ["insert"], maxMoves: 3 },
        { id: 2, name: "Simple Delete", difficulty: "Easy", initial: ["A", "B"], target: ["A"], operations: ["delete"], maxMoves: 3 },
        { id: 3, name: "Build List", difficulty: "Easy", initial: [], target: ["A", "B", "C"], operations: ["insert"], maxMoves: 6 },
        { id: 4, name: "Empty List", difficulty: "Easy", initial: ["A", "B"], target: [], operations: ["delete"], maxMoves: 6 },
        { id: 5, name: "Replace Element", difficulty: "Easy", initial: ["A"], target: ["B"], operations: ["insert", "delete"], maxMoves: 4 },
        { id: 6, name: "Single Node", difficulty: "Easy", initial: [], target: ["X"], operations: ["insert"], maxMoves: 2 },
        { id: 7, name: "Clear List", difficulty: "Easy", initial: ["X", "Y"], target: [], operations: ["delete"], maxMoves: 4 },
        { id: 8, name: "Build Three", difficulty: "Easy", initial: [], target: ["1", "2", "3"], operations: ["insert"], maxMoves: 6 },
        { id: 9, name: "Remove Last", difficulty: "Easy", initial: ["A", "B", "C"], target: ["A", "B"], operations: ["delete"], maxMoves: 2 },
        { id: 10, name: "Add End", difficulty: "Easy", initial: ["A", "B"], target: ["A", "B", "C"], operations: ["insert"], maxMoves: 2 },
        
        // Medium Levels (11-20)
        { id: 11, name: "Insert Middle", difficulty: "Medium", initial: ["A", "C"], target: ["A", "B", "C"], operations: ["insert"], maxMoves: 4 },
        { id: 12, name: "Delete Middle", difficulty: "Medium", initial: ["A", "B", "C"], target: ["A", "C"], operations: ["delete"], maxMoves: 4 },
        { id: 13, name: "List Swap", difficulty: "Medium", initial: ["A", "B", "C"], target: ["A", "C", "B"], operations: ["insert", "delete"], maxMoves: 8 },
        { id: 14, name: "Insert Start", difficulty: "Medium", initial: ["B", "C"], target: ["A", "B", "C"], operations: ["insert"], maxMoves: 4 },
        { id: 15, name: "Delete Start", difficulty: "Medium", initial: ["A", "B", "C"], target: ["B", "C"], operations: ["delete"], maxMoves: 4 },
        { id: 16, name: "List Reverse", difficulty: "Medium", initial: ["A", "B", "C"], target: ["C", "B", "A"], operations: ["insert", "delete"], maxMoves: 10 },
        { id: 17, name: "Insert Position", difficulty: "Medium", initial: ["A", "D"], target: ["A", "B", "C", "D"], operations: ["insert"], maxMoves: 6 },
        { id: 18, name: "Delete Position", difficulty: "Medium", initial: ["A", "B", "C", "D"], target: ["A", "D"], operations: ["delete"], maxMoves: 6 },
        { id: 19, name: "List Rotation", difficulty: "Medium", initial: ["A", "B", "C"], target: ["B", "C", "A"], operations: ["insert", "delete"], maxMoves: 8 },
        { id: 20, name: "Complex Insert", difficulty: "Medium", initial: ["A", "E"], target: ["A", "B", "C", "D", "E"], operations: ["insert"], maxMoves: 8 },
        
        // Hard Levels (21-30)
        { id: 21, name: "List Permutation", difficulty: "Hard", initial: ["A", "B", "C", "D"], target: ["B", "D", "A", "C"], operations: ["insert", "delete"], maxMoves: 15 },
        { id: 22, name: "List Tower", difficulty: "Hard", initial: [], target: ["A", "B", "C", "D", "E"], operations: ["insert"], maxMoves: 10 },
        { id: 23, name: "Complex List", difficulty: "Hard", initial: ["A", "B", "C", "D"], target: ["D", "C", "B", "A"], operations: ["insert", "delete"], maxMoves: 18 },
        { id: 24, name: "List Palindrome", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "A"], operations: ["insert", "delete"], maxMoves: 8 },
        { id: 25, name: "List Shuffle", difficulty: "Hard", initial: ["1", "2", "3", "4"], target: ["2", "4", "1", "3"], operations: ["insert", "delete"], maxMoves: 20 },
        { id: 26, name: "List Mirror", difficulty: "Hard", initial: ["A", "B", "C"], target: ["A", "B", "C", "B", "A"], operations: ["insert", "delete"], maxMoves: 12 },
        { id: 27, name: "List Merge", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "A", "B"], operations: ["insert", "delete"], maxMoves: 10 },
        { id: 28, name: "List Pattern", difficulty: "Hard", initial: ["1", "2"], target: ["1", "2", "3", "5"], operations: ["insert", "delete"], maxMoves: 10 },
        { id: 29, name: "List Sort", difficulty: "Hard", initial: ["D", "C", "B", "A"], target: ["A", "B", "C", "D"], operations: ["insert", "delete"], maxMoves: 20 },
        { id: 30, name: "Master List", difficulty: "Hard", initial: ["X"], target: ["X", "Y", "Z", "Y", "X"], operations: ["insert", "delete"], maxMoves: 16 }
    ],
    tree: [
        // Easy Levels (1-10)
        { id: 1, name: "Basic Insert", difficulty: "Easy", initial: [], target: [5], operations: ["insert_tree"], maxMoves: 3 },
        { id: 2, name: "Simple Search", difficulty: "Easy", initial: [5], target: [5], operations: ["search"], maxMoves: 3 },
        { id: 3, name: "Build BST", difficulty: "Easy", initial: [], target: [5, 3, 7], operations: ["insert_tree"], maxMoves: 6 },
        { id: 4, name: "Find Element", difficulty: "Easy", initial: [5, 3, 7], target: [5, 3, 7], operations: ["search"], maxMoves: 5 },
        { id: 5, name: "Insert Left", difficulty: "Easy", initial: [5], target: [5, 3], operations: ["insert_tree"], maxMoves: 4 },
        { id: 6, name: "Insert Right", difficulty: "Easy", initial: [5], target: [5, 7], operations: ["insert_tree"], maxMoves: 4 },
        { id: 7, name: "Single Node", difficulty: "Easy", initial: [], target: [10], operations: ["insert_tree"], maxMoves: 2 },
        { id: 8, name: "Build Three", difficulty: "Easy", initial: [], target: [10, 5, 15], operations: ["insert_tree"], maxMoves: 6 },
        { id: 9, name: "Search Found", difficulty: "Easy", initial: [10, 5, 15], target: [10, 5, 15], operations: ["search"], maxMoves: 3 },
        { id: 10, name: "Insert Multiple", difficulty: "Easy", initial: [5], target: [5, 3, 7, 2], operations: ["insert_tree"], maxMoves: 8 },
        
        // Medium Levels (11-20)
        { id: 11, name: "Balanced Tree", difficulty: "Medium", initial: [], target: [5, 3, 7, 2, 4, 6, 8], operations: ["insert_tree"], maxMoves: 14 },
        { id: 12, name: "Search Multiple", difficulty: "Medium", initial: [5, 3, 7, 2, 4], target: [5, 3, 7, 2, 4], operations: ["search"], maxMoves: 10 },
        { id: 13, name: "Insert Complex", difficulty: "Medium", initial: [5], target: [5, 3, 8, 2, 4, 7, 9], operations: ["insert_tree"], maxMoves: 12 },
        { id: 14, name: "Tree Traversal", difficulty: "Medium", initial: [5, 3, 7], target: [5, 3, 7], operations: ["search"], maxMoves: 8 },
        { id: 15, name: "Build Complete", difficulty: "Medium", initial: [], target: [10, 5, 15, 2, 7, 12, 18], operations: ["insert_tree"], maxMoves: 14 },
        { id: 16, name: "Search Path", difficulty: "Medium", initial: [10, 5, 15, 2, 7], target: [10, 5, 15, 2, 7], operations: ["search"], maxMoves: 12 },
        { id: 17, name: "Insert Deep", difficulty: "Medium", initial: [5], target: [5, 3, 2, 1], operations: ["insert_tree"], maxMoves: 8 },
        { id: 18, name: "Tree Height", difficulty: "Medium", initial: [], target: [5, 3, 7, 1, 4, 6, 8], operations: ["insert_tree"], maxMoves: 14 },
        { id: 19, name: "Search All", difficulty: "Medium", initial: [5, 3, 7, 2, 4, 6, 8], target: [5, 3, 7, 2, 4, 6, 8], operations: ["search"], maxMoves: 15 },
        { id: 20, name: "Insert Skewed", difficulty: "Medium", initial: [], target: [1, 2, 3, 4, 5], operations: ["insert_tree"], maxMoves: 10 },
        
        // Hard Levels (21-30)
        { id: 21, name: "Complex BST", difficulty: "Hard", initial: [], target: [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45], operations: ["insert_tree"], maxMoves: 22 },
        { id: 22, name: "Tree Search", difficulty: "Hard", initial: [50, 30, 70, 20, 40, 60, 80], target: [50, 30, 70, 20, 40, 60, 80], operations: ["search"], maxMoves: 20 },
        { id: 23, name: "Perfect Tree", difficulty: "Hard", initial: [], target: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15], operations: ["insert_tree"], maxMoves: 30 },
        { id: 24, name: "Tree Patterns", difficulty: "Hard", initial: [5, 3, 7], target: [5, 3, 7, 2, 4, 6, 8, 1, 9], operations: ["insert_tree"], maxMoves: 18 },
        { id: 25, name: "Search Challenge", difficulty: "Hard", initial: [100, 50, 150, 25, 75, 125, 175], target: [100, 50, 150, 25, 75, 125, 175], operations: ["search"], maxMoves: 25 },
        { id: 26, name: "Tree Mirror", difficulty: "Hard", initial: [5, 3, 7], target: [5, 3, 7, 2, 4, 6, 8], operations: ["insert_tree"], maxMoves: 16 },
        { id: 27, name: "Deep Search", difficulty: "Hard", initial: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], operations: ["search"], maxMoves: 30 },
        { id: 28, name: "Fibonacci Tree", difficulty: "Hard", initial: [], target: [13, 8, 21, 5, 11, 18, 34, 3, 6, 9, 12, 16, 19, 25, 30], operations: ["insert_tree"], maxMoves: 30 },
        { id: 29, name: "Tree Balance", difficulty: "Hard", initial: [1], target: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15], operations: ["insert_tree"], maxMoves: 30 },
        { id: 30, name: "Master Tree", difficulty: "Hard", initial: [50], target: [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93], operations: ["insert_tree"], maxMoves: 30 }
    ],
    graph: [
        // Easy Levels (1-10)
        { id: 1, name: "Basic Vertex", difficulty: "Easy", initial: [], target: ["A"], operations: ["addVertex"], maxMoves: 3 },
        { id: 2, name: "Simple Remove", difficulty: "Easy", initial: ["A"], target: [], operations: ["removeVertex"], maxMoves: 3 },
        { id: 3, name: "Build Graph", difficulty: "Easy", initial: [], target: ["A", "B", "C"], operations: ["addVertex"], maxMoves: 6 },
        { id: 4, name: "Empty Graph", difficulty: "Easy", initial: ["A", "B"], target: [], operations: ["removeVertex"], maxMoves: 6 },
        { id: 5, name: "Replace Vertex", difficulty: "Easy", initial: ["A"], target: ["B"], operations: ["addVertex", "removeVertex"], maxMoves: 4 },
        { id: 6, name: "Single Node", difficulty: "Easy", initial: [], target: ["X"], operations: ["addVertex"], maxMoves: 2 },
        { id: 7, name: "Clear Graph", difficulty: "Easy", initial: ["X", "Y"], target: [], operations: ["removeVertex"], maxMoves: 4 },
        { id: 8, name: "Build Three", difficulty: "Easy", initial: [], target: ["1", "2", "3"], operations: ["addVertex"], maxMoves: 6 },
        { id: 9, name: "Remove One", difficulty: "Easy", initial: ["A", "B", "C"], target: ["A", "B"], operations: ["removeVertex"], maxMoves: 2 },
        { id: 10, name: "Add Vertex", difficulty: "Easy", initial: ["A", "B"], target: ["A", "B", "C"], operations: ["addVertex"], maxMoves: 2 },
        
        // Medium Levels (11-20)
        { id: 11, name: "Graph Build", difficulty: "Medium", initial: ["A"], target: ["A", "B", "C", "D"], operations: ["addVertex"], maxMoves: 8 },
        { id: 12, name: "Graph Remove", difficulty: "Medium", initial: ["A", "B", "C", "D"], target: ["A", "B"], operations: ["removeVertex"], maxMoves: 8 },
        { id: 13, name: "Graph Swap", difficulty: "Medium", initial: ["A", "B", "C"], target: ["A", "X", "Y", "C"], operations: ["addVertex", "removeVertex"], maxMoves: 10 },
        { id: 14, name: "Graph Replace", difficulty: "Medium", initial: ["A", "B"], target: ["X", "Y"], operations: ["addVertex", "removeVertex"], maxMoves: 6 },
        { id: 15, name: "Graph Expand", difficulty: "Medium", initial: ["A"], target: ["A", "B", "C", "D", "E"], operations: ["addVertex"], maxMoves: 10 },
        { id: 16, name: "Graph Contract", difficulty: "Medium", initial: ["A", "B", "C", "D", "E"], target: ["A", "B"], operations: ["removeVertex"], maxMoves: 10 },
        { id: 17, name: "Graph Mix", difficulty: "Medium", initial: ["A", "B"], target: ["X", "Y", "Z"], operations: ["addVertex", "removeVertex"], maxMoves: 8 },
        { id: 18, name: "Graph Transform", difficulty: "Medium", initial: ["X", "Y", "Z"], target: ["A", "B", "C"], operations: ["addVertex", "removeVertex"], maxMoves: 8 },
        { id: 19, name: "Graph Cycle", difficulty: "Medium", initial: ["A", "B", "C"], target: ["A", "B", "C", "A"], operations: ["addVertex"], maxMoves: 8 },
        { id: 20, name: "Graph Path", difficulty: "Medium", initial: ["A"], target: ["A", "B", "C", "D", "E"], operations: ["addVertex"], maxMoves: 10 },
        
        // Hard Levels (21-30)
        { id: 21, name: "Complex Graph", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "C", "D", "E", "F"], operations: ["addVertex", "removeVertex"], maxMoves: 15 },
        { id: 22, name: "Graph Tower", difficulty: "Hard", initial: [], target: ["A", "B", "C", "D", "E", "F", "G"], operations: ["addVertex"], maxMoves: 14 },
        { id: 23, name: "Graph Network", difficulty: "Hard", initial: ["A", "B", "C", "D", "E", "F"], target: ["X", "Y", "Z"], operations: ["removeVertex"], maxMoves: 15 },
        { id: 24, name: "Graph Complete", difficulty: "Hard", initial: [], target: ["A", "B", "C", "D", "E"], operations: ["addVertex"], maxMoves: 10 },
        { id: 25, name: "Graph Sparse", difficulty: "Hard", initial: ["A", "B", "C", "D", "E"], target: ["A"], operations: ["removeVertex"], maxMoves: 10 },
        { id: 26, name: "Graph Dense", difficulty: "Hard", initial: ["A"], target: ["A", "B", "C", "D", "E", "F", "G", "H"], operations: ["addVertex"], maxMoves: 16 },
        { id: 27, name: "Graph Merge", difficulty: "Hard", initial: ["A", "B"], target: ["A", "B", "A", "B"], operations: ["addVertex"], maxMoves: 8 },
        { id: 28, name: "Graph Pattern", difficulty: "Hard", initial: ["1", "2"], target: ["1", "2", "3", "5", "8"], operations: ["addVertex"], maxMoves: 10 },
        { id: 29, name: "Graph Web", difficulty: "Hard", initial: ["A", "B", "C"], target: ["A", "B", "C", "D", "E", "F", "G", "H", "I"], operations: ["addVertex"], maxMoves: 18 },
        { id: 30, name: "Master Graph", difficulty: "Hard", initial: ["X"], target: ["X", "Y", "Z", "Y", "X", "W", "V"], operations: ["addVertex", "removeVertex"], maxMoves: 20 }
    ]
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Authentication
function setupAuth() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const guestLoginBtn = document.getElementById('guestLoginBtn');
    
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
    
    // Guest Login
    guestLoginBtn.addEventListener('click', () => {
        gameState.currentUser = {
            username: 'Guest_' + Math.floor(Math.random() * 1000),
            id: 'guest_' + Date.now(),
            isGuest: true
        };
        showMainMenu();
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        showMessage('Attempting to login...', 'info');
        
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                gameState.currentUser = { ...data.user, isGuest: false };
                showMessage('Login successful!', 'success');
                setTimeout(() => showMainMenu(), 1000);
            } else {
                const errorData = await response.json();
                showMessage(errorData.error || 'Invalid credentials', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Backend server not available. Using offline mode.', 'info');
            // Fallback to local storage for demo
            gameState.currentUser = { username, id: Date.now(), isGuest: false };
            setTimeout(() => showMainMenu(), 1000);
        }
    });
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        showMessage('Creating account...', 'info');
        
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                gameState.currentUser = { ...data.user, isGuest: false };
                showMessage('Registration successful!', 'success');
                setTimeout(() => showMainMenu(), 1000);
            } else {
                const errorData = await response.json();
                showMessage(errorData.error || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Backend server not available. Using offline mode.', 'info');
            // Fallback to local storage for demo
            gameState.currentUser = { username, email, id: Date.now(), isGuest: false };
            setTimeout(() => showMainMenu(), 1000);
        }
    });
}

// Main Menu
function showMainMenu() {
    document.getElementById('welcomeUser').textContent = `Welcome, ${gameState.currentUser.username}!`;
    showScreen('mainMenuScreen');
}

function setupMainMenu() {
    document.getElementById('startGameBtn').addEventListener('click', () => {
        showScreen('dataStructureScreen');
    });
    
    document.getElementById('viewProgressBtn').addEventListener('click', () => {
        showProgress();
    });
    
    document.getElementById('instructionsBtn').addEventListener('click', () => {
        showScreen('instructionsScreen');
    });
    
    document.getElementById('exitBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to exit?')) {
            showScreen('loginScreen');
        }
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            gameState.currentUser = null;
            showScreen('loginScreen');
        }
    });
}

// Data Structure Selection
function setupDataStructureSelection() {
    const dsCards = document.querySelectorAll('.ds-card');
    dsCards.forEach(card => {
        card.addEventListener('click', () => {
            gameState.currentDataStructure = card.dataset.ds;
            showLevelSelection();
        });
    });
    
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        showMainMenu();
    });
}

// Level Selection
function showLevelSelection() {
    const ds = gameState.currentDataStructure;
    const dsLevels = levels[ds] || [];
    
    document.getElementById('currentDs').textContent = ds.charAt(0).toUpperCase() + ds.slice(1);
    
    const levelGrid = document.getElementById('levelGrid');
    levelGrid.innerHTML = '';
    
    dsLevels.forEach((level, index) => {
        const levelBtn = document.createElement('button');
        levelBtn.className = 'level-btn unlocked';
        
        // Add difficulty indicator
        const difficultyColor = {
            'Easy': '#28a745',
            'Medium': '#ffc107',
            'Hard': '#dc3545'
        };
        
        levelBtn.innerHTML = `
            <div>Level ${level.id}</div>
            <div>${level.name}</div>
            <div style="color: ${difficultyColor[level.difficulty]}; font-size: 12px; font-weight: bold;">${level.difficulty}</div>
            <div class="star">⭐⭐⭐</div>
        `;
        
        levelBtn.addEventListener('click', () => {
            gameState.currentLevel = level;
            startGame();
        });
        
        levelGrid.appendChild(levelBtn);
    });
    
    showScreen('levelScreen');
}

function setupLevelSelection() {
    document.getElementById('backToDsBtn').addEventListener('click', () => {
        showScreen('dataStructureScreen');
    });
}

// Game Logic
function startGame() {
    gameState.moves = 0;
    gameState.startTime = Date.now();
    gameState.hints = 0;
    
    initializeGame();
    startTimer();
    
    document.getElementById('levelInfo').textContent = `Level ${gameState.currentLevel.id} - ${gameState.currentDataStructure.charAt(0).toUpperCase() + gameState.currentDataStructure.slice(1)}`;
    showScreen('gameScreen');
}

function initializeGame() {
    const level = gameState.currentLevel;
    const ds = gameState.currentDataStructure;
    
    // Initialize current structure
    switch (ds) {
        case 'stack':
            gameState.currentStructure = new Stack();
            level.initial.forEach(item => gameState.currentStructure.push(item));
            break;
        case 'queue':
            gameState.currentStructure = new Queue();
            level.initial.forEach(item => gameState.currentStructure.enqueue(item));
            break;
        case 'linkedlist':
            gameState.currentStructure = new LinkedList();
            level.initial.forEach(item => gameState.currentStructure.insert(item));
            break;
        case 'tree':
            gameState.currentStructure = new BinarySearchTree();
            level.initial.forEach(item => gameState.currentStructure.insert(item));
            break;
        case 'graph':
            gameState.currentStructure = new Graph();
            level.initial.forEach(item => gameState.currentStructure.addVertex(item));
            break;
    }
    
    // Initialize target structure
    switch (ds) {
        case 'stack':
            gameState.targetStructure = new Stack();
            level.target.forEach(item => gameState.targetStructure.push(item));
            break;
        case 'queue':
            gameState.targetStructure = new Queue();
            level.target.forEach(item => gameState.targetStructure.enqueue(item));
            break;
        case 'linkedlist':
            gameState.targetStructure = new LinkedList();
            level.target.forEach(item => gameState.targetStructure.insert(item));
            break;
        case 'tree':
            gameState.targetStructure = new BinarySearchTree();
            level.target.forEach(item => gameState.targetStructure.insert(item));
            break;
        case 'graph':
            gameState.targetStructure = new Graph();
            level.target.forEach(item => gameState.targetStructure.addVertex(item));
            break;
    }
    
    updateDisplay();
    setupOperations();
}

function setupOperations() {
    const operations = gameState.currentLevel.operations;
    const operationsButtons = document.getElementById('operationsButtons');
    operationsButtons.innerHTML = '';
    
    operations.forEach(op => {
        const btn = document.createElement('button');
        btn.className = 'op-btn';
        btn.textContent = op.toUpperCase();
        btn.addEventListener('click', () => performOperation(op));
        operationsButtons.appendChild(btn);
    });
}

function performOperation(operation) {
    const ds = gameState.currentDataStructure;
    let result = null;
    
    switch (operation) {
        case 'push':
            const pushValue = prompt('Enter value to push:');
            if (pushValue) {
                gameState.currentStructure.push(pushValue);
                gameState.moves++;
            }
            break;
        case 'pop':
            result = gameState.currentStructure.pop();
            if (result !== null) {
                gameState.moves++;
                showMessage(`Popped: ${result}`, 'info');
            } else {
                showMessage('Stack is empty!', 'error');
            }
            break;
        case 'enqueue':
            const enqueueValue = prompt('Enter value to enqueue:');
            if (enqueueValue) {
                gameState.currentStructure.enqueue(enqueueValue);
                gameState.moves++;
            }
            break;
        case 'dequeue':
            result = gameState.currentStructure.dequeue();
            if (result !== null) {
                gameState.moves++;
                showMessage(`Dequeued: ${result}`, 'info');
            } else {
                showMessage('Queue is empty!', 'error');
            }
            break;
        case 'insert':
            const insertValue = prompt('Enter value to insert:');
            const position = prompt('Enter position (leave blank for end):');
            if (insertValue) {
                gameState.currentStructure.insert(insertValue, position ? parseInt(position) : null);
                gameState.moves++;
            }
            break;
        case 'delete':
            const deletePosition = prompt('Enter position to delete (leave blank for end):');
            result = gameState.currentStructure.delete(deletePosition ? parseInt(deletePosition) : null);
            if (result !== null) {
                gameState.moves++;
                showMessage(`Deleted: ${result}`, 'info');
            } else {
                showMessage('List is empty!', 'error');
            }
            break;
        case 'insert_tree':
            const treeValue = prompt('Enter value to insert:');
            if (treeValue) {
                gameState.currentStructure.insert(treeValue);
                gameState.moves++;
            }
            break;
        case 'search':
            const searchValue = prompt('Enter value to search:');
            if (searchValue) {
                const found = gameState.currentStructure.search(searchValue);
                gameState.moves++;
                showMessage(found ? `Found: ${searchValue}` : `Not found: ${searchValue}`, found ? 'success' : 'error');
            }
            break;
        case 'addVertex':
            const vertexValue = prompt('Enter vertex name:');
            if (vertexValue) {
                gameState.currentStructure.addVertex(vertexValue);
                gameState.moves++;
            }
            break;
        case 'removeVertex':
            const removeValue = prompt('Enter vertex to remove:');
            if (removeValue) {
                gameState.currentStructure.removeVertex(removeValue);
                gameState.moves++;
            }
            break;
    }
    
    updateDisplay();
    checkWinCondition();
}

function updateDisplay() {
    const currentDisplay = document.getElementById('currentStructure');
    const targetDisplay = document.getElementById('targetStructure');
    
    currentDisplay.innerHTML = renderStructure(gameState.currentStructure);
    targetDisplay.innerHTML = renderStructure(gameState.targetStructure);
    
    document.getElementById('moveCounter').textContent = `Moves: ${gameState.moves}`;
}

function renderStructure(structure) {
    if (!structure) return '<div>Empty</div>';
    
    const array = structure.toArray ? structure.toArray() : [];
    
    if (array.length === 0) return '<div>Empty</div>';
    
    return array.map(item => `<div class="stack-item">${item}</div>`).join('');
}

function checkWinCondition() {
    const current = gameState.currentStructure.toArray();
    const target = gameState.targetStructure.toArray();
    
    if (JSON.stringify(current) === JSON.stringify(target)) {
        endGame(true);
    } else if (gameState.moves > gameState.currentLevel.maxMoves) {
        endGame(false);
    }
}

function endGame(won) {
    clearInterval(gameState.timerInterval);
    
    const timeTaken = Math.floor((Date.now() - gameState.startTime) / 1000);
    const score = calculateScore(won, timeTaken);
    
    gameState.score = score;
    
    if (won) {
        document.getElementById('finalMoves').textContent = gameState.moves;
        document.getElementById('finalTime').textContent = formatTime(timeTaken);
        document.getElementById('finalScore').textContent = score;
        document.getElementById('successModal').classList.add('active');
    } else {
        showMessage(`Game Over! Maximum moves exceeded.`, 'error');
        setTimeout(() => {
            showLevelSelection();
        }, 2000);
    }
}

function calculateScore(won, timeTaken) {
    if (!won) return 0;
    
    let score = 50; // Base completion score
    score += Math.max(0, (gameState.currentLevel.maxMoves - gameState.moves)) * 10; // Move bonus
    score += Math.max(0, 30 - timeTaken) * 2; // Time bonus
    score -= gameState.hints * 5; // Hint penalty
    
    return Math.max(0, score);
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        document.getElementById('timer').textContent = `Time: ${formatTime(elapsed)}`;
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showMessage(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    if (!messageArea) {
        // Create message area if it doesn't exist (for login screen)
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            const newMessageArea = document.createElement('div');
            newMessageArea.className = `message-area ${type}`;
            newMessageArea.textContent = message;
            newMessageArea.style.cssText = `
                margin-top: 15px;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                font-weight: bold;
            `;
            
            // Set colors based on type
            if (type === 'success') {
                newMessageArea.style.background = '#d4edda';
                newMessageArea.style.color = '#155724';
            } else if (type === 'error') {
                newMessageArea.style.background = '#f8d7da';
                newMessageArea.style.color = '#721c24';
            } else {
                newMessageArea.style.background = '#d1ecf1';
                newMessageArea.style.color = '#0c5460';
            }
            
            // Remove existing message area if present
            const existingMessage = loginCard.querySelector('.message-area');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            loginCard.appendChild(newMessageArea);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                if (newMessageArea.parentNode) {
                    newMessageArea.remove();
                }
            }, 3000);
        }
        return;
    }
    
    messageArea.textContent = message;
    messageArea.className = `message-area ${type}`;
    
    setTimeout(() => {
        messageArea.textContent = '';
        messageArea.className = 'message-area';
    }, 3000);
}

// Progress
function showProgress() {
    if (gameState.currentUser.isGuest) {
        // Show guest progress message
        document.getElementById('totalScore').textContent = 'Guest Mode';
        document.getElementById('levelsCompleted').textContent = 'Not Tracked';
        document.getElementById('totalTime').textContent = '00:00';
        
        const dsProgress = document.getElementById('dsProgress');
        dsProgress.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                <h4>🎮 Guest Mode</h4>
                <p>Progress is not saved in guest mode.</p>
                <p>Register or login to track your progress!</p>
            </div>
        `;
    } else {
        // Simulated progress data for registered users
        document.getElementById('totalScore').textContent = '1250';
        document.getElementById('levelsCompleted').textContent = '8';
        document.getElementById('totalTime').textContent = '45:30';
        
        const dsProgress = document.getElementById('dsProgress');
        dsProgress.innerHTML = `
            <div class="ds-progress-item">
                <h4>Stack</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 100%"></div>
                </div>
            </div>
            <div class="ds-progress-item">
                <h4>Queue</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 66%"></div>
                </div>
            </div>
            <div class="ds-progress-item">
                <h4>Linked List</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 33%"></div>
                </div>
            </div>
        `;
    }
    
    showScreen('progressScreen');
}

// Game Controls
function setupGameControls() {
    document.getElementById('hintBtn').addEventListener('click', () => {
        gameState.hints++;
        showMessage('Hint: Try to think about the order of operations!', 'info');
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Reset this level?')) {
            startGame();
        }
    });
    
    document.getElementById('backToLevelBtn').addEventListener('click', () => {
        clearInterval(gameState.timerInterval);
        showLevelSelection();
    });
    
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('active');
        // Load next level logic here
        showLevelSelection();
    });
    
    document.getElementById('replayLevelBtn').addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('active');
        startGame();
    });
    
    document.getElementById('backToMenuFromSuccessBtn').addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('active');
        showMainMenu();
    });
}

// Instructions
function setupInstructions() {
    document.getElementById('backToMenuFromInstructionsBtn').addEventListener('click', () => {
        showMainMenu();
    });
}

// Progress Screen
function setupProgressScreen() {
    document.getElementById('backToMenuFromProgressBtn').addEventListener('click', () => {
        showMainMenu();
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupAuth();
    setupMainMenu();
    setupDataStructureSelection();
    setupLevelSelection();
    setupGameControls();
    setupInstructions();
    setupProgressScreen();
    
    // Show login screen initially
    showScreen('loginScreen');
});
