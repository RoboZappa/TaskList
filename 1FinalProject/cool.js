// Renderer js
// child of the main
const electron = require('electron');
//File stuff
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');

const ipc = electron.ipcRenderer;

// document.getElementById('start').addEventListener('click', _=>{
//     ipc.send('countdown-start');
// });

//Receiving 
ipc.on('countdown', (evt, count) =>{
    document.getElementById('count').innerHTML = count;
})

//Saving a file
document.getElementById('btn').addEventListener('click', saveFile);

function saveFile(){
    dialog.showSaveDialog((filename)=>{
        if(filename === undefined){
            alert("You didn't enter in a filename");
            return;
        }
        // Grabbing user input from input field
        var content = document.getElementById('content').value;

        fs.writeFile(filename, content, (err)=>{
            if(err)console.log(err)
            alert("The file has been saved!");    
        })
    });
}