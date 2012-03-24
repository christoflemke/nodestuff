var _ = require('underscore'),
couchdb = require('./couchdb.js');
var logging = require('./logger.js');

var log = logging.createDefaultLogger('log.log');

var couchoptions = {
    uri : 'http://10.0.0.101:5984/',
    logger : log
};

var listTorrents = function(response) {
    var sorted = _.sortBy(response.torrents,function(t) {
	return t.uploadRatio;
    });
    _.each(sorted,log,debug);
};

var initialized = function(rpc) {

    var couch = couchdb(couchoptions);

    var torrentEventFields = {
	hashString : "hashString",
	name : "name",
	status : "status",
	sizeWhenDone : "sizeWhenDone"
    };
    var getTorrentRequest = function() {
	var request = {
	    method : 'torrent-get',
	    'arguments' : {fields : []}
	};
	_.each(torrentEventFields,function(f) {
	    request['arguments'].fields.push(f);
	});
	return request;
    };
    var updateDocument = function(torrent) {
	var create = function() {
	    log.info('create');
	    couch.put('test/'+torrent.hashString,torrent,log.debug);
	};
	var update = function(b) {
	    var exsiting = JSON.parse(b);
	    torrent._rev = exsiting._rev;
	    torrent._id = exsiting._id;
	    var isEquals = _.all(torrentEventFields,function(p) {
		return exsiting[p] === torrent[p];
	    });
	    if(!isEquals) {
		log.info('update');
		couch.put('test/'+torrent.hashString,torrent,debug);
	    }
	};
	couch.get('test/'+torrent.hashString,update,create);
    };
    var initDb = function() {
	couch.put('test/',{},function() {
	    log.info('db ready');
	    couch.get('test',log.info);
	    var poll = function() {
		rpc(getTorrentRequest(),function(torrents) {
		    _.each(torrents.torrents,updateDocument);
		});
		log.debug('poll');
	    };
	    poll();
	});
    };
    initDb();
};

var transmission = require('./transmission.js');
var options = {
    username : "user",
    password : "pass",
    url : "http://10.0.0.195:9091/transmission/rpc/",
    debug : false
};
console.log("init transmission");
transmission(options,initialized);
