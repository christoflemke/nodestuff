function transmission(initoptions,callback) {
    var request = require('request');
    // prototype function
    if(typeof Object.create !== 'function') {
	Object.create = function(o) {
	    var F = function() {};
	    F.prototype = o;
	    return new F();
	};
    }

    // log
    var log = function(m) {
	console.log(m);
    },
    dbg = function(m) {
	if(initoptions.debug) {
	    log(m);
	}
    },
    error = function(m,o) {
	log("Error," + m);
	if(o) {
	    log(o);
	}
    };
    var auth = "Basic " + new Buffer(initoptions.username + ":" + initoptions.password).toString("base64");
    var options = {
	url : initoptions.url,
	headers : {
	    "Authorization" : auth
	}
    };
    var initcallback = function(e,r,b) {
	dbg(r);
	if(e) {
	    error(r);
	    return;
	}
	else if(r.statusCode >= 300 && r.statusCode !== 409) {
	    error('status: ',r.statusCode);
	    return;
	}
	// add session id to std options
	options.headers["x-transmission-session-id"] = r.headers["x-transmission-session-id"];
	var rpc = function(json,callback) {
	    var myOptions = Object.create(options);
	    myOptions.json = json
	    request.post(myOptions,function(e,r,b) {
		dbg(r);
		if(e) {
		    error(r);
		}
		else if(r.statusCode >= 300) {
		    error('status: ',r.statusCode);
		}
		else {
		    if(b.result === 'success') {
			callback(b['arguments']);
		    }
		    else {
			error('service returned: ',b.result);
		    }
		}
	    })
	};
	callback(rpc);
    };
    request.get(Object.create(options),initcallback);
};
module.exports = transmission;