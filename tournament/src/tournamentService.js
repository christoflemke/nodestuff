// node library
var urlparser = require('url')
var fs = require('fs');

// modules
var _ = require('underscore');
var express = require('express');

// source
var tournament = require('./tournament.js');

var createService = function() {
    var server = express()
    var tournamentIdCounter = 0;

    server.post('/createRoundRobin',function(req, res) {
	var wrapper = {
	    path : '/tournament/'+tournamentIdCounter++,
	    tournament : tournament.createRoundRobin()
	}

	var writeMe = function(req,res) {
	    res.send({
		path : wrapper.path,
		players : wrapper.tournament.players()
	    });
	}

	var addPlayer = function(req,res) {
	    
	};
	server.post(wrapper.path+'/addPlayer',addPlayer);
	server.post(wrapper.path,writeMe);
	writeMe(req,res);
    });

    server.get('/favicon.ico',function(req, res) {
	var input = fs.createReadStream('res/favicon.ico');
	res.writeHead(200);
	input.pipe(res);
    });

    server.close = function() {
	console.log('service closed');
    };
    console.log('server created');
    return server;
};

exports.createService = createService;