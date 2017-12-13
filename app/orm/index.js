/**
 * Created by xiaobxia on 2017/11/1.
 */
const UserORM = require('./list/userORM');
const LogAuditORM = require('./list/logAuditORM');
const EmailVerifyORM = require('./list/emailVerifyORM');
const BroadcastORM = require('./list/broadcastORM');
const SystemMessageORM = require('./list/systemMessageORM');
const ArticleORM = require('./list/articleORM');
const SysUserORM = require('./list/sysUserORM');

module.exports = {
  userORM(connection) {
    return new UserORM(connection);
  },
  logAuditORM(connection) {
    return new LogAuditORM(connection);
  },
  emailVerifyORM(connection) {
    return new EmailVerifyORM(connection);
  },
  broadcastORM(connection) {
    return new BroadcastORM(connection);
  },
  systemMessageORM(connection) {
    return new SystemMessageORM(connection);
  },
  articleORM(connection) {
    return new ArticleORM(connection);
  },
  sysUserORM(connection) {
    return new SysUserORM(connection);
  }
};
