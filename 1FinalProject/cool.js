// Renderer js
// child of the main
const electron = require('electron');
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
// ipc
const ipc = electron.ipcRenderer;

//Viewtiful js (Vue.js)
var app = new Vue({
    el: "#app",
    data: {
        todos: [
            {name: "Do the shopping", done: false, id: 0},
            {name: "Tell wife... something", done: false, id: 1},
            {name: "Tell wife... something", done: false, id: 2}
        ]
    },
    methods: {
        addTodo(){
            var userTodo = $("#content")[0].value;
            this.todos.push({name: userTodo, completed: false});
        },
        removeTodo(){

        },
        // Method creates a blank list
        newList(){
            this.todos = {"items": []};
            ipc.send('save-json', {"items": []});
        }
    }
});


//Listeners
//Listen for Open
document.getElementById("btnOpen").addEventListener('click', _=> {
    var filePath = $('#userFile')[0].files[0].filePath;
    if(filePath === undefined)
    {
        alert("No File selected.");
        alert(filePath);
        return;
    }
    alert(filePath);
    openAFile(filePath);
})

//Listen for Save
document.getElementById("btnSave").addEventListener('click', _=> {
    dialog.showSaveDialog(userFile);
    if(userFile === undefined)
    {
        alert("File not saved");
        alert(userFile);
        return;
    }
    ipc.send('save-json' [app.todos, userFile]);
})
//Function exists to send a request to main ipc
function openAFile(filePath){
    ipc.send('open-json', filePath);
}

// Menu Items
ipc.on('menu-open',(event, blank) => {
    $('.modal').modal('open');
});

//Returned message from Main ipc
//Event fills Vue todos array 
ipc.on('obtain-file-content', (event, list) => {
    console.log(list);
    app.todos = list;
    updateView();
});

//Clear array to clear list on page
ipc.on('menu-clear', (event, args) =>{
    app.items = [];
    updateView();
})


function updateView() {
    var empty = true;
    app.todos.forEach(function (item) {
        if (item.completed == false) {
            empty = false;
        }
    }, this);
    if (empty == true) {
        $('#tasks').hide()
    }
    else {
        $('#tasks').show()
    }
}



// //Markley's example
// function openAFile()
// {
//     dialog.showOpenDialog((filenames) => {
//         if(filenames === undefined)
//         {
//             alert("No file selected")
//             return
//         }
        
//         readAFile(filenames[0]);
//     });
// }

// function readAFile(filePath){
//     fs.readFile(filePath, 'utf-8', (err, data) =>{
//         if(err){
//             alert("There was a error")
//             return
//         }
//         var textARea
//     })
// }


//Listener
//document.getElementById("btnOpen").addEventListener('click', openAFile)