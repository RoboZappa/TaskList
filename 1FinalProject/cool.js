const electron = require('electron');
var app = require('electron').remote;
var dialog = app.dialog;
const ipc = electron.ipcRenderer;

//Viewtiful js (Vue.js)
var app = new Vue({
    el: "#app",
    data: {
        tasks: {
            noteGroupTitle: String,
            identity: Number,
            items: [
            ]
        }
        
    },
    methods: {
        addNote(){
            const userNote = $("#content1")[0].value;
            this.tasks.identity += 1;
            this.tasks.items.push({name: userNote, done: false, id: this.tasks.identity});
            console.log('Identity: ', this.tasks.identity);
            refreshList();
        },
        removeNote(id){
            this.tasks.items.splice(id, 1);
        },
        toggleNote(id) {
            this.tasks.items[id].done = this.tasks.items[id].done ? false : true;
        },
        saveNoteGroupTitle(title){
            this.tasks.noteGroupTitle = title;
        },
        // Method creates a blank list
        newList(){
            this.tasks = {"noteGroupTitle": string, "identity": 0, "items": []};
            ipc.send('save-json', {"noteGroupTitle": '', "identity": 0, "items": []});
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

//Returned message from Main ipc
//Event fills Vue todos array 
ipc.on('obtain-file-content', (event, noteGroup) => {
    app.tasks.noteGroupTitle = noteGroup.noteGroupTitle
    app.tasks.items = noteGroup.items;
    console.log('App.Tasks', app.tasks);
    refreshList();
});

//Clear array to clear list on page
ipc.on('menu-clear', (event, args) =>{
    app.tasks.items = [];
    refreshList();
});

function refreshList() {
    let blank = true;
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
