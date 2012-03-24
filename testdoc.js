var couchdb = require('./couchdb.js'),
logging = require('./logger.js'),
querystring = require('querystring');

var log = logging.createDefaultLogger('log.log');

var couchoptions = {
    uri : 'http://10.0.0.101:5984/',
    log : log,
    user : "dbtest",
    pass : "Cicseocbel8"
};
var couch = couchdb(couchoptions);

couch.update('test/_design/show',{
    id : '_design/show',
    views : {
	foo : {
	    map : function(doc) {
		emit(doc.name,doc.sizeWhenDone);
	    }
	}
    }
},function(doc) {
  console.log('received response');
    log.info(doc);
});