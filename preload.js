const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  foo: () => ipcRenderer.invoke("foo"),
  bar: () => ipcRenderer.invoke("bar"),
});
