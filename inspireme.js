// Create an array of styles.
var styles = [
	{stylers: [
		{ hue: "#00aaff" },
		{ saturation: -12 },
		{ lightness: -12 },
		{ gamma: 1.33 }
	]},{
	featureType: "road",
	elementType: "geometry",
	stylers: [
		{ visibility: "off" }
	]
	},{
	featureType: "all",
	elementType: "labels",
	stylers: [
		{ visibility: "off" }
	]
	},{
	featureType: 'administrative.country',
	stylers: [ 
		{ visibility: 'on' }
	]
	},{
	featureType: 'administrative.country',
	elementType: "labels.text",
	stylers: [ 
		{ "gamma": 2.94 },
		{ "visibility": "on" },
		{ "weight": 0.1 },
		{ "hue":"#ff0000"},
		{ "saturation":25},
		{ "lightness":37},
	]
	},{
	featureType: "road",
	elementType: "labels",
	stylers: [
		{ visibility: "off" }
	]
	}
];
var worldBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-40,-180),
                                               new google.maps.LatLng(40,180)); //pounds to display map of entire world
var map;    

var options = {
	zoom: 7,
	disableDefaultUI: true,          //disableDefaultUI on maps
	navigationControlOptions: {
	        style: google.maps.NavigationControlStyle.SMALL
	},
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	mapTypeControlOptions: {
	      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style'] //to style the map
	}
};

//Define marker icon to be displayed for woman leader
var leaderIcon = new google.maps.MarkerImage(
	'images/female.png',
	null,null,null,
	new google.maps.Size(50, 40)
); 
var infowindow = new google.maps.InfoWindow();

var wleaderData; //store data of leaders read from json


//Resize Map Canvas element to full screen
function resizeElementHeight(element) {        
    var height = 0;
    var body = window.document.body;
    if (window.innerHeight) {height = window.innerHeight;}
    else if (body.parentElement.clientHeight) {height = body.parentElement.clientHeight;}
    else if (body && body.clientHeight) {height = body.clientHeight;}
    element.style.height = ((height - element.offsetTop) + "px");
}//End of resizeElementHeight

function drawCircleInfluence(){
	if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(draw);
	} 
	else { alert("Location not supported");}
}

function draw(position){
	coord = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	//Draw a circle of inspiration/impact
	console.log("yo!")
	var inspirationOptions = {
		strokeColor: '#FF69B4',
		strokeOpacity: 0.8,
		strokeWeight: 1,
		fillColor: '#FFC0CB',
		fillOpacity: 0.50,
		map: map,
		center: coord,
		radius: 600000
	};

    // Add the circle for this city to the map.
    var leaderCircle = new google.maps.Circle(inspirationOptions);
}

function drawData(name, quote, img, number,email, coords, color){
	//define marker for current leader
	var leader = new google.maps.Marker({
		position: coords,
		map: map,
		icon: leaderIcon,
		optimized: false
	});
	leader.setMap(map); //add marker to map

	//define content of infowindow for leader marker
	var contentString = 
		'<div class="card">'+
			'<div class="contact">'+
				'<div class="name">'+name+'</div>'+
				'<img src="'+ img+'">'+
			'</div>'+
			'<div class="quote">'+quote+'</div>'+
			'<div class="card-actions">'+
				'<div class="line"></div>'+
				'<div class="action">'+
					//'<a href="">'+ //set on click function
						'<button onClick="drawCircleInfluence()">'+"You Inspire Me"+'</button>'+
					//'</a>'+
				'</div>'+
				'<div class="action">'+
					'<a href="listview.html?profile=malala">'+
						'<button>'+"Read More"+'</button>'+
					'</a>'+
				'</div>'+
				'<div class="action">'+
					'<a href="mailto:'+email+'">'+
						'<button>'+"Contact"+'</button>'+
					'</a>'+
				'</div>'+
			'</div>'+
		'</div>';

		console.log(contentString);

		google.maps.event.addListener(leader, 'click', function(e) {
		    infowindow.setContent(contentString);
		    infowindow.open(map, this);
		    //changeCircleColor(); //changes colors of influence circles associated with this leader
		    //Try to look into making other leaders look vague
		});
	
	//Draw a circle of inspiration/impact
	var inspirationOptions = {
		strokeColor: '#FF69B4',
		strokeOpacity: 0.8,
		strokeWeight: 1,
		fillColor: color,
		fillOpacity: 0.50,
		map: map,
		center: coords,
		radius: number*100
	};

    // Add the circle for this city to the map.
    var leaderCircle = new google.maps.Circle(inspirationOptions);

}

/*
//draw circle of influence for people who clicked "inspired"
function drawInspiredCircle(inspired){
	for (key in inspired){
		var lat = inspired[key].lat;
		var lat = inspired[key].lng;
		var center = new google.maps.LatLng(lat, lng);
		//Draw a circle of inspiration/impact
		var inspirationOptions = {
			strokeColor: '#FF69B4',
			strokeOpacity: 0.8,
			strokeWeight: 1,
			fillColor: '#FF69B4',
			fillOpacity: 0.35,
			map: map,
			center: center,
			radius: number*1000
		};
		// Add the circle for this city to the map.
		var leaderCircle = new google.maps.Circle(inspirationOptions);
	}
}*/

//Read JSON file
function readData(wleader){
	console.log(wleader);
	//wleaderData = wleader;
	for(key in wleader){
		var name = key;
		console.log(key);
		var quote = wleader[key].quote;
		var img = wleader[key].img;
		var number = wleader[key].peopleAffected;
		var lat = wleader[key].lat;
		var lng = wleader[key].lng;
		var color = wleader[key].color;
		var email = wleader[key].email;
		//var inspired = wleader[key].inspired;

		coords = new google.maps.LatLng(lat, lng); //create a point to be drawn on map

		drawData(name, quote, img, number, email, coords, color);

		//drawInspiredCircle(inspired);
	}
}

//Called if geolocation is supported
function success(position) {
	console.log("Yo");
	 //Create Map Container
    var mapcanvas = document.createElement('div');
    mapcanvas.id = 'mapcontainer';
    resizeElementHeight(mapcanvas);  //Full screen for map
    document.querySelector('#container').appendChild(mapcanvas);

	// Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles,
    	{name: "Styled Map"});

    //Initialize map
    map = new google.maps.Map(mapcanvas, options); 
    map.fitBounds(worldBounds);
    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
  	map.setMapTypeId('map_style');

	//get json file
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "wleaders.json", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			//readData(xhr.responseText);
			readData(JSON.parse(xhr.responseText));
		}				
	}
	xhr.send();

}

//Check if geolocation is supported by browser
//If yes, call success function
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(success);
} 
else { alert("Location not supported");}