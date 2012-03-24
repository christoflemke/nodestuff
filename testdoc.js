var couchdb = require('./couchdb.js'),
logging = require('./logger.js'),
querystring = require('querystring');

var log = logging.createDefaultLogger('log.log');

var couchoptions = {
    uri : 'http://localhost:5984/',
    log : log
};
var couch = couchdb(couchoptions);

couch.post('test/_temp_viwe/',{
    language : 'javascript',
    views : {
	show : {
	    map : "function(doc) {emit(doc.name,doc)}"
	}
    }
},function(doc) {
    log.info(doc);
});