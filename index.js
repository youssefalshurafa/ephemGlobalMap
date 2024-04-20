import { statusMap } from './statusMap.js';
function addStatusToGeoJSON(geojson) {
 
    // Loop through each feature in the GeoJSON
    geojson.features.forEach(feature => {
        // Get the ADM0_NAME of the feature
        const countryName = feature.properties.ADM0_NAME;
        // Look up the status for the country in the statusMap
        const status = statusMap[countryName];
        // Add the status property to the feature
        feature.properties.STATUS = status || 'Undefined';
    });

    return geojson;
}


var globalMapWithStatus = addStatusToGeoJSON(globalMap);

var map = L.map('map').setView([0, 17.2812], 4);

var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
})

var CartoDB_DarkMatterNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);

var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
var baseLayers = {
    "Smooth Dark": CartoDB_DarkMatter,
    " No Labels": CartoDB_DarkMatterNoLabels,
    "Light": CartoDB_Positron,
    "Light no Labels": CartoDB_PositronNoLabels
};

var overlays = {};  // This can be populated with any additional layers you want to toggle

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

function getColor(status) {
    switch (status) {
        case 'Launched':          
            return 'red'; 
        case 'Piloting':         
            return '#c92f2f';  
        case 'Request':           
            return '#db7070';    
        default:
            return '#787777';  
    }
}


function style(feature) {
    return {
        fillColor: getColor(feature.properties.STATUS),  
        weight: 2,
        opacity: 1,
        color: 'gray',
        dashArray: '3',
        fillOpacity: 0.4
    };
}
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


var geojson;

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(globalMapWithStatus, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
//================= create an info panel ===============//
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Country Info</h4>' +  (props ?
        '<b>' + props.ADM0_NAME + '</b><br />' +
        (props.STATUS ? 'Status: ' + props.STATUS : 'Status: Undefined') // Add status here
        : 'Hover over a country');
};


info.addTo(map);

//=================== Create a legend control ===================//
var legend = L.control({ position: 'bottomright' });

// Define legend content
var legend = L.control({ position: 'bottomright' });

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<i style="background:#e37e7f"></i> <span style="font-size: 14px;">Launched Stage</span> <br>';
    div.innerHTML += '<i style="background:#fb9796"></i> <span style="font-size: 14px;">Piloting Stage</span> <br>';
    div.innerHTML += '<i style="background:#cfa6a9"></i> <span style="font-size: 14px;">Request Stage</span> <br>';
    return div;
};

legend.addTo(map);

// Create a new control for the refresh button
var resetButton = L.DomUtil.create('button', 'reset-button'); 
resetButton.innerHTML = 'Return';
resetButton.addEventListener('click',() => returnToDefaultView()); 

var resetControl = L.control({ position: 'topleft' }); 

resetControl.onAdd = function (map) {
return resetButton;
};
resetControl.addTo(map);



function returnToDefaultView () {
    console.log('reset');
    map.setView([0, 17.2812], 4);
}