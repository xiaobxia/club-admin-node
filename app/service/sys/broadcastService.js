/**
 * Created by xiaobxia on 2017/12/6.
 */
const BaseService = require('../baseService');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');

module.exports = class BroadcastService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async getBroadcasts(filter, start, offset) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const broadcasts = await broadcastORM.pageSelect({
      where: filter,
      start,
      offset
    });
    return broadcasts;
  }

  async getBroadcastCount(filter) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const result = await broadcastORM.count({
      where: filter
    });
    return result[0].count;
  }

  async getBroadcast(filter) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const result = await broadcastORM.select({
      where: filter
    });
    return result[0];
  }

  async addBroadcast(data) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    data.uuid = md5(data.title + uuidv4());
    const result = await broadcastORM.addRecord(data);
    return result.insertId;
  }

  async saveBroadcastById(id, data) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const result = await broadcastORM.updateRecordById(id, data);
    console.log(result)
    return result;
  }

  async deleteBroadcastById(id) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const result = await broadcastORM.deleteRecordById(id);
    console.log(result)
    return result;
  }
};
