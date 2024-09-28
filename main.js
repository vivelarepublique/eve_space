import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

process.env.APP_ROOT = dirname(fileURLToPath(import.meta.url));

export const MAIN_DIST = join(process.env.APP_ROOT, 'dist-electron');
const RENDERER_DIST = join(process.env.APP_ROOT, 'dist');
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
console.log(process.env.APP_ROOT, MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL);
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 1000,
        webPreferences: {
            webSecurity: false,
            // preload: join(process.env.APP_ROOT, './preload/preload.js'),
        },
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    } else {
        win.loadFile(join(RENDERER_DIST, 'index.html'));
    }
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
