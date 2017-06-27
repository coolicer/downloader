var youtubedl = require('youtube-dl');
var video;
var filename;

function Youtube(url) {
  video = youtubedl(url,
  ['--format=18'],
  { cwd: '/home/download' });

  video.on('info', function(info) {
    filename = info.filename;
    video.pipe(fs.createWriteStream(filename));
  });
}

module.exports = Youtube;