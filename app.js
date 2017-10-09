'use strict';
const { app, BrowserWindow, ipcMain, Menu, dialog, webContents, remote, Ren } = require('electron');
const [fs, path, url] = [require('fs'), require('path'), require('url')];
const eventEmiter = require('events').EventEmitter;
let events = new eventEmiter();
let win;

function init() {
    let window = new BrowserWindow({ width: 750, height: 700 });
    win = window;
    let menuTemplate = [
        {
            label: 'Load',
            submenu: [
                {
                    label: 'Open File',
                    click: () => {
                        loadFile();
                    }
                },
                {
                    label: 'Open Folder',
                    click: () => {
                        loadFolder();
                    }
                }
            ]
        }, {
            label: 'Quit',
            click: () => {
                quitApp();
            }
        }
    ]
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
    window.setMaximizable(false);
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'app/view/home.html'),
        protocol: 'file',
        slashes: true
    }));
    //console.log('Application run', webContents.getFocusedWebContents());
}

function quitApp() {
    dialog.showMessageBox({
        type: 'info',
        title: 'Text Analyizer',
        message: 'Are you sure to leave!',
        buttons: ['Yes', 'No'],
    }, (index) => {
        if (index == 0)
            app.quit();
    })
}
function loadFile() {
    dialog.showOpenDialog({
        filters: [
            { name: 'text', extensions: ['txt', 'text'] },
            { name: 'doc files', extensions: ['doc', 'docx'] },
            { name: 'html', extensions: ['html', 'htm'] },
            { name: 'xml', extensions: ['xml'] },
            { name: 'design', extensions: ['css', 'scss', 'sass'] },
            { name: 'script', extensions: ['js', 'ts', 'jsp', 'php', 'asp', 'pl', 'py', 'py3'] },
            { name: 'program', extensions: ['java', 'c', 'cpp', 'cs'] },
            { name: 'all', extensions: ['*'] }
        ]
    }, (filename) => {
        if (filename)
            win.webContents.send('file', filename);
        //console.log('Filename: ', filename);
    })
    console.log('Load File Called');
}
function loadFolder() {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, (dirName) => {
        if (dirName) {
            console.log('Folder Name: ', dirName);
            let fileList = fs.readdirSync(dirName[0]);
            let files = fileList.filter(d => {
                if (fs.statSync(dirName[0] + '\\' + d).isFile())
                    return d;
            });
        }
    })
    console.log('Load Folder Clicked');
}

app.on('ready', () => init());
app.on('window-all-close', () => {
    console.log('Close app');
    app.quit();
});