const Parameter = require('../common/validate');
const BaseModel = require('../baseModel');
const services = require('../service');

const p = new Parameter();

module.exports = class BaseController extends BaseModel {
  constructor() {
    super();
    this.services = services;
  }

  paging(pageIndex, pageSize, defaultValue) {
    let defaultPageIndex = 1,
      defaultPageSize = 10;
    if (defaultValue) {
      defaultPageIndex = defaultValue.pageIndex || defaultPageIndex;
      defaultPageSize = defaultValue.pageSize || defaultPageSize;
    }
    //得是个整数
    let pageIndexT = parseInt(pageIndex, 10),
      pageSizeT = parseInt(pageSize, 10),
      index = isNaN(pageIndexT) ? defaultPageIndex : pageIndexT,
      size = isNaN(pageSizeT) ? defaultPageSize : pageSizeT;
    return {
      pageIndex: index,
      pageSize: size,
      start: (index - 1) * size,
      offset: size
    };
  }

  wrapResult(ctx, responseData) {
    responseData = responseData || {};
    let _responseData = {};
    _responseData.status = responseData.status || 0;
    _responseData.message = responseData.message || '';
    if (responseData.data) {
      _responseData.data = responseData.data;
    }
    ctx.body = _responseData;
  }

  getSessionUser(session) {
    return session[this.localConst.SESSION_KEY];
  }

  setSessionUser(session, user) {
    session[this.localConst.SESSION_KEY] = user;
  }

  validate(ctx, rules, data) {
    let msgList = p.validate(rules, data);
    if (msgList !== undefined) {
      if (this.isDebug === true) {
        this.logger.warn(msgList);
      }
      let msg = msgList[0];
      ctx.throw(400, msg.field + ' ' + msg.message);
    }
  }

  mysqlGetConnection() {
    return new Promise((resolve, reject) => {
      this.mysqlPool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          resolve(connection);
        }
      });
    });
  }

  mysqlRelease(connection) {
    if (connection) {
      connection.release();
    }
  }

  mysqlBeginTransaction(connection) {
    return new Promise(function (resolve, reject) {
      connection.beginTransaction(function (error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  mysqlCommit(connection) {
    return new Promise(function (resolve, reject) {
      connection.commit(function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  mysqlRollback(connection) {
    if (connection) {
      connection.rollback();
    }
  }
};
