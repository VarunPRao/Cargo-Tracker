var locations = new Array();
var map;

document.getElementById("awbsearch").addEventListener('keypress', event => {
	if (event.keyCode == 13) {
        event.preventDefault();
		document.getElementById("endsearch").click();
    
		console.log("search bar input");
		const username = "username@gmail.com";
		const pass = "abcdefg";
		const awb = event.target.value;
		const url = "https://one-record-demo-endpoint" + awb;
	
		console.log("sending " + url);
		const request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState === 4 && this.status === 200) {
				console.log("successful request:\n" + request.responseText);
				var flightData = JSON.parse(request.responseText);
				
				var consignment = getConsignment(flightData);
				
				flightData.flightHistory.consignments[consignment].events.sort(
					function comparison(a, b) {
						var yearDif = parseInt(a.timeOfEvent.substring(0, 4)) - parseInt(b.timeOfEvent.substring(0, 4));
						var monthDif = parseInt(a.timeOfEvent.substring(5, 7)) - parseInt(b.timeOfEvent.substring(5, 7));
						var dayDif = parseInt(a.timeOfEvent.substring(8, 10)) - parseInt(b.timeOfEvent.substring(8, 10));
						var hourDif = parseInt(a.timeOfEvent.substring(11, 13)) - parseInt(b.timeOfEvent.substring(11, 13));
						var minuteDif = parseInt(a.timeOfEvent.substring(14, 16)) - parseInt(b.timeOfEvent.substring(14, 16));
						var secondDif = parseInt(a.timeOfEvent.substring(17)) - parseInt(b.timeOfEvent.substring(17));
						
						if(yearDif == 0) {
							if(monthDif == 0) {
								if(dayDif == 0) {
									if(hourDif == 0) {
										if(minuteDif == 0) {
											return secondDif;
										} else {
											return minuteDif;
										}
									} else {
										return hourDif;
									}
								} else {
									return dayDif;
								}
							} else {
								return monthDif;
							}
						} else {
							return yearDif;
						}
					}
				);
				
				startGraph(flightData, consignment);
				getLocations(flightData, consignment);
			}
		}
	
		request.open('GET', url, true);
		request.setRequestHeader("Authorization", "Basic " + btoa(username+ ":" + pass));
		request.send();
	}
})

function initMap() {
	var locations = new Array();
	var loc1, loc2;
	var marker1, marker2;
	
	map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20, lng: 80 },
    zoom: 3,
  });
}

function update(airports, data) {
	var i, path;
	
	window.scrollTo({top:0, behavior: 'smooth'});
	
	var bounds = new google.maps.LatLngBounds();
	bounds.extend(locations[0].getPosition());
	bounds.extend(locations[locations.length - 1].getPosition());
	map.fitBounds(bounds);
	
	var polyArray = new Array();
	var geodesicOptions = {
		strokeColor: "#CC0099",
		strokeOpacity: 1.0,
		strokeWeight: 3,
		geodesic: true,
		map: map,
	};
	
	const lineSymbol = {
		path: "M 0, -1 0, 1",
		strokeOpacity: 1.0,
		scale: 4,
	};
	
	var geodesicDotted = {
		strokeColor: "#CC0099",
		strokeOpacity: 0,
		icons: [
			{
				icon: lineSymbol,
				offset: "0",
				repeat: "20px",
			},
		],
		strokeWeight: 3,
		geodesic: true,
		map: map,
	};
	
	var j = 0;
	console.log(airports[0]);
	for(i = 0; i < (locations.length - 2) ; ++i) {
		console.log(airports[i + 1]);
		path = [locations[i].getPosition(), locations[i + 1].getPosition()];
		polyArray.push(new google.maps.Polyline(geodesicOptions))
		polyArray[j].setPath(path);
		++j;
	}
	
	
	if(airports[length - 1] != airports[length - 2]) {
		var dottedPath = [locations[locations.length - 2].getPosition(), locations[locations.length - 1].getPosition()];
		var dottedLine = new google.maps.Polyline(geodesicDotted);
		dottedLine.setPath(dottedPath);
	}
}

function getLocations(data, consignment) {
	var i;
	var j = 0;
	var airports = getAirports(data.flightHistory.consignments[consignment]);
	
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState === 4 && this.status === 200) {
			response = JSON.parse(request.responseText);
			
			var j;
			for(j = 0; j < response.length; ++j) {
				marker = new google.maps.Marker({
					map,
					draggable: true,
					position: response[j],
				});
			
				locations.push(marker);
				
				if(j == (response.length - 1)) {
					update(airports, data);
				}
			}
		}
	}
	
	var url = "http://localhost:8080/coords?codes=";
	for(i = 0; i < airports.length; ++i) {
		url += airports[i];
		if(i != (airports.length - 1))
			url += ",";
	}
	
	request.open('GET', url, true);
	request.send();
}

function getAirports(consignment) {
	var i;
	var airports = new Array();
	
	airports.push(consignment.originAndDestination.origin);
	for(i = 0; i < consignment.events.length; ++i) {
		var flightEvent = consignment.events[i];
		if(flightEvent.type == "departed") {
			if(!airports.includes(flightEvent.origin))
				airports.push(flightEvent.origin);
			if(!airports.includes(flightEvent.destination))
				airports.push(flightEvent.destination);
		}
		else if((flightEvent.type == "discrepancy") && (flightEvent.discrepancyCode == "SHORTSHIPPED"))
			airports.pop();
	}
	airports.push(consignment.originAndDestination.destination);
	
	return airports;
}

function getConsignment(flightData) {
	var i;
	for(i = 0; i < flightData.flightHistory.consignments.length; ++i) {
		if(flightData.flightHistory.consignments[i].quantity.shipmentDescriptionCode == "TOTAL_CONSIGNMENT")
			return i;
	}
	return 0;
}