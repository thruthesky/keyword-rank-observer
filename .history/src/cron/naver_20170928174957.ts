const spawn = require('child_process').spawn;
var CronJob = require('cron').CronJob;
new CronJob('00 */5 * * * *', function() {
   console.log('Cron runs every 5 minutes.');
  spawn('node', ['dist/task/naver.kin.desktop.js', '--keyword=화상영어']);
  spawn('node', ['dist/task/naver.kin.desktop.js', '--keyword=어린이영어']);
  spawn('node', ['dist/task/naver.kin.mobile.js', '--keyword=화상영어']);
  spawn('node', ['dist/task/naver.kin.mobile.js', '--keyword=어린이영어']);
}, null, true, 'Asia/Seoul');
