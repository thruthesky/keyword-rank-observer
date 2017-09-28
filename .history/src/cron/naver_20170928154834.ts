const spawn = require('child_process').spawn;
var CronJob = require('cron').CronJob;
new CronJob('00 * * * * *', function() {
  console.log('Cron runs every 5 minutes.');
  spawn('node', ['dist/task/naver.kin.desktop.js', '--keyword=유치원영어']);
  spawn('node', ['dist/task/naver.kin.desktop.js', '--keyword=유치원영어']);
  spawn('node', ['dist/task/naver.kin.desktop.js', '--keyword=유치원영어']);
  spawn('node', ['dist/task/naver.kin.desktop.js', '--keyword=유치원영어']);
  
}, null, true, 'Asia/Seoul');
