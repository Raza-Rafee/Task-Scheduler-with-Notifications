document.addEventListener("DOMContentLoaded", function () {
    // Select the elements
    const taskInput = document.getElementById("task");
    const prioritySelect = document.getElementById("priority");
    const deadlineInput = document.getElementById("deadline");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    let tasks = []; // Array to store tasks

    // Event listener for the "Add Task" button
    addTaskButton.addEventListener("click", function () {
        // Get the input values
        const task = taskInput.value;
        const priority = prioritySelect.value;
        const deadline = deadlineInput.value;
        const selectedDate = new Date(deadline);
        const currentDate = new Date();

        // Check if the task input is not empty
        if (task.trim() === "" || deadline === "") {
            alert("Please select an upcoming date for the deadline.");
            return;
        }
        if (selectedDate <= currentDate) {
            alert("Please select an upcoming date for the deadline.");
            return; // Don't add task if the deadline is not in the future
        }

        // Create a new task object
        const newTask = {
            task: task,
            priority: priority,
            deadline: deadline,
            daysRemaining: Math.ceil((selectedDate - currentDate) / (1000 * 60 * 60 * 24)) // Calculate days remaining
        };

        // Add the new task to the tasks array
        tasks.push(newTask);

        // Sort tasks based on priority and days remaining
        tasks.sort((a, b) => a.daysRemaining - b.daysRemaining || a.priority.localeCompare(b.priority));

        // Display tasks in the task list
        displayTasks();

        // Clear the input fields
        taskInput.value = "";
        prioritySelect.value = "low";
        deadlineInput.value = "";

        // Display notification
        showNotification('Task Added', `${task} has been added with priority ${priority}.`);
    });

    // Display tasks in the task list
    function displayTasks() {
        // Clear the current content of the task list
        taskList.innerHTML = "";

        // Iterate through tasks and create task elements
        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task-item");

            // Create task details HTML
            taskElement.innerHTML = `
                <span><strong>Task:</strong> ${task.task}</span>
                <span><strong>Priority:</strong> ${task.priority}</span>
                <span><strong>Deadline:</strong> ${task.deadline}</span>
                <span><strong>Days Remaining:</strong> ${task.daysRemaining} day(s)</span>
                <button class="delete-task">Delete</button>
            `;

            // Event listener for the "Delete" button
            const deleteButton = taskElement.querySelector(".delete-task");
            deleteButton.addEventListener("click", function () {
                // Remove the task from the array and re-display tasks
                tasks = tasks.filter(t => t !== task);
                displayTasks();
            });

            // Append the task element to the task list
            taskList.appendChild(taskElement);
        });
    }

    function showNotification(title, message) {
        if ('Notification' in window) {
            Notification.requestPermission().then(function (permission) {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }
});
