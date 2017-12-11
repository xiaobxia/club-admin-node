/**
 * Created by xiaobxia on 2017/12/11.
 */
const BaseORM = require('../baseORM');
module.exports = class SystemMessageORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'system_message';
  }
};
