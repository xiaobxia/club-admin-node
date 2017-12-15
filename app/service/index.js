/**
 * Created by xiaobxia on 2017/10/31.
 */
const AuthService = require('./list/authService');
const UserService = require('./list/userService');
const BroadcastService = require('./list/broadcastService');
const SystemMessageService = require('./list/systemMessageService');
const ArticleService = require('./list/articleService');
const SysUserService = require('./list/sysUserService');
const SysLogAuditService = require('./list/sysLogAuditService');

module.exports = {
  authService(connection){
    return new AuthService(connection);
  },
  userService(connection) {
    return new UserService(connection);
  },
  broadcastService(connection) {
    return new BroadcastService(connection);
  },
  systemMessageService(connection) {
    return new SystemMessageService(connection);
  },
  articleService(connection) {
    return new ArticleService(connection);
  },
  sysUserService(connection) {
    return new SysUserService(connection);
  },
  sysLogAuditService(connection) {
    return new SysLogAuditService(connection);
  }
};
