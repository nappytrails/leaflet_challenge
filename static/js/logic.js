// Getting the GeoJSON data
// Create the map object with options.
    var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5,
    });

// Create the tile layer that will be the background of the map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    console.log(data);

    let features = data["features"];
    console.log(features);

    // Function to return color of markers
    function chooseColor(quakeDepth) {
        if (quakeDepth <= 10) return "aquamarine";
        else if (quakeDepth < 30) return "chartreuse";
        else if (quakeDepth < 50) return "gold";
        else if (quakeDepth < 70) return "orange";
        else if (quakeDepth < 90) return "tomato";
        else return "orangered";
    }

    let quakeMarkers = []

    // Loop through the features array.
    for (var i = 0; i < features.length; i++) {
        let feature = features[i];
        let lon = feature["geometry"]["coordinates"][0];
        let lat = feature["geometry"]["coordinates"][1];
        let depth = feature["geometry"]["coordinates"][2];
        let id = feature["id"];
        let mag = feature["properties"]["mag"];

        // console.log(mag);

        // For each earthquake, create a marker, and bind a popup with quake info
        var quakeMarker = L.circle([lat,lon], {
            color: "black",
            // weight: 15,
            stroke: true,
            weight: .5,
            fillColor: chooseColor(depth),
            fillOpacity: 0.5,
            radius: mag * 5000
        }).bindPopup(`id: ${id}<br>latitude: ${lat}<br>longitude: ${lon}<br>magnitude: ${mag}<br>depth: ${depth}`);

        quakeMarkers.push(quakeMarker);
    }    

    var earthquakes = L.layerGroup(quakeMarkers)
    earthquakes.addTo(myMap)

    /*Legend specific*/
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<b>Quake Depth</b><br>";
        div.innerHTML += '<i style="background: aquamarine"></i><10<br>';
        div.innerHTML += '<i style="background: chartreuse"></i>10-30<br>';
        div.innerHTML += '<i style="background: gold"></i>30-50<br>';
        div.innerHTML += '<i style="background: orange"></i>50-70<br>';
        div.innerHTML += '<i style="background: tomato"></i>70-90<br>';
        div.innerHTML += '<i style="background: orangered"></i><90<br>';
        return div;
    };

    legend.addTo(myMap);


    // // Create the map object with options.
    // var myMap = L.map("map", {
    // center: [39.8283, -98.5795],
    // zoom: 3,
    // layers: [streetmap, earthquakes]
    // });

    // streetmap.addTo(myMap)
    // earthquakes.addTo(myMap)




})