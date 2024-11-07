document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('.task-input input');
    const addButton = document.querySelector('.add-btn');
    const tasksList = document.querySelector('.tasks-list');
    const statusCount = document.querySelector('.status-count');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function updateTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateStatusCount();
    }

    function renderTasks() {
        tasksList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) taskItem.classList.add('completed');

            taskItem.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" id="task${index}" ${task.completed ? 'checked' : ''}>
                    <label for="task${index}">${task.text}</label>
                </div>
                <div class="task-actions">
                    <button class="edit-btn"><i class="fas fa-pen"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;

            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                updateTasks();
            });

            const editBtn = taskItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text);
                if (newText !== null && newText.trim() !== '') {
                    task.text = newText.trim();
                    updateTasks();
                }
            });

            const deleteBtn = taskItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                updateTasks();
            });

            tasksList.appendChild(taskItem);
        });
    }

    function updateStatusCount() {
        const completedTasks = tasks.filter(task => task.completed).length;
        statusCount.textContent = `${completedTasks}/${tasks.length}`;
    }

    addButton.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text !== '') {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            updateTasks();
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });

    renderTasks();
    updateStatusCount();
});