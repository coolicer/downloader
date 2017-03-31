var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var parser = bodyParser.urlencoded({extended: false});
var Aria2 = require('./aria2');
var config = require('./config');
var aria2 = new Aria2();

var index = fs.readFileSync('./index.html');
var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

var _http = http.createServer( function(req, res) {
    
    var verb = req.method.toLocaleLowerCase();
    if (verb == 'get') {

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.write(index);
        res.end();

    } else if( verb == 'post') {
       
        parser(req,res, function(err){
            if(err) return;
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
            aria2.download(url, email);
            res.writeHead(302, {'Location': config.redirect_url});
            res.end();
        })
    }
});


_http.listen(3001 , function() {
    console.log('server start at: http://127.0.0.1:3001');
});
