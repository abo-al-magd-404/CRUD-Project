// ========================
// DOM Elements
// ========================
const taskName = document.getElementById("task-name");
const taskDescription = document.getElementById("task-description");
const taskCategory = document.getElementById("task-category");
const taskDate = document.getElementById("task-date");
const taskButton = document.getElementById("task-btn");
const tasksContainer = document.getElementById("tasks");
const searchInput = document.getElementById("search");
const doneSound = document.getElementById("done-sound");
const deleteSound = document.getElementById("delete-sound");

// ========================
// State Variables
// ========================
let tasksArray = [];
let isUpdating = false;
let updateIndex = null;

// ========================
// Load Tasks from localStorage
// ========================
if (localStorage.getItem("tasks")) {
  tasksArray = JSON.parse(localStorage.getItem("tasks"));
  renderTasks(tasksArray);
}

// ========================
// Add or Update Task
// ========================
taskButton.onclick = function () {
  if (
    taskName.value &&
    taskDescription.value &&
    taskCategory.value &&
    taskDate.value
  ) {
    const validInputs =
      /^[a-z ]+$/i.test(taskName.value) &&
      /^[a-z ]+$/i.test(taskDescription.value) &&
      /^[a-z ]+$/i.test(taskCategory.value);

    if (!validInputs) {
      return alert("Please enter valid text (letters only).");
    }

    const taskData = {
      name: taskName.value.trim(),
      description: taskDescription.value.trim(),
      category: taskCategory.value.trim(),
      date: taskDate.value,
      done: false,
    };

    if (isUpdating) {
      tasksArray[updateIndex] = taskData;
      isUpdating = false;
      updateIndex = null;
      taskButton.innerText = "Create New Task";
    } else {
      tasksArray.push(taskData);
    }

    clearInputs();
    saveTasks();
    renderTasks(tasksArray);
  } else {
    alert("All fields are required.");
  }
};

// ========================
// Clear Form Inputs
// ========================
function clearInputs() {
  taskName.value = "";
  taskDescription.value = "";
  taskCategory.value = "";
  taskDate.value = "";
}

// ========================
// Save Tasks to localStorage
// ========================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// ========================
// Render All Tasks
// ========================
function renderTasks(arr) {
  tasksContainer.innerHTML = "";

  arr.forEach((task, i) => {
    const taskEl = document.createElement("div");
    taskEl.className = `task my-2 ${task.done ? "task-done" : ""}`;

    taskEl.innerHTML = `
      <div class="name">${task.name}</div>
      <div class="task-details">
        <div class="description">${task.description}</div>
        <div class="category">${task.category}</div>
        <div class="date">${task.date}</div>
      </div>
      <div class="buttons">
        <button class="done btn" data-index="${i}">
          Done <i class="fa-solid fa-check"></i>
        </button>
        <button class="update btn" data-index="${i}">
          Update <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete btn" data-index="${i}">
          Delete <i class="fa-solid fa-delete-left"></i>
        </button>
      </div>
    `;

    tasksContainer.appendChild(taskEl);
  });

  attachEvents();
}

// ========================
// Attach Button Events
// ========================
function attachEvents() {
  document.querySelectorAll(".done").forEach((btn) => {
    btn.onclick = () => {
      const index = btn.dataset.index;
      tasksArray[index].done = true;
      saveTasks();
      renderTasks(tasksArray);
      doneSound.play();
    };
  });

  document.querySelectorAll(".delete").forEach((btn) => {
    btn.onclick = () => {
      const index = btn.dataset.index;
      tasksArray.splice(index, 1);
      saveTasks();
      renderTasks(tasksArray);
      deleteSound.play();
    };
  });

  document.querySelectorAll(".update").forEach((btn) => {
    btn.onclick = () => {
      const index = btn.dataset.index;
      const task = tasksArray[index];
      taskName.value = task.name;
      taskDescription.value = task.description;
      taskCategory.value = task.category;
      taskDate.value = task.date;

      isUpdating = true;
      updateIndex = index;
      taskButton.innerText = "Update Task";
      taskName.focus();
    };
  });
}

// ========================
// Search by Name
// ========================
searchInput.onkeyup = () => {
  const query = searchInput.value.toLowerCase().trim();
  if (query === "") {
    renderTasks(tasksArray);
  } else {
    const filtered = tasksArray.filter((task) =>
      task.name.toLowerCase().includes(query)
    );
    renderTasks(filtered);
  }
};
