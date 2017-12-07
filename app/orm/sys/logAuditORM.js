/**
 * Created by xiaobxia on 2017/7/24.
 */
const BaseORM = require('../baseORM');
module.exports = class LogAuditORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'sys_log_audit';
  }
};
