var tournament = require('../src/tournament.js');
var expect = require('expect.js');

describe('Single elimination',function() {
    
    describe('start with one bye', function() {
	var game = tournament.createSingleElimination();
	game.addPlayer('one');
	game.addPlayer('two');
	game.addPlayer('three');
	game.start();

	it('bye added', function() {

	    expect(game.parings()).to.be.eql([
		{a : 'one', b : 'Bye'},
		{a : 'two', b : 'three'},
	    ]);
	    
	});
    });

    describe('start with two bye', function() {
	var game = tournament.createSingleElimination();
	game.addPlayer('one');
	game.addPlayer('two');
	game.addPlayer('three');
	game.addPlayer('four');
	game.addPlayer('five');
	game.addPlayer('six');

	game.start();

	it('bye added', function() {

	    expect(game.parings()).to.be.eql([
		{a : 'one', b : 'Bye'},
		{a : 'two', b : 'Bye'},
		{a : 'three', b : 'six'},
		{a : 'four', b : 'five'}
	    ]);
	    
	});
    });

    describe('top 8 pairings', function() {

	var game = tournament.createSingleElimination();
	game.addPlayer('one');
	game.addPlayer('two');
	game.addPlayer('three');
	game.addPlayer('four');
	game.addPlayer('five');
	game.addPlayer('six');
	game.addPlayer('seven');
	game.addPlayer('eight');


	it('pairings',function() {
	    expect(game.parings()).to.be.eql([
		{a : 'one', b : 'eight'},
		{a : 'two', b : 'seven'},
		{a : 'three', b : 'six'},
		{a : 'four', b : 'five'}
	    ]);
	});
    });

    describe('next round',function() {
	var game = tournament.createSingleElimination();
	game.addPlayer('one');
	game.addPlayer('two');
	game.addPlayer('three');
	game.addPlayer('four');
	game.addPlayer('five');
	game.addPlayer('six');
	game.addPlayer('seven');
	game.addPlayer('eight');

	it('missing result',function() {
	    expect(game.nextRound).to.throwError();
	});
/*
	it('results complete',function() {
	    game.addResult('one','eight',2,0);
	    game.addResult('two','seven',2,0);
	    game.addResult('three','six',2,0);
	    game.addResult('four','five',2,0);
	    game.nextRound();
	});*/
    });
});
