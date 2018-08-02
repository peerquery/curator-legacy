
-- Get post for curation

DROP procedure IF EXISTS `curate`;

CREATE PROCEDURE `curate`()
BEGIN
    
	DECLARE id INT;
        
	SELECT `posts_view`.`id` INTO id FROM `posts_view` WHERE `posts_view`.`state` = 0 ORDER BY `posts_view`.`timestamp` DESC LIMIT 1;
	
	UPDATE `posts` SET `posts`.`state` = 1 WHERE `posts`.`id` = id;
    
	SELECT * FROM `posts_view` WHERE `posts_view`.`id` = id;
	
END;

-- Get post for voting

DROP procedure IF EXISTS `upvote`;

CREATE PROCEDURE `upvote`()
BEGIN
    
	SELECT * FROM `posts_view` WHERE `posts_view`.`rate` > 0 AND `posts_view`.`voted` = 'false' ORDER BY `posts_view`.`timestamp` DESC LIMIT 1;
	
END;

-- Approve a posts

DROP procedure IF EXISTS `approve`;

CREATE PROCEDURE `approve`(
	IN author VARCHAR(45),
	IN title VARCHAR(512),
	IN url VARCHAR(512),
	IN curator VARCHAR(45),
	IN remarks VARCHAR(512),
	IN state INT,
	IN rate INT,
	IN action VARCHAR(45)
)
BEGIN
    
	DECLARE activity_id INT DEFAULT 0;
		
	UPDATE `posts` SET `posts`.`curator` = curator, `posts`.`remarks` = remarks, `posts`.`state` = state, `posts`.`rate` = rate, `posts`.`curate_time` = NOW() WHERE `posts`.`url` = url;
	
	UPDATE `team` SET `team`.`curations` = `team`.`curations` + 1 WHERE `team`.`account` = curator;
	
	INSERT IGNORE INTO `activity` (`author`, `type`, `link`, `comments`) VALUES (curator, action, url, title);
	
	IF action = 'approve' THEN
  
		INSERT IGNORE `users` (`account`, `score`, `posts`, `approved`) values ( author, rate, 1, 1)
			ON DUPLICATE KEY
				UPDATE `score` = `score` + rate, `posts` = `posts` + 1, `approved` = `approved` + 1;
	
		ELSE IF action = 're-approve' THEN
		
				SELECT `id` INTO activity_id FROM `activity` WHERE `activity`.`link` = url;
		
			IF activity_id > 0 THEN 
		
					UPDATE `users` SET `score` = VALUES(`score`) + rate , `rejected` = VALUES(`rejected`) - 1, `approved` = VALUES(`approved`) + 1 WHERE `account` = author;
		
				ELSE IF activity_id = 0 THEN
		
					INSERT IGNORE `users` (`account`, `score`, `posts`, `approved`) values ( author, rate, 1, 1)
						ON DUPLICATE KEY
							UPDATE `score` = `score` + rate, `posts` = `posts` + 1, `approved` = `approved` + 1;
						
				END IF;
			
			END IF;
		
		END IF;
	
	END IF;

END;


-- Reject a posts


DROP procedure IF EXISTS `reject`;

CREATE PROCEDURE `reject`(
	IN author VARCHAR(45),
	IN title VARCHAR(512),
	IN url VARCHAR(512),
	IN curator VARCHAR(45),
	IN remarks VARCHAR(512),
	IN state INT,
	IN action VARCHAR(45)
)
BEGIN
    
	DECLARE added_points INT DEFAULT 0;
		
	UPDATE `posts` SET `posts`.`curator` = curator, `posts`.`remarks` = remarks, `posts`.`state` = state, `posts`.`curate_time` = NOW() WHERE `posts`.`url` = url;
	
	UPDATE `team` SET `team`.`curations` = `team`.`curations` + 1 WHERE `team`.`account` = curator;
	
	INSERT `activity` (`author`, `type`, `link`, `comments`) VALUES (curator, action, url, title);
	
	IF action = 'reject' THEN
  
		INSERT IGNORE `users` (`account`, `posts`, `rejected`) values ( author, 1, 1)
			ON DUPLICATE KEY
				UPDATE `posts` = `posts` + 1, `rejected` = `rejected` + 1;
	
		ELSE IF action = 're-reject' THEN
		
				SELECT `value` INTO added_points FROM `activity` WHERE `activity`.`link` = url;
		
			IF added_points > 0 THEN 
		
					UPDATE `users` SET `score` = `score` - added_points , `rejected` = `rejected` + 1, `approved` = `approved` - 1 WHERE `account` = author;
		
				ELSE IF added_points = 0 THEN
		
					INSERT IGNORE `users` (`account`, `posts`, `rejected`) values ( author, 1, 1)
						ON DUPLICATE KEY
							UPDATE `posts` = `posts` + 1, `rejected` = `rejected` + 1;
					
				END IF;
			
			END IF;
		
		END IF;
	
	END IF;
	
END;


-- new team

DROP procedure IF EXISTS `new_team`;

CREATE PROCEDURE `new_team`(
	IN account VARCHAR(45),
	IN author VARCHAR(45),
	IN email VARCHAR(512),
	IN role VARCHAR(45),
	IN tag VARCHAR(45),
	IN message VARCHAR(512),
	IN authority INT(11),
	IN token_hash VARCHAR(512)
)
BEGIN
        
	INSERT INTO `team` (`account`, `email`, `role`, `tag`, `status`, `message`, `authority`, `invitor`, `token_hash`)
		VALUES(account, email, role, tag, "pending", message, authority, author, token_hash)
			ON DUPLICATE KEY UPDATE `email` = VALUES(email), `role` = VALUES(role), `tag` = 'pending', `message` = VALUES(message), `authority` = VALUES(authority), `invitor` = VALUES(invitor), `token_hash` = VALUES(token_hash);
	
	INSERT INTO `blacklist` (`account`, `type`, `reason`, `admitter`)
		VALUES(account, 'opt_out', 'is_team_member', author)
			ON DUPLICATE KEY UPDATE `type` = 'opt_out', `reason` = 'is_team_member', `admitter` = VALUES(admitter);
	
	INSERT INTO `activity` (`author`, `type`, `link`, `comments`)
		VALUES (author, 'add_team', CONCAT('/@', account), CONCAT('New user @', account, ' added to team as ', role, '!') );
	
END;



-- remove team

DROP procedure IF EXISTS `remove_team`;

CREATE PROCEDURE `remove_team`(
	IN account VARCHAR(45),
	IN author VARCHAR(45)
)
BEGIN
       
	UPDATE `team` SET `team`.`status` = 'inactive' WHERE `team`.`account` = account;
	
	DELETE FROM `blacklist` WHERE `account` = account;
	
	INSERT `activity` (`author`, `type`, `link`, `comments`) VALUES (author, 'remove_team', CONCAT('/@', account), CONCAT('Former team user @', account, ' removed!'));
	
END;


-- get team admins

DROP procedure IF EXISTS `team_admins`;

CREATE PROCEDURE `team_admins`()
BEGIN
        
	SELECT * FROM `team_view` WHERE `team_view`.`role` = 'admin' AND `team_view`.`status` = 'active';
	
END;


-- get team mods

DROP procedure IF EXISTS `team_mods`;

CREATE PROCEDURE `team_mods`()
BEGIN
        
	SELECT * FROM `team_view` WHERE `team_view`.`role` = 'moderator' AND `team_view`.`status` = 'active';
	
END;


-- get team curators

DROP procedure IF EXISTS `team_curies`;

CREATE PROCEDURE `team_curies`()
BEGIN
        
	SELECT * FROM `team_view` WHERE `team_view`.`role` = 'curator' AND `team_view`.`status` = 'active';
	
END;


-- get pending team

DROP procedure IF EXISTS `team_pending`;

CREATE PROCEDURE `team_pending`()
BEGIN
        
	SELECT * FROM `team_view` WHERE `team_view`.`status` = 'pending';
	
END;


-- get inactive team

DROP procedure IF EXISTS `team_inactive`;

CREATE PROCEDURE `team_inactive`()
BEGIN
        
	SELECT * FROM `team_view` WHERE `team_view`.`status` = 'inactive';
	
END;


-- get team

DROP procedure IF EXISTS `get_team`;

CREATE PROCEDURE `get_team`(
	IN username_or_email VARCHAR(512)
)
BEGIN
    
	SELECT * FROM `team_view` WHERE `team_view`.`account` = username_or_email OR `team_view`.`email` = username_or_email;
	
END;



-- set password_hash

DROP procedure IF EXISTS `set_password_hash`;

CREATE PROCEDURE `set_password_hash`(
	IN account_or_email VARCHAR(45),
	IN password_hash VARCHAR(512)
)
BEGIN
    
	UPDATE `team` SET `team`.`password_hash` = password_hash WHERE `team`.`account`  = account_or_email OR `team`.`email`  = account_or_email;
	
END;


-- reset password_hash

DROP procedure IF EXISTS `reset_password_hash`;

CREATE PROCEDURE `reset_password_hash`(
	IN email VARCHAR(125),
	IN reset_token VARCHAR(512)
)
BEGIN
    
	UPDATE `team` SET `team`.`token_hash` = reset_token, `team`.`reset_time` = NOW() WHERE `team`.`email` = email;
	SELECT `account` FROM `team_view` WHERE `team_view`.`email` = email;
	
END;


-- get token_hash

DROP procedure IF EXISTS `token_hash`;

CREATE PROCEDURE `token_hash`(
	IN username VARCHAR(45)
)
BEGIN
    
	SELECT `token_hash` FROM `team` WHERE `team`.`account` = username;
	
END;





-- activate team

DROP procedure IF EXISTS `activate_team`;

CREATE PROCEDURE `activate_team`(
	IN username VARCHAR(45)
)
BEGIN
    
	UPDATE `team` SET `team`.`status` = 'active', `team`.`token_hash` = '' WHERE `team`.`account` = username;
	
END;


-- get team password_hash

DROP procedure IF EXISTS `password_hash`;

CREATE PROCEDURE `password_hash`(
	IN email_or_account VARCHAR(512)
)
BEGIN
    
	SELECT `password_hash` FROM `team`
		WHERE (`team`.`email` = email_or_account OR `team`.`account` = email_or_account ) AND `team`.`status` != 'inactive';
	
END;


-- delete team token_hash

DROP procedure IF EXISTS `delete_token_hash`;

CREATE PROCEDURE `delete_token_hash`(
	IN username VARCHAR(45)
)
BEGIN
    
	UPDATE `team` SET `team`.`token_hash` = '' WHERE `team`.`account` = username;
	
END;


-- get a team member's account

DROP procedure IF EXISTS `account`;

CREATE PROCEDURE `account`(
	IN account VARCHAR(45)
)
BEGIN
    
	SELECT * FROM `team_view` WHERE `team_view`.`account` = account;
	
END;



-- get a team member's wallet

DROP procedure IF EXISTS `wallet`;

CREATE PROCEDURE `wallet`(
	IN account VARCHAR(45)
)
BEGIN
    
	SELECT COUNT(`id`) AS total_payments FROM `bot_activity_view` 
		WHERE `bot_activity_view`.`account` = account AND YEARWEEK(`bot_activity_view`.`time`) = YEARWEEK(CURDATE());
		
	SELECT COUNT(`id`) AS total_curations FROM `posts_view` 
		WHERE `posts_view`.`curator` = account AND `posts_view`.`state` > 1 AND YEARWEEK(`posts_view`.`timestamp`) = YEARWEEK(CURDATE());
		
	SELECT SUM(`vote_amount`) AS total_earnings FROM `bot_activity_view` 
		WHERE `bot_activity_view`.`account` = account AND YEARWEEK(`bot_activity_view`.`time`) = YEARWEEK(CURDATE());
		
	SELECT * FROM `bot_activity_view`
		WHERE `bot_activity_view`.`account` = account AND YEARWEEK(`bot_activity_view`.`time`) = YEARWEEK(CURDATE())
			ORDER BY `bot_activity_view`.`time` DESC;
	
END;


-- Get approved posts

DROP procedure IF EXISTS `approved`;

CREATE PROCEDURE `approved`()
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` > 1 AND `posts_view`.`voted` = 'false' ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get voted posts

DROP procedure IF EXISTS `voted`;

CREATE PROCEDURE `voted`()
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`voted` = "true" ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get ignored posts

DROP procedure IF EXISTS `ignored`;

CREATE PROCEDURE `ignored`()
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = 1 AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get lost posts

DROP procedure IF EXISTS `lost`;

CREATE PROCEDURE `lost`()
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = 0 AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get rejected posts

DROP procedure IF EXISTS `rejected`;

CREATE PROCEDURE `rejected`()
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = -1 ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;



-- Get approved user posts

DROP procedure IF EXISTS `approved_user`;

CREATE PROCEDURE `approved_user`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` > 1 AND `posts_view`.`voted` = 'false' AND `posts_view`.`author` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get voted user posts

DROP procedure IF EXISTS `voted_user`;

CREATE PROCEDURE `voted_user`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`voted` = "true" AND `posts_view`.`author` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get ignored user posts

DROP procedure IF EXISTS `ignored_user`;

CREATE PROCEDURE `ignored_user`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = 1 AND `posts_view`.`author` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get lost user posts

DROP procedure IF EXISTS `lost_user`;

CREATE PROCEDURE `lost_user`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = 0 AND `posts_view`.`author` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get rejected user posts

DROP procedure IF EXISTS `rejected_user`;

CREATE PROCEDURE `rejected_user`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = -1 AND `posts_view`.`author` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;



-- Get approved curator posts

DROP procedure IF EXISTS `approved_curator`;

CREATE PROCEDURE `approved_curator`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` > 1 AND `posts_view`.`voted` = 'false' AND `posts_view`.`curator` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get voted curator posts

DROP procedure IF EXISTS `voted_curator`;

CREATE PROCEDURE `voted_curator`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`voted` = "true" AND `posts_view`.`curator` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;


-- Get ignored curator posts

DROP procedure IF EXISTS `ignored_curator`;

CREATE PROCEDURE `ignored_curator`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = 1 AND `posts_view`.`curator` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;



-- Get rejected curator posts

DROP procedure IF EXISTS `rejected_curator`;

CREATE PROCEDURE `rejected_curator`(
	IN account varchar(45)
)
BEGIN
        
	SELECT * FROM `posts_view` WHERE `posts_view`.`state` = -1 AND `posts_view`.`curator` = account ORDER BY `posts_view`.`timestamp` DESC LIMIT 20;
	
END;





-- Get all activity

DROP procedure IF EXISTS `all_activity`;

CREATE PROCEDURE `all_activity`()
BEGIN
        
	SELECT * FROM `activity_view` ORDER BY `activity_view`.`time` DESC LIMIT 20;
	
END;


-- Get curation activity

DROP procedure IF EXISTS `curation_activity`;

CREATE PROCEDURE `curation_activity`()
BEGIN
        
	SELECT * FROM `activity_view` WHERE `activity_view`.`type` = 'approve' OR `activity_view`.`type` = 'reject' ORDER BY `activity_view`.`time` DESC LIMIT 20;
	
END;


-- Get re_curation activity

DROP procedure IF EXISTS `re_curation_activity`;

CREATE PROCEDURE `re_curation_activity`()
BEGIN
        
	SELECT * FROM `activity_view` WHERE `activity_view`.`type` = 're-approve' OR `activity_view`.`type` = 're-reject' ORDER BY `activity_view`.`time` DESC LIMIT 20;
	
END;



-- Get finance activity

DROP procedure IF EXISTS `finance_activity`;

CREATE PROCEDURE `finance_activity`()
BEGIN
        
	SELECT * FROM `activity_view` WHERE `activity_view`.`type` = 'add_sponsor' OR `activity_view`.`type` = 'remove_sponsor' ORDER BY `activity_view`.`time` DESC LIMIT 20;
	
END;



-- Get team activity

DROP procedure IF EXISTS `team_activity`;

CREATE PROCEDURE `team_activity`()
BEGIN
        
	SELECT * FROM `activity_view` WHERE `activity_view`.`type` = 'add_team' OR `activity_view`.`type` = 'remove_team' ORDER BY `activity_view`.`time` DESC LIMIT 20;
	
END;



-- Get discussions activity

DROP procedure IF EXISTS `discussions_activity`;

CREATE PROCEDURE `discussions_activity`()
BEGIN
        
	SELECT * FROM `activity_view` WHERE `activity_view`.`type` = 'discussions' ORDER BY `activity_view`.`time` DESC LIMIT 20;
	
END;




-- Get new users

DROP procedure IF EXISTS `new_users`;

CREATE PROCEDURE `new_users`(
	IN lmt INT(11)
)
BEGIN
        
	SELECT * FROM `users_view` ORDER BY `users_view`.`created` DESC LIMIT 20 OFFSET lmt;
	
END;



-- Get top users


DROP procedure IF EXISTS `top_users`;

CREATE PROCEDURE `top_users`(
	IN lmt INT(11)
)
BEGIN
        
	SELECT * FROM `users_view` ORDER BY `users_view`.`score` DESC LIMIT 20 OFFSET lmt;
	
END;




-- Get new curators


DROP procedure IF EXISTS `new_curators`;

CREATE PROCEDURE `new_curators`(
	IN lmt INT(11)
)
BEGIN
    
	SELECT `account`, `created`, `curations`, `points`
		FROM `team_view` WHERE `team_view`.`role` = 'curator' AND `team_view`.`status` = 'active' ORDER BY `team_view`.`created` ASC LIMIT 20 OFFSET lmt;
	
END;



-- Get top curators


DROP procedure IF EXISTS `top_curators`;

CREATE PROCEDURE `top_curators`(
	IN lmt INT(11)
)
BEGIN
    
	SELECT `account`, `created`, `curations`, `points`
		FROM `team_view` WHERE `team_view`.`role` = 'curator' AND `team_view`.`status` = 'active' ORDER BY `team_view`.`curations` DESC LIMIT 20 OFFSET lmt;
	
END;



-- Get top curators


DROP procedure IF EXISTS `inactive_curators`;

CREATE PROCEDURE `inactive_curators`(
	IN lmt INT(11)
)
BEGIN
    
	SELECT `account`, `created`, `curations`, `points`
		FROM `team_view` WHERE `team_view`.`role` = 'curator' AND `team_view`.`status` = 'inactive' ORDER BY `team_view`.`curations` DESC LIMIT 20 OFFSET lmt;
	
END;



-- Get community stats


DROP procedure IF EXISTS `community_stats`;

CREATE PROCEDURE `community_stats`()
BEGIN
        
	SELECT COUNT(`id`) AS user_count FROM `users_view`;
	SELECT COUNT(`id`) AS blacklist_count FROM `blacklist_view` WHERE NOT `blacklist_view`.`type` = 'opt_out';
	SELECT COUNT(`id`) AS curator_count FROM `team_view` WHERE `team_view`.`role` = 'curator';
	SELECT COUNT(`id`) AS sponsors_count FROM `sponsors_view` WHERE `sponsors_view`.`status` = 'active';
	
END;


-- Get curation stats


DROP procedure IF EXISTS `curation_stats`;

CREATE PROCEDURE `curation_stats`()
BEGIN
        
	SELECT COUNT(`id`) AS approved_count FROM `posts_view` WHERE `posts_view`.`state` > 1 AND `posts_view`.`voted` = 'false' AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS voted_count FROM `posts_view` WHERE `posts_view`.`voted` = 'true' AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS lost_count FROM `posts_view` WHERE `posts_view`.`state` = 0 AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS rejected_count FROM `posts_view` WHERE `posts_view`.`state` = -1 AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	
END;


-- Get user rep


DROP procedure IF EXISTS `user_rep`;

CREATE PROCEDURE `user_rep`(
	IN author VARCHAR(45)
)
BEGIN
    
	SELECT `score` FROM `users_view` WHERE `users_view`.`account` = author;
	
END;



-- Get curator rep

DROP procedure IF EXISTS `curator_rep`;

CREATE PROCEDURE `curator_rep`(
	IN curator VARCHAR(45)
)
BEGIN
    
	SELECT `points` FROM `team_view` WHERE `team_view`.`account` = curator;
	
END;



-- Get user stats


DROP procedure IF EXISTS `user_stats`;

CREATE PROCEDURE `user_stats`(
	IN author VARCHAR(45)
)
BEGIN
    
	SELECT COUNT(`id`) AS approved_count FROM `posts_view`
		WHERE `posts_view`.`state` > 1 AND `posts_view`.`author` = author AND `posts_view`.`voted` = 'false' AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS voted_count FROM `posts_view` 
		WHERE `posts_view`.`voted` = 'true' AND `posts_view`.`author` = author AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS lost_count FROM `posts_view` 
		WHERE `posts_view`.`state` = 0 AND `posts_view`.`author` = author AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS rejected_count FROM `posts_view` 
		WHERE `posts_view`.`state` = -1 AND `posts_view`.`author` = author AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	
END;


-- Get curator stats


DROP procedure IF EXISTS `curator_stats`;

CREATE PROCEDURE `curator_stats`(
	IN curator VARCHAR(45)
)
BEGIN
    
	SELECT COUNT(`id`) AS approved_count FROM `posts_view`
		WHERE `posts_view`.`state` > 1 AND `posts_view`.`curator` = curator AND `posts_view`.`voted` = 'false' AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS voted_count FROM `posts_view` 
		WHERE `posts_view`.`voted` = 'true' AND `posts_view`.`curator` = curator AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS lost_count FROM `posts_view` 
		WHERE `posts_view`.`state` = 0 AND `posts_view`.`curator` = curator AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	SELECT COUNT(`id`) AS rejected_count FROM `posts_view` 
		WHERE `posts_view`.`state` = -1 AND `posts_view`.`curator` = curator AND DATE(`posts_view`.`timestamp`) > DATE_SUB(NOW(), INTERVAL 1 MONTH);
	
END;



-- add to blacklist


DROP procedure IF EXISTS `add_to_blacklist`;

CREATE PROCEDURE `add_to_blacklist`(
	IN account VARCHAR(45),
	IN author VARCHAR(45),
	IN type VARCHAR(45),
	IN reason VARCHAR(512)
)
BEGIN
	
	INSERT `blacklist` (`account`, `admitter`, `type`, `reason`) VALUES(account, author, type, reason)
	ON DUPLICATE KEY UPDATE `type` = VALUES(type), `admitter` = VALUES(admitter), `reason` = VALUES(reason);
	
	INSERT `activity` (`author`, `type`, `link`, `comments`) VALUES (author, 'add_to_blacklist', CONCAT('/@', account), CONCAT('Added @', account, ' to blacklist!'));
	
END;



-- remove from blacklist


DROP procedure IF EXISTS `remove_from_blacklist`;

CREATE PROCEDURE `remove_from_blacklist`(
	IN account VARCHAR(45),
	IN author VARCHAR(45)
)
BEGIN
	
	DELETE FROM `blacklist` WHERE `account` = account;
	
	INSERT `activity` (`author`, `type`, `link`, `comments`) VALUES (author, 'remove_from_blacklist', CONCAT('/@', account), CONCAT('Removed @', account, ' from blacklist!'));
	
END;




-- Get blacklist_reported

DROP procedure IF EXISTS `blacklist_reported`;

CREATE PROCEDURE `blacklist_reported`()
BEGIN
	
	SELECT * FROM `blacklist_view` WHERE `blacklist_view`.`type` = 'reported' ORDER BY `blacklist_view`.`date` DESC;
	
END;





-- Get blacklist_probation

DROP procedure IF EXISTS `blacklist_probation`;

CREATE PROCEDURE `blacklist_probation`()
BEGIN
		
	SELECT * FROM `blacklist_view` WHERE `blacklist_view`.`type` = 'probation' ORDER BY `blacklist_view`.`date` DESC;
	
END;





-- Get blacklist_banned

DROP procedure IF EXISTS `blacklist_banned`;

CREATE PROCEDURE `blacklist_banned`()
BEGIN
		
	SELECT * FROM `blacklist_view` WHERE `blacklist_view`.`type` = 'banned' ORDER BY `blacklist_view`.`date` DESC;
	
END;





-- Get blacklist_opt_out

DROP procedure IF EXISTS `blacklist_opt_out`;

CREATE PROCEDURE `blacklist_opt_out`()
BEGIN
		
	SELECT * FROM `blacklist_view` WHERE `blacklist_view`.`type` = 'opt_out' ORDER BY `blacklist_view`.`date` DESC;
	
END;




-- Get blacklist

DROP procedure IF EXISTS `get_blacklist`;

CREATE PROCEDURE `get_blacklist`(
	IN lmt INT(11)
)
BEGIN
		
	SELECT * FROM `blacklist_view` WHERE `blacklist_view`.`type` != 'opt_out' ORDER BY `blacklist_view`.`date` DESC LIMIT 20 OFFSET lmt;
	
END;



-- add sponsors

DROP procedure IF EXISTS `add_sponsor`;

CREATE PROCEDURE `add_sponsor`(
	IN account VARCHAR(45),
	IN author VARCHAR(45),
	IN delegation INT(11),
	IN link VARCHAR(512),
	IN banner VARCHAR(512),
	IN message VARCHAR(512)
)
BEGIN
	
	INSERT INTO `sponsors` (`account`, `delegation`, `message`, `link`, `banner`, `status`) VALUES(account, delegation, message, link, banner, 'active')
		ON DUPLICATE KEY UPDATE `delegation` = VALUES(delegation), `message` = VALUES(message), `link` = VALUES(link), `banner` = VALUES(banner), `status` = 'active';
	
	INSERT `activity` (`author`, `type`, `link`, `comments`) VALUES (author, 'add_sponsor', CONCAT('/@', account), CONCAT('Add new sponsor @', account, '!'));
	
END;


-- remove sponsor


DROP procedure IF EXISTS `remove_sponsor`;

CREATE PROCEDURE `remove_sponsor`(
	IN account VARCHAR(45),
	IN author VARCHAR(45)
)
BEGIN
	
	UPDATE `sponsors` SET `sponsors`.`status` = 'inactive' WHERE `sponsors`.`account` = account;
	
	INSERT `activity` (`author`, `type`, `link`, `comments`) VALUES (author, 'remove_sponsor', CONCAT('/@', account), CONCAT('Former sponsor @', account, ' removed!'));
	
END;


-- get active sponsors


DROP procedure IF EXISTS `get_active_sponsors`;

CREATE PROCEDURE `get_active_sponsors`()
BEGIN
	
	SELECT * FROM `sponsors_view` WHERE `sponsors_view`.`status` = 'active' ORDER BY `sponsors_view`.`delegation` DESC;
	
END;



-- get inactive sponsors


DROP procedure IF EXISTS `get_inactive_sponsors`;

CREATE PROCEDURE `get_inactive_sponsors`()
BEGIN
	
	SELECT * FROM `sponsors_view` WHERE `sponsors_view`.`status` = 'inactive' ORDER BY `sponsors_view`.`delegation` DESC;
	
END;




-- bot activity

DROP procedure IF EXISTS `bot_activity`;

CREATE PROCEDURE `bot_activity`(
	IN account VARCHAR(45),
	IN url VARCHAR(512),
	IN note VARCHAR(45),
	IN vote_amount DECIMAL(4,2),
	IN permlink VARCHAR(512),
	IN type VARCHAR(45)
)
BEGIN
        
	BEGIN
		INSERT IGNORE `bot_activity` (`account`, `url`, `note`, `vote_amount`, `type`)
			VALUES(account, url, note, vote_amount, type);
	END;
		
	BEGIN
		IF type = "curation" THEN
		
			UPDATE `posts` SET `posts`.`voted` = 'true', `posts`.`vote_amount` = vote_amount WHERE `posts`.`permlink` = permlink;
		
		END IF;
	END;
	
END;




-- Get curators of the day

DROP procedure IF EXISTS `curators_activity`;

CREATE PROCEDURE `curators_activity`()
BEGIN
    
	SELECT `author` AS curator, COUNT(DISTINCT `author`) AS total_curation FROM `activity_view`
		WHERE (`activity_view`.`type` = 'approve' OR `activity_view`.`type` = 'reject' OR `activity_view`.`type` = 're-approve' OR `activity_view`.`type` = 're-reject')
		AND DATE(`activity_view`.`time`) = CURDATE()
		GROUP BY `activity_view`.`author`;
	
END;




-- Get team without curators

DROP procedure IF EXISTS `team_no_curator`;

CREATE PROCEDURE `team_no_curator`()
BEGIN
    
	SELECT `account` FROM `team_view` WHERE (`team_view`.`role` = 'admin' OR `team_view`.`role` = 'moderator') AND `team_view`.`status` = 'active';
	
END;





-- Get dashboard data

DROP procedure IF EXISTS `get_dashboard`;

CREATE PROCEDURE `get_dashboard`()
BEGIN
    
	SELECT `bot_account`, `community_rate`, `team_rate`, `project_rate`, `daily_curation` FROM `settings_view`;
	SELECT COUNT(`id`) AS total_posts FROM `posts_view` WHERE DATE(`timestamp`) = CURDATE();
	SELECT COUNT(`id`) AS voted_posts FROM `posts_view` WHERE `posts_view`.`voted` = 'true' AND DATE(`timestamp`) = CURDATE();
	SELECT COUNT(*) AS total_team FROM `team_view`;
	SELECT 0 AS total_sponsors;
	SELECT COUNT(DISTINCT `author`) AS total_members FROM `posts_view`;
	
END;





-- Get bot data

DROP procedure IF EXISTS `get_bot`;

CREATE PROCEDURE `get_bot`()
BEGIN
    
	SELECT `bot_account`, `community_rate`, `team_rate`, `project_rate`, `daily_curation` FROM `settings_view`;
	SELECT COUNT(`id`) AS total_posts FROM `posts_view` WHERE DATE(`timestamp`) = CURDATE();
	SELECT COUNT(`id`) AS voted_posts FROM `posts_view` WHERE `posts_view`.`voted` = 'true' AND DATE(`timestamp`) = CURDATE();
	
END;





-- Get vote settings

DROP procedure IF EXISTS `vote_settings`;

CREATE PROCEDURE `vote_settings`()
BEGIN
    
	SELECT
		`bot_account`,
		`community_rate`,
		`team_rate`,
		`project_rate`,
		`curator_rate`,
		`common_comment`,
		`bot_holiday`,
		`holiday_days`,
		`vote_interval_minutes`
	FROM
		`settings_view`;
	
END;







-- Get settings data

DROP procedure IF EXISTS `get_settings`;

CREATE PROCEDURE `get_settings`()
BEGIN
    
	SELECT
		`community_rate`,
		`team_rate`,
		`project_rate`,
		`curator_rate`,
		`common_comment`,
		`bot_holiday`,
		`holiday_days`,
		`daily_curation`,
		`vote_interval_minutes`
	FROM
		`settings_view`;
	
END;




-- Sponsors page

DROP procedure IF EXISTS `sponsorship`;

CREATE PROCEDURE `sponsorship`()
BEGIN
    
	SELECT `account`, `link`, `banner`, `message` FROM `sponsors_view` WHERE `sponsors_view`.`status` = 'active' ORDER BY `sponsors_view`.`delegation` DESC;
	SELECT COUNT(*) AS curations FROM `posts_view`;
	SELECT COUNT(DISTINCT `author`) AS authors FROM `posts_view`;
	SELECT `bot_account` FROM `settings_view`;
	SELECT SUM(`vote_amount`) AS worth FROM `posts_view`;
	
END;





-- Get content

DROP procedure IF EXISTS `get_content`;

CREATE PROCEDURE `get_content`(
	IN url VARCHAR(512)
)
BEGIN
    
	DECLARE account VARCHAR(45);
	
	SELECT * FROM `posts_view` WHERE `posts_view`.`url` = url;
	    
	SELECT `author` INTO account FROM `posts_view` WHERE `posts_view`.`url` = url;
		
	SELECT `score`, `posts`, `approved`, `rejected` FROM `users_view` WHERE `users_view`.`account` = account;
	
END;





-- add discussion


DROP procedure IF EXISTS `add_discussion`;

CREATE PROCEDURE `add_discussion`(
	IN author VARCHAR(45),
	IN receiver VARCHAR(45),
	IN body TEXT,
	IN type VARCHAR(45)
)
BEGIN
	
	INSERT IGNORE `discussions` (`author`, `receiver`, `body`, `type`) VALUES (author, receiver, body, type);
	
END;


-- get public discussions


DROP procedure IF EXISTS `public_discussions`;

CREATE PROCEDURE `public_discussions`()
BEGIN
	
	SELECT * FROM `discussions_view` ORDER BY `discussions_view`.`created` ASC LIMIT 30;
	
END;


-- get private discussions


DROP procedure IF EXISTS `personal_discussions`;

CREATE PROCEDURE `personal_discussions`(
	IN receiver VARCHAR(45)
)
BEGIN
	
	SELECT * FROM `discussions_view` WHERE `discussions_view`.`type` = 'personal' AND `discussions_view`.`receiver` = receiver ORDER BY `discussions_view`.`created` ASC LIMIT 30;
	
END;




-- add online


DROP procedure IF EXISTS `add_online`;

CREATE PROCEDURE `add_online`(
	IN socket_id VARCHAR(70),
	IN user_name VARCHAR(45)
)
BEGIN
	
	INSERT IGNORE `online` (`socket_id`, `user_name`, `state`) VALUES (socket_id, user_name, 'active')
	ON DUPLICATE KEY UPDATE `socket_id` = VALUES(`socket_id`), `time` = NOW(), `state` = 'active' ;
	
END;





-- remove online


DROP procedure IF EXISTS `remove_online`;

CREATE PROCEDURE `remove_online`(
	IN socket_id VARCHAR(70)
)
BEGIN
	
	SELECT `user_name` FROM `online` WHERE `online`.`socket_id` = socket_id;
	UPDATE `online` SET `online`.`state` = 'offline' WHERE `online`.`socket_id` = socket_id;
	
END;



-- get socket_id


DROP procedure IF EXISTS `get_socket_id_from_name`;

CREATE PROCEDURE `get_socket_id_from_name`(
	IN name VARCHAR(45)
)
BEGIN
	
	SELECT `socket_id` FROM `online_view` WHERE `online_view`.`user_name` = name;
	
END;


-- get online


DROP procedure IF EXISTS `get_online`;

CREATE PROCEDURE `get_online`()
BEGIN
	
	SELECT * FROM `online_view` WHERE `online_view`.`state` = 'active';
	
END;

