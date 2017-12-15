const moment = require('moment');
const BaseService = require('../baseService');


module.exports = class LoginService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  /**
   * 登录
   * @param account
   * @param password
   * @returns {Promise.<*>}
   */
  async login(account, password) {
    const errorMessage = this.localConst.errorMessage;
    const userORM = this.ORMs.userORM(this.connection);
    let dbResult = await userORM.getRawRecordsByAccount(account);
    this.checkDBResult(dbResult, errorMessage.ACCOUNT_OR_PWD_ERROR);
    let user = dbResult[0];
    const isForceLogin = user['force_login'] === 'Y';
    let isLockBefore = user['is_locked'] === 'Y';
    //强制登录
    if(isForceLogin) {
      return user;
    }
    //判断解锁
    if (isLockBefore) {
      if (moment().isAfter(user['unlock_date'])) {
        await userORM.getAllRawRecordById(user['id'], {
          login_fail: 0,
          is_locked: 'N',
          unlock_date: null
        });
        //得到用户新状态
        dbResult = await userORM.getAllRawRecordById(user['id']);
        user = dbResult[0];
      } else {
        this.throwError(errorMessage.LOCK_USER);
      }
    }
    //验证密码
    if (user['password'] === password) {
      //清空尝试，之前没锁定并且失败数不为0
      if (!isLockBefore && user['login_fail'] !==0) {
        await userORM.updateRecordById(user['id'], {
          login_fail: 0,
          is_locked: 'N',
          unlock_date: null
        });
      }
      return user;
    } else {
      //密码不匹配
      let updateData = null;
      if (user['login_fail'] > 6) {
        //失败大于6次
        updateData = {
          is_locked: 'Y',
          unlock_date: moment().add(3, 'minutes').format('YYYY-M-D HH:mm:ss')
        };
      } else {
        updateData = {
          login_fail: 1 + user['login_fail']
        };
      }
      await userORM.updateRecordById(user['id'], updateData);
      this.throwError(errorMessage.ACCOUNT_OR_PWD_ERROR);
    }
  }

  /**
   * 退出登录
   * @param userInfo
   * @returns {Promise.<void>}
   * 注释原因：无需添加记录
   */
  // async logout(userInfo) {
  //   const logAuditORM = this.ORMs.logAuditORM(this.connection);
  //   await logAuditORM.addRecord({
  //     log_type: 'logout',
  //     ...userInfo
  //   });
  // }
};
