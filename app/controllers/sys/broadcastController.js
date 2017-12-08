/**
 * Created by xiaobxia on 2017/12/6.
 */
const BaseController = require('../baseController');

const filterListModel = {
  state: ''
};

const addModel = {
  platform: 'web',
  title: '',
  startDate: '',
  endDate: ''
};

module.exports = class BroadcastController extends BaseController {
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
        const broadcastService = this.services.broadcastService(connection);
        //得到表
        const result = await Promise.all([
          broadcastService.getBroadcasts(filter, pagingModel.start, pagingModel.offset),
          broadcastService.getBroadcastCount(filter)
        ]);
        pagingModel.total = result[1];
        //转换格式
        const broadcastList = this.localUtil.listToCamelCase(result[0]);
        this.wrapResult(ctx, {data: {success: true, list: broadcastList, page: pagingModel}});
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
        const broadcastService = this.services.broadcastService(connection);
        //得到表
        const count = await broadcastService.getBroadcastCount();
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
        const broadcastService = this.services.broadcastService(connection);
        //得到表
        let broadcast = await broadcastService.getBroadcast(data);
        //转换格式
        broadcast = this.localUtil.keyToCamelCase(broadcast);
        this.wrapResult(ctx, {data: {success: true, item: broadcast}});
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
        platform: {type: 'string', required: true},
        title: {type: 'string', required: true},
        startDate: {type: 'dateTime', required: true},
        endDate: {type: 'dateTime', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const broadcastService = this.services.broadcastService(connection);
        //添加记录
        await broadcastService.addBroadcast(this.localUtil.keyToHyphen(data));
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
        platform: {type: 'string', required: true},
        title: {type: 'string', required: true},
        startDate: {type: 'dateTime', required: true},
        endDate: {type: 'dateTime', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const broadcastService = this.services.broadcastService(connection);
        //添加记录
        await broadcastService.saveBroadcastById(id, this.localUtil.keyToHyphen(data));
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
        const broadcastService = this.services.broadcastService(connection);
        //得到表
        await broadcastService.deleteBroadcastById(data.id);
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
