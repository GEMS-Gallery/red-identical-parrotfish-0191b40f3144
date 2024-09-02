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
                                <input type="text" class="due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}" data-id="${task.id}" value="${formatDate(task.dueDate)}">
                                <select class="tag tag-${task.tag}" data-id="${task.id}">
                                    <option value="marketing" ${task.tag === 'marketing' ? 'selected' : ''}>Marketing</option>
                                    <option value="security" ${task.tag === 'security' ? 'selected' : ''}>Security</option>
                                    <option value="product" ${task.tag === 'product' ? 'selected' : ''}>Product</option>
                                </select>
                                <i data-feather="trash-2" class="delete-task" data-id="${task.id}"></i>
                            </li>
                        `).join('')}
                </ul>
                <div class="add-task" data-category-id="${category.id}">+ Add Task</div>
            `;
            container.insertAdjacentHTML('beforeend', categoryHtml);
        });

        feather.replace();
        initializeDatePickers();
        addEventListeners();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function initializeDatePickers() {
    flatpickr('.due-date', {
        dateFormat: 'Y-m-d',
        onChange: function(selectedDates, dateStr, instance) {
            const taskId = instance.element.dataset.id;
            handleTaskEdit({ target: instance.element });
        },
        onOpen: function(selectedDates, dateStr, instance) {
            const rect = instance.element.getBoundingClientRect();
            const calendarRect = instance.calendarContainer.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            if (spaceBelow < calendarRect.height && spaceAbove > spaceBelow) {
                instance.calendarContainer.style.top = `${rect.top - calendarRect.height}px`;
            } else {
                instance.calendarContainer.style.top = `${rect.bottom}px`;
            }
            
            instance.calendarContainer.style.left = `${rect.left}px`;
            instance.calendarContainer.style.right = 'auto';
        },
        static: true
    });
}

function addEventListeners() {
    document.querySelectorAll('.task-name').forEach(element => {
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

    document.querySelectorAll('.due-date').forEach(element => {
        element.addEventListener('click', function(e) {
            e.stopPropagation();
            this._flatpickr.open();
        });
    });

    document.querySelectorAll('.tag').forEach(element => {
        element.addEventListener('change', handleTaskEdit);
    });
}

async function handleTaskEdit(event) {
    try {
        const taskId = parseInt(event.target.dataset.id);
        const taskElement = document.getElementById(`task-${taskId}`);
        const name = taskElement.querySelector('.task-name').textContent.trim();
        const dueDate = taskElement.querySelector('.due-date').value;
        const tag = taskElement.querySelector('.tag').value;
        const categoryId = parseInt(taskElement.closest('.task-list').id.split('-')[1]);

        console.log('Updating task:', { taskId, name, dueDate, categoryId, tag });
        await updateTask(taskId, name, dueDate, categoryId, tag);
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
        const tag = 'product';

        console.log('Adding task:', { name, dueDate, categoryId, tag });
        await addTask(name, dueDate, categoryId, tag);
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

async function addTask(name, dueDate, categoryId, tag) {
    try {
        await backend.addTask(name, dueDate, BigInt(categoryId), tag);
        await loadTasks();
    } catch (error) {
        console.error('Error in addTask:', error);
    }
}

async function updateTask(id, name, dueDate, categoryId, tag) {
    try {
        await backend.updateTask(BigInt(id), name, dueDate, BigInt(categoryId), tag);
        await loadTasks();
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
        await loadTasks();
    } catch (error) {
        console.error('Error in updateCategory:', error);
    }
}

window.addEventListener('load', loadTasks);
