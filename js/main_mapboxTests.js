mapboxgl.accessToken='pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg';

const stateToCountyZoomThresh = 7;
const countyToTRZoomThresh = 9;
const TRtoSectionZoomThresh = 11;
const maxZoomLevel = 12; // was 22



let geojsonURL = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/geojson/MN_countyCentroids_CRS4326_v3.geojson";
//let jsonURL = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/mapBox_pointImageTest.geojson";

// Layers are rendered in the same order they are defined; layers near the top of the file are rendered first (i.e. under)
// layers at the bottom of the file

// currentBackgroundLayer = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',{
//     maxZoom:16,
//     attribution: 'Map tiles by <a href="https://usgs.gov">Department of Interior/USGS</a> | <a href="https://github.com/geohouse/blockIslandGlassFloats">This site\'s source code</a>',
// });

// currentBackgroundLayer.addTo(map);

// function renderLayer(jsonData){
//     const renderedLayer = L.geoJson(jsonData, {
//             pointToLayer: function(geoJsonPoint, latlng) {
//             //console.log("The point is:");
//             //console.log(geoJsonPoint);
            
//             // This is the url coded for each feature in the geojson file.
//             const pathToIcon = geoJsonPoint.properties.imgUrl;
//             console.log(pathToIcon);
//             console.log(latlng);
//             //const iconSizeVar = [100,100];
//             // Location in the icon that is the specified geographic location that it's 
//             // marking (i.e. the 'tip' of the icon on the map). This is in pixels and 
//             // is relative to the top left corner of the icon [x,y]
//             //const iconAnchorVar = [50,50];

//             let mapIcon = L.icon({
//                 //"css/images/marker-icon.png"
                
//                 iconUrl: pathToIcon,
//                 opacity: 0,
//                 // Size [x,y] in pixels
//                 //iconSize: iconSizeVar,
//                 // Location in the icon that is the specified geographic location that it's 
//                 // marking (i.e. the 'tip' of the icon on the map). This is in pixels and 
//                 // is relative to the top left corner of the icon [x,y]
//                 //iconAnchor: iconAnchorVar
//                 //popupAnchor: 
//             });
//             return L.marker(latlng, {icon: mapIcon});
//         }, onEachFeature: function(feature, layer){
//             let countyName = feature.properties.COUN_LC;
//             let lat = feature.geometry.coordinates[1];
//             let lng = feature.geometry.coordinates[0];
//             L.marker([lat,lng], L.icon({iconUrl: feature.properties.imgUrl})).bindPopup('County Name: ' + '<b>' + countyName);
//         }
//     });
//     return renderedLayer;
// }

// let countyPointLayer;

// function plotPoints(urlForData){ 
// $.getJSON(urlForData, function(jsonData){
//     // returns JSON as an object
//     console.log(typeof(jsonData));

//     console.log(jsonData.length);
    
//     //for (i = 0; i < jsonData.length; i = i+1){
//     //    console.log(jsonData[i].properties);
//         // properties: year, numFound, floatType, locationName
//     //}
//     countyPointLayer = renderLayer(jsonData);
    
//     countyPointLayer.addTo(map);
//     }
// )
// }

// plotPoints(jsonURL);







// Layers are rendered in the same order they are defined; layers near the top of the file are rendered first (i.e. under)
// layers at the bottom of the file

const map = new mapboxgl.Map({
    container: 'map', // container ID from the div
    style: 'mapbox://styles/mapbox/satellite-v9', // Build the map with the tilesets manually here instead of using a custom style so have
    // control over 
    //style: 'mapbox://styles/geohouse/cl3519a0d000414oi9vytp125/draft', // my custom style url from Mapbox studio
    center: [-93.934, 46.535],
    zoom: 6
});

function plotURLIcons (inputGeojson){
    for (marker of inputGeojson.features){
        console.log("Marker");
        console.log(marker);
        let iconDiv = document.createElement('div');
        const width = 40;
        const height = 40;
        iconDiv.className = 'icon'; 
        iconDiv.style.backgroundImage = 'url(https://github.com/geohouse/MN_cropRotations/blob/main/img/cnty/Hennepin.png)';
        //iconDiv.style.width = `${width}px`;
        //iconDiv.style.height = `${height}px`;
        console.log(iconDiv);
        new mapboxgl.Marker(iconDiv).setLngLat(marker.geometry.coordinates).addTo(map);
    }
}

// Wait until map has finished loading
map.on('load', () => {

    map.addSource('countyCentroids_TEST', {
        data: geojsonURL,
        type: 'geojson'
    });
    let geojsonData;
    $.getJSON(geojsonURL, function(jsonData){
        plotURLIcons(jsonData);
    });

    console.log("Testing");
    console.log(geojsonData);


    // Add my custom vector tilesets

    map.addSource('stateBoundaries', {
        type: 'vector',
        url: 'mapbox://geohouse.cl34p6beh1nx120s2y59y1ady-6nfmo'
    });
    map.addLayer({
        'id': 'stateBound',
        'source':'stateBoundaries',
        'source-layer': 'MN_stateBoundary_CRS4326',
        'minzoom': 0,
        'maxzoom': maxZoomLevel,
        'type': 'line',
        'paint':{
            'line-color': '#fff',
            'line-width': 15
        }
    });

    map.addSource('countyBoundaries', {
        type: 'vector',
        url: 'mapbox://geohouse.cl34ri1a70cpp21rx3s1lsnk8-3702a'
    });
    map.addLayer({
        'id': 'countyBound',
        'source':'countyBoundaries',
        'source-layer': 'MN_countyBoundaries_CRS4326',
        'minzoom': stateToCountyZoomThresh,
        'maxzoom': countyToTRZoomThresh,
        'type': 'line',
        'paint':{
            'line-color': '#f00',
            'line-width': 4
        }
    });

    map.addSource('countyCentroids', {
        type: 'vector',
        url: 'mapbox://geohouse.cl364uk210mzw20od5lzldwmo-8l9mh'
    });
    map.addLayer({
        'id': 'countyCenters',
        'source':'countyCentroids',
        'source-layer': 'MN_countyCentroids_CRS4326',
        'minzoom': stateToCountyZoomThresh,
        'maxzoom': countyToTRZoomThresh,
        'type': 'circle',
        'paint':{
            'circle-radius': 4,
            'circle-color': '#0f0'
        }
    });


    map.addSource('townshipRangeBoundaries', {
        type: 'vector',
        url: 'mapbox://geohouse.4rzngdch'
    });
    map.addLayer({
        'id': 'trBound',
        'source':'townshipRangeBoundaries',
        'source-layer': 'MN_townshipRangeBoundaries_CR-165sgr',
        'minzoom': countyToTRZoomThresh,
        'maxzoom': TRtoSectionZoomThresh,
        'type': 'line',
        'paint':{
            'line-color': '#00f',
            'line-width': 2
        }
    });

    map.addSource('townshipRangeCentroids', {
        type: 'vector',
        url: 'mapbox://geohouse.ashxwcy1'
    });
    map.addLayer({
        'id': 'trCenters',
        'source':'townshipRangeCentroids',
        'source-layer': 'MN_townshipRangeCentroids_CRS-cmfe41',
        'minzoom': countyToTRZoomThresh,
        'maxzoom': TRtoSectionZoomThresh,
        'type': 'circle',
        'paint':{
            'circle-radius': 2,
            'circle-color': '#ff0'
        }
    });

    map.addSource('sectionBoundaries', {
        type: 'vector',
        url: 'mapbox://geohouse.actmjjf3'
    });
    map.addLayer({
        'id': 'sectionBound',
        'source':'sectionBoundaries',
        'source-layer': 'MN_sectionBoundaries_CRS4326-5yduoq',
        'minzoom': TRtoSectionZoomThresh,
        'maxzoom': maxZoomLevel,
        'type': 'line',
        'paint':{
            'line-color': '#0ff',
            'line-width': 1
        }
    });

    map.addSource('sectionCentroids', {
        type: 'vector',
        url: 'mapbox://geohouse.1ve57zd7'
    });
    map.addLayer({
        'id': 'sectionCenters',
        'source':'sectionCentroids',
        'source-layer': 'MN_sectionCentroids_CRS4326-arv0q8',
        'minzoom': TRtoSectionZoomThresh,
        'maxzoom': maxZoomLevel,
        'type': 'circle',
        'paint':{
            'circle-radius': 1,
            'circle-color': '#f0f'
        }
    });

    /* For image styling, load data directly from web-hosted geojson instead of vector tiles
    map.addSource('imageTests', {
        type: 'vector',
        url: 'mapbox://geohouse.0yc9mwo8'
    });
    */
    map.addSource('imageTests', {
        type: 'geojson',
        data: 'https://github.com/geohouse/MN_cropRotations/blob/main/mapBox_pointImageTest.geojson'
    });

    
    //const imageTests = map.getSource('imageTests');
    //console.log(imageTests);
    /*
    // Add the custom markers to the map
    for (const marker of imageTests.features) {
        // Create a div element for each marker
        const divElement = document.createElement('div');
        const width = 100;
        const height = 100;
        divElement.className = 'marker';
        // Read the image url from the properties in the geojson file
        divElement.style.backgroundImage = marker.properties.imagePath;
        divElement.style.width = `${width}px`;
        divElement.style.height = `${height}px`;

        new mapboxgl.Marker(divElement).setLngLat(marker.geometry.coordinates).addTo(map);
    }
*/
    map.addLayer({
        'id': 'testImagePoints',
        'source':'imageTests',
        'minzoom': stateToCountyZoomThresh,
        'maxzoom': countyToTRZoomThresh,
        'type': 'circle',
        'paint':{
            'circle-radius': 10,
            'circle-color': '#ff0'
        }
    });


});


