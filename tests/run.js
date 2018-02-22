var shell = require('shelljs');
var exec = shell.exec;

var child = exec('npm run serve-sample-apps', {async:true});

exec('npm run protractor-tests', function(code) {
    child.kill('SIGTERM');
    process.exit(code);
});