/**
 * Created by xiaobxia on 2017/12/13.
 */
const BaseController = require('../baseController');

const filterListModel = {
  userId: ''
};

module.exports = class SysLogAuditController extends BaseController {
  /**
   * GET
   */
  list() {
    return async (ctx) => {
      const query = ctx.request.query;
      //分页
      const pagingModel = this.paging(query.current, query.pageSize);
      //搜索模型
      const filter = this.localUtil.keyToHyphen(
        this.localUtil.model(filterListModel, query)
      );
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const sysLogAuditService = this.services.sysLogAuditService(connection);
        //得到表
        const result = await Promise.all([
          sysLogAuditService.getSysLogAudits(filter, pagingModel.start, pagingModel.offset),
          sysLogAuditService.getSysLogAuditCount(filter)
        ]);
        pagingModel.total = result[1];
        //转换格式
        const sysLogAuditList = this.localUtil.listToCamelCase(result[0]);
        this.wrapResult(ctx, {data: {success: true, list: sysLogAuditList, page: pagingModel}});
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
