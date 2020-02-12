var extract = require('./extract');
var fs = require('fs');

module.exports = function (dir) {

    function Router(dir) {

        this.dir = dir;

        Router.prototype.serve = function (url, fnError, fnSuccess) {
            var filePath = extract(url, this.dir);
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    fnError(err);
                } else {
                    fnSuccess(data);
                }
            });
        };
    }

    return new Router(dir);
};
