// Create a map object. 
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(link).then(createMapAndMarkers)


// Create the createMarkers function.
function createMapAndMarkers(response){
  // Pull the "features" property from response data.
  let earthquakes = response.features;
  // Initialize an array to hold the earthquake markers.
  let earthquakeMarkers = [];
  console.log(earthquakes.length)

  let maxDepth = 0;
  let maxMag = 0; 
  let minDepth = 0;


  // Find the max and min depths and the max magnitude for use in the sizing of markers
  for (let i = 0; i < earthquakes.length; i++) {
    if (earthquakes[i].geometry.coordinates[2] > maxDepth) {
      maxDepth = earthquakes[i].geometry.coordinates[2];
    }
    if (earthquakes[i].geometry.coordinates[2] < minDepth) {
      minDepth = earthquakes[i].geometry.coordinates[2];
    }  
    if (earthquakes[i].properties.mag > maxMag) {
     maxMag = earthquakes[i].properties.mag;
    }  
  }
  console.log("Max depth", maxDepth)
  console.log("Min depth",minDepth)
  console.log("Max Mag",maxMag)


  let myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  

  // Define colours for the legend and the depths 
  colours = ["green","greenyellow","yellow","orange","orangered","red"];
  
   // Loop through the earthquakes array.
  for (let i = 0; i < earthquakes.length; i++) {

    let popUpString = [];

    // The co-ordinates are the wrong way around, change them around
    coords = [earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]];

    let depth = earthquakes[i].geometry.coordinates[2];

    // define the string which will go in the pop up
    popUpString = [`${earthquakes[i].id}<br> Magnitude: ${earthquakes[i].properties.mag}<br> Place: ${earthquakes[i].properties.place}<br> Depth: ${depth}`];

    // define the colour of the marker depending on the depth
    if (depth < 10){
      colour = colours[0]
    }  
    else if (depth >= 10 & depth <30){
      colour = colours[1]
    } 
    else if (depth >= 30 & depth <50){
      colour = colours[2]
    } 
    else if (depth >= 50 & depth <70){
      colour = colours[3]
    } 
    else if (depth >= 70 & depth <90){
      colour = colours[4]
    } 
    else {
      colour = colours[5]
    }

    // bind the circle marker with the pop up message
    L.circle(coords, {
      color: colour,
      fillOpacity: 1,
      radius: markerSize(earthquakes[i].properties.mag, maxMag)                 
    }).bindPopup(`<h1>${popUpString}</h1>`).addTo(myMap); 
    
  }  

  // Add legend
  // Define the legend labels
  let legendLabels = ["-10-10","10-30","30-50","50-70","70-90","90+"];
 
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
  };
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML +=
        `<i style></i> Depth of Earthquake <br>`;

    // Loop through colors and labels 
    for (var i = 0; i < colours.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colours[i] + '"></i> ' + legendLabels[i] + '<br>';
    }
   return div;
  };

  legend.addTo(myMap);

}

// function to give size of marker based on the maximum value
function markerSize(value,mag){
    return (100000 * value) / mag;
}





