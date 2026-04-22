const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const uuid = require('uuid').v4;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({extended : true}));

const port = 8000;
let allTask = [];


function readFile() {
    try {
        let data = fs.readFileSync(path.join(__dirname, "allTask.json"), 'utf-8');
        allTask = JSON.parse(data);
    }
    catch {
        console.log("data is not present");
    }
    
}
function saveTask() {
    fs.writeFile(path.join(__dirname, "allTask.json"), JSON.stringify(allTask, null, 2), (err) => {
        if(err) {
            console.log(err);
        }
    });
}

// let userTaskObj = {
//     task : null,
//     id  : uuid(),
//     date : new Date().toDateString(),
//     status : false,
// }
readFile();

app.get("/", (req, res) => {
    res.render("index.ejs", {allTask});
})

app.get("/findtask", (req, res) => {
    readFile();
    res.send(allTask);
});

app.post("/addtask", (req, res) => {
    readFile();
    let {userTask} = req.body;
    let userAllTask = userTask.split(",").map(t => t.trim());
    // console.log(userAllTask);
    let userAllTakskLen = userAllTask.length;
    // let count = 0;
    let isFound = false;
    userAllTask.forEach(tasks => {
        for(picktask of allTask) {
            if(picktask.task == tasks) {
                isFound = true;
                break;
            }
        }
        if(!isFound) {
            let newTask = {
                task: tasks,
                id: uuid(),
                date: new Date().toDateString(),
                status: false
            };
            allTask.push(newTask);
            saveTask();
            // count++;
        }
    });
    // if(count == userAllTakskLen) {
    //     res.send("All Tasks Added Successfully");
    // }
    // else {
    //     res.send(`${count} tasks added out of ${userAllTakskLen}`);
    // }
    if(isFound === true) {
        res.sendStatus(202);
    }
    else if(isFound === false) {
        res.sendStatus(200);
    }
});

app.post("/updatetask", (req, res) => {
    let {userID, updateTask} = req.body;
    allTask.forEach(val => {
        if(val.id === userID) {
            val.task = updateTask;
            isAdded = true;
            saveTask();
            res.send("Task Updated Successfully");
            return;
        }
    });
});

app.post("/taskcomplete", (req, res) => {
    let {userID} = req.body;
    allTask.forEach(theTasks => {
        if(theTasks.id == userID) {
            theTasks.status = true;
            saveTask();
            res.send("Taks Completed");
            return;
        }
    })
    res.send("Invalid User ID");
})

app.post("/taskincomplete", (req, res) => {
    let {userID} = req.body;
    allTask.forEach(theTasks => {
        if(theTasks.id == userID) {
            theTasks.status = false;
            saveTask();
            res.send("Task Incompleted");
            return;
        }
    });
    res.send("Invalild User ID");
});

app.post("/deletetask", (req, res) => {
    let {userID} = req.body;
    allTask = allTask.filter(i => i.id != userID);
    saveTask();
    res.send("Task deleted Successfully");
});

app.listen(port, () => {
    console.log(`server is listening at ${port}`);
})