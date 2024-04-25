// JavaScript code
document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
    
    // Add event listener to form submission
    const taskForm = document.getElementById("task-form");
    taskForm.addEventListener("submit", addTask);
    
    // Add event listener to delete buttons
    const taskList = document.getElementById("task-list");
    taskList.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const taskId = event.target.parentElement.dataset.taskId;
            deleteTask(taskId);
        }
    });

    // Add event listener to edit buttons
    taskList.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-btn")) {
            const taskDiv = event.target.parentElement;
            const taskId = taskDiv.dataset.taskId;
            const taskTitle = taskDiv.querySelector("h2").innerText;
            const taskDescription = taskDiv.querySelector("p:nth-of-type(1)").innerText.replace("Description: ", "");
            const taskDueDate = taskDiv.querySelector("p:nth-of-type(2)").innerText.replace("Due Date: ", "");
            populateEditForm(taskId, taskTitle, taskDescription, taskDueDate);
        }
    });

    // Add event listener to edit form submission
    const editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", updateTask);

    // Add event listener to cancel edit button
    const cancelEditBtn = document.getElementById("cancel-edit");
    cancelEditBtn.addEventListener("click", () => {
        editForm.reset();
        editForm.style.display = "none";
    });
});

async function fetchTasks() {
    try {
        const response = await fetch("/api/tasks");
        const tasks = await response.json();
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Clear existing task list
        tasks.forEach(task => {
            const taskDiv = createTaskElement(task);
            taskList.prepend(taskDiv); // Prepend new task element
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

async function addTask(event) {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("dueDate");
    
    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, dueDate })
        });
        
        if (!response.ok) {
            throw new Error("Failed to add task");
        }
        
        // Reload tasks after adding new task
        fetchTasks();
        
        // Clear form inputs
        event.target.reset();
    } catch (error) {
        console.error("Error adding task:", error);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE"
        });
        
        if (!response.ok) {
            throw new Error("Failed to delete task");
        }
        
        // Reload tasks after deleting
        fetchTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

function populateEditForm(taskId, title, description, dueDate) {
    const editForm = document.getElementById("edit-form");
    const editTaskIdInput = document.getElementById("edit-task-id");
    const editTitleInput = document.getElementById("edit-title");
    const editDescriptionInput = document.getElementById("edit-description");
    const editDueDateInput = document.getElementById("edit-due-date");

    editTaskIdInput.value = taskId;
    editTitleInput.value = title;
    editDescriptionInput.value = description;
    editDueDateInput.value = dueDate;

    editForm.style.display = "block";
}

async function updateTask(event) {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(event.target);
    const taskId = formData.get("taskId");
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("dueDate");
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, dueDate })
        });
        
        if (!response.ok) {
            throw new Error("Failed to update task");
        }
        
        // Reload tasks after updating
        fetchTasks();

        // Reset and hide edit form
        const editForm = document.getElementById("edit-form");
        editForm.reset();
        editForm.style.display = "none";
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

function createTaskElement(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.dataset.taskId = task._id; // Store task ID in dataset
    taskDiv.innerHTML = `
        <h2>${task.title}</h2>
        <p>Description: ${task.description}</p>
        <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
    return taskDiv;
}
