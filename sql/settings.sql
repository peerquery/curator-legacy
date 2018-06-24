

-- Insert settings from config file into DB


	INSERT IGNORE INTO
		`settings`(
			`community_rate`,
			`team_rate`,
			`project_rate`,
			`curator_rate`,
			`common_comment`,
			`bot_holiday`,
			`holiday_days`,
			`daily_curation`,
			`bot_account`
			)
		VALUES (
			'COMMUNITY_RATE',
			'TEAM_RATE',
			'PROJECT_RATE',
			'CURATOR_RATE',
			'COMMON_COMMENT',
			'BOT_HOLIDAY',
			'HOLIDAY_DAYS',
			'DAILY_CURATION',
			'BOT_ACCOUNT'
			);
		