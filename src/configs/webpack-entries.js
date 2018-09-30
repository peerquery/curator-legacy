const fs = require('fs'),
    path = require('path'),
    root = fs.realpathSync(process.cwd()),
    resolveApp = relativePath => path.resolve(root, relativePath),
    resolveRuntime = relativePath =>
        path.resolve(fs.realpathSync(process.cwd()), relativePath);
        
var entry = {};

entry = {
    styles: resolveApp('./src/client/ui/styles.js'),
    scripts: resolveApp('./src/client/ui/scripts.js'),
};

module.exports = entry;
