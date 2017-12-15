/**
 * Created by xiaobxia on 2017/12/13.
 */
const BaseORM = require('../baseORM');
module.exports = class SysLogAuditORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'sys_log_audit';
  }
};
