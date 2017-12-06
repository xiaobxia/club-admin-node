/**
 * Created by xiaobxia on 2017/12/6.
 */
const BaseORM = require('../baseORM');
module.exports = class BroadcastORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'broadcast';
  }

  getAllRecordsCount() {
    return this.query(`SELECT COUNT(*) AS count FROM ${this.defaultTable}`);
  }

  getAllRecordsByIds(ids) {
    return this.query({
      sql: `SELECT * FROM ${this.defaultTable} WHERE id IN (?)`,
      values: [ids]
    });
  }

  getAllRecords(start, offset) {
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
        return this.getAllRecordsByIds(ids);
      }
    });
  }
};
