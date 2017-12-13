/**
 * Created by xiaobxia on 2017/12/13.
 */
const BaseService = require('../baseService');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

module.exports = class SysUserService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async getSysUsers(filter, start, offset) {
    const sysUserORM = this.ORMs.sysUserORM(this.connection);
    const sysUsers = await sysUserORM.pageSelect({
      where: filter,
      start,
      offset
    });
    return sysUsers;
  }

  async getSysUserCount(filter) {
    const sysUserORM = this.ORMs.sysUserORM(this.connection);
    const result = await sysUserORM.count({
      where: filter
    });
    return result[0].count;
  }

  async getSysUser(filter) {
    const sysUserORM = this.ORMs.sysUserORM(this.connection);
    const result = await sysUserORM.select({
      where: filter
    });
    return result[0];
  }

  async addSysUser(data) {
    const sysUserORM = this.ORMs.sysUserORM(this.connection);
    data.uuid = md5(data.title + uuidv4());
    const result = await sysUserORM.addRecord(data);
    return result.insertId;
  }

  async saveSysUserById(id, data) {
    const sysUserORM = this.ORMs.sysUserORM(this.connection);
    data['update_date']= moment().format('YYYY-M-D HH:mm:ss');
    const result = await sysUserORM.updateRecordById(id, data);
    return result;
  }

  async deleteSysUserById(id) {
    const sysUserORM = this.ORMs.sysUserORM(this.connection);
    const result = await sysUserORM.deleteRecordById(id);
    return result;
  }
};
