'use strict';

const Enum = require('./Enum');

class Permission extends Enum {}

Permission.GET_STATEMENT = new Permission('s');
Permission.GET_PERSONAL_INFO = new Permission('p');
Permission.GET_FOP = new Permission('f');

module.exports = Permission;
