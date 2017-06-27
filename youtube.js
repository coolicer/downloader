const fetchVideoInfo = require('youtube-info');
const querystring = require('querystring');
const cmd=require('node-cmd');

function Youtube(url) {
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
      cmdDown(_url, filename);
    });
}

function cmdDown(url, filename) {
  cmd.get(
        `
            cd /home/download
            youtube-dl -f 18 ${url}
        `,
        function(err, data, stderr){
            if (!err) {
               console.log('the node-cmd cloned dir contains these files :\n\n',data)
            } else {
               console.log('error', err)
            }
 
        }
    );
}
// Youtube('https://wwww.youtube.com/watch?v=m_lnmN6F34w');
module.exports = Youtube;