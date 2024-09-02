import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadTasks();
        loadCategories();
    }, []);

    async function loadTasks() {
        try {
            const fetchedTasks = await backend.getTasks();
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async function loadCategories() {
        try {
            const fetchedCategories = await backend.getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async function handleAddTask() {
        try {
            const name = 'New Task';
            const dueDate = new Date().toISOString().split('T')[0];
            const categoryId = 0;
            await backend.addTask(name, dueDate, BigInt(categoryId));
            await loadTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async function handleAddCategory() {
        try {
            const name = 'New Category';
            const icon = 'folder';
            await backend.addCategory(name, icon);
            await loadCategories();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    }

    return (
        <div>
            <h1>Task Manager</h1>
            <button onClick={handleAddTask}>Add Task</button>
            <button onClick={handleAddCategory}>Add Category</button>
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.name} - Due: {task.dueDate}</li>
                ))}
            </ul>
            <h2>Categories</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
