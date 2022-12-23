


var RouteAnimation = function (path, map) {
	var self = this;
	var animationIndex = 0;
	var pin = new google.maps.MarkerImage('images/pin.png', null, null, null, new google.maps.Size(26, 31));
	fooey = new google.maps.MarkerImage('images/fooey.png', null, null, null, new google.maps.Size(26, 31));
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