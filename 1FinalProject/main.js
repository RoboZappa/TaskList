const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
//File stuff
var dialog = app.dialog;
var fs = require('fs');
var json = require('json-file')
const ipc = electron.ipcMain;

app.on('ready', _=>{
    console.log("It's alive!");
    mainWindow = new BrowserWindow({ width:625, height:550, resizable: false});
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
                    click:_=>{ mainWindow.webContents.send( 'menu-open' )},
                    accelerator: 'Ctrl+O'
                },// End Open
                {type: 'separator'},  
                {
                    label: "Add Todo",
                    click: () => { mainWindow.webContents.send( 'menu-add' ) }
                },//End Add
                {type: 'separator'},
                {
                    label: "Clear List",
                    click: () => { mainWindow.webContents.send( 'menu-clear' ) }
                },//End Clear
                {type: 'separator'},
                {
                    label: "Quit",
                    click: _=>{app.quit()},
                    accelerator: 'Ctrl+Q'
                }//End Quit
                ]//End Submenu
            },
            {
                label: "Help",
                click: _=>{alert("No help for you") }
            },
            {
                label: "About",
                click: _=>{ console.log("You clicked me!") }
            },
            {
                label: "Dev Tools",
                click: function(item, focusedWindow){ focusedWindow.toggleDevTools();},
                accelerator : 'ctrl+i'
            },
            { label: "Refresh", role: "reload"}
        ]
//Listen to me.
//Listeners get triggered from the ipc-renderer-js in the cool.js
//Opening a file 
ipc.on('open-json', (event, filePath)=>{
    var file = json.read(filePath);
    var thing = file.get('items');
    //webContents...
    mainWindow.webContents.send('obtain-file-content', thing);
});
//Saving a file
ipc.on('save-json', (event, list)=>{
    console.log(list[0]);
    var file = `${list[1]}`;
    console.log(file);
    fs.writeFileSync(file, JSON.stringify(list[0]));
});

