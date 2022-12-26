<?php

ini_set('display_errors', 1);


// get the session name from the query string, which loads which points file to use
$session = $_GET['s'];

if ($session=="random" or $session=="") {	
	ini_set('memory_limit', '1024M'); // big file!
	$local_data_file = "trails.json";
	
	if (time()-filemtime($local_data_file) < 24 * 3600) {
		// reusing our locally stored trails file
		$json_data=file_get_contents($local_data_file);
	}
	else {
		// the data file is too old, lets redownload it
		$json_data=file_get_contents("https://app.onewheel.com/wp-json/fm/v2/trails");
		file_put_contents($local_data_file, $json_data);
	}	
	
	$array = json_decode($json_data, true);
	$random_ride = $array[rand(0, count($array) - 1)];
	$session = $random_ride["id"];
	
	// trying to make it not serve the same ride again and again when loading a random ride on mobile
	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

	$random_ride="true"; // as string since going to print it into javascript.
}
else {
	$random_ride="false"; // as string
}


$overview = "https://app.onewheel.com/wp-json/fm/v2/trails/1?trackId=" . $session;
$points_fname = "https://app.onewheel.com/wp-json/fm/v2/trailscoordinates/" . $session;


// not really used anymore
$autopan = $_GET['p'];
if ($autopan=="yes" || $autopan=="true") $autopan="true"; // this has to be a string since it gets printed into javascript. I'm sure there's a better way.
else $autopan="false";


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




#battery_soc{   
	background-colorZZ: blue;
	position: absolute; 
	width: 99%;
	top: 0;
    left: 0;
    right: 0;
	text-align: center;
	height:30px;
	z-index: 2000; 
	color: white;
	
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

let autopan = <? print $autopan; ?>;
let random_ride = <? print $random_ride; ?>;
let session_number = <?php echo $session; ?>;

console.log("Track ID = <?php echo $session; ?>");
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
<script src="js/animation.js?v=<?php print rand(); ?>"></script>

<div id="battery_soc"></div>
<div id="some_form">

  <input type="checkbox" name="filter" value="distributer" class='chk-btn' >
  <label for='shower'>AutoPan</label>

</div>

  </body>
</html>
