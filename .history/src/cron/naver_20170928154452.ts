const spawn = require('child_process').spawn;
var CronJob = require('cron').CronJob;
new CronJob('00 */5 * * * *', function() {
  console.log('Cron runs every 5 minutes.');
  const phone = spawn('node', ['dist/task/naver.kin.desktop.js', '--keyword=유치원영어']);
  phone.stdout.on('data', data => {
      console.log(data);
  });
  phone.stderr.on('data', data => {
    console.log(data);
 });
  phone.on('close', data => {});
}, null, true, 'Asia/Seoul');
