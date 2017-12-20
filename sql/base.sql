DROP TABLE IF EXISTS sys_log_audit;

DROP TABLE IF EXISTS sys_user;

DROP TABLE IF EXISTS user_archive;

DROP TABLE IF EXISTS sys_email_verify;

DROP TABLE IF EXISTS broadcast;

DROP TABLE IF EXISTS user_message;

DROP TABLE IF EXISTS article;

DROP TABLE IF EXISTS article_info;

DROP TABLE IF EXISTS article_comment;

DROP TABLE IF EXISTS user_collect_like;

DROP TABLE IF EXISTS user_focus;

DROP TABLE IF EXISTS user_integral;

DROP TABLE IF EXISTS survey;

DROP TABLE IF EXISTS survey_result;

/*==============================================================*/
/* Table: sys_log_audit(登录日志)                                        */
/*==============================================================*/
CREATE TABLE sys_log_audit
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   user_id              INT(11) NOT NULL COMMENT '用户id',
   log_type             VARCHAR(10) NOT NULL COMMENT '日志类型',
   platform             CHAR(10) NOT NULL DEFAULT 'web' COMMENT '平台:web,admin',
   token                CHAR(32) NOT NULL COMMENT '用户登录的token，用户id+user-agent+时间',
   device_id            VARCHAR(100) NOT NULL COMMENT '设备id',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: sys_user(账户信息)                                             */
/*==============================================================*/
CREATE TABLE sys_user
(
   id                   INT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '用户的uuid',
   password             VARCHAR(60) NOT NULL COMMENT '登陆账户密码',
   email                VARCHAR(50) NOT NULL DEFAULT '',
   mobile               VARCHAR(20) NOT NULL DEFAULT '',
   active               CHAR(1) NOT NULL DEFAULT 'N' COMMENT '是否已激活账户，Y已激活，N未激活',
   active_date          DATETIME COMMENT '激活的日期',
   force_login          CHAR(1) NOT NULL DEFAULT 'N' COMMENT 'Y允许强制登录，N不允许。默认N',
   login_fail           INT(1) NOT NULL DEFAULT 0 COMMENT '登录失败次数，空表示0',
   is_locked            CHAR(1) NOT NULL DEFAULT 'N' COMMENT '是否锁定，''Y''-锁定，''N''-没有锁定，null表示''N''',
   unlock_date          DATETIME COMMENT '解锁的日期',
   state                CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'U-未启用, A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARSET=UTF8;

/*==============================================================*/
/* Table: user_archive(用户档案)                                             */
/*==============================================================*/
CREATE TABLE user_archive
(
   id                   INT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '档案的uuid',
   user_id              INT(11) NOT NULL COMMENT '用户id',
   user_name            VARCHAR(60) NOT NULL COMMENT '登陆账户名',
   type                 VARCHAR(10) NOT NULL DEFAULT 'ordinary' COMMENT '用户的类型,admin,ordinary',
   avatar               VARCHAR(255) NOT NULL DEFAULT '' COMMENT '用户头像地址',
   true_name            VARCHAR(255) NOT NULL DEFAULT '' COMMENT '真实姓名',
   gender               INT(1) NOT NULL DEFAULT 0 COMMENT '性别,0:未设置,1:男,2:女',
   birthday             DATETIME COMMENT '用户的生日',
   city                 VARCHAR(60) NOT NULL DEFAULT '' COMMENT '城市',
   website              VARCHAR(255) NOT NULL DEFAULT '' COMMENT '个人网址',
   company              VARCHAR(255) NOT NULL DEFAULT '' COMMENT '公司',
   school               VARCHAR(255) NOT NULL DEFAULT '' COMMENT '学校',
   job                  VARCHAR(60) NOT NULL DEFAULT '' COMMENT '职位',
   introduce            VARCHAR(255) NOT NULL DEFAULT '' COMMENT '介绍',
   state                CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'U-未启用, A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARSET=UTF8;

/*==============================================================*/
/* Table: sys_email_verify(邮箱验证)                                     */
/*==============================================================*/
CREATE TABLE sys_email_verify
(
   id                   INT(9) NOT NULL AUTO_INCREMENT,
   user_name            VARCHAR(60) NOT NULL COMMENT '用户设置的用户名',
   email                VARCHAR(50) NOT NULL COMMENT '用户设置的邮箱地址',
   password             VARCHAR(60) NOT NULL COMMENT '用户设置的密码',
   verify_code          CHAR(32) NOT NULL COMMENT '用户的验证码',
   verify_status        INT(1) NOT NULL COMMENT '验证状态，1：邮件已发送，2：邮件验证成功，2：邮件验证失败',
   state                CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'U-未启用, A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: broadcast(广播)                                          */
/*==============================================================*/
CREATE TABLE broadcast
(
   id                   INT(9) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '广播的uuid',
   user_id              INT(11) NOT NULL COMMENT '编辑用户的id',
   start_date           DATETIME COMMENT '广播上线时间',
   end_date             DATETIME COMMENT '广播下线时间',
   platform             CHAR(10) NOT NULL DEFAULT 'web' COMMENT '广播上线平台',
   title                VARCHAR(150) NOT NULL DEFAULT '' COMMENT '广播的标题',
   url                  VARCHAR(255) NOT NULL DEFAULT '' COMMENT '广播的地址',
   state                CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'U-未启用, A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: user_message(用户消息，系统消息不群发，群发用公告)           */
/*==============================================================*/
CREATE TABLE user_message
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '用户消息的uuid',
   send_user_id         INT(11) NOT NULL COMMENT '发送消息的用户id',
   receive_user_id      INT(11) NOT NULL COMMENT '接收消息用户id',
   type                 VARCHAR(20) NOT NULL COMMENT '消息的类型,系统:system,@:at,评论:comment',
   title                VARCHAR(150) NOT NULL DEFAULT '' COMMENT '消息的标题',
   content              VARCHAR(600) NOT NULL DEFAULT '' COMMENT '消息的内容',
   url                  VARCHAR(255) NOT NULL DEFAULT '' COMMENT '消息的地址',
   has_read             CHAR(1) NOT NULL DEFAULT 'N' COMMENT 'Y以阅读，N未阅读。默认N',
   read_date            DATETIME COMMENT '阅读的日期',
   state                CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'U-未启用, A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: article(文章)                                          */
/*==============================================================*/
CREATE TABLE article
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '文章的uuid',
   user_id              INT(11) NOT NULL COMMENT '作者的id',
   article_type         VARCHAR(30) NOT NULL DEFAULT 'question' COMMENT '文章的类型,question,friend,activity,game,partTime',
   article_tags         VARCHAR(60) NOT NULL DEFAULT '' COMMENT '文章的标签',
   title                VARCHAR(150) NOT NULL DEFAULT '' COMMENT '文章的标题',
   cover                VARCHAR(255) NOT NULL DEFAULT '' COMMENT '文章的封面地址',
   url                  VARCHAR(255) NOT NULL DEFAULT '' COMMENT '文章的地址',
   content              TEXT NOT NULL COMMENT '文章的内容',
   state                CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'U-未启用, A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: article_info(文章)                                               */
/*==============================================================*/
CREATE TABLE article_info
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '文章信息的uuid',
   article_id           INT(11) NOT NULL COMMENT '文章的id',
   top                  CHAR(1) NOT NULL DEFAULT 'N' COMMENT 'Y置顶，N不置顶。默认N',
   good                 CHAR(1) NOT NULL DEFAULT 'N' COMMENT 'Y精品，N不是精品。默认N',
   like_count           INT(11) NOT NULL DEFAULT 0 COMMENT '文章的点赞数',
   last_like_date       DATETIME COMMENT '最近点赞时间',
   comment_count        INT(11) NOT NULL DEFAULT 0 COMMENT '文章的评论数',
   last_comment_id      DATETIME COMMENT '最近评论的id',
   last_comment_date    DATETIME COMMENT '最近评论时间',
   collect_count        INT(11) NOT NULL DEFAULT 0 COMMENT '文章的收藏数',
   last_collect_date    DATETIME COMMENT '最近收藏时间',
   visit_count          INT(11) NOT NULL DEFAULT 0 COMMENT '文章的浏览数',
   last_visit_date      DATETIME COMMENT '最近浏览时间',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: article_comment(文章评论)                                       */
/*==============================================================*/
CREATE TABLE article_comment
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '评论的uuid',
   article_id           INT(11) NOT NULL COMMENT '评论文章的id',
   owner_user_id        INT(11) NOT NULL COMMENT '发表评论的用户id',
   target_user_id       INT(11) NOT NULL COMMENT '评论的目标用户id',
   parent_id            INT(11) NOT NULL COMMENT '评论的目标id(id是某条评论的id)',
   parent_type          VARCHAR(20) NOT NULL DEFAULT 'article' COMMENT '评论的目标类型,文章:article,评论:comment',
   content              VARCHAR(600) NOT NULL DEFAULT '' COMMENT '评论的内容',
   like_count           INT(11) NOT NULL DEFAULT 0 COMMENT '评论的点赞数',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: user_collect_like(用户的收藏和点赞)                           */
/*==============================================================*/
CREATE TABLE user_collect_like
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '记录的uuid',
   user_id              INT(11) NOT NULL COMMENT '用户id',
   article_id           INT(11) NOT NULL COMMENT '文章的id',
   comment_id           INT(11) NOT NULL COMMENT '评论的id',
   target_type          VARCHAR(20) NOT NULL COMMENT '对象的类型,文章:article,评论:comment',
   type                 VARCHAR(20) NOT NULL COMMENT '记录的类型,like,collect',
   state                CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'U-未启用, A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: user_integral(用户的积分)                           */
/*==============================================================*/
CREATE TABLE user_integral
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '记录的uuid',
   user_id              INT(11) NOT NULL COMMENT '用户id',
   integral             INT(11) NOT NULL DEFAULT 0 COMMENT '用户的积分',
   be_like_count        INT(11) NOT NULL DEFAULT 0 COMMENT '文章的点赞数',
   be_comment_count     INT(11) NOT NULL DEFAULT 0 COMMENT '文章的评论数',
   be_collect_count     INT(11) NOT NULL DEFAULT 0 COMMENT '文章的收藏数',
   be_visit_home_count       INT(11) NOT NULL DEFAULT 0 COMMENT '文章的浏览数',
   be_visit_article_count     INT(11) NOT NULL DEFAULT 0 COMMENT '文章的浏览数',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: user_focus(用户的关注)                                  */
/*==============================================================*/
CREATE TABLE user_focus
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '记录的uuid',
   owner_user_id        INT(11) NOT NULL COMMENT '发起关注的用户id',
   target_user_id       INT(11) NOT NULL COMMENT '被关注的用户id',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: survey(调查问卷)                                  */
/*==============================================================*/
CREATE TABLE survey
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '问卷的uuid',
   user_id              INT(11) NOT NULL COMMENT '发起问卷的用户id',
   content              TEXT NOT NULL COMMENT '问卷的内容,json字符串',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: survey_result(问卷的结果)                               */
/*==============================================================*/
CREATE TABLE survey_result
(
   id                   BIGINT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '结果的uuid',
   survey               INT(11) NOT NULL COMMENT '问卷的id',
   user_id              INT(11) NOT NULL COMMENT '做问卷的用户id',
   result               TEXT NOT NULL COMMENT '问卷的结果,json字符串',
   use_time             INT(11) NOT NULL COMMENT '用时',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;
