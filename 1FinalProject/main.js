const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
var fs = require('fs');
var json = require('json-file')
const ipc = electron.ipcMain;

app.on('ready', _ => {
    console.log("It's alive!");
    mainWindow = new BrowserWindow({
        width: 625,
        height: 550,
        resizable: true,
        icon: './assets/imgs/PartyNotesLogo.png'
    });
    mainWindow.loadURL(`file://${__dirname}/task.html`);

    const menu = Menu.buildFromTemplate(myTemplate);
    Menu.setApplicationMenu(menu);
    // Closes Electron window
    mainWindow.on('closed', _ => {
        mainWindow = null;
    });
});
// Tool bar & buttons
const myTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Open",
                click: _ => { mainWindow.webContents.send('menu-open') },
                accelerator: 'Ctrl+O'
            },// End Open
            { type: 'separator' },
            {
                label: "Clear List",
                click: () => { mainWindow.webContents.send('menu-clear') }
            },//End Clear
            { type: 'separator' },
            {
                label: "Quit",
                click: _ => { app.quit() },
                accelerator: 'Ctrl+Q'
            }//End Quit
        ]//End Submenu
    },
    {
        label: "Dev Tools",
        click: function (item, focusedWindow) { focusedWindow.toggleDevTools(); },
        accelerator: 'ctrl+i'
    },
    { label: "Refresh", role: "reload" }
]

//Listeners get triggered from the ipc-renderer-js in the cool.js
//Opening a file 
ipc.on('open-json', (event, filePath) => {
    const file = json.read(filePath);
    const noteGroup = {
        noteGroupTitle: file.data.noteGroupTitle,
        items: file.data.items,
        filePath: filePath
    };
    console.log('noteGroup: ', noteGroup);
    mainWindow.webContents.send('obtain-file-content', noteGroup);
});

//Saving a file
ipc.on('save-json', (event, list) => {
    const file = `${list[1]}`;
    fs.writeFileSync(file, JSON.stringify(list[0]));
});

