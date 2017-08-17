var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var parser = bodyParser.urlencoded({extended: false});
var exec = require('child_process').exec;
var cmd = require('node-cmd');
var Aria2 = require('./aria2');
var config = require('./config');
var aria2 = new Aria2();
var youtube = require('./youtube');
var index = fs.readFileSync('./index.html');
var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

const checkAriaIsRunning = () => {
    exec('ps aux | grep aria* | grep -v grep | wc -l', function(err, output){
        if(err) throw err;
        if(output == 0) {
            return false;
        }
        return true;
    });
};

const startAriaServer = () => {
    if (checkAriaIsRuning()) return;
    cmd.get(
        `
            cd /root
            aria2c --conf-path=./aria2c.conf  -D
        `,
        function (err, data, stderr) {
            console.log('Aria2c start.');
        }
    );
};

var _http = http.createServer( function(req, res) {
    
    var method = req.method.toLocaleLowerCase();
    if (method == 'get') {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.write(index);
        res.end();

    } else if( method == 'post') {
        parser(req, res, function(err){
            if(err) return;
            res.setHeader('Content-Type', 'text/html;charset=utf8');
            var url = req.body.url;
            var email = req.body.email;
            if(email == '') {
                return res.end('邮件都没下载个毛啊');
            }
            if(!emailPattern.test(email)) {
                return res.end('邮件地址都错了下载个毛啊');
            }
            if(url == '') {
                return res.end('链接都没下载个毛啊');
            }
            if(!urlPattern.test(url)) {
                return res.end('链接都错了下载个毛啊');
            }
            if ( /(youtu.be)|(youtube.com)/.test(url)) {
                youtube(url, email);
            } else {
                aria2.download(url, email);
            }
            
            res.writeHead(302, {'Location': config.redirect_url});
            res.end();
        })
    }
});


_http.listen(3001 , function() {
    console.log('server start.');
    startAriaServer();
});
