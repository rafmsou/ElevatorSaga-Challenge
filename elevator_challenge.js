var initFunc = function(elevators, floors) {
    
    var self = this;
    self.elevators = elevators;
    self.floors = floors;

    for(var i=0; i<floors.length; i++)
		(function(floor){
			
			floor.on("down_button_pressed", function(){
                
                self.queueToNearestElevator(this.floorNum(), false);

            });

			floor.on("up_button_pressed", function(){

                self.queueToNearestElevator(this.floorNum(), true);
                
            });

		})(floors[i]);

    for(var i=0; i<elevators.length; i++)
    	(function(elevator){

			elevator.id = (i + 1);
			elevator.callingQueue = [];

    		elevator.on("idle", function() { 
	        	log("elevator is idle");
	            
	        });

	        elevator.on("floor_button_pressed", function(floorNum) {

	            if(elevator.destinationQueue.indexOf(floorNum) < 0) {
	            	elevator.destinationQueue.push(floorNum);
	            	elevator.checkDestinationQueue();

                    //log("new queue: " + elevator.rearrangeQueue());
	            }
	        });

			elevator.on("stopped_at_floor", function(floorNum) {

				elevator.floorVisited(floorNum);
			});

			elevator.on("passing_floor", function(floorNum, direction) {
				
				// if the elevator is not completely full, and this floor has a request waiting (up or down), stop at it 				
			    if(elevator.loadFactor() > 0.8)
					return;
					           
               log("is going up -> " + elevator.isGoingUp());         
               if(elevator.isGoingUp() == true){
                    if(elevator.callingQueue.contains({ floor: floorNum, isUp: true })){

						elevator.goToFloor(floorNum, true);
                    }
                }
                else{
                    if(elevator.callingQueue.contains({ floor: floorNum, isUp: false })){

						elevator.goToFloor(floorNum, true);
                    }
                }

			});
			
			elevator.callingQueue.contains = function(request){
				for(var i=0; i<this.length; i++)
				{
					if(request.floor == this[i].floor && request.isUp == this[i].isUp)
                            return true;
				}
				
				return false;
			};

    	    elevator.floorVisited = function(floor){
			
				if(elevator.destinationQueue.indexOf(floor) > -1){
					elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(floor), 1);
					elevator.checkDestinationQueue();
				}
				
				for(var i=0; i<elevator.callingQueue.length; i++){
					if(elevator.callingQueue[i].floor == floor)
						elevator.callingQueue.splice(i, 1);
				}

    		};

            elevator.isGoingUp = function(){
                
                var destinationDistance = (elevator.destinationQueue[0] - elevator.currentFloor());
                var isGoingUp = destinationDistance > 0 ? true : false;

                if(destinationDistance == 0){

                    // if the distance is 0, we still don't know what the direction is
                    isGoingUp = (elevator.destinationQueue[0] - elevator.destinationQueue[1]) > 0 ? false : true;
                }

                return isGoingUp;
            };

            elevator.rearrangeQueue = function(){
            
                var nearestFloor = null;
                var curfloor = elevator.currentFloor();
                var destinationDistance = (elevator.destinationQueue[0] - curfloor);
                var isGoingUp = elevator.isGoingUp();

                if(destinationDistance == 0)
                    nearestFloor = curfloor;                    
                else
                    nearestFloor = self.getNearestFloor(curfloor, elevator.destinationQueue, isGoingUp);

                var queue = elevator.destinationQueue.slice();
                queue.sort(sortAsc);

                var index = queue.indexOf(nearestFloor);
                var queueUp = queue.slice(index);
                var queueDown = queue.slice(0, index).sort(sortDesc);
                var newQueue = [];

                if(isGoingUp == true){
                    newQueue.push.apply(newQueue, queueUp);
                    newQueue.push.apply(newQueue, queueDown);

                }else{
                    newQueue.push.apply(newQueue, queueDown);
                    newQueue.push.apply(newQueue, queueUp);
                }

                return newQueue;
            };

    	})(elevators[i]);
   

    self.queueToNearestElevator = function(floorNum, isUp){

        var request = { floor: floorNum, isUp: isUp };
		
		var elevator = self.getNearestElevator(request);
		if(elevator != null)
		{
			if(!elevator.callingQueue.contains(request)) {
				elevator.callingQueue.push(request);
				
				if(elevator.destinationQueue.length == 0)
					elevator.goToFloor(request.floor);
			}
		}

    };

    self.getNearestFloor = function(curFloor, queue, isGoingUp) {

        var minDistance = null;
        var nearestFloor = null;

        for (var i = 0; i < queue.length; i++) {

            var distance = curFloor - queue[i];

            if( (distance > 0 && isGoingUp) ||  (distance < 0 && !isGoingUp) )
                continue;

            distance = Math.abs(distance);

            if(minDistance == null){
        		nearestFloor = queue[i];
        		minDistance = distance;
        	}
            //else if(distance < minDistance && distance != 0){
        	else if(distance < minDistance){
        		nearestFloor = queue[i];
        		minDistance = distance;
        	}
        };

		//log("current floor: " + curFloor);
		//log("queue: " + queue);
		//log("nearestFloor: " + nearestFloor);
        return nearestFloor;
    };

	self.getNearestElevator = function(request) {

        var minDistance = null;
        var nearestElevator = null;

        for (var i = 0; i < elevators.length; i++) {

        	var distance = Math.abs(request.floor - elevators[i].currentFloor());

        	if(minDistance == null){
        		nearestElevator = elevators[i];
        		minDistance = distance;
        	}
			else if(elevators[i].loadFactor() == 0 && distance < minDistance && distance != 0){
        		nearestElevator = elevators[i];
        		minDistance = distance;				
			}
        	else if(distance < minDistance && distance != 0){
        		nearestElevator = elevators[i];
        		minDistance = distance;
        	}
        };

		//log("request floor: " + request.floor);
		//log("nearestElevator.floor: " + nearestElevator.currentFloor());
        return nearestElevator;
    };

    var sortAsc = function(a, b){ return a-b };

    var sortDesc = function(a, b){ return b-a };

    var log = function(text){
        if (console && console != null) console.log(text);
    };
}