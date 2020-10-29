//Data
var earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(earthquakeurl, function(data) {
    console.log(data)
    createFeatures(data);
});

function createFeatures(earthquakeData) {

    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: circleSize(feature.properties.mag),
            fillOpacity: 0.75,
            color: getColor(feature.properties.mag),
            fillColor: getColor(feature.properties.mag)
        });
    }

    function onEachFeature(feature,layer) {
        layer.bindPopup("<h4>" + "Location:" + feature.properties.place + "</h4><hr><p>" + "Date: " + new Date(feature.properties.time) + "</p><hr><p>" + "Magnitude: " + feature.properties.mag + "</p");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: "pk.eyJ1IjoiZW1zaGV2cyIsImEiOiJja2V6d2dod3cwdDdhMnZwM3liaDJ5bHN1In0.k3SLAZIijw5HaS2w3dfQag"
    });

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: "pk.eyJ1IjoiZW1zaGV2cyIsImEiOiJja2V6d2dod3cwdDdhMnZwM3liaDJ5bHN1In0.k3SLAZIijw5HaS2w3dfQag"
    });

    var baseMaps = {
        "Light": light,
        "Dark" : dark
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [37, -95],
        zoom: 3,
        layers: [light, earthquakes]
      });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'legend'),
        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < labels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(i) + '"></i> ' +
            labels[i] + '<br>';
    }

    return div;
};

legend.addTo(myMap);

};

function getColor(magnitude) {
    // Conditionals for magnitude
    if (magnitude >= 5) {
      return "#8b0000";
    }
    else if (magnitude >= 4) {
      return "#ff5349";
    }
    else if (magnitude >= 3) {
     return "#FF4500";
    }
    else if (magnitude >= 2) {
      return "#FFD700";
    }
    else if (magnitude >= 1) {
      return "#9ACD32";
    }
    else {
      return "#008000";
    }
};

// Define a circleSize function that will give each city a different radius based on its population
function circleSize(magnitude) {
  return magnitude ** 2;
}

