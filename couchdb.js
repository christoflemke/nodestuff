var request = require('request')
_ = require('underscore');
var couchdb = function(options){
    var log = options.log || {
	error : console.log,
	warn : console.log,
	info : function() {},
	debug : function() {}
    };
    var handleResponse = function(callback,errorhandler) {
	return function(e,r,b) {
	    log.info(b);
	    if(!e && b && (r.headers['content-type'] === 'application/json')) {
		//console.log(r);
		try {
		    b = JSON.parse(b);
		} catch(e) {
		    log.debug('unable to parse');
		}
	    }
	    if(e) {
		if(errorhandler) {
		    errorhandler(b);
		}
		else {
		    log.error(r);
		}
	    }
	    else
	    {
		if(b && b.error) {
		    log.error(r);
		    if(errorhandler) {
			errorhandler(b);
		    }
		}
		else if(callback) {
		    callback(b);
		}
	    }
	};
    };
    var stringify = function(parent,childName) {
	if(childName) {
	    var child = parent[childName];
	    if(_.isFunction(child)) {
		parent[childName] = child.toString();
	    }
	    else {
		if(typeof child === 'object') {
		    _.each(_.keys(child),function(key) {
			stringify(child,key);
		    });
		}
	    }
	    
	}
	else
	{
	    if(parent) {
		_.each(_.keys(parent),function(key) {
		    stringify(parent,key);
		});
		return parent;
	    }
	}
	
    };
    var makeOptions = function(target,method,body) {
	var auth = "Basic " + new Buffer(options.user + ":" + options.pass).toString("base64");
	var op = {
	    url : options.uri + target,
	    method : method,
	    json : stringify(body),
	    headers : {
		'Accept' : 'application/json',
		'Authorization' : auth
	    },
	    
	};
	//console.log(op);
	return op;
    };
    return {
	get : function(uri,callback,errorhandler) {
	    log.info('get: ' + uri);
	    request(
		makeOptions(uri,'GET',''),
		handleResponse(callback,errorhandler));
	},
	put : function(uri,body,callback,errorhandler) {
	    log.info('put: ' + uri);
	    request(
		makeOptions(uri,'PUT',body),
		handleResponse(callback,errorhandler));
	},
	post : function(uri,body,callback,errorhandler) {
	    log.info('post: ' + uri);
	    request(
		makeOptions(uri,'POST',body),
		handleResponse(callback,errorhandler));
	},
	del : function(uri,callback,errorhandler) {
	    log.info('delete: ' + uri);
	    request(
		makeOptions(uri,'DELETE'),
		handleResponse(callback,errorhandler));
	},
	forcedelete : function(uri,callback) {
	    log.info('forcedelete: ' + uri);
	    var that = this;
	    this.get(uri,function(b) {
		that.del(uri+'?rev='+b._rev,callback);
	    },callback);
	},
	update : function(uri,body,callback,errorhandler) {
	    log.info('update: ' + uri);
	    var that = this;
	    this.get(uri,function(b) {
		body._rev = b._rev;
		body._id = b._id;
		//console.log(b);
		that.put(uri,body,callback,errorhandler);
	    },errorhandler);
	}
    }
};
module.exports = couchdb;