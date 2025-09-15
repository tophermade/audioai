const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,
  
  // Version information
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },

  // App information
  app: {
    name: 'AI Audio Translator',
    version: '1.0.0'
  },

  // Future IPC methods can be added here
  // For example:
  // openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),
  
  // Notification methods (if needed in the future)
  // showNotification: (title, body) => ipcRenderer.invoke('notification:show', title, body)
});

// Security: Remove any node integration from the window object
// This ensures the renderer process cannot access Node.js APIs directly
delete window.module;
delete window.exports;
delete window.require;
