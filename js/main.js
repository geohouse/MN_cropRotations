mapboxgl.accessToken='pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg';

const stateToCountyZoomThresh = 7;
const countyToTRZoomThresh = 9;
const TRtoSectionZoomThresh = 11;
const maxZoomLevel = 22;


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

// Wait until map has finished loading
map.on('load', () => {

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

    // For image styling, 
    map.addSource('imageTests', {
        type: 'vector',
        url: 'mapbox://geohouse.0yc9mwo8'
    });
    
    console.log(imageTests.properties);

    map.addLayer({
        'id': 'testImagePoints',
        'source':'imageTests',
        'source-layer': 'mapBox_pointImageTest-cht3ww',
        'minzoom': stateToCountyZoomThresh,
        'maxzoom': countyToTRZoomThresh,
        'type': 'circle',
        'paint':{
            'circle-radius': 10,
            'circle-color': '#ff0'
        }
    });


});


