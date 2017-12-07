/**
 * Created by xiaobxia on 2017/12/6.
 */
const BaseORM = require('../baseORM');
module.exports = class BroadcastORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'broadcast';
  }
};
