/**
 * Created by xiaobxia on 2017/12/13.
 */
const BaseController = require('../baseController');

const filterListModel = {
  userName: '',
  email: '',
  mobile: '',
  state: '',
  isLocked: '',
  active: ''
};

const addModel = {
  userUuid: '',
  sysUserType: '',
  sysUserTags: '1|2',
  title: '',
  content: ''
};

module.exports = class SysUserController extends BaseController {
  /**
   * GET
   */
  list() {
    return async (ctx) => {
      const query = ctx.request.query;
      const filter = this.localUtil.keyToHyphen(
        this.localUtil.model(filterListModel, query)
      );
      //分页
      const pagingModel = this.paging(query.current, query.pageSize);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const sysUserService = this.services.sysUserService(connection);
        //得到表
        const result = await Promise.all([
          sysUserService.getSysUsers(filter, pagingModel.start, pagingModel.offset),
          sysUserService.getSysUserCount(filter)
        ]);
        pagingModel.total = result[1];
        //转换格式
        const sysUserList = this.localUtil.listToCamelCase(result[0]);
        this.wrapResult(ctx, {data: {success: true, list: sysUserList, page: pagingModel}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, success: false}});
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * GET
   */
  count() {
    return async (ctx) => {
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const sysUserService = this.services.sysUserService(connection);
        //得到表
        const count = await sysUserService.getSysUserCount();
        //转换格式
        this.wrapResult(ctx, {data: {success: true, count}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, success: false}});
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * GET
   */
  item() {
    return async (ctx) => {
      const query = ctx.request.query;
      const data = {
        id: parseInt(query.id, 10)
      };
      this.validate(ctx, {
        id: {type: 'number', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const sysUserService = this.services.sysUserService(connection);
        //得到表
        let sysUser = await sysUserService.getSysUser(data);
        //转换格式
        sysUser = this.localUtil.keyToCamelCase(sysUser);
        this.wrapResult(ctx, {data: {success: true, item: sysUser}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, success: false}});
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * POST
   */
  add() {
    return async (ctx) => {
      const body = ctx.request.body;
      const data = this.localUtil.model(addModel, body);
      this.validate(ctx, {
        sysUserType: {type: 'string', required: true},
        title: {type: 'string', required: true},
        content: {type: 'string', required: true},
        userUuid: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const userService = this.services.userService(connection);
        const user = await userService.getUser({uuid: data.userUuid});
        const sysUserService = this.services.sysUserService(connection);
        //添加记录
        delete data.userUuid;
        data.userId = user.id;
        await sysUserService.addSysUser(this.localUtil.keyToHyphen(data));
        this.wrapResult(ctx, {data: {success: true}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, success: false}});
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * POST
   */
  save() {
    return async (ctx) => {
      const body = ctx.request.body;
      const id = parseInt(body.id, 10);
      const data = this.localUtil.model(addModel, body);
      this.validate(ctx, {
        id: {type: 'number', required: true}
      }, {id});
      //作者需要改为修改者的信息
      this.validate(ctx, {
        sysUserType: {type: 'string', required: true},
        title: {type: 'string', required: true},
        content: {type: 'string', required: true},
        userUuid: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        //得到作者信息
        const userService = this.services.userService(connection);
        const user = await userService.getUser({uuid: data.userUuid});
        const sysUserService = this.services.sysUserService(connection);
        //更新记录
        delete data.userUuid;
        data.userId = user.id;
        await sysUserService.saveSysUserById(id, this.localUtil.keyToHyphen(data));
        this.wrapResult(ctx, {data: {success: true}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, success: false}});
        } else {
          throw error;
        }
      }
    }
  }
  /**
   * GET
   */
  deleteItem() {
    return async (ctx) => {
      const query = ctx.request.query;
      const data = {
        id: parseInt(query.id, 10)
      };
      this.validate(ctx, {
        id: {type: 'number', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const sysUserService = this.services.sysUserService(connection);
        //得到表
        await sysUserService.deleteSysUserById(data.id);
        this.wrapResult(ctx, {data: {success: true}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, success: false}});
        } else {
          throw error;
        }
      }
    }
  }
};
