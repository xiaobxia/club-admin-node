/**
 * Created by xiaobxia on 2017/12/11.
 */
const BaseService = require('../baseService');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

module.exports = class SystemMessageService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async getSystemMessages(filter, start, offset) {
    const systemMessageORM = this.ORMs.systemMessageORM(this.connection);
    const systemMessages = await systemMessageORM.pageSelect({
      where: filter,
      start,
      offset
    });
    return systemMessages;
  }

  async getSystemMessageCount(filter) {
    const systemMessageORM = this.ORMs.systemMessageORM(this.connection);
    const result = await systemMessageORM.count({
      where: filter
    });
    return result[0].count;
  }

  async getSystemMessage(filter) {
    const systemMessageORM = this.ORMs.systemMessageORM(this.connection);
    const result = await systemMessageORM.select({
      where: filter
    });
    return result[0];
  }

  async addSystemMessage(data) {
    const systemMessageORM = this.ORMs.systemMessageORM(this.connection);
    data.uuid = md5(data.title + uuidv4());
    const result = await systemMessageORM.addRecord(data);
    return result.insertId;
  }

  async saveSystemMessageById(id, data) {
    const systemMessageORM = this.ORMs.systemMessageORM(this.connection);
    data['update_date']= moment().format('YYYY-M-D HH:mm:ss');
    const result = await systemMessageORM.updateRecordById(id, data);
    return result;
  }

  async deleteSystemMessageById(id) {
    const systemMessageORM = this.ORMs.systemMessageORM(this.connection);
    const result = await systemMessageORM.deleteRecordById(id);
    return result;
  }

  async clearTable() {
    const systemMessageORM = this.ORMs.systemMessageORM(this.connection);
    const result = await systemMessageORM.select({
      where: {
        state: 'U'
      }
    });
    let updateUList = [];
    //上线
    for (let k = 0; k < result.length; k++) {
      let item = result[k];
      if (moment(item['start_date']).isBefore(moment().add(2, 'm'))) {
        updateUList.push(systemMessageORM.updateRecordById(item['id'], {
          state: 'A'
        }));
      }
    }
    await Promise.all(updateUList);
  }
};
