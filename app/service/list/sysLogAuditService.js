/**
 * Created by xiaobxia on 2017/12/13.
 */
const BaseService = require('../baseService');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

module.exports = class SysLogAuditService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async getSysLogAudits(filter, start, offset) {
    const sysLogAuditORM = this.ORMs.sysLogAuditORM(this.connection);
    const sysLogAudits = await sysLogAuditORM.pageSelect({
      where: filter,
      start,
      offset
    });
    return sysLogAudits;
  }

  async getSysLogAuditCount(filter) {
    const sysLogAuditORM = this.ORMs.sysLogAuditORM(this.connection);
    const result = await sysLogAuditORM.count({
      where: filter
    });
    return result[0].count;
  }

  async getSysLogAudit(filter) {
    const sysLogAuditORM = this.ORMs.sysLogAuditORM(this.connection);
    const result = await sysLogAuditORM.select({
      where: filter
    });
    return result[0];
  }

  async addSysLogAudit(data) {
    const sysLogAuditORM = this.ORMs.sysLogAuditORM(this.connection);
    const result = await sysLogAuditORM.addRecord(data);
    return result.insertId;
  }

  async saveSysLogAuditById(id, data) {
    const sysLogAuditORM = this.ORMs.sysLogAuditORM(this.connection);
    data['update_date']= moment().format('YYYY-M-D HH:mm:ss');
    const result = await sysLogAuditORM.updateRecordById(id, data);
    return result;
  }

  async deleteSysLogAuditById(id) {
    const sysLogAuditORM = this.ORMs.sysLogAuditORM(this.connection);
    const result = await sysLogAuditORM.deleteRecordById(id);
    return result;
  }
};
