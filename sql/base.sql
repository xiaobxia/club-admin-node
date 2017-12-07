DROP TABLE IF EXISTS sys_log_audit;

DROP TABLE IF EXISTS sys_user;

DROP TABLE IF EXISTS sys_email_verify;

DROP TABLE IF EXISTS broadcast;

DROP TABLE IF EXISTS system_message;

/*==============================================================*/
/* Table: sys_log_audit                                         */
/*==============================================================*/
CREATE TABLE sys_log_audit
(
   id                   INT(11) NOT NULL AUTO_INCREMENT,
   log_type             VARCHAR(10) NOT NULL,
   user_uuid            CHAR(32) NOT NULL COMMENT '用户的uuid',
   user_name            VARCHAR(60) NOT NULL COMMENT '登陆账户名',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: sys_user                                              */
/*==============================================================*/
CREATE TABLE sys_user
(
   id                   INT(11) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '用户的uuid',
   user_name            VARCHAR(60) NOT NULL COMMENT '登陆账户名',
   password             VARCHAR(60) NOT NULL COMMENT '登陆账户密码',
   mobile               VARCHAR(20) NOT NULL DEFAULT '',
   email                VARCHAR(50) NOT NULL DEFAULT '',
   active               CHAR(1) NOT NULL DEFAULT 'N' COMMENT '是否已激活账户，Y已激活，N未激活',
   active_date          DATETIME COMMENT '激活的日期',
   state                CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'A-在用，X-失效',
   state_date           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '状态变更的日期',
   is_locked            CHAR(1) NOT NULL DEFAULT 'N' COMMENT '是否锁定，''Y''-锁定，''N''-没有锁定，null表示''N''',
   force_login          CHAR(1) NOT NULL DEFAULT 'N' COMMENT 'Y允许强制登录，N不允许。默认N',
   login_fail           INT(1) NOT NULL DEFAULT 0 COMMENT '登录失败次数，空表示0',
   unlock_date          DATETIME,
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARSET=UTF8;

/*==============================================================*/
/* Table: sys_email_verify                                     */
/*==============================================================*/
CREATE TABLE sys_email_verify
(
   id                   BIGINT(9) NOT NULL AUTO_INCREMENT,
   user_name            VARCHAR(60) NOT NULL COMMENT '用户设置的用户名',
   email                VARCHAR(50) NOT NULL COMMENT '用户设置的邮箱地址',
   password             VARCHAR(60) NOT NULL COMMENT '用户设置的密码',
   verify_code          CHAR(32) NOT NULL COMMENT '用户的验证码',
   verify_status        INT(1) NOT NULL COMMENT '验证状态，1：邮件已发送，2：邮件验证成功，2：邮件验证失败',
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
   id                   BIGINT(9) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '广播的uuid',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   start_date          DATETIME COMMENT '广播上线时间',
   end_date             DATETIME COMMENT '广播下线时间',
   state                CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'U-未启用, A-在用，X-失效',
   platform             CHAR(10) NOT NULL DEFAULT 'web' COMMENT '广播上线平台',
   title                VARCHAR(150) NOT NULL DEFAULT '' COMMENT '广播的标题',
   url                  VARCHAR(255) NOT NULL DEFAULT '' COMMENT '广播的地址',
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: system_message(系统消息)                               */
/*==============================================================*/
CREATE TABLE system_message
(
   id                   BIGINT(9) NOT NULL AUTO_INCREMENT,
   uuid                 CHAR(32) NOT NULL COMMENT '系统消息的uuid',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   start_date           DATETIME COMMENT '系统消息发送时间',
   state                CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'U-未启用, A-在用，X-失效',
   title                VARCHAR(150) NOT NULL DEFAULT '' COMMENT '系统消息的标题',
   url                  VARCHAR(255) NOT NULL DEFAULT '' COMMENT '系统消息的地址',
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;
