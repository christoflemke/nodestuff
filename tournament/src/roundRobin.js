var pairingMatrix = function(mod) {
    var result = function(col) {
	return function(row) {
	    var round;
	    if (col%2 === 0) {
		round = (mod+row-col)%mod;
	    }
	    else {
		round = (mod+col-row)%mod;
	    }

	    if(col === row) {
		return 0;
	    }
	    else if(col < row) {
		return round;
	    }
	    else {
		return round + mod -1;
	    }
	};
    };
    result.numberOfPlayers = function() {
	return mod;
    };
    result.print = function() {
	if(mod === 0) {
	    console.log("[]");
	}
	for(var i = 0; i < mod; i++) {
	    var line = "[" + pairingMatrix(mod)(0)(i);;
	    for(var j = 1; j < mod; j++) {
		line = line + "," + pairingMatrix(mod)(j)(i);
	    }
	    console.log(line + ']');
	}
    };
    return result;
};

var pairings = function(matrix, round) {
    console.log("round: " + round);
    
    var result = [];
    var numPlayers = matrix.numberOfPlayers();
    matrix.print();

    for(var i = 0; i < numPlayers; i++) {
	for(var j = 0; j < numPlayers; j++) {
	    var col = matrix(i);
	    if(col(j) === round) {
		result.push({
		    a : i,
		    b : j
		});
	    }
	}
    }
    return result;
}

exports.matrix = pairingMatrix;
exports.pairings = pairings;
