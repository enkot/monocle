import { ipcMain, clipboard } from 'electron'
import axios from 'axios'
import Store from 'electron-store'

const store = new Store()

const env = import.meta.env

axios.defaults.adapter = require('axios/lib/adapters/http')

const api = axios.create({
  baseURL: env.MODE === 'production' ? `https://${env.VERCEL_URL}/api` : 'http://localhost:3001/api',
})

ipcMain.handle('copy', async(value: any) => {
  clipboard.writeText(value)
})

ipcMain.handle('getAccess', async(): Promise<string | null> => {
  try {
    const { data } = await api.get<AccessData>('/getaccess')
    store.set('token', data?._tokenRequestId)
    return data?._acceptUrl
  }
  catch {
    return null
  }
})

ipcMain.handle('checkAccess', async(): Promise<boolean> => {
  const token = store.get('token')

  if (!token) return false

  try {
    const response = await api.get<CheckAccessData>('/checkaccess', {
      headers: {
        'x-token': token,
      },
    })

    return response.data?.isGranted
  }
  catch {
    return false
  }
})

ipcMain.handle('userInfo', async(): Promise<UserInfo | null> => {
  const token = store.get('token')

  if (!token) return null

  try {
    const response = await api.get<UserInfo>('/userinfo', {
      headers: {
        'x-token': token,
      },
    })

    return response.data
  }
  catch {
    return null
  }
})

ipcMain.handle('statement', async(channel, accountId): Promise<Statement[]> => {
  const token = store.get('token')

  if (!token) return []

  try {
    const response = await api.get<Statement[]>('/statement', {
      params: {
        account: accountId,
      },
      headers: {
        'x-token': token,
      },
    })

    return response.data
  }
  catch (e) {
    return []
  }
})

ipcMain.handle('currency', async(): Promise<Currency[] | null> => {
  try {
    const response = await api.get<Currency[]>('/currency')

    return response.data
  }
  catch {
    return null
  }
})

ipcMain.handle('logout', async() => {
  store.delete('token')
})
