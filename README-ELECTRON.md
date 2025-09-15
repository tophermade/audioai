# AI Audio Translator - Electron Desktop Application

This is the Electron desktop version of the AI Audio Translator application, providing a native desktop experience for multilingual text-to-speech translation.

## Features

- **Desktop Native**: Runs as a standalone desktop application on Windows, macOS, and Linux
- **All Original Features**: Maintains all functionality from the web version
- **Offline-First**: No need for a browser - runs directly on your desktop
- **System Integration**: Native menus, keyboard shortcuts, and OS integration
- **Secure**: API keys stored locally with enhanced security measures

## Quick Start

### Development Mode

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the Electron app in development mode**:
   ```bash
   npm run electron-dev
   ```
   This will start both the server and Electron app simultaneously.

3. **Or run Electron with existing server**:
   ```bash
   # In one terminal:
   npm run dev
   
   # In another terminal:
   npm run electron
   ```

### Production Build

1. **Build for your current platform**:
   ```bash
   npm run build
   ```

2. **Build for specific platforms**:
   ```bash
   # Windows
   npm run build-win
   
   # macOS
   npm run build-mac
   
   # Linux
   npm run build-linux
   ```

3. **Create unpacked directory** (for testing):
   ```bash
   npm run pack
   ```

## Electron-Specific Features

### Application Menu
- **File Menu**: New Translation (Ctrl+N), History (Ctrl+H), Quit
- **Edit Menu**: Standard editing commands (Cut, Copy, Paste, etc.)
- **View Menu**: Reload, Developer Tools, Zoom controls, Fullscreen
- **Window Menu**: Minimize, Close
- **Help Menu**: About dialog, GitHub repository link

### Keyboard Shortcuts
- `Ctrl+N` (Cmd+N on Mac): New Translation
- `Ctrl+H` (Cmd+H on Mac): View History
- `F5`: Reload application
- `F11`: Toggle fullscreen
- `Ctrl+Shift+I` (Cmd+Opt+I on Mac): Developer Tools

### Security Features
- **Context Isolation**: Renderer process is isolated from Node.js
- **Preload Scripts**: Secure communication between main and renderer processes
- **No Node Integration**: Web content cannot access Node.js APIs directly
- **External Link Handling**: External links open in default browser
- **Single Instance**: Prevents multiple app instances

## File Structure

```
AiAudio/
├── main.js              # Electron main process
├── preload.js           # Preload script for secure IPC
├── server.js            # Express server (modified for Electron)
├── package.json         # Updated with Electron scripts and build config
├── config/              # Configuration files
├── routes/              # API routes
├── views/               # Pug templates (updated for desktop)
├── public/              # Static files
└── dist/                # Built application (after npm run build)
```

## Configuration

### Build Configuration

The `package.json` includes electron-builder configuration for:

- **Windows**: NSIS installer with desktop shortcuts
- **macOS**: DMG package for Intel and Apple Silicon
- **Linux**: AppImage for universal compatibility

### Environment Variables

Create a `.env` file for server configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# The app will automatically detect Electron mode
# ELECTRON_MODE is set automatically by the main process
```

## Development

### Debugging

1. **Main Process Debugging**:
   - Use `console.log()` statements in `main.js`
   - Logs appear in the terminal where you started the app

2. **Renderer Process Debugging**:
   - Press `F12` or use View → Toggle Developer Tools
   - Standard browser DevTools are available

3. **Server Debugging**:
   - Server logs appear in the terminal
   - API endpoints work the same as the web version

### Hot Reload

The development mode (`npm run electron-dev`) includes:
- **Server hot reload**: Nodemon restarts the server on changes
- **Electron reload**: Manual reload with F5 or View → Reload

## Building and Distribution

### Build Process

1. **Dependencies**: All Node.js dependencies are bundled
2. **Assets**: Static files and templates are included
3. **Server**: Express server runs within the Electron app
4. **Icons**: Placeholder icons included (customize as needed)

### Distribution Files

After building, you'll find:

- **Windows**: `.exe` installer in `dist/`
- **macOS**: `.dmg` file in `dist/`
- **Linux**: `.AppImage` file in `dist/`

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - The app automatically handles port conflicts
   - If needed, change PORT in `.env` file

2. **Build Failures**:
   - Ensure all dependencies are installed: `npm install`
   - Clear node_modules and reinstall if needed

3. **API Key Issues**:
   - API keys are still provided through the web interface
   - Keys are stored in localStorage (same as web version)

4. **Performance**:
   - The Electron app may use more memory than the web version
   - This is normal for Electron applications

### Logs and Debugging

- **Application logs**: Check the terminal where you started the app
- **Crash logs**: Check OS-specific crash log locations
- **Developer Tools**: Available via View menu or F12

## Customization

### Icons

Replace the placeholder icons with your own:

- **Windows**: `public/favicon.ico` (256x256 ICO format)
- **macOS**: `public/favicon.icns` (ICNS format with multiple sizes)
- **Linux**: `public/favicon.png` (512x512 PNG format)

### Window Settings

Modify `main.js` to customize:

- Default window size and position
- Minimum window dimensions
- Window behavior and features

### Menu Customization

Edit the `createMenu()` function in `main.js` to:

- Add custom menu items
- Modify keyboard shortcuts
- Add application-specific actions

## Comparison with Web Version

| Feature | Web Version | Electron Version |
|---------|-------------|------------------|
| Installation | Browser-based | Native desktop app |
| Performance | Browser-dependent | Consistent native performance |
| Offline Usage | Requires server | Fully self-contained |
| Updates | Manual refresh | App-level updates |
| System Integration | Limited | Full OS integration |
| Memory Usage | Browser tab | Dedicated process |
| Security | Browser security | Enhanced Electron security |

## Support

For Electron-specific issues:

1. Check this README for common solutions
2. Review the original README.md for API and feature documentation
3. Open an issue on the GitHub repository
4. Include your OS, Electron version, and error logs

## License

Same as the original project - MIT License.
