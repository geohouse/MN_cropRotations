mapboxgl.accessToken='pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg';

const stateToCountyZoomThresh = 9;
const countyToTRZoomThresh = 11;
const TRtoSectionZoomThresh = 14;
const maxZoomLevel = 22; // was 22

// Will hold info about the currently displayed interactive graph to be able to show/hide as needed
let currDisplayImageInfo={};

// Will need to implement clustering and zoom levels to show these data (~12Mb)
//let geojsonURL = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/geojson/MN_sectionCentroids_CRS4326_v2.geojson";
// operational, but commented out
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

// This works as POC (when code calling it below is uncommented), but seems like a very hacky way to get 
// unique images onto a map. Now adding all needed images into the map's style, and then matching ids between
// those images and a unique name field in the tileset properties (from the geojson properties).
function plotURLIcons (inputGeojson){
    for (marker of inputGeojson.features){
        console.log("Marker");
        console.log(marker);
        let iconDiv = document.createElement('div');
        const width = 100;
        const height = 100;
        iconDiv.className = 'icon'; 
        // There are spaces in some of the county names, so need to escape those to html for the 
        // images to load correctly.
        let imageURI = marker.properties.imgUrl;
        let imageURI_encoded = encodeURI(imageURI);
        iconDiv.style.backgroundImage = `url(${imageURI_encoded})`;
        //iconDiv.style.backgroundImage = "url('img/cnty/Crow Wing.png')";
        //iconDiv.style.backgroundImage = "url('https://github.com/geohouse/MN_cropRotations/blob/main/img/cnty/Otter%20Tail.png?raw=true')";
        iconDiv.style.width = `${width}px`;
        iconDiv.style.height = `${height}px`;
        console.log(iconDiv);
        new mapboxgl.Marker(iconDiv).setLngLat(marker.geometry.coordinates).addTo(map);
    }
}

// >>> import json
// >>> test = [{'a':"tester"},{'b':"tester2"}]
// >>> json.dumps(test)
// '[{"a": "tester"}, {"b": "tester2"}]'

let stateCentroidJSON_CR = [];
let countyCentroidJSON_CR = [];
let trCentroidJSON_CR = [];
let tr_secCentroidJSON_CR = [];

async function loadJSONImageMap(JSON_url){
    let jsonObject = await fetch(JSON_url).then(response => response.json());
    //console.log(jsonObject);
    stateCentroidJSON_CR = jsonObject;
    return jsonObject;
}

loadJSONImageMap("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/state_CR_images.json");

async function loadJSONImageMap_cnty(JSON_url){
    let jsonObject = await fetch(JSON_url).then(response => response.json());
    //console.log(jsonObject);
    countyCentroidJSON_CR = jsonObject;
    return jsonObject;
}

loadJSONImageMap_cnty("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/cnty_CR_images.json");

// async function loadJSONImageMap_tr(JSON_url){
//     let jsonObject = await fetch(JSON_url).then(response => response.json());
//     //console.log(jsonObject);
//     trCentroidJSON_CR = jsonObject;
//     return jsonObject;
// }

// loadJSONImageMap_tr("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/tr_CR_images.json");

// async function loadJSONImageMap_tr_sec(JSON_url){
//     let jsonObject = await fetch(JSON_url).then(response => response.json());
//     //console.log(jsonObject);
//     tr_secCentroidJSON_CR = jsonObject;
//     return jsonObject;
// }

// loadJSONImageMap_tr_sec("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/tr_sec_CR_images.json");

//console.log(stateCentroidJSON_CR.json());


// Wait until map has finished loading
map.on('load', () => {
    console.log(stateCentroidJSON_CR);
//console.log(stateCentroidJSON_CR);

    // map.addSource('countyCentroids_TEST', {
    //     data: geojsonURL,
    //     type: 'geojson'
    // });
    
    // map.loadImage('https://github.com/geohouse/MN_cropRotations/blob/main/img/test.jpg?raw=true', (error, image) => {
    //     if (error) throw error;
    //     // Add the loaded image to the style's sprite with the ID 'kitten'.
    //     map.addImage('kitten', image);
    //     });
    // console.log("added cat");

    // The URLs MUST be from raw.githubusercontent.com/geohouse/MN_cropRotations/main
    // and end with the image file extension, otherwise mapbox gives CORS error if using the version of the 
    // file from the GitHub webpage -> copy image link (that ends with i.e. .jpg?raw=true)
    const images = [{url:'https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/cnty/Hennepin.png',id:'Hennepin'},{url:'https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/cnty/Otter%20Tail3.png',id:'Otter Tail'},{url:'https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/cnty/Crow%20Wing.png',id:'Crow Wing'}];
    console.log(images);
    const stateTests = [{"url":"https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/state/MN_CRPlot_resized.png","id":"Y"}]
    // Code to add all images to the map's style asynchronously, then to place each image as a marker where
    // it should go based on matching id values (I can define what these should be) between the images and a 
    // property in the tileset (which was a property in the geojson file). Doing it this way also allows
    // image add/remove based on zoom level like all the rest of the properties of the style.
    // This code is from here:
    // https://github.com/mapbox/mapbox-gl-js/issues/4736

    Promise.all(
    //    images.map(img => new Promise((resolve, reject) => {
    //        map.loadImage(img.url, function (error, image) {
    //            if (error) throw error;
    //            map.addImage(img.id, image)
    //            resolve();
    //        })
    //    })),

    // let stateCentroidJSON_CR = [];
    // let countyCentroidJSON_CR = [];
    // let trCentroidJSON_CR = [];
    // let tr_secCentroidJSON_CR = [];

       stateCentroidJSON_CR.map(img => new Promise((resolve, reject) => {
            map.loadImage(img.url, function (error, image) {
                if (error) throw error;
                map.addImage(img.id, image)
                resolve();
            })
       })),

        countyCentroidJSON_CR.map(img => new Promise((resolve, reject) => {
            map.loadImage(img.url, function (error, image) {
                if (error) throw error;
                map.addImage(img.id, image)
                resolve();
            })
        })),

        // trCentroidJSON_CR.map(img => new Promise((resolve, reject) => {
        //     map.loadImage(img.url, function (error, image) {
        //         if (error) throw error;
        //         map.addImage(img.id, image)
        //         resolve();
        //     })
        // })),

        // tr_secCentroidJSON_CR.map(img => new Promise((resolve, reject) => {
        //     map.loadImage(img.url, function (error, image) {
        //         if (error) throw error;
        //         map.addImage(img.id, image)
        //         resolve();
        //     })
        // }))

       


   ).then(console.log("Images Loaded"));

    // $.getJSON(geojsonURL, function(jsonData){
    //    plotURLIcons(jsonData);
    // });

    //console.log("Testing");
    //console.log(geojsonData);


    // Add my custom vector tilesets

    map.addSource('stateCentroid', {
        type: 'vector',
        url: 'mapbox://geohouse.cl54dzjzq42y723o39gtpfd29-9weht'
    });
    map.addLayer({
        'id': 'stateCenter',
        'source':'stateCentroid',
        'source-layer': 'MN_stateCentroid_CRS4326',
        'minzoom': 0,
        'maxzoom': stateToCountyZoomThresh,
        'type':'symbol',
        'layout': {
            // Tell it which field in the geojson to plot should match with the image id in order for the 
            // correct image to be placed in the correct location (by name id); STATE field == Y
            'icon-image': ['get', 'STATE'],
        }
        //'type': 'circle',
        //'paint':{
        //    'circle-radius': 4,
        //    'circle-color': '#0f0'
        //}
    });

    map.addSource('stateBoundaries', {
        type: 'vector',
        url: 'mapbox://geohouse.cl34p6beh1nx120s2y59y1ady-6nfmo'
    });
    map.addLayer({
        'id': 'stateBound',
        'source':'stateBoundaries',
        'source-layer': 'MN_stateBoundary_CRS4326',
        'minzoom': 0,
        'maxzoom': stateToCountyZoomThresh,
        'type': 'line',
        'paint':{
            'line-color': '#fff',
            'line-width': 2
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
        'type':'symbol',
        'layout': {
            // Tell it which field in the geojson to plot should match with the image id in order for the 
            // correct image to be placed in the correct location (by name id)
            'icon-image': ['get', 'COUN_LC'],
            // units relative to default size (1). Must be > 0.
            //'icon-size': 0.2
        }
        //'type': 'circle',
        //'paint':{
        //    'circle-radius': 4,
        //    'circle-color': '#0f0'
        //}
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
        url: 'mapbox://geohouse.2lnt8uoz'
    });
    map.addLayer({
        'id': 'trCenters',
        'source':'townshipRangeCentroids',
        'source-layer': 'MN_townshipRangeCentroids_CRS-3oq9pf',
        'minzoom': countyToTRZoomThresh,
        'maxzoom': TRtoSectionZoomThresh,
        'type':'symbol',
        'layout': {
            // Tell it which field in the geojson to plot should match with the image id in order for the 
            // correct image to be placed in the correct location (by name id)
            'icon-image': ['get', 'TWP_LABEL'],
            // units relative to default size (1). Must be > 0.
            //'icon-size': 0.2
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
        url: 'mapbox://geohouse.3ux2j5tq'
    });
    map.addLayer({
        'id': 'sectionCenters',
        'source':'sectionCentroids',
        'source-layer': 'MN_sectionCentroids_CRS4326-v-45qel9',
        'minzoom': TRtoSectionZoomThresh,
        'maxzoom': maxZoomLevel,
        'type':'symbol',
        'layout': {
            // Tell it which field in the geojson to plot should match with the image id in order for the 
            // correct image to be placed in the correct location (by name id)
            'icon-image': ['get', 'TWP_SEC_LABEL'],
            // units relative to default size (1). Must be > 0.
            //'icon-size': 0.2
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


    map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point);
         // Limit the number of properties we're displaying for
// legibility and performance
        const displayProperties = [
            'type',
            'properties',
            'id',
            'layer',
            'source',
            'sourceLayer'
        ];
     
    const displayFeatures = features.map((feat) => {
    const displayFeat = {};
    displayProperties.forEach((prop) => {
    displayFeat[prop] = feat[prop];
    });
    return displayFeat;
    });
         
        // Write object as string with an indent of two spaces.
        document.getElementById('features').innerHTML = JSON.stringify(
        //displayFeatures,
        // layer.id = 'countyCenters'
        // 'trCenters'
        // 'sectionCenters'

        // Use this to get just the name of the icon image. 
        // features is an array of length 1 that holds an object. Need to index [0] first to access the 
        // object, then can use dot notation to access subsequent layers, except 'icon-image' which 
        // needs bracket notation access because of the hyphen. Example return of name for Otter Tail county: "Otter Tail"
        // For the full state layer, the .name appears as "Y"
        //features[0].layer.layout["icon-image"].name,
        // Correctly returns the layer ID as defined in the code above.
        // 'stateCenter',
        // 'stateBound',
        // 'countyBound',
        // 'countyCenters',
        // 'trBound',
        // 'trCenters',
        // 'sectionBound',
        // 'sectionCenters'
        features[0].layer.id,
        null,
        2
        );
        if(features[0].layer.id === "stateCenter"){
            console.log("fired");
            currDisplayImageInfo={layer:features[0].layer.id,imgType:'CR'};
            const graphTest = document.createElement("img");
            graphTest.src = 'https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/state/MN_CRPlot_resized.png';
            document.getElementById('plotly').appendChild(graphTest);
        }
        }

        );



        // Plotly tests
        // const graphHolder = document.getElementById('plotly');
        // Plotly.newPlot(graphHolder, [{
        //     x: [1,2,3,4,5],
        //     y: [1,2,4,8,16]}],{margin:{t:0}});


});


