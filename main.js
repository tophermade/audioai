const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

// Keep a global reference of the window object
let mainWindow;
let serverProcess;
const PORT = 3000;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'public/favicon.ico'), // Add favicon if available
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    show: false // Don't show until ready
  });

  // Create application menu
  createMenu();

  // Load the app once server is ready
  startServer().then(() => {
    mainWindow.loadURL(`http://localhost:${PORT}`);
    
    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    dialog.showErrorBox('Server Error', 'Failed to start the application server. Please check the console for details.');
    app.quit();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Handle window close event
  mainWindow.on('close', (event) => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Translation',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.loadURL(`http://localhost:${PORT}`);
          }
        },
        {
          label: 'History',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.loadURL(`http://localhost:${PORT}/history`);
          }
        },
        { type: 'separator' },
        {
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About AI Audio Translator',
              message: 'AI Audio Translator',
              detail: 'A comprehensive multilingual text-to-speech application powered by OpenAI and ElevenLabs.\n\nVersion: 1.0.0'
            });
          }
        },
        {
          label: 'GitHub Repository',
          click: () => {
            shell.openExternal('https://github.com/tophermade/audioai');
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Window menu
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startServer() {
  return new Promise((resolve, reject) => {
    // Check if port is already in use
    const server = net.createServer();
    
    server.listen(PORT, (err) => {
      if (err) {
        // Port is in use, try to connect to existing server
        server.close();
        checkServerHealth().then(resolve).catch(() => {
          // Start new server process
          launchServerProcess().then(resolve).catch(reject);
        });
      } else {
        // Port is free, close test server and start our server
        server.close();
        launchServerProcess().then(resolve).catch(reject);
      }
    });

    server.on('error', (err) => {
      server.close();
      if (err.code === 'EADDRINUSE') {
        // Port is in use, check if it's our server
        checkServerHealth().then(resolve).catch(() => {
          launchServerProcess().then(resolve).catch(reject);
        });
      } else {
        reject(err);
      }
    });
  });
}

function launchServerProcess() {
  return new Promise((resolve, reject) => {
    console.log('Starting server process...');
    
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ELECTRON_MODE: 'true' }
    });

    let serverReady = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Server:', output);
      
      if (output.includes('Server running on port') && !serverReady) {
        serverReady = true;
        // Wait a moment for server to be fully ready
        setTimeout(resolve, 1000);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('Server Error:', data.toString());
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
      if (!serverReady) {
        reject(new Error(`Server process exited with code ${code}`));
      }
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server process:', error);
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Server startup timeout'));
      }
    }, 30000);
  });
}

function checkServerHealth() {
  return new Promise((resolve, reject) => {
    const request = require('http').get(`http://localhost:${PORT}`, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Server returned status ${res.statusCode}`));
      }
    });

    request.on('error', reject);
    request.setTimeout(5000, () => {
      request.abort();
      reject(new Error('Server health check timeout'));
    });
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    if (serverProcess) {
      serverProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS, re-create window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Security: Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (navigationEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== `http://localhost:${PORT}`) {
      navigationEvent.preventDefault();
    }
  });
});

// Handle app termination
app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
