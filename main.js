const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 1000,
        webPreferences: {
            webSecurity: false,
            // preload: path.join(__dirname, './preload/preload.js'),
        },
    });

    win.loadFile('./index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
