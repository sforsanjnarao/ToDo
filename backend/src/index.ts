import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3001;

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: uuidv4(), text: 'Learn Express', completed: true },
  { id: uuidv4(), text: 'Learn React', completed: false },
];

app.use(cors({
    origin: 'https://sanjana-todo.netlify.app', 
    credentials: true,
  }));
app.use(express.json()); 
console.log("fsdsd")
app.get('/',(req:Request,res:Response):void=>{
    console.log("hey user")
})
app.get('/api/todos', (req: Request, res: Response):void => {
  res.json(todos);
});

app.post('/api/todos', (req: Request, res: Response):void => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return  
  }
  const newTodo: Todo = {
    id: uuidv4(),
    text,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req: Request, res: Response):void => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return 
  }

  if (typeof text === 'string') {
    todos[todoIndex].text = text;
  }
  if (typeof completed === 'boolean') {
    todos[todoIndex].completed = completed;
  }

  res.json(todos[todoIndex]);
});

app.delete('/api/todos/:id', (req: Request, res: Response):void => {

  const { id } = req.params;
  console.log(id)
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);

  if (todos.length === initialLength) {
    return  
  }

  res.status(204).send(); 
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});