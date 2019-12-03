const electron = require('electron');
var app = require('electron').remote;
var dialog = app.dialog;
const ipc = electron.ipcRenderer;

//Viewtiful js (Vue.js)
var app = new Vue({
    el: "#app",
    data: {
        tasks: {
            listTitle: 'Current List Title',
            items: [
            ]
        }
        
    },
    methods: {
        addNote(){
            var userTodo = $("#content1")[0].value;
            this.tasks.items.push({name: userTodo, done: false, id: this.tasks.items.length});
        },
        addFromMenu(){
            var userTodo = $("#content2")[0].value;
            this.tasks.items.push({name: userTodo, done: false, id: this.tasks.items.length});
        },
        removeNote(id){
            this.tasks.items.splice(id, 1);
          //  refreshList();
        },
        toggleNote(id) {
            console.log('Task Before: ', this.tasks.items[id].done);
            this.tasks.items[id].done = this.tasks.items[id].done ? false : true;
            console.log('Task After: ', this.tasks.items[id].done);
        },
        // Method creates a blank list
        newList(){
            this.tasks = {"listTitle": any, "items": []};
            ipc.send('save-json', {"items": []});
            refreshList()
        }
    }
});


//Listeners

// On Load Listener 
document.addEventListener('load', openAFile('./lists/mylist.json'));
// TODO: Load all .json lists in list Directory

//Listen for Open
document.getElementById("btnOpen").addEventListener('click', _=> {
    var filePath = $('#userFile')[0].files[0].path;
    if (filePath === undefined) {
        alert("No File selected.");
        return;
    } else {
        openAFile(filePath);
    }
    
})

//Listen for Save
document.getElementById("btnSave").addEventListener('click', _=> {
    dialog.showSaveDialog({filters: [ {name: 'MyList(.json)', extensions: ['json'] } ] }, function(userFile){
        if(userFile === undefined)
        {
            alert("File not saved", userFile);
            return;
        }
        ipc.send('save-json', [app.tasks, userFile]);
    });
});
//Function exists to send a request to main ipc
function openAFile(filePath){
    ipc.send('open-json', filePath);
}

// Menu Items
// Menu Open
ipc.on('menu-open',(event, blank) => {
    $('#modalOpen').modal('open');
});

//Add Item
ipc.on('menu-add', (event, blank) => {
    $('#modalAdd').modal('open');
})

//Returned message from Main ipc
//Event fills Vue todos array 
ipc.on('obtain-file-content', (event, list) => {
    console.log(list);
    app.tasks.items = list;
    refreshList();
});

//Clear array to clear list on page
ipc.on('menu-clear', (event, args) =>{
    app.tasks.items = [];
    refreshList();
})


function refreshList() {
    var blank = true;
    app.tasks.items.forEach(function (item) {
        if (item.done == false) {
            blank = false;
        }
    }, this);
    if (blank == true) {
        $('#list').hide()
    }
    else {
        $('#list').show()
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