/**
 * Created by xiaobxia on 2017/12/13.
 */
const BaseController = require('../baseController');

const filterListModel = {
  articleType: '',
  articleTags: '',
  title: '',
  userName: ''
};

const addModel = {
  userUuid: '',
  articleType: '',
  articleTags: '1|2',
  title: '',
  content: ''
};

module.exports = class ArticleController extends BaseController {
  /**
   * GET
   */
  list() {
    return async (ctx) => {
      const query = ctx.request.query;
      const filter = this.localUtil.keyToHyphen(
        this.localUtil.model(filterListModel, query)
      );
      if (filter.title) {
        filter.title = {
          type: 'like',
          value: `%${filter.title}%`
        }
      }
      //分页
      const pagingModel = this.paging(query.current, query.pageSize);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const articleService = this.services.articleService(connection);
        //得到表
        const result = await Promise.all([
          articleService.getArticles(filter, pagingModel.start, pagingModel.offset),
          articleService.getArticleCount(filter)
        ]);
        pagingModel.total = result[1];
        //转换格式
        const articleList = this.localUtil.listToCamelCase(result[0]);
        this.wrapResult(ctx, {data: {success: true, list: articleList, page: pagingModel}});
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

  /**
   * GET
   */
  count() {
    return async (ctx) => {
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const articleService = this.services.articleService(connection);
        //得到表
        const count = await articleService.getArticleCount();
        //转换格式
        this.wrapResult(ctx, {data: {success: true, count}});
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

  /**
   * GET
   */
  item() {
    return async (ctx) => {
      const query = ctx.request.query;
      const data = {
        id: parseInt(query.id, 10)
      };
      this.validate(ctx, {
        id: {type: 'number', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const articleService = this.services.articleService(connection);
        //得到表
        let article = await articleService.getArticle(data);
        //转换格式
        article = this.localUtil.keyToCamelCase(article);
        this.wrapResult(ctx, {data: {success: true, item: article}});
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

  /**
   * POST
   */
  add() {
    return async (ctx) => {
      const body = ctx.request.body;
      const data = this.localUtil.model(addModel, body);
      this.validate(ctx, {
        articleType: {type: 'string', required: true},
        title: {type: 'string', required: true},
        content: {type: 'string', required: true},
        userUuid: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const userService = this.services.userService(connection);
        const user = await userService.getUser({uuid: data.userUuid});
        const articleService = this.services.articleService(connection);
        //添加记录
        delete data.userUuid;
        data.userId = user.id;
        await articleService.addArticle(this.localUtil.keyToHyphen(data));
        this.wrapResult(ctx, {data: {success: true}});
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

  /**
   * POST
   */
  save() {
    return async (ctx) => {
      const body = ctx.request.body;
      const id = parseInt(body.id, 10);
      const data = this.localUtil.model(addModel, body);
      this.validate(ctx, {
        id: {type: 'number', required: true}
      }, {id});
      //作者需要改为修改者的信息
      this.validate(ctx, {
        articleType: {type: 'string', required: true},
        title: {type: 'string', required: true},
        content: {type: 'string', required: true},
        userUuid: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        //得到作者信息
        const userService = this.services.userService(connection);
        const user = await userService.getUser({uuid: data.userUuid});
        const articleService = this.services.articleService(connection);
        //更新记录
        delete data.userUuid;
        data.userId = user.id;
        await articleService.saveArticleById(id, this.localUtil.keyToHyphen(data));
        this.wrapResult(ctx, {data: {success: true}});
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
  /**
   * GET
   */
  deleteItem() {
    return async (ctx) => {
      const query = ctx.request.query;
      const data = {
        id: parseInt(query.id, 10)
      };
      this.validate(ctx, {
        id: {type: 'number', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const articleService = this.services.articleService(connection);
        //得到表
        await articleService.deleteArticleById(data.id);
        this.wrapResult(ctx, {data: {success: true}});
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
