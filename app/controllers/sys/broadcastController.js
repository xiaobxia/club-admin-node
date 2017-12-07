/**
 * Created by xiaobxia on 2017/12/6.
 */
const BaseController = require('../baseController');

module.exports = class BroadcastController extends BaseController {
  /**
   * GET
   */
  list() {
    return async (ctx) => {
      const query = ctx.request.query;
      //分页
      const pagingModel = this.paging(query.pageIndex, query.pageSize);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const broadcastService = this.services.broadcastService(connection);
        //得到表
        let broadcastList = await broadcastService.getBroadcasts(pagingModel.start, pagingModel.offset);
        //转换格式
        broadcastList = this.localUtil.listToCamelCase(broadcastList);
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
};
