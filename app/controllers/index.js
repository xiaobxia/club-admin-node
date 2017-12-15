/**
 * Created by xiaobxia on 2017/10/31.
 */
const AuthController = require('./list/authController');
const UserController = require('./list/userController');
const BroadcastController = require('./list/broadcastController');
const SystemMessageController = require('./list/systemMessageController');
const ArticleController = require('./list/articleController');
const SysUserController = require('./list/sysUserController');
const SysLogAuditController = require('./list/sysLogAuditController');

module.exports = {
  authController: new AuthController(),
  userController: new UserController(),
  broadcastController: new BroadcastController(),
  systemMessageController: new SystemMessageController(),
  articleController: new ArticleController(),
  sysUserController: new SysUserController(),
  sysLogAuditController: new SysLogAuditController()
};
