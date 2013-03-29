var _ = require('underscore');
var roundRobin = require('./roundRobin.js');

var tournament = function() {
    var players = [];
    var results = [];
    var currentRound = 0;

    return {
	start : function() {
	    if(players.length < 2) {
		throw new Error('can not start tournament with less than 2 players');
	    }
	    if(players.length%2 == 1) {
		players.push('Bye');
	    }
	    currentRound = 1;
	},
	addPlayer : function (name) {
	    players.push(name);
	},
	players : function() {
	    return players;
	},
	getCurrentRound : function() {
	    return currentRound;
	},
	nextRound : function() {
	    currentRound = currentRound+1;
	},
	addResult : function(playera,playerb, pointsa, pointsb) {
	    results.push({ 
		playera : playera,
		pointsa : pointsa,
		playerb : playerb,
		pointsb : pointsb,
		round : currentRound 
	    });
	},
	results : function() {
	    return results;
	},
	ranking : function() {
	    var playerPoints = _.map(players,function(player) {
		var playerPoints = _.map(results,function(r) {
		    if(r.playera === player) {
			return r.pointsa;
		    }
		    if(r.playerb === player) {
			return r.pointsb;
		    }
		    return 0;
		});
		return {
		    player : player,
		    points : _.reduce(playerPoints,function(a,b) {return a + b;},0)
		};
	    });
	    return _.sortBy(playerPoints,function(r) {
		return r.points * -1;
	    });
	},
	gamesPlayed : function() {
	    return results;
	}
    };
}

exports.createSingleElimination = function() {
    var game = tournament();

    var nextPowerOfTwo = function(num) {
	var targetNum = 2;
	while( targetNum < num) {
	    targetNum = targetNum * 2;
	}
	return targetNum;
    };

    game.start = function() {
	var numPlayers = game.players().length;
	var targetNum = nextPowerOfTwo(numPlayers);
	if(numPlayers !== targetNum) {
	    console.log('number of players should be a power of two');
	}
    };

    game.nextRound = function() {
	var currentPairings = game.parings();
	for(var pairing in currentPairings) {
	    console.log(pairing);
	    var a = pairing.a;
	    var b = pairing.b;
	    var resultForPairing = _.findWhere(game.results,{
		playera : a,
		playerb : b
	    })
	    if(_.isUndefined(resultForPairing)) {
		throw new Error('missing results for pairing ' + a + ' vs ' + b);
	    }
	}
    }

    game.parings = function() {
	var targetNum = nextPowerOfTwo(game.players().length);
	
	var result = [];
	for(var i  = 0; i < targetNum/2; i++) {
	    var j = targetNum -1 - i;
	    var a = game.players()[i];
	    if(_.isUndefined(a)) {
		a = 'Bye';
	    }
	    var b = game.players()[j];
	    if(_.isUndefined(b)) {
		b = 'Bye';
	    }
	    result.push({
		a : a,
		b : b
	    });
	}
	return result;

	return _.map(evenPlayers,function(p) {
	    return 
	});
    };
    return game;
}

exports.createRoundRobin = function() {
    var game = tournament();
    game.pairings = function(round) {
	if(_.isUndefined(round)) {
	    round = game.getCurrentRound();
	}
	console.log("round: " + round);

	var players = game.players();
	var matrix = roundRobin.matrix(players.length);
	var pairings = roundRobin.pairings(matrix,round);

	return _.map(pairings,function(p) {
	    return {
		a : players[p.a],
		b : players[p.b]
	    };
	});
    };
    return game;
};
