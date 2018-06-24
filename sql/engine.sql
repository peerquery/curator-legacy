

-- New post sp


DROP procedure IF EXISTS `new_post`;
CREATE PROCEDURE `new_post`(
	IN author VARCHAR(45),
    IN permlink VARCHAR(512),
    IN category VARCHAR(45),
    IN title VARCHAR(512),
    IN body TEXT,
    IN url VARCHAR(512),
    IN timestamp TIMESTAMP
)
BEGIN
	DECLARE id INT DEFAULT 0;
	
	SELECT `blacklist_view`.`id` INTO id FROM `blacklist_view` WHERE `blacklist_view`.`account` = author LIMIT 1;
	
	IF id = 0 THEN
		INSERT INTO `posts` (`author`, `permlink`, `category`, `title`, `body`, `url`, `timestamp`)
			VALUES (author, permlink, category, title, body, url, timestamp)
		ON DUPLICATE KEY UPDATE 
			`author`= VALUES(`author`),
			`permlink`= VALUES(`permlink`),
			`category`= VALUES(`category`),
			`title`= VALUES(`title`),
			`body`= VALUES(`body`),
			`url`= VALUES(`url`),
			`timestamp`= VALUES(`timestamp`);
	END IF;
	
END;