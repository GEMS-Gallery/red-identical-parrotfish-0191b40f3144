import { backend } from 'declarations/backend';

async function loadTasks() {
    const tasks = await backend.getTasks();
    const categories = await backend.getCategories();
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryHtml = `
            <h2>
                <i data-feather="${category.icon}" class="category-icon"></i>
                ${category.name}
            </h2>
            <ul class="task-list" id="category-${category.id}">
                ${tasks
                    .filter(task => task.categoryId === category.id)
                    .map(task => `
                        <li class="task-item" id="task-${task.id}">
                            <span class="task-name">${task.name}</span>
                            <span class="due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}">${task.dueDate}</span>
                        </li>
                    `).join('')}
            </ul>
        `;
        container.insertAdjacentHTML('beforeend', categoryHtml);
    });

    feather.replace();
}

async function addTask(name, dueDate, categoryId) {
    await backend.addTask(name, dueDate, BigInt(categoryId));
    await loadTasks();
}

async function updateTask(id, name, dueDate, categoryId) {
    await backend.updateTask(BigInt(id), name, dueDate, BigInt(categoryId));
    await loadTasks();
}

async function deleteTask(id) {
    await backend.deleteTask(BigInt(id));
    await loadTasks();
}

async function addCategory(name, icon) {
    await backend.addCategory(name, icon);
    await loadTasks();
}

window.addEventListener('load', loadTasks);

// Expose functions to window for easy access in browser console
window.addTask = addTask;
window.updateTask = updateTask;
window.deleteTask = deleteTask;
window.addCategory = addCategory;
