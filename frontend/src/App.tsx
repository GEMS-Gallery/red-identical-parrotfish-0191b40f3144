import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

type Task = {
  id: number;
  name: string;
  dueDate: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  icon: string;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTask, setNewTask] = useState({ name: '', dueDate: '', categoryId: 0 });
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await backend.getTasks();
    setTasks(fetchedTasks);
  };

  const fetchCategories = async () => {
    const fetchedCategories = await backend.getCategories();
    setCategories(fetchedCategories);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await backend.addTask(newTask.name, newTask.dueDate, BigInt(newTask.categoryId));
    setNewTask({ name: '', dueDate: '', categoryId: 0 });
    fetchTasks();
  };

  const handleUpdateTask = async (task: Task) => {
    await backend.updateTask(BigInt(task.id), task.name, task.dueDate, BigInt(task.categoryId));
    fetchTasks();
  };

  const handleDeleteTask = async (id: number) => {
    await backend.deleteTask(BigInt(id));
    fetchTasks();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await backend.addCategory(newCategory.name, newCategory.icon);
    setNewCategory({ name: '', icon: '' });
    fetchCategories();
  };

  const handleUpdateCategory = async (category: Category) => {
    await backend.updateCategory(BigInt(category.id), category.name, category.icon);
    fetchCategories();
  };

  return (
    <div>
      <h1>Task Manager</h1>

      <h2>Add New Category</h2>
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Icon Name"
          value={newCategory.icon}
          onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
          required
        />
        <button type="submit">Add Category</button>
      </form>

      <h2>Add New Task</h2>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          required
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          required
        />
        <select
          value={newTask.categoryId}
          onChange={(e) => setNewTask({ ...newTask, categoryId: Number(e.target.value) })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>

      {categories.map((category) => (
        <div key={category.id}>
          <h2>
            <i data-feather={category.icon} className="category-icon"></i>
            {category.name}
          </h2>
          <ul className="task-list">
            {tasks
              .filter((task) => task.categoryId === category.id)
              .map((task) => (
                <li key={task.id} className="task-item">
                  <span className="task-name">{task.name}</span>
                  <span className={`due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                    {task.dueDate}
                  </span>
                  <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
