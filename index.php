<?php

// get the session name from the query string, which loads which points file to use
$session = $_GET['s'];


$overview = "https://app.onewheel.com/wp-json/fm/v2/trails/1?trackId=" . $session;
$points_fname = "https://app.onewheel.com/wp-json/fm/v2/trailscoordinates/" . $session;


?>

  


<!DOCTYPE html>
<html lang="en">
  <head>


<style>

#map {
	height: 100%;
}

html, body {
	height: 100%;
	margin: 0;
	padding: 0;

	font-family: 'HelveticaNeue-Light', 'Helvetica Neue', Helvetica, Arial, sans-serif;
	font-size: 20px;
	line-height: 1.28;

	overflow: hidden;

}








</style>


<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Floats!</title>

<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
<link rel="stylesheet" href="css/styles.css">

<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
  <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->


<script src="js/jquery.js"></script>
<script src="js/underscore.js"></script>
<script src="js/GDouglasPeuker.js"></script>
<script src="js/filters.js"></script>


<script src="js/styles.js?v=<?php print rand(); ?>"></script>
<script src="js/route.js?v=<?php print rand(); ?>"></script>




</head>

<body>

<div id="map"></div>





<script>

console.log("Using <?php echo $points_fname; ?>");

// make the route global
var route;

function initMap() {

    route = new Route();

	$.getJSON("<?php echo $points_fname; ?>",
		function(data) { 
			route.setPath(data);

			route.playAnimation(); // auto start

		} // end function(data)
	); // end getJson

};




</script>


<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCsUaVH1bABUSRhEb7AHTkeQIyuActfI3Q&libraries=geometry&callback=initMap"></script>
<script src="js/animation.js"></script>



  </body>
</html>