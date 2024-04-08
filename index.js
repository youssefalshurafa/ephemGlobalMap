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

var map = L.map('map').setView([39.00, 44.00], 3);

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png',
    noWrap: false
}).addTo(map)


function getColor(status) {
    switch (status) {
        case 'Piloting':          //Blue
            return '#009dd4';  
        case 'Launched':          //Violet
            return '#d23264';    
        case 'Request':            //yellow
            return '#d4ba5f';    
        default:
            return '#e0e0e0';  
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
//================= create an info panel
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

//=================== Create a legend control
var legend = L.control({ position: 'bottomright' });

// Define legend content
var legend = L.control({ position: 'bottomright' });

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<i style="background:#009dd4"></i> <span style="font-size: 14px;">Piloting Stage</span> <br>';
    div.innerHTML += '<i style="background:#d23264"></i> <span style="font-size: 14px;">Launched Stage</span> <br>';
    div.innerHTML += '<i style="background:#d4ba5f"></i> <span style="font-size: 14px;">Request Stage</span> <br>';
    return div;
};

legend.addTo(map);




