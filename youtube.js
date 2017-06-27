const fetchVideoInfo = require('youtube-info');
const querystring = require('querystring');
const config = require('./config');
const util = require('./util');
const cmd=require('node-cmd');

function Youtube(url, email) {
  let videoId;
  let _url = url;
  url = url.split('?')[1];
  url = querystring.parse(url);
  videoId = url.v;
  videoId && fetchVideoInfo(videoId)
    .then((videoInfo) => {
      return videoInfo.title;
    })
    .then((filename) => {
      cmdDown(_url, filename, email);
    });
}

function cmdDown(url, filename, email) {
  cmd.get(
        `
            cd /home/download
            youtube-dl -f 18 ${url}
        `,
        function(err, data, stderr){
          let url = config.baseUrl + filename + '.mp4';
          console.log(url);
          util.sendMail({
              "to": email,
              "subject": "主人，视频已经帮你下载好了。",
              "html": '<div style="font-size:20px;">您要的' + filename + ', 去' + '<a href=" '+ url +'">下载</a></div>'
          });
        }
    );
}
// Youtube('https://wwww.youtube.com/watch?v=m_lnmN6F34w');
module.exports = Youtube;