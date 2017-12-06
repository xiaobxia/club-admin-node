/**
 * Created by xiaobxia on 2017/10/31.
 */
const AuthService = require('./sys/authService');
const UserService = require('./sys/userService');
const BroadcastService = require('./sys/broadcastService');

module.exports = {
  authService(connection){
    return new AuthService(connection);
  },
  userService(connection) {
    return new UserService(connection);
  },
  broadcastService(connection) {
    return new BroadcastService(connection);
  }
};
