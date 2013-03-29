var service = require('../src/tournamentService.js');
var expect = require('expect.js');

describe('TournamentService',function() {
    var tournamentService;
    beforeEach(function() {
	tournamentService = service.createService();
	tournamentService.listen(1337,'localhost');
    });

    afterEach(function() {
	tournamentService.close();
    });

    describe('created', function() {
	it('service created', function() {

	});
    });


    
});

