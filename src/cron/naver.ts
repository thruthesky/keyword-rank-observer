const spawn = require('child_process').spawn;
var CronJob = require('cron').CronJob;
new CronJob('00 */5 * * * *', function () {
  console.log('Cron runs every 5 minutes.');
  const desktop = spawn('node', ['dist/task/naver.kin.desktop.js']);
  const mobile = spawn('node', ['dist/task/naver.kin.mobile.js']);

  desktop.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  desktop.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
  mobile.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  mobile.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
}, null, true, 'Asia/Seoul');
