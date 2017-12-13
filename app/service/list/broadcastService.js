/**
 * Created by xiaobxia on 2017/12/6.
 */
const BaseService = require('../baseService');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

module.exports = class BroadcastService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  _checkDate(data) {
    const errorMessage = this.localConst.errorMessage;
    //开始时间不能大于结束时间
    if (moment(data['start_date']).isAfter(moment(data['end_date']))) {
      this.throwError(errorMessage.START_AFTER_END);
    }
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
    this._checkDate(data['start_date'], data['end_date']);
    const result = await broadcastORM.addRecord(data);
    return result.insertId;
  }

  async saveBroadcastById(id, data) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    this._checkDate(data['start_date'], data['end_date']);
    data['update_date']= moment().format('YYYY-M-D HH:mm:ss');
    const result = await broadcastORM.updateRecordById(id, data);
    return result;
  }

  async deleteBroadcastById(id) {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const result = await broadcastORM.deleteRecordById(id);
    return result;
  }

  async clearTable() {
    const broadcastORM = this.ORMs.broadcastORM(this.connection);
    const result = await Promise.all([
      broadcastORM.select({
        where: {
          state: 'A'
        }
      }),
      broadcastORM.select({
        where: {
          state: 'U'
        }
      })
    ]);
    const resultA = result[0];
    const resultU = result[1];
    let updateAList = [];
    let updateUList = [];
    //下线
    for (let k = 0; k < resultA.length; k++) {
      let item = resultA[k];
      if (moment(item['end_date']).isBefore(moment().add(2, 'm'))) {
        updateAList.push(broadcastORM.updateRecordById(item['id'], {
          state: 'X'
        }));
      }
    }
    //上线
    for (let k = 0; k < resultU.length; k++) {
      let item = resultU[k];
      if (moment(item['start_date']).isBefore(moment().add(2, 'm'))) {
        updateUList.push(broadcastORM.updateRecordById(item['id'], {
          state: 'A'
        }));
      }
    }
    await Promise.all(updateAList.concat(updateUList));
  }
};
