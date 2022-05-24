var map = L.map('map').setView([46.535,-93.934],6);

const stateToCountyZoomThresh = 7;
const countyToTRZoomThresh = 9;
const TRtoSectionZoomThresh = 11;
const maxZoomLevel = 22;

let jsonURL = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/mapBox_pointImageTest.geojson";

// Layers are rendered in the same order they are defined; layers near the top of the file are rendered first (i.e. under)
// layers at the bottom of the file

currentBackgroundLayer = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',{
    maxZoom:16,
    attribution: 'Map tiles by <a href="https://usgs.gov">Department of Interior/USGS</a> | <a href="https://github.com/geohouse/blockIslandGlassFloats">This site\'s source code</a>',
});

currentBackgroundLayer.addTo(map);

function renderLayer(jsonData){
    const renderedLayer = L.geoJson(jsonData, {
            pointToLayer: function(geoJsonPoint, latlng) {
            //console.log("The point is:");
            //console.log(geoJsonPoint);
            
            // This is the url coded for each feature in the geojson file.
            const pathToIcon = geoJsonPoint.properties.imagePath;
            console.log(pathToIcon);
            console.log(latlng);
            //const iconSizeVar = [100,100];
            // Location in the icon that is the specified geographic location that it's 
            // marking (i.e. the 'tip' of the icon on the map). This is in pixels and 
            // is relative to the top left corner of the icon [x,y]
            //const iconAnchorVar = [50,50];

            let mapIcon = L.icon({
                //"css/images/marker-icon.png"
                
                iconUrl: pathToIcon,
               
                // Size [x,y] in pixels
                //iconSize: iconSizeVar,
                // Location in the icon that is the specified geographic location that it's 
                // marking (i.e. the 'tip' of the icon on the map). This is in pixels and 
                // is relative to the top left corner of the icon [x,y]
                //iconAnchor: iconAnchorVar
                //popupAnchor: 
            });
            return L.marker(latlng, {icon: mapIcon});
        }, onEachFeature: function(feature, layer){
            let countyName = feature.properties.COUN_LC;
            layer.bindPopup('County Name: ' + '<b>' + countyName);
        }
    });
    return renderedLayer;
}

let countyPointLayer;

function plotPoints(urlForData){ 
$.getJSON(urlForData, function(jsonData){
    // returns JSON as an object
    console.log(typeof(jsonData));

    console.log(jsonData.length);
    
    //for (i = 0; i < jsonData.length; i = i+1){
    //    console.log(jsonData[i].properties);
        // properties: year, numFound, floatType, locationName
    //}
    countyPointLayer = renderLayer(jsonData);
    
    countyPointLayer.addTo(map);
    }
)
}

plotPoints(jsonURL);

