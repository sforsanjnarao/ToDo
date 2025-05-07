import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://todo-exsa.onrender.com/api',
});

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await apiClient.get('/todos');
        setTodos(res.data);
      } catch (e) {
        const err = e as AxiosError | Error;
        setError(err.message);
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
      const res = await apiClient.post('/todos', { text: newTodoText });
      setTodos([...todos, res.data]);
      setNewTodoText('');
    } catch (e) {
      const err = e as AxiosError | Error;
      setError(err.message);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const res = await apiClient.put(`/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch (e) {
      const err = e as AxiosError | Error;
      setError(err.message);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await apiClient.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (e) {
      const err = e as AxiosError | Error;
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
          📝 My Todo List
        </h1>

        <form onSubmit={handleAddTodo} className="flex gap-3">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTodoText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTodoText(e.target.value)}
            className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Add
          </button>
        </form>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-600">No todos yet. Add something above!</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="w-5 h-5 text-blue-500"
                  />
                  <span
                    onClick={() => handleToggleComplete(todo.id)}
                    className={`cursor-pointer select-none ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;