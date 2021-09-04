'use strict'

const cc = require('currency-codes')

class Account {
  /**
   * @param {string} id
   * @param {int} balance
   * @param {int} creditLimit
   * @param {int} currencyCode
   * @param {string} cashbackType
   */
  constructor({ id, balance, creditLimit, currencyCode, cashbackType, maskedPan, type, iban }) {
    this._id = id
    this._balance = balance
    this._creditLimit = creditLimit
    this._currencyCode = cc.number(currencyCode)

    if (typeof this._currencyCode === 'undefined')
      throw new Error(`Invalid currencyCode value "${currencyCode}"`)

    this._cashbackType = cashbackType
    this._maskedPan = maskedPan
    this._type = type
    this._iban = iban
  }

  /**
   * @returns {string}
   */
  get id() {
    return this._id
  }

  /**
   * @returns {int}
   */
  get balance() {
    return this._balance
  }

  /**
   * @returns {int}
   */
  get creditLimit() {
    return this._creditLimit
  }

  /**
   * @returns {CurrencyCodeRecord}
   */
  get currencyCode() {
    return this._currencyCode
  }

  /**
   * @returns {string}
   */
  get cashbackType() {
    return this._cashbackType
  }

  /**
   * @returns {string}
   */
  get iban() {
    return this._iban
  }

  /**
   * @returns {string}
   */
  get type() {
    return this._type
  }

  /**
   * @returns {string[]}
   */
  get maskedPan() {
    return this._maskedPan
  }
}

module.exports = Account
