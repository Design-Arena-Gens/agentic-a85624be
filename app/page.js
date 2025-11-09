'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className={styles.container}>
      <div className={styles.todoApp}>
        <header className={styles.header}>
          <h1 className={styles.title}>Todo List</h1>
          <p className={styles.subtitle}>Stay organized and productive</p>
        </header>

        <form onSubmit={addTodo} className={styles.inputForm}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className={styles.input}
          />
          <button type="submit" className={styles.addButton}>
            Add Task
          </button>
        </form>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <ul className={styles.todoList}>
          {filteredTodos.length === 0 ? (
            <li className={styles.emptyState}>
              {filter === 'completed' && completedCount === 0
                ? 'No completed tasks yet'
                : filter === 'active' && activeCount === 0
                ? 'No active tasks'
                : 'No tasks yet. Add one above!'}
            </li>
          ) : (
            filteredTodos.map((todo) => (
              <li key={todo.id} className={styles.todoItem}>
                <div className={styles.todoContent}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className={styles.checkbox}
                  />
                  <span
                    className={`${styles.todoText} ${
                      todo.completed ? styles.completed : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={styles.deleteButton}
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>

        {completedCount > 0 && (
          <div className={styles.footer}>
            <button onClick={clearCompleted} className={styles.clearButton}>
              Clear Completed ({completedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
