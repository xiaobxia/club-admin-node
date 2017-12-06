/**
 * Created by xiaobxia on 2017/12/6.
 */
const BaseService = require('../baseService');

module.exports = class BroadcastService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async getBroadcasts() {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const broadcasts = await broadcastORM.getRecords();
    return broadcasts;
  }
};
