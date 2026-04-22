const inputBox = document.querySelector('#task');
const taskContainer = document.querySelector(".tasks_container");
const addTaskButton = document.querySelector(".button_container");
const todoImg = document.querySelector(".todoImgContainer");
const toastMsg = document.querySelector(".toastMsg");

const API_URL = window.location.origin;

function scrollToBottom() {
    taskContainer.scrollTop = taskContainer.scrollHeight;
}

// LOAD TODO
async function loadTodos() {
    const options = {
        headers : {
            "Content-Type" : "application/json; charset=utf-8",
        }
    }
    let res = await axios.get(`${API_URL}/findtask`,options);
    return res.data;
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
    let res = axios.post(`${API_URL}/deletetask`, data, options);
    return res;
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
    let res = axios.post(`${API_URL}/updatetask`, data, options);
    return res;
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
    let res = axios.post(`${API_URL}/addtask`, data, options);
    return res;
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
    let res = axios.post(`${API_URL}/taskcomplete`, data, options);
    return res;
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
    let res = axios.post(`${API_URL}/taskincomplete`, data, options);
    return res;
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
        let deleteTaskRes = await deleteTask(taskId);
        if(deleteTaskRes.status == 200) {
            taskDiv.classList.add("taskDelete");
            setTimeout(() => {
                showTodos();
            }, 410)
            showToast("Task Deleted"); 
            return;
        }
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
                    let taskCompleteRes = await taskCompleted(taskId);
                    if(taskCompleteRes.status == 200) {
                        showToast("Task Completed");
                        showTodos();
                        return;
                    }
                }
                else if(todo.status == true) {
                    let taskInCompleteRes = await taskInCompleted(taskId);
                    if(taskInCompleteRes.status == 200) {
                        showToast("Task In-Complete");
                        showTodos();
                        return;
                    }
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
        let updateTaskRes = await updateTask(editId, value);
        if(updateTaskRes.status == 200) {
            showToast("Task Updated");
            inputBox.value = "";
            showTodos();
            delete inputBox.dataset.editId;
        }
    } 
    else {
        let addUserTaskRes = await addUserTask(value);
        if(addUserTaskRes.status == 200) {
            showToast("Task Added");
            inputBox.value = "";
            showTodos();
            delete inputBox.dataset.editId;
            scrollToBottom();
        }
        else if(addUserTaskRes.status == 202) {
            showToast("Task Already Exists");
        }
        console.log(addUserTaskRes.status);
    }
    
});

inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTaskButton.click();
    }
})
showTodos();