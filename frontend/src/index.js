import { backend } from 'declarations/backend';

async function loadTasks() {
    try {
        const tasks = await backend.getTasks();
        const categories = await backend.getCategories();
        const container = document.getElementById('categories-container');
        container.innerHTML = '';

        categories.forEach(category => {
            const categoryHtml = `
                <h2>
                    <i data-feather="${category.icon}" class="category-icon"></i>
                    <span contenteditable="true" class="category-name" data-id="${category.id}">${category.name}</span>
                </h2>
                <ul class="task-list" id="category-${category.id}">
                    ${tasks
                        .filter(task => task.categoryId === category.id)
                        .map(task => `
                            <li class="task-item" id="task-${task.id}">
                                <span contenteditable="true" class="task-name" data-id="${task.id}">${task.name}</span>
                                <span contenteditable="true" class="due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}" data-id="${task.id}">${task.dueDate}</span>
                                <i data-feather="trash-2" class="delete-task" data-id="${task.id}"></i>
                            </li>
                        `).join('')}
                </ul>
                <div class="add-task" data-category-id="${category.id}">+ Add Task</div>
            `;
            container.insertAdjacentHTML('beforeend', categoryHtml);
        });

        feather.replace();
        addEventListeners();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function addEventListeners() {
    document.querySelectorAll('.task-name, .due-date').forEach(element => {
        element.addEventListener('blur', handleTaskEdit);
    });

    document.querySelectorAll('.category-name').forEach(element => {
        element.addEventListener('blur', handleCategoryEdit);
    });

    document.querySelectorAll('.add-task').forEach(element => {
        element.addEventListener('click', handleAddTask);
    });

    document.querySelector('.add-category').addEventListener('click', handleAddCategory);

    document.querySelectorAll('.delete-task').forEach(element => {
        element.addEventListener('click', handleDeleteTask);
    });
}

async function handleTaskEdit(event) {
    try {
        const taskId = parseInt(event.target.dataset.id);
        const taskElement = document.getElementById(`task-${taskId}`);
        const name = taskElement.querySelector('.task-name').textContent.trim();
        const dueDate = taskElement.querySelector('.due-date').textContent.trim();
        const categoryId = parseInt(taskElement.closest('.task-list').id.split('-')[1]);

        console.log('Updating task:', { taskId, name, dueDate, categoryId });
        await updateTask(taskId, name, dueDate, categoryId);
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function handleCategoryEdit(event) {
    try {
        const categoryId = parseInt(event.target.dataset.id);
        const name = event.target.textContent.trim();
        const icon = event.target.previousElementSibling.dataset.feather;

        console.log('Updating category:', { categoryId, name, icon });
        await updateCategory(categoryId, name, icon);
    } catch (error) {
        console.error('Error updating category:', error);
    }
}

async function handleAddTask(event) {
    try {
        const categoryId = parseInt(event.target.dataset.categoryId);
        const name = 'New Task';
        const dueDate = new Date().toISOString().split('T')[0];

        console.log('Adding task:', { name, dueDate, categoryId });
        await addTask(name, dueDate, categoryId);
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function handleAddCategory() {
    try {
        const name = 'New Category';
        const icon = 'folder';

        console.log('Adding category:', { name, icon });
        await addCategory(name, icon);
    } catch (error) {
        console.error('Error adding category:', error);
    }
}

async function handleDeleteTask(event) {
    try {
        const taskId = parseInt(event.target.dataset.id);
        await deleteTask(taskId);
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function addTask(name, dueDate, categoryId) {
    try {
        await backend.addTask(name, dueDate, BigInt(categoryId));
        await loadTasks();
    } catch (error) {
        console.error('Error in addTask:', error);
    }
}

async function updateTask(id, name, dueDate, categoryId) {
    try {
        await backend.updateTask(BigInt(id), name, dueDate, BigInt(categoryId));
        setTimeout(loadTasks, 100); // Add a small delay before reloading
    } catch (error) {
        console.error('Error in updateTask:', error);
    }
}

async function deleteTask(id) {
    try {
        await backend.deleteTask(BigInt(id));
        await loadTasks();
    } catch (error) {
        console.error('Error in deleteTask:', error);
    }
}

async function addCategory(name, icon) {
    try {
        await backend.addCategory(name, icon);
        await loadTasks();
    } catch (error) {
        console.error('Error in addCategory:', error);
    }
}

async function updateCategory(id, name, icon) {
    try {
        await backend.updateCategory(BigInt(id), name, icon);
        setTimeout(loadTasks, 100); // Add a small delay before reloading
    } catch (error) {
        console.error('Error in updateCategory:', error);
    }
}

window.addEventListener('load', loadTasks);
