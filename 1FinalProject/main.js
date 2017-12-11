const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;

app.on('ready', _=>{
    console.log("It's alive!");
    mainWindow = new BrowserWindow({ width:800, height:700});
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
                    label: "Open"
                },{type: 'separator'},
                {
                    label: "Edit"
                },{type: 'separator'},
                {
                    label: "View"
                },{type: 'separator'},
                {
                    label: "Quit",
                    click: _=>{
                            app.quit()
                        },
                        acclerator: 'Ctrl+Q'
                    } 
                ]
            },
            {
                label: "Help"
            },
            {
                label: "About",
                click: _=>{
                    console.log("You clicked me!");
            }
        }
    ]

ipc.on('countdown-start', (evt,arg) =>{
    let count=3
    let timer = setInterval(_=>{
         console.log("count " + count);
         count--
         mainWindow.webContents.send('countdown', count);
         if(count == 0){
            clearInterval(timer);
        }
    }, 1000);
   
})