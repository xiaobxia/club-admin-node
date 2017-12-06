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
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const broadcastService = this.services.broadcastService(connection);
        const broadcastList = await broadcastService.getBroadcasts();
        this.wrapResult(ctx, {data: {success: true, list: broadcastList}});
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
