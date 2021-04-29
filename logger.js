var winston = require('winston'),
  WinstonCloudWatch = require('./index');
path = require("path");
var pkgjson = path.join(process.cwd(), './package.json'),
  pjson = require(pkgjson);
var os = require("os");
const { format } = require('logform');
const { timestamp } = format;


// when you don't provide a name the default one
// is CloudWatch
winston.add(new WinstonCloudWatch({
  logGroupName: 'cloudwatch',
  logStreamName: 'cloud_watch_stream',
  awsRegion: 'eu-west-1'
}));

function cloudWatchLevel(format) {
  const levels = {
    'error': 0,
    'warn': 1,
    'info': 2,
    'http': 3,
    'verbose': 4,
    'debug': 5,
    'silly': 6
  };

  return levels[format];
}

exports.getFormattedLog = function (logevt, format) {
  var log = JSON.stringify({
    Version: pjson.version,
    PackageName: pjson.name,
    MachineName: os.hostname(),
    Timestamp: new Date().toISOString(),
    Message: logevt,
    Level: format
  });
  if (cloudWatchLevel(format) == 0) {
    winston.error(log);
  } else if (cloudWatchLevel(format) == 1) {
    winston.warn(log);
  } else if (cloudWatchLevel(format) == 2) {
    winston.info(log);
  }else if (cloudWatchLevel(format) == 3) {
    winston.http(log);
  }else if (cloudWatchLevel(format) == 4) {
    winston.verbose(log);
  }else if (cloudWatchLevel(format) == 5) {
    winston.debug(log);
  }else if (cloudWatchLevel(format) == 6) {
    winston.silly(log);
  }
}