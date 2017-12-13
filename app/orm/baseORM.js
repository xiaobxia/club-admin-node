const BaseModel = require('../baseModel');


module.exports = class BaseORM extends BaseModel {
  constructor(connection) {
    super();
    this.connection = connection;
    this.defaultTable = 'table';
    this.defaultSelect = ['*'];
    this.defaultWhere = {};
    this.defaultWhereType = 'AND';
    this.defaultStart = 0;
    this.defaultOffset = 10;
  }

  tranceSql(sql) {
    if (this.isDebug) {
      this.logger.trace('sql: ' + sql);
    }
  }

  getConnection() {
    return this.connection;
  }

  query(sqlOption) {
    const connection = this.getConnection();
    return new Promise((resolve, reject) => {
      const query = connection.query(
        sqlOption,
        (error, results, fields) => {
          if (error) {
            this.logger.error(error.stack);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
      this.tranceSql(query.sql);
    });
  }

  formatWhere(sql, where, whereType) {
    let values = [];
    let str = '';
    for (const key in where) {
      if (where.hasOwnProperty(key)) {
        if (typeof where[key] === 'object') {
          values.push(key, where[key].value);
          if (where[key].type === 'like') {
            if (str === '') {
              str += 'WHERE ?? LIKE ?';
            } else {
              str += ` ${whereType} ?? LIKE ?`;
            }
          } else {
            if (str === '') {
              str += 'WHERE ??=?';
            } else {
              str += ` ${whereType} ??=?`;
            }
          }
        } else {
          values.push(key, where[key]);
          if (str === '') {
            str += 'WHERE ??=?';
          } else {
            str += ` ${whereType} ??=?`;
          }
        }
      }
    }
    return {
      sql: sql.replace('{WHERE}', str),
      values: values
    };
  }

  select(option) {
    const _option = option || {};
    const _select = _option.select || this.defaultSelect;
    const _where = _option.where || this.defaultWhere;
    const _whereType = _option.whereType || this.defaultWhereType;
    const _table = _option.table || this.defaultTable;
    const queryObj = this.formatWhere(`SELECT ?? FROM ${_table} {WHERE}`, _where, _whereType);
    return this.query({
      sql: queryObj.sql,
      values: [_select, ...queryObj.values]
    });
  }

  pageSelect(option) {
    const _option = option || {};
    const _select = _option.select || this.defaultSelect;
    const _where = _option.where || this.defaultWhere;
    const _whereType = _option.whereType || this.defaultWhereType;
    const _table = _option.table || this.defaultTable;
    const _start = _option.start || this.defaultStart;
    const _offset = _option.offset || this.defaultOffset;
    const queryObj = this.formatWhere(`SELECT ?? FROM ${_table} {WHERE} ORDER BY id DESC LIMIT ?,?`, _where, _whereType);
    return this.query({
      sql: queryObj.sql,
      values: [_select, ...queryObj.values, _start, _offset]
    }).then((results) => {
      if (!results.length) {
        return results;
      } else {
        let ids = [];
        for (let k = 0, len = results.length; k < len; k++) {
          ids.push(results[k]['id']);
        }
        return this.getAllRawRecordsByIds(ids);
      }
    });
  }


  count(option) {
    const _option = option || {};
    const _where = _option.where || this.defaultWhere || {};
    const _whereType = _option.whereType || this.defaultWhereType;
    const _table = _option.table || this.defaultTable;
    const queryObj = this.formatWhere(`SELECT COUNT(*) AS count FROM ${_table} {WHERE}`, _where, _whereType);
    return this.query({
      sql: queryObj.sql,
      values: queryObj.values
    });
  }

  update(option) {
    const _option = option || {};
    const _data = _option.data || {};
    const _whereType = _option.whereType || this.defaultWhereType;
    const _where = _option.where || this.defaultWhere;
    const _table = _option.table || this.defaultTable;
    // _data = this.keyToHyphen(_data);
    const queryObj = this.formatWhere(`UPDATE ${_table} SET ? {WHERE}`, _where, _whereType);
    return this.query({
      sql: queryObj.sql,
      values: [_data, ...queryObj.values]
    });
  }

  insert(option) {
    const _option = option || {};
    const _data = _option.data || {};
    const _table = _option.table || this.defaultTable;
    // _data = this.keyToHyphen(_data);
    return this.query({
      sql: `INSERT INTO ${_table} SET ?`,
      values: _data
    });
  }

  /**
   * 适用于管理平台
   */

  //增
  addRecord(data) {
    return this.query({
      sql: `INSERT INTO ${this.defaultTable} SET ?`,
      values: [data]
    });
  }

  //删
  deleteRecordById(id) {
    return this.query({
      sql: `DELETE FROM ${this.defaultTable} WHERE id=?`,
      values: id
    });
  }

  //改
  updateRecordById(id, data) {
    return this.query({
      sql: `UPDATE ${this.defaultTable} SET ? WHERE id=?`,
      values: [data, id]
    });
  }

  //查

  getAllRawRecordById(id) {
    return this.query({
      sql: `SELECT * FROM ${this.defaultTable} WHERE id=?`,
      values: [id]
    });
  }

  getAllRawRecordsCount() {
    return this.query(`SELECT COUNT(*) AS count FROM ${this.defaultTable}`);
  }

  getAllRawRecordsByIds(ids) {
    return this.query({
      sql: `SELECT * FROM ${this.defaultTable} WHERE id IN (?) ORDER BY id DESC`,
      values: [ids]
    });
  }

  getAllRawRecords(start, offset) {
    return this.query({
      sql: `SELECT id FROM ${this.defaultTable} ORDER BY id DESC LIMIT ?,?`,
      values: [start, offset]
    }).then((results) => {
      if (!results.length) {
        return results;
      } else {
        let ids = [];
        for (let k = 0, len = results.length; k < len; k++) {
          ids.push(results[k]['id']);
        }
        return this.getAllRawRecordsByIds(ids);
      }
    });
  }
};
