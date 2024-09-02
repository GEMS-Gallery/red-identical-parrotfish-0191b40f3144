import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

type Task = {
  title: string;
  category: string;
  dueDate: string;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await backend.getTasks();
    setTasks(fetchedTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await backend.addTask(title, category, dueDate);
    setTitle('');
    setCategory('');
    setDueDate('');
    fetchTasks();
  };

  return (
    <div>
      <h2>
        <i data-feather="list" className="category-icon"></i>
        Tasks
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <span className="task-name">{task.title}</span>
            <div>
              <span className="category">{task.category}</span>
              <span className="due-date">{task.dueDate}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
