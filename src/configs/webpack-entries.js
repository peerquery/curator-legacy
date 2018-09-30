const fs = require('fs'),
    path = require('path'),
    root = fs.realpathSync(process.cwd()),
    resolveApp = relativePath => path.resolve(root, relativePath),
    resolveRuntime = relativePath =>
        path.resolve(fs.realpathSync(process.cwd()), relativePath);
        
var entry = {};

entry = {
    //auth
    invite: resolveApp('./src/client/pages/auth/invite.js'),
    login: resolveApp('./src/client/pages/auth/login.js'),
    password_reset: resolveApp('./src/client/pages/auth/password_reset.js'),
    reset: resolveApp('./src/client/pages/auth/reset.js'),
    set: resolveApp('./src/client/pages/auth/set.js'),
    
    //community
    community: resolveApp('./src/client/pages/community/community.js'),
    user: resolveApp('./src/client/pages/community/user.js'),
    
    //curators
    curator: resolveApp('./src/client/pages/curators/curator.js'),
    curators: resolveApp('./src/client/pages/curators/curators.js'),
    
    //office
    account: resolveApp('./src/client/pages/office/account.js'),
    activity: resolveApp('./src/client/pages/office/activity.js'),
    blacklist: resolveApp('./src/client/pages/office/blacklist.js'),
    curation: resolveApp('./src/client/pages/office/curation.js'),
    dashboard: resolveApp('./src/client/pages/office/dashboard.js'),
    discussions: resolveApp('./src/client/pages/office/discussions.js'),
    settings: resolveApp('./src/client/pages/office/settings.js'),
    sponsors: resolveApp('./src/client/pages/office/sponsors.js'),
    team: resolveApp('./src/client/pages/office/team.js'),
    wallet: resolveApp('./src/client/pages/office/wallet.js'),
    
    //partials
    //footer: resolveApp('./src/client/partials/footer.js'),
    navbar: resolveApp('./src/client/partials/navbar.js'),
    notifications: resolveApp('./src/client/partials/notifications.js'),
    sidebar: resolveApp('./src/client/partials/sidebar.js'),
    
    //static
    bot: resolveApp('./src/client/pages/static/bot.js'),
    //faqs: resolveApp('./src/client/pages/static/faqs.js'),
    index: resolveApp('./src/client/pages/static/index.js'),
    sponsor_list: resolveApp('./src/client/pages/static/sponsor_list.js'),
    
    //trail
    trail: resolveApp('./src/client/pages/trail/trail.js'),
    viewer: resolveApp('./src/client/pages/trail/viewer.js'),
    
    //ui
    styles: resolveApp('./src/client/ui/styles.js'),
    scripts: resolveApp('./src/client/ui/scripts.js'),
};

module.exports = entry;
