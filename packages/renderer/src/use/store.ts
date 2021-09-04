import { acceptHMRUpdate, defineStore } from 'pinia'
import getSymbolFromCurrency from 'currency-symbol-map'

interface Statements {
  [key: string]: Statement[]
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>()
  const statements = ref<Statements>({})
  const currency = ref<Currency[]>([])

  const checkAccess = async() => await window.ipc.invoke('checkAccess')

  const getUserInfo = async() => {
    userInfo.value = await window.ipc.invoke('userInfo')
  }

  const getCurrency = async() => {
    const result = await window.ipc.invoke('currency')
    if (result) currency.value = result
  }

  const accounts = computed<Account[]>(() => (userInfo.value?.accounts || [])
    .sort((a: Account, b: Account) => b.balance - a.balance)
    .map((account: Account) => {
      const { code } = account.currencyCode

      return {
        ...account,
        balance: (account.balance - account.creditLimit) / 100,
        creditLimit: account.creditLimit / 100,
        currency: {
          code,
          symbol: getSymbolFromCurrency(code),
        },
      }
    }))

  return {
    userInfo,
    accounts,
    currency,
    statements,
    checkAccess,
    getUserInfo,
    getCurrency,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
