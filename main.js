const tasks = [];

/*
li
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-2',
delet btn
     'btn', 'btn-danger', 'ml-auto', 'delete-btn'
p
    'mt-2', 'w-100'
*/

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});
  const themes = {
    default: {
      "--base-text-color": "#212529",
      "--header-bg": "#007bff",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#007bff",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#0069d9",
      "--default-btn-border-color": "#0069d9",
      "--danger-btn-bg": "#dc3545",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#bd2130",
      "--danger-btn-border-color": "#dc3545",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#80bdff",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
    },
    dark: {
      "--base-text-color": "#212529",
      "--header-bg": "#343a40",
      "--header-text-color": "#fff",
      "--default-btn-bg": "#58616b",
      "--default-btn-text-color": "#fff",
      "--default-btn-hover-bg": "#292d31",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#b52d3a",
      "--danger-btn-text-color": "#fff",
      "--danger-btn-hover-bg": "#88222c",
      "--danger-btn-border-color": "#88222c",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
    light: {
      "--base-text-color": "#212529",
      "--header-bg": "#fff",
      "--header-text-color": "#212529",
      "--default-btn-bg": "#fff",
      "--default-btn-text-color": "#212529",
      "--default-btn-hover-bg": "#e8e7e7",
      "--default-btn-border-color": "#343a40",
      "--default-btn-focus-box-shadow":
        "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
      "--danger-btn-bg": "#f1b5bb",
      "--danger-btn-text-color": "#212529",
      "--danger-btn-hover-bg": "#ef808a",
      "--danger-btn-border-color": "#e2818a",
      "--input-border-color": "#ced4da",
      "--input-bg-color": "#fff",
      "--input-text-color": "#495057",
      "--input-focus-bg-color": "#fff",
      "--input-focus-text-color": "#495057",
      "--input-focus-border-color": "#78818a",
      "--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
    },
  };
  const form = document.forms["addTask"];
  const titleInput = form.elements["title"];
  const bodyInput = form.elements["body"];
  const ul = document.querySelector(".list-group");
  const themeSelect = document.querySelector("#themeSelect");
  let todos;
  let lastSelectedTheme = localStorage.getItem('add_theme') || "default";
  function toLocal() {
    todos = ul.innerHTML;
    localStorage.setItem("todo", JSON.stringify(todos));
  }

  renderAllTasks(objOfTasks);
  setTheme(lastSelectedTheme)
  form.addEventListener("submit", onFormSubmitHandler);
  ul.addEventListener("click", onDeletehandler);
  themeSelect.addEventListener("change", onThemeSelectHandler);
  function renderAllTasks(tasksList) {
    if (!tasksList) return;
    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((item) => {
      const li = createElement(item);
      fragment.appendChild(li);
    });
    ul.appendChild(fragment);
  }
  function createElement({ _id, body, title } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    const span = document.createElement("span");
    span.classList.add("title1");
    span.textContent = title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");
    deleteBtn.textContent = "Delete task";

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    return li;
  }
  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = titleInput.value;
    const bodyValue = bodyInput.value;
    if (!titleValue || !bodyValue) {
      return alert("Title or Value is empty");
    }
    const task = createTask(titleValue, bodyValue);
    const listItem = createElement(task);
    ul.insertAdjacentElement("afterbegin", listItem);
    form.reset();
    toLocal();
  }
  function createTask(title, body) {
    const newTask = {
      title,
      body,
      _id: `task-${Math.random()}`,
      completed: false,
    };
    objOfTasks[newTask._id] = newTask;
    return { ...newTask };
  }

  function onDeletehandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const isConfirmed = confirm(`Do you want delete this task?`);
      deleteTask(isConfirmed, target);
      toLocal();
    }
  }
  function deleteTask(confirmed, el) {
    if (!confirmed) return;
    el.closest("li").remove();
  }

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isConfirmed = confirm(
      `Do you want to change the theme to: ${selectedTheme}?`
    );
    if (!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    }
    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
    localStorage.setItem('add_theme', selectedTheme)
  }
  function setTheme(name) {
    const selectedThemObj = themes[name];
    Object.entries(selectedThemObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
  if (localStorage.getItem("todo")) {
    ul.innerHTML = JSON.parse(localStorage.getItem("todo"));
  }
})(tasks);
