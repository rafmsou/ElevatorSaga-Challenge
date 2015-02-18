var getElevatorObj = function(){
	
	var ElevatorMock = function(){ };
	ElevatorMock.prototype = { 
		// properties
		curFloor: 2,
	    destinationQueue: [],

		// methods
		on: function(event, func){ },
	    goToFloor: function(floor){ },
	    currentFloor: function(){ return this.curFloor },
	    loadFactor: function(){ return 0.5 },
	    checkDestinationQueue: function() { }
	};

	return new ElevatorMock();
};