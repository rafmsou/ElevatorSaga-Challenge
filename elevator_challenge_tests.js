
var main = new initFunc([ getElevatorObj() ], []);

describe("Elevator Tests", function() {
  
  it("first elevator to have id #1", function() {
    expect(main.elevators[0].id).toEqual(1);
  });

  it("calling queue contain request: floor /5 /up", function() {
    var request = { floor: 5, isUp: true };
    var elevator = main.elevators[0];
    elevator.callingQueue.push(request);

    expect(elevator.callingQueue.contains(request)).toBe(true);
  });

  it("calling queue does not contain request: floor /5 /down", function() {
    var requestUp = { floor: 5, isUp: true };
    var requestDown = { floor: 5, isUp: false };
    var elevator = main.elevators[0];
    elevator.callingQueue.push(requestUp);

    expect(elevator.callingQueue.contains(requestDown)).toBe(false);
  });

  it("floorVisited method clears floor from all queues", function() {
    var request = { floor: 5, isUp: true };
    var elevator = main.elevators[0];

    elevator.callingQueue.splice(0);
    elevator.destinationQueue.splice(0);
    elevator.callingQueue.push(request);
    elevator.destinationQueue.push(5);

    elevator.floorVisited(5);

    expect(elevator.callingQueue.length).toEqual(0);
    expect(elevator.destinationQueue.length).toEqual(0);

  });

});

describe("Operations Tests", function(){
    
    it("get the nearest elevator with 1 elevator only", function(){
    	var request = { floor: 0, isUp: true };
    	elevator = main.getNearestElevator(request);

    	expect(elevator).toBeDefined();
    	expect(elevator.id).toEqual(1);
    });

    it("get the nearest elevator with 2 elevators", function(){
    	var request = { floor: 0, isUp: true };

    	var oneElevator = getElevatorObj();
    	oneElevator.curFloor = 1
    	var anotherElevator = getElevatorObj();
    	anotherElevator.curFloor = 2;

    	var initFuncTest = new initFunc([oneElevator, anotherElevator], []);

    	elevator = initFuncTest.getNearestElevator(request);

    	expect(elevator).toBeDefined();
    	expect(elevator.currentFloor()).toEqual(1);

    	initFuncTest = null;
    });

});