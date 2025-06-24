
        // Wait for the DOM to be fully loaded before executing JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const taskInput = document.getElementById('taskInput');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const taskList = document.getElementById('taskList');
            const emptyState = document.getElementById('emptyState');

            // Load tasks from localStorage when the page loads
            loadTasks();

            // Event Listeners
            addTaskBtn.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });

            /**
             * Adds a new task to the list
             */
            function addTask() {
                const taskText = taskInput.value.trim();
                
                if (taskText === '') {
                    alert('Please enter a task');
                    return;
                }

                // Create task object
                const task = {
                    id: Date.now(),
                    text: taskText,
                    completed: false
                };

                // Add task to the DOM
                addTaskToDOM(task);
                
                // Add task to localStorage
                addTaskToStorage(task);

                // Clear input field
                taskInput.value = '';
                
                // Hide empty state if it's visible
                if (emptyState.style.display !== 'none') {
                    emptyState.style.display = 'none';
                }
            }

            /**
             * Adds a task to the DOM
             * @param {Object} task - The task object to add
             */
            function addTaskToDOM(task) {
                const li = document.createElement('li');
                li.className = 'task-item';
                li.dataset.id = task.id;
                
                if (task.completed) {
                    li.classList.add('completed');
                }

                li.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;

                // Add event listeners to the buttons
                li.querySelector('.complete-btn').addEventListener('click', toggleTaskCompletion);
                li.querySelector('.delete-btn').addEventListener('click', deleteTask);

                // Add the task to the list
                taskList.insertBefore(li, emptyState);
            }

            /**
             * Toggles the completion status of a task
             * @param {Event} e - The click event
             */
            function toggleTaskCompletion(e) {
                const taskItem = e.target.closest('.task-item');
                const taskId = parseInt(taskItem.dataset.id);
                
                // Toggle completed class
                taskItem.classList.toggle('completed');
                
                // Update button text
                const completeBtn = taskItem.querySelector('.complete-btn');
                completeBtn.textContent = taskItem.classList.contains('completed') ? 'Undo' : 'Complete';
                
                // Update task text style
                const taskText = taskItem.querySelector('.task-text');
                
                // Update task in localStorage
                updateTaskInStorage(taskId, {
                    completed: taskItem.classList.contains('completed')
                });
            }

            /**
             * Deletes a task from the list
             * @param {Event} e - The click event
             */
            function deleteTask(e) {
                const taskItem = e.target.closest('.task-item');
                const taskId = parseInt(taskItem.dataset.id);
                
                // Remove from DOM with animation
                taskItem.style.transform = 'translateX(100%)';
                taskItem.style.opacity = '0';
                
                setTimeout(() => {
                    taskItem.remove();
                    
                    // Remove from localStorage
                    removeTaskFromStorage(taskId);
                    
                    // Show empty state if no tasks left
                    if (taskList.children.length === 1) { // Only empty state remains
                        emptyState.style.display = 'block';
                    }
                }, 300);
            }

            /**
             * Loads tasks from localStorage
             */
            function loadTasks() {
                const tasks = getTasksFromStorage();
                
                if (tasks.length > 0) {
                    emptyState.style.display = 'none';
                    
                    tasks.forEach(task => {
                        addTaskToDOM(task);
                    });
                }
            }

            /**
             * Gets all tasks from localStorage
             * @returns {Array} - Array of tasks
             */
            function getTasksFromStorage() {
                const tasksJSON = localStorage.getItem('tasks');
                return tasksJSON ? JSON.parse(tasksJSON) : [];
            }

            /**
             * Adds a task to localStorage
             * @param {Object} task - The task to add
             */
            function addTaskToStorage(task) {
                const tasks = getTasksFromStorage();
                tasks.push(task);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            /**
             * Updates a task in localStorage
             * @param {Number} taskId - The ID of the task to update
             * @param {Object} updates - The updates to apply
             */
            function updateTaskInStorage(taskId, updates) {
                const tasks = getTasksFromStorage();
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                
                if (taskIndex !== -1) {
                    tasks[taskIndex] = {
                        ...tasks[taskIndex],
                        ...updates
                    };
                    
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                }
            }

            /**
             * Removes a task from localStorage
             * @param {Number} taskId - The ID of the task to remove
             */
            function removeTaskFromStorage(taskId) {
                const tasks = getTasksFromStorage();
                const filteredTasks = tasks.filter(task => task.id !== taskId);
                localStorage.setItem('tasks', JSON.stringify(filteredTasks));
            }
        });
  