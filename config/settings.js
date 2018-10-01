
var settings  =  {};

//server
settings.STEEM_RPC = 'https://api.steemit.com';
settings.PORT = 80;

//site globals - required for server functions and emailing - YOU MUST CHANGE THESE VALUES TO THAT OF YOUR PROJECT
settings.PROJECT_NAME = 'The Curators';
settings.PROJECT_HOMEPAGE = 'http://localhost';
settings.PROJECT_INFO = 'https://pqy.one/curator';
settings.PROJECT_ADDRESS = 'Accra, Ghana';
settings.PROJECT_EMAIL = 'ebli5dbe7pnm7ans@ethereal.email';
settings.PROJECT_COMMUNITY = 'Curator';
settings.PROJECT_OWNER = 'Peer Query';
settings.PROJECT_BLOG = 'makafuigdzivenu';
settings.BOT_ACCOUNT = 'makafuigdzivenu';

//default settings stored in DB - careful, will not override existing settings incase of update
settings.COMMUNITY_RATE = 3;
settings.TEAM_RATE = 5;
settings.PROJECT_RATE = 10;
settings.CURATOR_RATE = 0.1;
settings.COMMON_COMMENT = 'Nice work. Consider delegating Steem Power to support our work!';
settings.BOT_HOLIDAY = 'sunday';
settings.HOLIDAY_DAYS = 1;
settings.DAILY_CURATION = 100;
settings.VOTE_INTERVAL_MINUTES = 5;

module.exports  =  settings;

