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
        updateTagColors();
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

function updateTagColors() {
    const tagColors = {
        marketing: { bg: '#e0f2fe', text: '#0369a1' },
        security: { bg: '#fef9c3', text: '#854d0e' },
        product: { bg: '#dcfce7', text: '#166534' }
    };

    document.querySelectorAll('.tag').forEach(tag => {
        const tagValue = tag.value;
        const colors = tagColors[tagValue];
        tag.style.backgroundColor = colors.bg;
        tag.style.color = colors.text;
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
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
        const updatedTask = await updateTask(taskId, name, dueDate, categoryId, tag);
        updateTaskElement(updatedTask);
        updateTagColors();
        showNotification('Task updated successfully');
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Error updating task');
    }
}

async function handleCategoryEdit(event) {
    try {
        const categoryId = parseInt(event.target.dataset.id);
        const name = event.target.textContent.trim();
        const icon = event.target.previousElementSibling.dataset.feather;

        console.log('Updating category:', { categoryId, name, icon });
        const updatedCategory = await updateCategory(categoryId, name, icon);
        updateCategoryElement(updatedCategory);
        showNotification('Category updated successfully');
    } catch (error) {
        console.error('Error updating category:', error);
        showNotification('Error updating category');
    }
}

async function handleAddTask(event) {
    try {
        event.target.disabled = true;
        const categoryId = parseInt(event.target.dataset.categoryId);
        const name = 'New Task';
        const dueDate = new Date().toISOString().split('T')[0];
        const tag = 'product';

        console.log('Adding task:', { name, dueDate, categoryId, tag });
        showNotification('Adding task...');
        const newTask = await addTask(name, dueDate, categoryId, tag);
        addTaskElement(newTask);
        const notificationMessage = await backend.getTaskAddedNotification(newTask);
        showNotification(notificationMessage);
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Error adding task');
    } finally {
        event.target.disabled = false;
    }
}

async function handleAddCategory() {
    try {
        const name = 'New Category';
        const icon = 'folder';

        console.log('Adding category:', { name, icon });
        const newCategory = await addCategory(name, icon);
        addCategoryElement(newCategory);
        showNotification('Category added successfully');
    } catch (error) {
        console.error('Error adding category:', error);
        showNotification('Error adding category');
    }
}

async function handleDeleteTask(event) {
    try {
        const taskId = parseInt(event.target.closest('.task-item').id.split('-')[1]);
        if (isNaN(taskId)) {
            throw new Error('Invalid task ID');
        }
        const result = await deleteTask(taskId);
        if (result) {
            removeTaskElement(taskId);
            showNotification('Task deleted successfully');
        } else {
            throw new Error('Task not found');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error deleting task');
    }
}

async function addTask(name, dueDate, categoryId, tag) {
    try {
        return await backend.addTask(name, dueDate, BigInt(categoryId), tag);
    } catch (error) {
        console.error('Error in addTask:', error);
        throw error;
    }
}

async function updateTask(id, name, dueDate, categoryId, tag) {
    try {
        return await backend.updateTask(BigInt(id), name, dueDate, BigInt(categoryId), tag);
    } catch (error) {
        console.error('Error in updateTask:', error);
        throw error;
    }
}

async function deleteTask(id) {
    try {
        return await backend.deleteTask(BigInt(id));
    } catch (error) {
        console.error('Error in deleteTask:', error);
        throw error;
    }
}

async function addCategory(name, icon) {
    try {
        return await backend.addCategory(name, icon);
    } catch (error) {
        console.error('Error in addCategory:', error);
        throw error;
    }
}

async function updateCategory(id, name, icon) {
    try {
        return await backend.updateCategory(BigInt(id), name, icon);
    } catch (error) {
        console.error('Error in updateCategory:', error);
        throw error;
    }
}

function updateTaskElement(task) {
    const taskElement = document.getElementById(`task-${task.id}`);
    if (taskElement) {
        taskElement.querySelector('.task-name').textContent = task.name;
        taskElement.querySelector('.due-date').value = task.dueDate;
        taskElement.querySelector('.tag').value = task.tag;
        updateTagColors();
    }
}

function updateCategoryElement(category) {
    const categoryElement = document.querySelector(`.category-name[data-id="${category.id}"]`);
    if (categoryElement) {
        categoryElement.textContent = category.name;
        categoryElement.previousElementSibling.dataset.feather = category.icon;
        feather.replace();
    }
}

function addTaskElement(task) {
    const categoryList = document.getElementById(`category-${task.categoryId}`);
    if (categoryList) {
        const taskHtml = `
            <li class="task-item" id="task-${task.id}">
                <span contenteditable="true" class="task-name" data-id="${task.id}">${task.name}</span>
                <input type="text" class="due-date" data-id="${task.id}" value="${task.dueDate}">
                <select class="tag tag-${task.tag}" data-id="${task.id}">
                    <option value="marketing" ${task.tag === 'marketing' ? 'selected' : ''}>Marketing</option>
                    <option value="security" ${task.tag === 'security' ? 'selected' : ''}>Security</option>
                    <option value="product" ${task.tag === 'product' ? 'selected' : ''}>Product</option>
                </select>
                <i data-feather="trash-2" class="delete-task" data-id="${task.id}"></i>
            </li>
        `;
        categoryList.insertAdjacentHTML('beforeend', taskHtml);
        feather.replace();
        initializeDatePickers();
        addEventListeners();
        updateTagColors();
    }
}

function addCategoryElement(category) {
    const container = document.getElementById('categories-container');
    const categoryHtml = `
        <h2>
            <i data-feather="${category.icon}" class="category-icon"></i>
            <span contenteditable="true" class="category-name" data-id="${category.id}">${category.name}</span>
        </h2>
        <ul class="task-list" id="category-${category.id}"></ul>
        <div class="add-task" data-category-id="${category.id}">+ Add Task</div>
    `;
    container.insertAdjacentHTML('beforeend', categoryHtml);
    feather.replace();
    addEventListeners();
}

function removeTaskElement(taskId) {
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
        taskElement.remove();
    }
}

window.addEventListener('load', loadTasks);
