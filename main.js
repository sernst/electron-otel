const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function registerIpcHandlers() {
  ipcMain.handle("foo", () => "Hello foo!");
  ipcMain.handle("bar", () => "Hello bar!");
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const indexPath = path.join(__dirname, "dist", "index.html");
  mainWindow.loadFile(indexPath);
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
