import express from 'express'
// @ts-ignore
import { ClientFactory, Permission } from './monobank-api-client'

const app = express()
const api = ClientFactory.createCorporate(process.env.KEY_ID, process.env.PRIVATE_KEY)

app.get('/api/ping', (req, res) => {
  res.end('pong')
})

app.get('/api/getaccess', async(req, res) => {
  const accessInfo = await api.getAccessRequest({
    permissions: [
      Permission.GET_STATEMENT,
      Permission.GET_PERSONAL_INFO,
      Permission.GET_FOP,
    ],
  })

  return res.json(accessInfo)
})

app.get('/api/checkaccess', async(req, res) => {
  const isGranted = await api.checkAccessRequest({
    requestId: req.headers['x-token'],
  })
  return res.json({ isGranted })
})

app.get('/api/userinfo', async(req, res) => {
  const userInfo = await api.getUserInfoWithRequestId(req.headers['x-token'])
  return res.json({
    name: userInfo.name,
    accounts: userInfo.accounts.map((account: Account) => ({
      id: account.id,
      balance: account.balance,
      cashbackType: account.cashbackType,
      creditLimit: account.creditLimit,
      currencyCode: account.currencyCode,
      iban: account.iban,
      maskedPan: account.maskedPan,
      type: account.type,
    })),
  })
})

app.get('/api/statement', async(req, res) => {
  const from = new Date()
  from.setMonth(from.getMonth() - 1)
  const { account } = req.query

  const statement = await api.getStatementWithRequestId(
    { account, from },
    req.headers['x-token'],
  )
  return res.json(
    statement.map((item: Statement) => ({
      id: item.id,
      time: item.time,
      description: item.description,
      mcc: item.mcc,
      hold: item.hold,
      amount: item.amount,
      operationAmount: item.operationAmount,
      currencyCode: item.currencyCode,
      commissionRate: item.commissionRate,
      cashbackAmount: item.cashbackAmount,
      balance: item.balance,
    })),
  )
})

app.get('/api/currency', async(req, res) => {
  const currency = await api.getCurrencyList()

  return res.json(
    currency.map((item: Currency) => ({
      currencyCodeA: item.currencyCodeA,
      currencyCodeB: item.currencyCodeB,
      date: item.date,
      rateSell: item.rateSell,
      rateBuy: item.rateBuy,
      rateCross: item.rateCross,
    })),
  )
})

app.use(function(err: any, req: any, res: any, next: any) {
  next()
})

process.on('uncaughtException', (err) => {
  console.error(err);
});

export default app
