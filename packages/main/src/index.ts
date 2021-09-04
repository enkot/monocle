import { join } from 'path'
import { URL } from 'url'
import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import positioner from 'electron-traywindow-positioner'
import './logic'

const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

if (process.platform === 'darwin')
  app.dock.hide()

app.disableHardwareAcceleration()

/**
 * Workaround for TypeScript bug
 * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
 */
const env = import.meta.env

// Install "Vue.js devtools"
if (env.MODE === 'development') {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e))
}

let mainWindow: BrowserWindow | null = null
let mainTray: Tray | null = null

const WINDOW_SIZE_DEFAULTS = {
  width: 360,
  height: 600,
  margin: {
    x: 0,
    y: 0,
  },
}

function createTray() {
  mainTray = new Tray(join(__dirname, '../assets/tray.png'))

  mainTray.on('click', () => {
    ipcMain.emit('tray-window-clicked', { window: mainWindow, tray: mainTray })
    toggleTrayWindow()
  })

  mainTray.on('right-click', () => mainTray?.popUpContextMenu(Menu.buildFromTemplate([
    {
      label: 'Quit',
      type: 'normal',
      click: () => app.quit(),
    },
  ])))

  ipcMain.emit('tray-window-ready', { window: mainWindow, tray: mainTray })
}

function toggleTrayWindow() {
  if (!mainWindow) return

  if (mainWindow?.isVisible()) {
    mainWindow?.hide()
  }
  else {
    if (!mainTray) return

    const trayBounds = mainTray.getBounds()

    positioner.position(mainWindow, trayBounds)
    mainWindow.setAlwaysOnTop(true, 'floating', 1)
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    mainWindow.show()
  }
}

const createWindow = async() => {
  mainWindow = new BrowserWindow({
    width: WINDOW_SIZE_DEFAULTS.width,
    height: WINDOW_SIZE_DEFAULTS.height,
    maxWidth: WINDOW_SIZE_DEFAULTS.width,
    maxHeight: WINDOW_SIZE_DEFAULTS.height,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    useContentSize: false,
    alwaysOnTop: true,
    transparent: false,
    skipTaskbar: true,
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
    },
  })

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    if (env.MODE === 'development') {
      // mainWindow?.show()
      mainWindow?.webContents.openDevTools()
    }
  })

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = env.MODE === 'development'
    ? env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', `file://${__dirname}`).toString()

  await mainWindow.loadURL(pageUrl as string)

  mainWindow?.hide()

  if (env.MODE !== 'development') {
    mainWindow.on('blur', () => {
      mainWindow?.hide()
    })
  }
}

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

app.whenReady()
  .then(() => {
    createTray()
    createWindow()
  })
  .catch(e => console.error('Failed create window:', e))

// Auto-updates
if (env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch(e => console.error('Failed check updates:', e))
}
