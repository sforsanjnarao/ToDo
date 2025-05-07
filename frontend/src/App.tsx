// frontend/src/App.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError for typing
import './App.css';

// Create an axios instance with a base URL (optional but recommended)
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Todo[]>('/todos'); // GET request
        setTodos(response.data);
      } catch (e) {
        const err = e as AxiosError | Error; // Type assertion
        setError(err.message);
        console.error("Failed to fetch todos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await apiClient.post<Todo>('/todos', { text: newTodoText }); // POST request
      setTodos([...todos, response.data]);
      setNewTodoText('');
    } catch (e) {
      const err = e as AxiosError | Error;
      setError(err.message);
      console.error("Failed to add todo:", err);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    try {
      const response = await apiClient.put<Todo>(`/todos/${id}`, { // PUT request
        completed: !todoToUpdate.completed,
      });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (e) {
      const err = e as AxiosError | Error;
      setError(err.message);
      console.error("Failed to toggle todo:", err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await apiClient.delete(`/todos/${id}`); // DELETE request
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (e) {
      const err = e as AxiosError | Error;
      setError(err.message);
      console.error("Failed to delete todo:", err);
    }
  };

  if (isLoading) return <p>Loading todos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="App">
      <h1>Simple To-Do List (Axios)</h1>
      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
            />
            <span
              onClick={() => handleToggleComplete(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;