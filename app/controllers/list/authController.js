const BaseController = require('../baseController');
const md5 = require('md5');

module.exports = class AuthController extends BaseController {
  /**
   * POST
   * account
   * password
   */
  login() {
    return async (ctx) => {
      console.log(ctx.request)
      const query = ctx.request.body;
      const data = {
        account: query.account,
        password: query.password
      };
      this.validate(ctx, {
        account: {type: 'string', required: true},
        password: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        //登录
        const authService = this.services.authService(connection);
        //返回用户信息
        let user = await authService.login(data.account, data.password);
        //添加登录记录
        const sysLogAuditService = this.services.sysLogAuditService(connection);
        const token = md5(user.id + ctx.request.header['user_agent'] + (new Date().getTime()));
        const deviceId = ctx.cookies.get('device_id');
        await sysLogAuditService.addSysLogAudit({
          'user_id': user.id,
          'log_type': 'login',
          'platform': 'admin',
          'token': token,
          'device_id': deviceId
        });
        //转换格式
        user = this.localUtil.keyToCamelCase(user);
        const userInfo = {
          userUuid: user.uuid,
          userName: user.userName,
          active: user.active,
          token: token,
          deviceId: deviceId
        };
        this.setSessionUser(ctx.session, userInfo);
        this.wrapResult(ctx, {data: {login: true, ...userInfo}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, login: false}});
        } else {
          throw error;
        }
      }
    };
  }

  /**
   * GET
   */
  checkLogin() {
    return async (ctx) => {
      let userInfo = this.getSessionUser(ctx.session);
      // session的id一般只有在使用缓存层的时候会用到
      this.wrapResult(ctx, {
        data: {
          isLogin: !!userInfo,
          ...userInfo
        }
      });
    }
  }

  /**
   * GET
   */
  logout() {
    return async (ctx) => {
      // const userInfoRaw = this.getSessionUser(ctx.session);
      // const userInfo = {
      //   user_uuid: userInfoRaw.userUuid,
      //   user_name: userInfoRaw.userName
      // };
      // if (userInfo) {
      //   let connection = null;
      //   try {
      //     connection = await this.mysqlGetConnection();
      //     this.mysqlBeginTransaction(connection);
      //     const authService = this.services.authService(connection);
      //     await authService.logout(userInfo);
      //     this.mysqlCommit(connection);
      //     this.mysqlRelease(connection);
      //   } catch (error) {
      //     this.mysqlRollback(connection);
      //     this.mysqlRelease(connection);
      //     throw error;
      //   }
      // }
      ctx.session = null;
      this.wrapResult(ctx);
    }
  }

  /**
   * GET
   */
  getDeviceId() {
    return async (ctx) => {
      if (!ctx.cookies.get('device_id')) {
        ctx.cookies.set('device_id', md5(ctx.ip + ctx.request.header['user_agent']), {
          expires: new Date('2038-01-18T00:00:03.424Z')
        })
      }
      this.wrapResult(ctx);
    }
  }
};
