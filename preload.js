const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  foo: (carrier) => ipcRenderer.invoke("foo", carrier),
  bar: (carrier) => ipcRenderer.invoke("bar", carrier),
});
