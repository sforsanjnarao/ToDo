import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
type Request=express.Request
type Response=express.Response
const PORT = process.env.PORT || 3001;

// Define the Todo type
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// In-memory store for todos
let todos: Todo[] = [
  { id: uuidv4(), text: 'Learn Express', completed: true },
  { id: uuidv4(), text: 'Learn React', completed: false },
];

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// GET all todos
app.get('/api/todos', (req: Request, res: Response) => {
  res.json(todos);
});

// POST a new todo
app.post('/api/todos', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Text is required and must be a string' });
  }
  const newTodo: Todo = {
    id: uuidv4(),
    text,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT to update a todo (toggle complete or change text)
app.put('/api/todos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
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
app.delete('/api/todos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(204).send(); // No content
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});