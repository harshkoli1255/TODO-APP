const inputBox = document.querySelector('#task');
const taskContainer = document.querySelector(".tasks_container");
const addTaskButton = document.querySelector(".button_container");
const todoImg = document.querySelector(".todoImgContainer");
const toastMsg = document.querySelector(".toastMsg");

// LOAD TODO
async function loadTodos() {
    let res = await fetch("http://localhost:80/findtask");
    let data = await res.json();
    allTodos = data;
    return allTodos;
}

// DELETE TASK
async function deleteTask(taskID) {
    let data = {
        userID : taskID,
    }
    let options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let res = axios.post("http://localhost:80/deletetask", data, options);
}


// UPDATE TASK
async function updateTask(userid, updatetask) {
    let data = {
        userID : userid,
        updateTask : updatetask,
    }
    let options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let res = axios.post("http://localhost:80/updatetask", data, options);
}


// ADD TASK
async function addUserTask(usertasks) {
    let data = {
        userTask : usertasks
    }
    let options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let res = axios.post("http://localhost:80/addtask", data, options);
}

async function taskCompleted(usertaskid) {
    let data = {
        userID : usertaskid
    }
    let options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let res = axios.post("http://localhost:80/taskcomplete", data, options);
}
async function taskInCompleted(usertaskid) {
    let data = {
        userID : usertaskid
    }
    let options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let res = axios.post("http://localhost:80/taskincomplete", data, options);
}
 
// SHOW TODOS
async function showTodos() {
    let alltodos = await loadTodos();
    document.querySelectorAll(".task").forEach(t => t.remove());
    if(alltodos.length > 0) {
        todoImg.style.display = "none";
    }
    else {
        todoImg.style.display = "flex";
    }
    alltodos.forEach(todo => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        taskDiv.dataset.id = todo.id;
        taskDiv.innerHTML = `
            <div class="userTask">
                <i class="fa-solid fa-grip-lines-vertical grap_icon"></i>
                <span class="uTask">${todo.task}</span>
            </div>
            <div class="funtion_buttons">
                <div class="edit_button">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div class="delete_button">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        `;
        taskContainer.appendChild(taskDiv);
        if(todo.status) {
            taskDiv.querySelector(".uTask").style.textDecoration = "line-through";
        }
    });
    
}

function showToast(message) {
    toastMsg.innerHTML = `<span>${message}</span>`;
    toastMsg.classList.remove("animate");
    setTimeout(() => {
        toastMsg.classList.add("animate");
    }, 10);
    setTimeout(() => {
        toastMsg.classList.remove("animate");
    }, 2000);
}

taskContainer.addEventListener("click", async (e) => {
    let alltodos = await loadTodos();
    const taskDiv = e.target.closest(".task");
    // console.log(taskDiv);
    if(!taskDiv) return;
    const taskId = taskDiv.dataset.id;

    // DELETE
    if(e.target.closest(".delete_button")) {
        taskDiv.classList.add("taskDelete");
        showToast("Task Deleted"); 
        await deleteTask(taskId);
        showTodos();
    }

    // EDIT
    if(e.target.closest(".edit_button")) {
        addTaskButton.innerHTML = `<i class="fa-solid fa-check" id="addTask"></i>`;
        const text = taskDiv.querySelector(".uTask").innerText;
        inputBox.value = text;
        inputBox.dataset.editId = taskId;
    }
    // TASK COMPLETE AND INCOMPLETE
    if(e.target.closest(".uTask")) {
        for(todo of alltodos) {
            if(todo.id == taskId) {
                if(todo.status == false) {
                    showToast("Task Completed");
                    taskCompleted(taskId)
                    showTodos();

                    return;
                }
                else if(todo.status == true) {
                    showToast("Task In-Complete");
                    taskInCompleted(taskId)
                    showTodos();
                    return;
                }
            }
        }
    }
});

addTaskButton.addEventListener("click", async () => {
    const value = inputBox.value.trim();
    if (!value) return;
    addTaskButton.innerHTML = `<i class="fa-solid fa-plus" id="addTask"></i>`;
    const editId = inputBox.dataset.editId;
    if (editId) {
        showToast("Task Updated");
        await updateTask(editId, value);
    } else {
        showToast("Task Added");
        await addUserTask(value);
    }
    inputBox.value = "";
    showTodos();
    delete inputBox.dataset.editId;
});

inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTaskButton.click();
    }
})
showTodos();