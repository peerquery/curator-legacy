

-- Create posts table SQL


CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `category` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `permlink` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `timestamp` datetime NOT NULL,
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `url` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `remarks` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `curator` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `rate` int(11) NOT NULL DEFAULT '0',
  `curate_time` datetime NOT NULL,
  `voted` varchar(10) NOT NULL DEFAULT 'false',
  `vote_amount` DECIMAL(4,2) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_UNIQUE` (`url`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create posts_view tables SQL


CREATE OR REPLACE VIEW `posts_view` AS SELECT * FROM `posts`;


-- Create activity table SQL


CREATE TABLE IF NOT EXISTS `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `link` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `value` int(11) NOT NULL DEFAULT '0',
  `comments` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create activity_view tables SQL


CREATE OR REPLACE VIEW `activity_view` AS SELECT * FROM `activity`;




-- Create users table SQL


CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `score` int(11) NOT NULL DEFAULT '0',
  `posts` int(11) NOT NULL DEFAULT '0',
  `approved` int(11) NOT NULL DEFAULT '0',
  `rejected` int(11) NOT NULL DEFAULT '0',
  `comments` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_UNIQUE` (`account`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create users_view table SQL


CREATE OR REPLACE VIEW `users_view` AS SELECT * FROM `users`;


-- Create team table SQL


CREATE TABLE IF NOT EXISTS `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `invitor` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `role` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `tag` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `message` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `authority` int(11) NOT NULL,
  `curations` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `token_hash` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `reset_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `account_UNIQUE` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



-- Create OWNER account immediately


	INSERT IGNORE INTO `team` (`account`, `email`, `password_hash`, `role`, `tag`, `status`, `message`, `authority`)
		VALUES("OWNER_ACCOUNT", "OWNER_EMAIL", "OWNER_PASS", "owner", "super-admin", "active", "create_owner", "4");


-- Create team_view: [ SELECT * FROM `team_view` ] will include the `password_hash` column! - SO USE THIS INSTEAD:


CREATE OR REPLACE VIEW `team_view` AS

	SELECT 
        `team`.`id` AS `id`,
        `team`.`account` AS `account`,
        `team`.`email` AS `email`,
        `team`.`role` AS `role`,
        `team`.`created` AS `created`,
        `team`.`invitor` AS `invitor`,
        `team`.`status` AS `status`,
        `team`.`tag` AS `tag`,
        `team`.`message` AS `message`,
        `team`.`authority` AS `authority`,
        `team`.`curations` AS `curations`,
        `team`.`points` AS `points`,
        `team`.`reset_time` AS `reset_time`
    FROM
        `team`;


		
		
-- Create sponsors table SQL


CREATE TABLE IF NOT EXISTS `sponsors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delegation` int(11) NOT NULL DEFAULT '0',
  `link` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `banner` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `message` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_UNIQUE` (`account`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create sponsors_view table SQL
	
	
CREATE OR REPLACE VIEW `sponsors_view` AS SELECT * FROM `sponsors`;
	
	
		

-- Create settings table SQL


CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(45) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'settings',
  `bot_holiday` varchar(45) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'sunday',
  `holiday_days` int(11) NOT NULL DEFAULT '1',
  `community_rate` int(11) NOT NULL,
  `curator_rate` decimal(6,2) NOT NULL,
  `team_rate` int(11) NOT NULL,
  `last_update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `project_rate` int(11) NOT NULL,
  `common_comment` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `daily_curation` int(11) NOT NULL,
  `vote_interval_minutes` int(11) NOT NULL DEFAULT '5',
  `bot_account` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_0_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_0_days` int(11) NOT NULL,
  `repuation_0_score` int(11) NOT NULL,
  `repuation_0_pass` int(11) NOT NULL,
  `reputation_1_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_1_days` int(11) NOT NULL,
  `repuation_1_score` int(11) NOT NULL,
  `repuation_1_pass` int(11) NOT NULL,
  `reputation_2_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_2_days` int(11) NOT NULL,
  `repuation_2_score` int(11) NOT NULL,
  `repuation_2_pass` int(11) NOT NULL,
  `reputation_3_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_3_days` int(11) NOT NULL,
  `repuation_3_score` int(11) NOT NULL,
  `repuation_3_pass` int(11) NOT NULL,
  `reputation_4_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_4_days` int(11) NOT NULL,
  `repuation_4_score` int(11) NOT NULL,
  `repuation_4_pass` int(11) NOT NULL,
  `reputation_5_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_5_days` int(11) NOT NULL,
  `repuation_5_score` int(11) NOT NULL,
  `repuation_5_pass` int(11) NOT NULL,
  `reputation_6_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reputation_6_days` int(11) NOT NULL,
  `repuation_6_score` int(11) NOT NULL,
  `repuation_6_pass` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `identifier_UNIQUE` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create settings_view table SQL


CREATE OR REPLACE VIEW `settings_view` AS SELECT * FROM `settings`;


-- Create blacklist table SQL


CREATE TABLE IF NOT EXISTS `blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `admitter` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `reason` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_UNIQUE` (`account`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create blacklist_view table SQL


CREATE OR REPLACE VIEW `blacklist_view` AS SELECT * FROM `blacklist`;



-- Create bot table SQL


CREATE TABLE IF NOT EXISTS `bot_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `url` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `note` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `vote_amount` DECIMAL(4,2) NOT NULL,
  `type` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create bot_view table SQL


CREATE OR REPLACE VIEW `bot_activity_view` AS SELECT * FROM `bot_activity`;





-- Create discussions table SQL


CREATE TABLE IF NOT EXISTS `discussions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `receiver` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `body` TEXT COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create discussions_view table SQL


CREATE OR REPLACE VIEW `discussions_view` AS SELECT * FROM `discussions`;





-- Create online table SQL


CREATE TABLE IF NOT EXISTS `online` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `socket_id` varchar(70) COLLATE utf8_unicode_ci NOT NULL,
  `user_name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `state` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Create online_view table SQL


CREATE OR REPLACE VIEW `online_view` AS SELECT * FROM `online`;






