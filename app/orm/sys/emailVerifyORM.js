/**
 * Created by xiaobxia on 2017/11/15.
 */
const BaseORM = require('../baseORM');
module.exports = class EmailVerifyORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'sys_email_verify';
  }
};
