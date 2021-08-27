declare module 'electron-traywindow-positioner'
declare module 'monobank-api-client'

enum Type {
  black = 'black',
  white = 'white',
  platinum = 'platinum',
  iron = 'iron',
  fop = 'fop',
  yellow = 'yellow'
}

enum CashbackType {
  None = 'None',
  UAH = 'UAH',
  Miles = 'Miles'
}

interface AccessData {
  _tokenRequestId: string
  _acceptUrl: string
}

interface CurrencyCode {
  code: string
  countries: string[]
  currency: string
  digits: number
  number: string
}

interface Account {
  id: string
  balance: number
  creditLimit: number
  type: Type
  currencyCode: CurrencyCode
  cashbackType: CashbackType
  iban: string
  maskedPan: string
  currency: any
}

interface Statement {
  id: string
  time: number
  description: string
  mcc: number
  hold: boolean
  amount: number
  operationAmount: number
  currencyCode: number
  commissionRate: number
  cashbackAmount: number
  balance: number
  comment: string
  receiptId: string
  counterEdrpou: string
  counterIban: string
}

interface UserInfo {
  id: string
  name: string
  accounts: Account[]
}

interface CheckAccessData {
  isGranted: boolean
}

interface Currency {
  currencyCodeA: number
  currencyCodeB: number
  date: number
  rateSell: number
  rateBuy: number
  rateCross: number
}
