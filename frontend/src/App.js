import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      alert('Error fetching todos');
    }
  };

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    try {
      await axios.post(API_URL, { title: newTitle, createdAt: newDate });
      setNewTitle('');
      setNewDate('');
      fetchTodos();
    } catch (err) {
      alert('Error adding todo');
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      alert('Error deleting todo');
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
  };

  // Update todo
  const updateTodo = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    try {
      await axios.put(`${API_URL}/${editId}`, { title: editTitle });
      setEditId(null);
      setEditTitle('');
      fetchTodos();
    } catch (err) {
      alert('Error updating todo');
    }
  };

  // Toggle completed
  const toggleCompleted = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo._id}`, {
        title: todo.title,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="container">
      <h1>ToDo List</h1>
      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add new todo..."
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          placeholder="Select date"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo)}
            />
            {editId === todo._id ? (
              <form onSubmit={updateTodo} className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span onDoubleClick={() => startEdit(todo)}>{todo.title}</span>
                <span className="date">
                  {todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : ''}
                </span>
                <button onClick={() => startEdit(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
