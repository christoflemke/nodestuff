var fs = require('fs'),
util = require('util');

var logger = {
    fileOut : function(filename) {
	var options = {
	    flags : 'w',
	    encoding : 'utf8',
	};
	var out = fs.createWriteStream(filename);
	return function(m) {
	    out.write(util.inspect(m));
	    out.write('\n');
	}
    },
    consoleOut : function(m) {
	console.log(m);
    },
    createLogger : function(out) {
	return {
	    error : function(m) {
		out(m);
	    },
	    warn : function(m) {
		out(m);
	    },
	    info : function(m) {
		out(m);
	    },
	    debug : function(m) {
		out(m);
	    }
	}
    },
    createConsoleLogger : function() {
	return this.createLogger(this.consoleOut);
    },
    createFileLogger : function(filename) {
	var fout = this.fileOut(filename);
	return this.createLogger(fout);
    },
    createDefaultLogger : function(filename) {
	var log = this.createFileLogger(filename);
	var cout = this.consoleOut;
	var fout = log.debug;
	var doublelog = function(m) {
	    cout(m);
	    fout(m);
	};
	log.warn = doublelog;
	log.error = doublelog;
	return log;
    }
}
module.exports = logger;