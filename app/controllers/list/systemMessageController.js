/**
 * Created by xiaobxia on 2017/12/11.
 */
const BaseController = require('../baseController');

const filterListModel = {
  state: ''
};

const addModel = {
  title: '',
  startDate: '',
  state: ''
};

module.exports = class SystemMessageController extends BaseController {
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
        const systemMessageService = this.services.systemMessageService(connection);
        //得到表
        const result = await Promise.all([
          systemMessageService.getSystemMessages(filter, pagingModel.start, pagingModel.offset),
          systemMessageService.getSystemMessageCount(filter)
        ]);
        pagingModel.total = result[1];
        //转换格式
        const systemMessageList = this.localUtil.listToCamelCase(result[0]);
        this.wrapResult(ctx, {data: {success: true, list: systemMessageList, page: pagingModel}});
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
        const systemMessageService = this.services.systemMessageService(connection);
        //得到表
        const count = await systemMessageService.getSystemMessageCount();
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
        const systemMessageService = this.services.systemMessageService(connection);
        //得到表
        let systemMessage = await systemMessageService.getSystemMessage(data);
        //转换格式
        systemMessage = this.localUtil.keyToCamelCase(systemMessage);
        this.wrapResult(ctx, {data: {success: true, item: systemMessage}});
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
        title: {type: 'string', required: true},
        startDate: {type: 'dateTime', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const systemMessageService = this.services.systemMessageService(connection);
        //添加记录
        await systemMessageService.addSystemMessage(this.localUtil.keyToHyphen(data));
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
      this.validate(ctx, {
        title: {type: 'string', required: true},
        startDate: {type: 'dateTime', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const systemMessageService = this.services.systemMessageService(connection);
        //添加记录
        await systemMessageService.saveSystemMessageById(id, this.localUtil.keyToHyphen(data));
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
        const systemMessageService = this.services.systemMessageService(connection);
        //得到表
        await systemMessageService.deleteSystemMessageById(data.id);
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
  clearTable() {
    //清理上下线状态
    return async (ctx) => {
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const systemMessageService = this.services.systemMessageService(connection);
        //得到表
        await systemMessageService.clearTable();
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
