function startGraph(flightInfo, consignment) {
	const graphContainer = document.getElementById("graph-container");
		
	var customTemplate = GitgraphJS.templateExtend(GitgraphJS.TemplateName.Metro, {
		colors: ["#979797", "#008FB5", "#F1C109", "#B50097", "#B56A00", "#0FB500"],
		branch: {
			lineWidth: 8,
			spacing: 40,
		},
		commit: {
			spacing: 60,
			dot: {
				size: 12,
			},
			message: {
				displayHash: false,
				displayAuthor: false,
				font: "normal 12pt Arial",
			},
		},
	});
	const gitgraph = GitgraphJS.createGitgraph(graphContainer, {template: customTemplate, /*orientation: GitgraphJS.Orientation.Horizontal*/});
		
	graph(flightInfo, consignment, gitgraph);
}

function graph(flightData, consignment, gitgraph) {
	var i;
	var count = 0;
	var branchMessage = "IN PROGRESS";
	
	for(i = 0; i < flightData.flightHistory.consignments[consignment].events.length; i++) {
		if(flightData.flightHistory.consignments[consignment].events[i].type == "DELIVERED")
			branchMessage = "DELIVERED";
	}
	
	const master = gitgraph.branch(branchMessage);
	master.commit("🏛️ " + flightData.flightHistory.consignments[consignment].originAndDestination.origin);
	
	var branches = new Array();
	
    for(i = 0; i < flightData.flightHistory.consignments[consignment].events.length; i++) {
		var flightEvent = flightData.flightHistory.consignments[consignment].events[i];
		//console.log("Event type: " + flightEvent.type)
		
		switch(flightEvent.type) {
			case "received from shipper":
				var message = displayTime(flightEvent) + " : RECIEVED FROM SHIPPER";
				master.commit(message);
				break;
				
			case "booked":
				var message = displayTime(flightEvent) + " : BOOKED ON FLIGHT " + flightEvent.flight;
				master.commit(message);
				break;
				
			case "manifested":
				var message = displayTime(flightEvent) + " : MANIFESTED ON FLIGHT " + flightEvent.flight;
				master.commit(message);
				break;
				
			case "departed":
				var obj = { name: flightEvent.flight, gitobj: master.branch(flightEvent.flight)};
				var message = displayTime(flightEvent) + " : FLIGHT " + flightEvent.flight + " DEPARTED";
				obj.gitobj.commit(message);
				branches.push(obj);
				break;
				
			case "arrived":
				var j;
				for(j = 0; j < branches.length; ++j) {
					if(branches[j].name == flightEvent.flight) {
						var message = displayTime(flightEvent) + " : FLIGHT " + flightEvent.flight + " ARRIVED";
						branches[j].gitobj.commit(message);
						master.merge(branches[j].gitobj, "🏛️ " + flightEvent.destination);
					}
				}
				break;
				
			case "freight prepared":
				var message = displayTime(flightEvent) + " : FREIGHT PREPARED FOR FLIGHT " + flightEvent.flight;
				master.commit(message);
				break;
				
			case "received from flight":
				var message = displayTime(flightEvent) + " : RECEIVED FROM FLIGHT " + flightEvent.flight;
				master.commit(message);
				break;
				
			case "consignee notified":
				var message = displayTime(flightEvent) + " : CONSIGNEE NOTIFIED";
				master.commit(message);
				break;
				
			case "delivered":
				var message;
				if(typeof(flightEvent.deliveryToName) != "undefined") {
					var message = displayTime(flightEvent) + " : DELIVERED TO " + flightEvent.deliveryToName;
					master.commit(message);
				}
				else {
					var message = displayTime(flightEvent) + " : DELIVERED";
					master.commit(message);
				}
				break;
				
			case "freight on hand":
				var message = displayTime(flightEvent) + " : FREIGHT ON HAND AT " + flightEvent.airportOfReceipt;
				master.commit(message);
				break;
				
			case "arrival documentation delivered":
				var message = displayTime(flightEvent) + " : ARRIVAL DOCUMENTATION DELIVERED AT " + flightEvent.airportOfDelivery;
				master.commit(message);
				break;
			
			case "discrepancy":
				var message = displayTime(flightEvent) + " : DISCREPANCY - " + flightEvent.discrepancyCode;
				master.commit(message);
				break;
			
			default:
				console.log("Unrecognized event type: " + flightEvent.type);
		}
	}
}

function displayTime(event) {
	var time = event.timeOfEvent;
	time = time.replace("T", " ");
	time = time.substr(0, 16);
	return time;
}

