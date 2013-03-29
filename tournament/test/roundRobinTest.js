var tournament = require('../src/tournament.js');
var roundRobin = require('../src/roundRobin.js');
var expect = require('expect.js');

describe('AllVsAll',function() {

    var game;
    var create2Player = function() {
	var game = tournament.createRoundRobin();
	game.addPlayer('john');
	game.addPlayer('don');
	game.start();
	return game;
    }

    var create4Player = function() {
	var game = tournament.createRoundRobin();
	game.addPlayer('one');
	game.addPlayer('two');
	game.addPlayer('three');
	game.addPlayer('four');
	game.start();
	return game;
    }

    var create6Player = function() {
	var game = tournament.createRoundRobin();
	game.addPlayer('one');
	game.addPlayer('two');
	game.addPlayer('three');
	game.addPlayer('four');
	game.addPlayer('five');
	game.addPlayer('six');
	game.start();
	return game;
    }

    beforeEach(function() {
	game = tournament.createRoundRobin();
    });

    describe('addplayer', function() {
	it('should add a player to the gamestate', function() {
	    game.addPlayer('john');
	    expect(game.players()).to.be.an('array');
	    expect(game.players()).to.eql(['john']);
	});
    });

    describe('currentRound',function() {
	it('should be 0 before the game is started',function() {
	    expect(game.getCurrentRound()).to.be.eql(0);
	});
	it('should be 1 when the game is started',function() {
	    game.addPlayer('john');
	    game.addPlayer('don');
	    game.start();
	    expect(game.getCurrentRound()).to.be.eql(1);
	});
    });

    describe('start',function() {
	it('should throw an exception if no players are added',function() {
	    expect(game.start).to.throwError();
	});
    });

    describe('add bye',function() {
	it('should add a player "bye" if the number of players is not even', function() {
	    var game = create2Player();
	    game.addPlayer('foo');
	    game.start();
	    expect(game.players()).to.be.eql(['john','don','foo','Bye']);
	});
    });

    describe('pairings', function() {

	it('should return one pairing for two players',function() {
	    var game = create2Player();
	    game.start();
	    expect(game.pairings()).to.be.eql([ 
		{ a : 'john', b : 'don'}
	    ]);
	});

	it('should return new pairings for each round in a game of 4',function() {
	    var game = create4Player();
	    game.start();
	    expect(game.pairings()).to.be.eql([
		{ a: 'one', b : 'two'},
		{ a: 'three', b : 'four'}
	    ]);
	    game.nextRound();
	    expect(game.pairings()).to.be.eql([
		{ a: 'one', b : 'three'},
		{ a: 'two', b : 'four'}
	    ]);
	    game.nextRound();
	    expect(game.pairings()).to.be.eql([
		{ a: 'one', b : 'four'},
		{ a: 'two', b : 'three'}
	    ]);
	});

	it('should return new pairings for each round in a game of 4',function() {
	    var game = create6Player();
	    game.start();
	    expect(game.pairings()).to.be.eql([
		{ a: 'one', b : 'two'},
		{ a: 'three', b : 'four'},
		{ a: 'five', b : 'six'}
	    ]);
	    game.nextRound();
	    expect(game.pairings()).to.be.eql([
		{ a: 'one', b : 'three'},
		{ a: 'two', b : 'six'},
		{ a: 'three', b : 'five'}
	    ]);
	    game.nextRound();
	    expect(game.pairings()).to.be.eql([
		{ a: 'one', b : 'four'},
		{ a: 'two', b : 'five'},
		{ a: 'three', b : 'six'}
	    ]);
	});

    });

    describe('matrix 6x6', function() {

	var matrix = roundRobin.matrix(6);

	it('col1',function() {
	    var col = matrix(0);
	    expect(col(0)).to.be(0);
	    expect(col(1)).to.be(1);
	    expect(col(2)).to.be(2);
	    expect(col(3)).to.be(3);
	    expect(col(4)).to.be(4);
	    expect(col(5)).to.be(5);
	});
	
	it('col2',function() {
	    var col = matrix(1);
	    expect(col(0)).to.be(6);
	    expect(col(1)).to.be(0);
	    expect(col(2)).to.be(5);
	    expect(col(3)).to.be(4);
	    expect(col(4)).to.be(3);
	    expect(col(5)).to.be(2);
	});


	it('col3',function() {
	    var col = matrix(2);
	    expect(col(0)).to.be(9);
	    expect(col(1)).to.be(10);
	    expect(col(2)).to.be(0);
	    expect(col(3)).to.be(1);
	    expect(col(4)).to.be(2);
	    expect(col(5)).to.be(3);
	});

	it('col4',function() {
	    var col = matrix(3);
	    expect(col(0)).to.be(8);
	    expect(col(1)).to.be(7);
	    expect(col(2)).to.be(6);
	    expect(col(3)).to.be(0);
	    expect(col(4)).to.be(5);
	    expect(col(5)).to.be(4);
	});

	it('col5',function() {
	    var col = matrix(4);
	    expect(col(0)).to.be(7);
	    expect(col(1)).to.be(8);
	    expect(col(2)).to.be(9);
	    expect(col(3)).to.be(10);
	    expect(col(4)).to.be(0);
	    expect(col(5)).to.be(1);
	});

	it('col6',function() {
	    var col = matrix(5);
	    expect(col(0)).to.be(10);
	    expect(col(1)).to.be(9);
	    expect(col(2)).to.be(8);
	    expect(col(3)).to.be(7);
	    expect(col(4)).to.be(6);
	    expect(col(5)).to.be(0);
	});
    });
    
    describe('results',function() {
	it('after round one',function() {
	    var game = create4Player();
	    game.addResult('one','two',2,0);
	    expect(game.ranking()).to.be.eql([
		{ player : 'one', points : 2},
		{ player : 'two', points : 0},
		{ player : 'three', points : 0},
		{ player : 'four', points : 0}
	    ]);
	    game.addResult('three','four',2,0);
	    expect(game.ranking()).to.be.eql([
		{ player : 'one', points : 2},
		{ player : 'three', points : 2},
		{ player : 'two', points : 0},
		{ player : 'four', points : 0}
	    ]);
	});

	it('after round two',function() {
	    var game = create4Player();
	    game.addResult('one','two',2,0);
	    game.addResult('three','four',2,0);

	    game.addResult('one','three',2,0);
	    game.addResult('two','four',2,0);
	    
	    expect(game.ranking()).to.be.eql([
		{ player : 'one', points : 4},
		{ player : 'two', points : 2},
		{ player : 'three', points : 2},
		{ player : 'four', points : 0}
	    ]);

	});

	it('after round three',function() {
	    var game = create4Player();
	    game.addResult('one','two',2,0);
	    game.addResult('three','four',2,0);
	    game.addResult('one','three',2,0);
	    game.addResult('two','four',2,0);

	    game.addResult('one','four',1,1);
	    game.addResult('two','three',0,2);
	    
	    expect(game.ranking()).to.be.eql([
		{ player : 'one', points : 5},
		{ player : 'three', points : 4},
		{ player : 'two', points : 2},
		{ player : 'four', points : 1}

	    ]);

	});
    });
    
});

