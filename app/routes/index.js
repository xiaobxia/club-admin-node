const Router = require('koa-router');
const controllers = require('../controllers');
const config = require('../../config/index');

const projectName = config.project.projectName;
if (!projectName) {
  console.error('projectName is required');
  process.exit();
}
const router = new Router({
  prefix: `/${projectName}`
});
//登录
router.post('/sys/auth/login', controllers.authController.login());
router.get('/sys/auth/checkLogin', controllers.authController.checkLogin());
router.get('/sys/auth/logout', controllers.authController.logout());
router.get('/sys/auth/getDeviceId', controllers.authController.getDeviceId());
//注册
router.get('/sys/user/register/active', controllers.userController.registerActive());
router.get('/sys/user/register/result', controllers.userController.registerResult());
router.post('/sys/user/register', controllers.userController.register());
router.get('/sys/user/sendActiveEmail', controllers.userController.sendActiveEmail());
//广播
router.get('/broadcasts/clearTable', controllers.broadcastController.clearTable());
router.get('/broadcasts/delete', controllers.broadcastController.deleteItem());
router.get('/broadcasts/count', controllers.broadcastController.count());
router.get('/broadcasts/item', controllers.broadcastController.item());
router.get('/broadcasts', controllers.broadcastController.list());
router.post('/broadcasts/add', controllers.broadcastController.add());
router.post('/broadcasts/save', controllers.broadcastController.save());
//系统消息
router.get('/systemMessages/clearTable', controllers.systemMessageController.clearTable());
router.get('/systemMessages/delete', controllers.systemMessageController.deleteItem());
router.get('/systemMessages/count', controllers.systemMessageController.count());
router.get('/systemMessages/item', controllers.systemMessageController.item());
router.get('/systemMessages', controllers.systemMessageController.list());
router.post('/systemMessages/add', controllers.systemMessageController.add());
router.post('/systemMessages/save', controllers.systemMessageController.save());
//文章
router.get('/articles/delete', controllers.articleController.deleteItem());
router.get('/articles/count', controllers.articleController.count());
router.get('/articles/item', controllers.articleController.item());
router.get('/articles', controllers.articleController.list());
router.post('/articles/add', controllers.articleController.add());
router.post('/articles/save', controllers.articleController.save());
//用户
router.get('/sysUsers/delete', controllers.sysUserController.deleteItem());
router.get('/sysUsers/count', controllers.sysUserController.count());
router.get('/sysUsers/item', controllers.sysUserController.item());
router.get('/sysUsers', controllers.sysUserController.list());
router.post('/sysUsers/add', controllers.sysUserController.add());
router.post('/sysUsers/save', controllers.sysUserController.save());
//登录记录
router.get('/sysLogAudits', controllers.sysLogAuditController.list());



module.exports = router;
