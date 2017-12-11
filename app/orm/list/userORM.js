/**
 * Created by xiaobxia on 2017/6/26.
 */
const BaseORM = require('../baseORM');
module.exports = class UserORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'sys_user';
  }

  //查
  getRawRecordsByAccount(account) {
    return this.query({
      sql: `SELECT * FROM ${this.defaultTable} WHERE state='A' AND (email=? OR mobile=? OR user_name=?)`,
      values: [account, account, account]
    });
  }

  getAllRawRecordsByAccount(account) {
    return this.query({
      sql: `SELECT * FROM ${this.defaultTable} WHERE (email=? OR mobile=? OR user_name=?)`,
      values: [account, account, account]
    });
  }
};
