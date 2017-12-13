/**
 * Created by xiaobxia on 2017/12/13.
 */
const BaseService = require('../baseService');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

module.exports = class ArticleService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async getArticles(filter, start, offset) {
    const articleORM = this.ORMs.articleORM(this.connection);
    const articles = await articleORM.pageSelect({
      where: filter,
      start,
      offset
    });
    return articles;
  }

  async getArticleCount(filter) {
    const articleORM = this.ORMs.articleORM(this.connection);
    const result = await articleORM.count({
      where: filter
    });
    return result[0].count;
  }

  async getArticle(filter) {
    const articleORM = this.ORMs.articleORM(this.connection);
    const result = await articleORM.select({
      where: filter
    });
    return result[0];
  }

  async addArticle(data) {
    const articleORM = this.ORMs.articleORM(this.connection);
    data.uuid = md5(data.title + uuidv4());
    const result = await articleORM.addRecord(data);
    return result.insertId;
  }

  async saveArticleById(id, data) {
    const articleORM = this.ORMs.articleORM(this.connection);
    data['update_date']= moment().format('YYYY-M-D HH:mm:ss');
    const result = await articleORM.updateRecordById(id, data);
    return result;
  }

  async deleteArticleById(id) {
    const articleORM = this.ORMs.articleORM(this.connection);
    const result = await articleORM.deleteRecordById(id);
    return result;
  }
};
