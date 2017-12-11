const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;

app.on('ready', _=>{
    console.log("It's alive!");
    mainWindow = new BrowserWindow({ width:625, height:550});
    mainWindow.loadURL(`file://${__dirname}/task.html`);

    const menu = Menu.buildFromTemplate(myTemplate);
    Menu.setApplicationMenu(menu);
// Closes Electron window
    mainWindow.on('closed', _=>{
        mainWindow = null;
        console.log('closed');
    });
});
// Tool bar & buttons
 const myTemplate = [
        {
            label: "File",
            submenu: [
                {
                    label: "Open",
                    accelerator: 'Ctrl+O'
                },// End Open
                {type: 'separator'},  
                {
                    label: "Edit",
                    click: _=>{
                        alert("I don't do anything yet")
                    }
                },//End Edit
                {type: 'separator'},
                {
                    label: "View",
                    click: _=>{
                        alert("I don't do anything yet")
                    }
                },//End View
                {type: 'separator'},
                {
                    label: "Quit",
                    click: _=>{
                            app.quit()
                        },
                        accelerator: 'Ctrl+Q'
                    }//End Quit
                ]//End Submenu
            },
            {
                label: "Help",
                click: _=>{
                        alert("No help for you")
                    }
            },
            {
                label: "About",
                click: _=>{
                    console.log("You clicked me!");
                }
            },
            {
                label: "Dev Tools",
                click: function(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                },
                accelerator : 'ctrl+i'
            }
        ]

// For cool.js
// renderer ipc
ipc.on('countdown-start', (evt,arg) =>{
    let count = 3 
    let timer = setInterval(_=>{
         console.log("count " + count);
         count--
         mainWindow.webContents.send('countdown', count);
         if(count == 0){
            clearInterval(timer);
        }
    }, 1000);
   
})