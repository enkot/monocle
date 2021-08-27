import { acceptHMRUpdate, defineStore } from 'pinia'

interface Statements {
  [key: string]: Statement[]
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>()
  const statements = ref<Statements>({})

  const checkAccess = async() => await window.ipc.invoke('checkAccess')

  const getUserInfo = async() => {
    userInfo.value = await window.ipc.invoke('userInfo')
  }

  return {
    userInfo,
    statements,
    checkAccess,
    getUserInfo,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
