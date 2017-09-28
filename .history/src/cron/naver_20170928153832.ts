var CronJob = require('cron').CronJob;
new CronJob('* */12 * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
