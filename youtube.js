const fetchVideoInfo = require('youtube-info');
const querystring = require('querystring');
const https = require('https');
const config = require('./config');
const util = require('./util');
const cmd = require('node-cmd');

function Youtube(url, email) {
    if (/youtu.be/.test(url)) {
        url = url.split('be/');
        let id = url[1];
        dealWithUrl(id, email);
    } else {
        url = url.split('?')[1];
        url = querystring.parse(url);
        let id = url.v;
        dealWithUrl(id, email);
    }
}

function dealWithUrl(videoId, email) {
    fetchVideoInfo(videoId)
        .then((videoInfo) => {
            cmdDown(videoInfo.title, email, videoId);
        });
}

function makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeHtml(filename, url) {
    let eStr = ['<div>'];
    eStr.push('您要的' + filename);
    eStr.push('<br />');
    eStr.push('<a href="' + url + '">' + url + '</a>');
    eStr.push('</div>');
    return eStr.join('');
}

function cmdDown(filename, email, id) {
    const url = `https://www.youtube.com/watch?v=${id}`;
    const randomname = makeid();
    cmd.get(
        `
            cd /home/download
            youtube-dl -f 18 ${url} -o ${randomname}.mp4
        `,
        function (err, data, stderr) {
            let url = config.baseUrl + randomname + '.mp4';
            const html = makeHtml(filename, url);
            util.sendMail({
                "to": email,
                "subject": "主人，视频已经帮你下载好了。",
                "html": html
            });
        }
    );
}
module.exports = Youtube;
