

var Route = (function () {
	


	function Route(options) {
		this.options = this.extend(this._options, options);
		this.init();
	}

	function ButtonControl(controlDiv, title, onClick) {
		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.marginBottom = '22px';
		controlUI.style.textAlign = 'center';
		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.lineHeight = '38px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlText.innerHTML = title;
		controlUI.appendChild(controlText);

		controlUI.addEventListener('click', onClick);
	}


	Route.prototype = {
		map: {},
		mapTileListener: null,
		coordinates: [],
		animation: null,
		init: function () {
			var self = this;
			
			// https://developers.google.com/maps/documentation/javascript/reference/map

			self.map = new google.maps.Map(document.querySelector("#map"), {
				center: new google.maps.LatLng(37.7749, -122.4194), 
				zoom: 13,
				mapTypeId: 'satellite',
				//mapTypeId: 'streetView',
				styles: styles,
				panControl: true, // was false
				zoomControl: true,
				mapTypeControl: true, // was false
				streetViewControl: true, // was false
				scrollwheel: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.LEFT_BOTTOM,
					style: google.maps.ZoomControlStyle.LARGE
				}
			});

			var controlDiv = document.createElement('div');
			controlDiv.style.padding = '5px';
			var playControl = new ButtonControl(controlDiv, 'Play', function () { self.playAnimation() });
			var pauseControl = new ButtonControl(controlDiv, 'Pause', function () { self.pauseAnimation() });

			//%%
			//var batteryControl = new ButtonControl(controlDiv, 'ASDF', function () { self.pauseAnimation() });

			controlDiv.index = 1;
			self.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(controlDiv);
		},

		parseJSON: function (data) {

			this.coordinates = data.map(function (item) {
				return {
					lat: item.lat,
					lng: item.lon,
					battery_soc: item.battery_soc,
					speed_ow: item.speed_ow,
					speed2: item.speed,
					altitude: item.alt,
					//timestamp: item.seconds,
					//ride: item.ride === 'true',
					//speed: item.speed,
					speed: 2.0, // hard coding the speed since this was adapted from my surf script that had speed
					
					googLatLng: new google.maps.LatLng(item.lat, item.lon)
				}
			});
		},
		setPath: function (points) {
			this.parseJSON(points);
			this.setMarkers();
		},
		setMarkers: function () {

			var self = this,
				//startMarker, endMarker, pin;
				startMarker, pin;

			pin = new google.maps.MarkerImage('images/pin.png', null, null, null, new google.maps.Size(26, 31));
			fooey = new google.maps.MarkerImage('images/fooey.png', null, null, null, new google.maps.Size(70, 85));
			fooey2 = new google.maps.MarkerImage('images/hongkong007.png', null, null, null, new google.maps.Size(110, 120));
			flag = new google.maps.MarkerImage('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png', null, null, null, new google.maps.Size(26, 31));
			trans = new google.maps.MarkerImage('images/transparent.png', null, null, null, new google.maps.Size(26, 31));


			// start point
			startMarker = new google.maps.Marker({
				position: self.coordinates[0].googLatLng,
				//icon: fooey2,
				icon: trans,
				map: self.map,
				animation: google.maps.Animation.DROP
			});
			

			// end point (removed)
			/*
			endMarker = new google.maps.Marker({
				position: self.coordinates[self.coordinates.length - 1].googLatLng,
				//icon: trans,
				icon: fooey2,
				map: self.map,
			});
			*/

			var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < self.coordinates.length; i++) {
				bounds.extend(self.coordinates[i].googLatLng);
			}
			
			

			self.map.fitBounds(bounds);
			self.map.setZoom(16); // set initial zoom level
			self.map.setCenter(self.coordinates[0].googLatLng);
			
		},
		playAnimation: function () {
			var self = this;
			if (!self.animation) {
				var animation = new RouteAnimation(self.coordinates, self.map);
				animation.onCompleted = function () {

				}
				self.animation = animation;
			}
			
			self.animation.play();
		},
		pauseAnimation: function () {
			var self = this;
			if (self.animation) {
				self.animation.pause();
			}
		},
		extend: function (a, b) {
			for (var key in b) {
				if (b.hasOwnProperty(key)) {
					a[key] = b[key];
				}
			}
			return a;
		}

	}

	return Route;

})();



