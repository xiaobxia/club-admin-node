/**
 * Created by xiaobxia on 2017/10/31.
 */
const AuthController = require('./list/authController');
const UserController = require('./list/userController');
const BroadcastController = require('./list/broadcastController');
const SystemMessageController = require('./list/systemMessageController');
const ArticleController = require('./list/articleController');

module.exports = {
  authController: new AuthController(),
  userController: new UserController(),
  broadcastController: new BroadcastController(),
  systemMessageController: new SystemMessageController(),
  articleController: new ArticleController()
};
