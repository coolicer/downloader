var Aria2 = require('aria2');
var path = require('path');
var MJson = require('./mjson');
var util = require('./util');
var M = new MJson('./db.json');
var config = require('./config');
var aria2 = {};

var noop = function() {};

function Down() {
    this.init();
}

Down.prototype.init = function() {
    aria2 = new Aria2({
        host: 'localhost',
        port: 6800,
        secure: false,
        secret: '',
        path: '/jsonrpc'
    });
}

Down.prototype.download = function(url, email) {
    var urlParser = path.parse(url);
    var filename = urlParser.base;
    var downloadUrl = config.baseUrl; + filename;
    aria2.open(function() {
        aria2.send('addUri', [url] ,function(err, res) {
            if(M.get(filename) === filename) {
                _send(email, filename, downloadUrl);
                return;
            }
            M.set(email, res, filename);
        });
    });
    _onDownloadStart();
    _onDownloadComplete();
}

function _send(email, filename, downloadUrl) {
    filename = decodeURIComponent(filename);
    util.sendMail({
        "to": email,
        "subject": "主人，已经帮你下载好了。",
        "html": '<div style="font-size:20px;">您要的' + filename + ', 去' + '<a href=" '+ downloadUrl +'">下载</a></div>'
    });
}

function _onDownloadStart() {
    aria2.onDownloadStart = function(res) {
        console.log('Start');
        aria2.onDownloadStart = noop;
    }
}

function _onDownloadComplete(){
    aria2.onDownloadComplete = function(res) {
        console.log('Download Complete.')
        var gid = res.gid;
        var item = M.get(gid);
        var filename = item.filename;
        var email = item.email;
        var downloadUrl = config.baseUrl + filename;
        _send(email, filename, downloadUrl);
        // M.del(gid);
        aria2.onDownloadComplete = noop;
    };
}

module.exports = Down;
