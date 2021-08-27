import { contextBridge, ipcRenderer } from 'electron'

const apiKey = 'electron'
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api: ElectronApi = {
  versions: process.versions,
}

if (import.meta.env.MODE !== 'test') {
  /**
   * The "Main World" is the JavaScript context that your main renderer code runs in.
   * By default, the page you load in your renderer executes code in this world.
   *
   * @see https://www.electronjs.org/docs/api/context-bridge
   */
  contextBridge.exposeInMainWorld(apiKey, api)
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  contextBridge.exposeInMainWorld(
    'ipc', {
      invoke: async(channel: string, ...invokeArgs: any[]) => {
        return await ipcRenderer.invoke(channel, ...invokeArgs)
      },
    },
  )
}
else {
  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param obj Object on which to lock the attributes
   */
  const deepFreeze = (obj: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((prop) => {
        const val = obj[prop]
        if ((typeof val === 'object' || typeof val === 'function') && !Object.isFrozen(val))
          deepFreeze(val)
      })
    }

    return Object.freeze(obj)
  }

  deepFreeze(api)

  window[apiKey] = api

  // Need for Spectron tests
  window.electronRequire = require
}
