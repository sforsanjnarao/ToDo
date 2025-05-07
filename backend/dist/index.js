"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// In-memory store for todos
let todos = [
    { id: (0, uuid_1.v4)(), text: 'Learn Express', completed: true },
    { id: (0, uuid_1.v4)(), text: 'Learn React', completed: false },
];
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // or your deployed frontend URL
    credentials: true,
}));
app.use(express_1.default.json()); // Middleware to parse JSON bodies
// GET all todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});
// POST a new todo
app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        return;
    }
    const newTodo = {
        id: (0, uuid_1.v4)(),
        text,
        completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
// PUT to update a todo (toggle complete or change text)
app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
        return;
    }
    // Update fields if they are provided in the request body
    if (typeof text === 'string') {
        todos[todoIndex].text = text;
    }
    if (typeof completed === 'boolean') {
        todos[todoIndex].completed = completed;
    }
    res.json(todos[todoIndex]);
});
// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    if (todos.length === initialLength) {
        return;
    }
    res.status(204).send(); // No content
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
