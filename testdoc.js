var couchdb = require('./couchdb.js'),
logging = require('./logger.js'),
querystring = require('querystring');

var log = logging.createDefaultLogger('log.log');

var couchoptions = {
    uri : 'http://localhost:5984/',
    log : log
};
var couch = couchdb(couchoptions);
couch.forcedelete('test/_design/showtorret',function() {
    couch.put('test/_design/showtorret',{
	language : 'javascript',
	views : {
	    show : {
		map : "function(doc) {emit(doc.name,doc)}"
	    }
	}
    },function(){
	couch.get("test/_design/showtorret/_view/show?" + querystring.stringify({key : 'Weezer',include_docs : true}),function(b) {
//	couch.get("test/_design/showtorret/_view/show",function(b) {
	    log.debug("rp");
	    console.log(b);
	});
    });
});