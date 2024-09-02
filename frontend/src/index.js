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
                <span contenteditable="true" class="category-name" data-id="${category.id}">${category.name}</span>
            </h2>
            <ul class="task-list" id="category-${category.id}">
                ${tasks
                    .filter(task => task.categoryId === category.id)
                    .map(task => `
                        <li class="task-item" id="task-${task.id}">
                            <span contenteditable="true" class="task-name" data-id="${task.id}">${task.name}</span>
                            <span contenteditable="true" class="due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}" data-id="${task.id}">${task.dueDate}</span>
                        </li>
                    `).join('')}
            </ul>
            <div class="add-task" data-category-id="${category.id}">+ Add Task</div>
        `;
        container.insertAdjacentHTML('beforeend', categoryHtml);
    });

    feather.replace();
    addEventListeners();
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
}

async function handleTaskEdit(event) {
    const taskId = parseInt(event.target.dataset.id);
    const taskElement = document.getElementById(`task-${taskId}`);
    const name = taskElement.querySelector('.task-name').textContent;
    const dueDate = taskElement.querySelector('.due-date').textContent;
    const categoryId = parseInt(taskElement.closest('.task-list').id.split('-')[1]);

    await updateTask(taskId, name, dueDate, categoryId);
}

async function handleCategoryEdit(event) {
    const categoryId = parseInt(event.target.dataset.id);
    const name = event.target.textContent;
    const icon = event.target.previousElementSibling.dataset.feather;

    await updateCategory(categoryId, name, icon);
}

async function handleAddTask(event) {
    const categoryId = parseInt(event.target.dataset.categoryId);
    const name = 'New Task';
    const dueDate = new Date().toISOString().split('T')[0];

    await addTask(name, dueDate, categoryId);
}

async function handleAddCategory() {
    const name = 'New Category';
    const icon = 'folder';

    await addCategory(name, icon);
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

async function updateCategory(id, name, icon) {
    await backend.updateCategory(BigInt(id), name, icon);
    await loadTasks();
}

window.addEventListener('load', loadTasks);
