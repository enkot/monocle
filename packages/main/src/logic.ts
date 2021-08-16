import { ipcMain } from 'electron'

ipcMain.handle('some-name', async(event, someArgument) => {
  const result = doSomeWork(someArgument)
  return result
})

function doSomeWork(someArgument: string) {
  return `done ${someArgument}`
}
