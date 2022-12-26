
let pan_counter=0;
let last_point;

var RouteAnimation = function (path, map) {
	var self = this;
	var animationIndex = 0;
	var pin = new google.maps.MarkerImage('images/pin.png', null, null, null, new google.maps.Size(26, 31));
	//fooey = new google.maps.MarkerImage('images/fooey.png', null, null, null, new google.maps.Size(26, 31));
	fooey = new google.maps.MarkerImage('images/pin.png', null, null, null, new google.maps.Size(26, 31));
	trans = new google.maps.MarkerImage('images/transparent.png', null, null, null, new google.maps.Size(26, 31));
	var paused = false;
	var started = false;
	var finished = false;
	var lines = [];

	var marker = null;


	// these are the colors of the rides
	function chooseRideColor() {

		colors = ["red", "blue", "purple", "orange"];

		// pick a random color
		var c = colors[Math.floor(Math.random()*colors.length)];

		return c;

	}

	function animateRoute(path, map, completed) {

		var self = this,
			moveSpeed = .5, // the speed
			step = 0,
			numSteps = 20,
			animationSpeed = 0.50,
			offset = animationIndex,
			nextOffset = animationIndex + 1,
			departure, destination, nextStop, line, interval;

		if (nextOffset >= path.length) {
			if (marker) {
				marker.setMap(null);
				marker = null;
			}
			clearInterval(interval);
			completed();
			return false;
		}

		if (!marker) {
			marker = new google.maps.Marker({
				icon: trans,
				map: map,
			});
		}


		speed_offset = .4; // adjust the speed with this

		moveSpeed = path[offset].speed * speed_offset;
		departure = path[offset].googLatLng;
		destination = path[nextOffset].googLatLng;
		numSteps = google.maps.geometry.spherical.computeDistanceBetween(departure, destination) / moveSpeed;

		let msg = path[nextOffset].battery_soc + "%";
		if (random_ride) msg += " (" + session_number + ")";
		$("#battery_soc").text(msg);
		
		last_point = path[nextOffset].googLatLng; //%%
		
		/*
		// my first attempt at auto panning, which pans every X steps
		pan_counter+=1;
		if (autopan && pan_counter > 100) {
			pan_counter=0;
			map.panTo(path[nextOffset].googLatLng);
		}
		*/
				
		// much better auto pan system, only auto pan if we're outside the map object's viewport
		var currentBounds = map.getBounds();

		if(currentBounds.contains(path[nextOffset].googLatLng)){
			// we're good!
		}else{
			// we're outside the viewport! Lets pan!
			map.panTo(path[nextOffset].googLatLng);
		}		
		
		//self.map.endMarker.hide();
		//endMarker.setVisible(false);



		path_color = '#f1d32e';

		current_point = path[animationIndex];
		current_point_is_ride = current_point["ride"];

		if (!current_point_is_ride) {
			// pick the ride color every time we're doing a non ride point. A kludge so that the rides are the same color for the whole ride
			ride_color = chooseRideColor();
		}


		// the regular route line
		line = new google.maps.Polyline({
			path: [departure, departure],
			geodesic: false,

			strokeColor: path[animationIndex].ride ? ride_color : path_color,
			strokeOpacity: 1,
			//strokeWeight: 2,
			strokeWeight: path[animationIndex].ride ? 6 : 2,
			map: map
		});
		lines.push(line)


		interval = setInterval(function () {
			if (paused) {
				return;
			}

			step++;

			if (step > numSteps) {
				line.setPath([departure, destination]);
				animationIndex++;
				animateRoute(path, map, completed);
				clearInterval(interval);
			} else {
				nextStop = google.maps.geometry.spherical.interpolate(departure, destination, step / numSteps);
				line.setPath([departure, nextStop]);
				marker.setPosition(nextStop);
			}

		}, animationSpeed);
	}


	return {
		play: function () {
			if (finished) {

				started = false;
				lines.forEach(function (line) {
					line.setMap(null);
				});
				lines = [];
			}
			if (!started) {
				animationIndex = 0;
				paused = false;
				started = true;
				finished = false;
				animateRoute(path, map, function () {
					// %% done! 
					console.log("done!"); 

					// put a little hong kong fooey at the end for good measure
					fooey2 = new google.maps.MarkerImage('images/hongkong007.png', null, null, null, new google.maps.Size(110, 120));
					endMarker2 = new google.maps.Marker({
						position: last_point,
						//icon: trans,
						icon: fooey2,
						map: self.map,
					});
					endMarker2.setMap(map);
										
					finished = true;
					self.onCompleted && self.onCompleted()
				});
			} else {
				paused = false;
			}

		},
		pause: function () {
			paused = true;
		}
	}

}
