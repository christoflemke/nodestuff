var logging = require('./logger.js');

var clog = logging.createConsoleLogger();
var flog = logging.createFileLogger('./log.log');
var dlog = logging.createDefaultLogger('./default.log');
var testlog = function(logger) {
    logger.error('error');
    logger.warn('warn');
    logger.info('info');
    logger.debug('debug');
};

testlog(clog);
testlog(flog);
testlog(dlog);