var map = L.map("map").setView([46.535, -93.934], 6);

const stateToCountyZoomThresh = 7;
const countyToTRZoomThresh = 9;
const TRtoSectionZoomThresh = 11;
const maxZoomLevel = 22;

let jsonURL =
  "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/mapBox_pointImageTest.geojson";

// Layers are rendered in the same order they are defined; layers near the top of the file are rendered first (i.e. under)
// layers at the bottom of the file

currentBackgroundLayer = L.tileLayer(
  "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 16,
    attribution:
      'Map tiles by <a href="https://usgs.gov">Department of Interior/USGS</a> | <a href="https://github.com/geohouse/blockIslandGlassFloats">This site\'s source code</a>',
  }
);

currentBackgroundLayer.addTo(map);

function renderLayer(jsonData) {
  const renderedLayer = L.geoJson(jsonData, {
    pointToLayer: function (geoJsonPoint, latlng) {
      //console.log("The point is:");
      //console.log(geoJsonPoint);

      // This is the url coded for each feature in the geojson file.
      const pathToIcon = geoJsonPoint.properties.imgUrl;
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
        opacity: 0,
        // Size [x,y] in pixels
        //iconSize: iconSizeVar,
        // Location in the icon that is the specified geographic location that it's
        // marking (i.e. the 'tip' of the icon on the map). This is in pixels and
        // is relative to the top left corner of the icon [x,y]
        //iconAnchor: iconAnchorVar
        //popupAnchor:
      });
      return L.marker(latlng, { icon: mapIcon });
    },
    onEachFeature: function (feature, layer) {
      let countyName = feature.properties.COUN_LC;
      let lat = feature.geometry.coordinates[1];
      let lng = feature.geometry.coordinates[0];
      L.marker(
        [lat, lng],
        L.icon({ iconUrl: feature.properties.imgUrl })
      ).bindPopup("County Name: " + "<b>" + countyName);
    },
  });
  return renderedLayer;
}

let countyPointLayer;

function plotPoints(urlForData) {
  $.getJSON(urlForData, function (jsonData) {
    // returns JSON as an object
    console.log(typeof jsonData);

    console.log(jsonData.length);

    //for (i = 0; i < jsonData.length; i = i+1){
    //    console.log(jsonData[i].properties);
    // properties: year, numFound, floatType, locationName
    //}
    countyPointLayer = renderLayer(jsonData);

    countyPointLayer.addTo(map);
  });
}

plotPoints(jsonURL);
let zoomLevel = 0;
// const countyBoundaryOptions = {
//     interactive: true,
//     vectorTileLayerStyles: {
//         MN_countyBoundaries_CRS4326: function(properties, zoom){
//             const weight = 1;
//             console.log(zoom);
//             console.log(properties);
//             zoomLevel = zoom;
//             if (zoom >= 15 || zoom <= 5){

//                 return ({
//                     fillOpacity: 0,
//                     weight: 0,
//                 })
//             } else {
//                 return ({
//                     fillOpacity: 1,
//                     fillColor: '#ff0000',
//                     weight: weight,
//                 })
//             };
//         }
//     }
// };

// const countyBoundaryOptions = {
//         MN_countyBoundaries_CRS4326: {
//             weight: 3,
//             color: "#ff0",
//             opacity: 0
//         }
// };

const countyMinZoom = 7;
const countyMaxZoom = 9;
const trMinZoom = 9;
const trMaxZoom = 11;
const sectionMinZoom = 11;
const sectionMaxZoom = 22;

let countyName = "";

let countyCentroidFeatGroup = new L.featureGroup();
// Get the layer names from the Tilesets page in Mapbox (exactly as they )
const vectorTileStylingOptions = {
  MN_stateBoundary_CRS4326: {
    //console.log(properties);
    //console.log(zoom);
    weight: 3,
    color: "#f0f",
    opacity: 1,
  },
  MN_countyBoundaries_CRS4326: function (properties, zoom) {
    console.log(properties);
    console.log(zoom);
    if (zoom >= countyMaxZoom || zoom <= countyMinZoom) {
      return {
        // makes disappear at zoom levels outside the needed range
        opacity: 0,
      };
    } else {
      return {
        weight: 3,
        color: "#ff0",
        opacity: 1,
      };
    }
  },
  "MN_countyCentroids_CRS4326_v3-b3uydv": function (properties, zoom) {
    console.log("props");
    console.log(properties);
    console.log("zoom");
    console.log(zoom);
    console.log(properties.COUN_LC);
    countyName = properties.COUN_LC;
    let countyFIPS = properties.FIPS_COUN;

    console.log(properties.lat);
    console.log(properties.lng);

    //countyCentroidsLayer.setFeatureStyle(countyFIPS, {icon: new L.icon({iconUrl: properties.imgUrl})});
    //countyCentroidsLayer.setFeatureStyle(countyFIPS, {weight:5, fillColor: "ff0"})//function(inputs){
    // console.log("testing");
    //console.log(inputs);
    //return({fill:true, weight:5, fillColor: "ff0"})
    if (zoom >= countyMaxZoom || zoom <= countyMinZoom) {
      return {
        opacity: 0,
      };
    } else {
      return {
        //L.marker([properties.lat, properties.lng], icon)
        opacity: 1,
        icon: new L.Icon((iconUrl = properties.imgUrl)),
        fill: true,
        weight: 3,
        fillColor: "#f0f",
        //color: "#f0f",
        //opacity: 1
      };
    }
  },
  "MN_townshipRangeBoundaries_CR-165sgr": function (properties, zoom) {
    if (zoom >= trMaxZoom || zoom <= trMinZoom) {
      return {
        // makes disappear at zoom levels outside the needed range
        opacity: 0,
      };
    } else {
      return {
        weight: 2,
        color: "#0ff",
        opacity: 1,
      };
    }
  },
  "MN_townshipRangeCentroids_CRS-cmfe41": function (properties, zoom) {
    if (zoom >= trMaxZoom || zoom <= trMinZoom) {
      return {
        opacity: 0,
      };
    } else {
      return {
        fill: true,
        weight: 2,
        fillColor: "#f6f",
        color: "#f6f",
        opacity: 1,
      };
    }
  },
  "MN_sectionBoundaries_CRS4326-5yduoq": function (properties, zoom) {
    if (zoom >= sectionMaxZoom || zoom <= sectionMinZoom) {
      return {
        // makes disappear at zoom levels outside the needed range
        opacity: 0,
      };
    } else {
      return {
        weight: 1,
        color: "#f80",
        opacity: 1,
      };
    }
  },
  "MN_sectionCentroids_CRS4326-arv0q8": function (properties, zoom) {
    if (zoom >= sectionMaxZoom || zoom <= sectionMinZoom) {
      return {
        opacity: 0,
      };
    } else {
      return {
        fill: true,
        weight: 1,
        color: "#6ff",
        fillColor: "#6ff",
        opacity: 1,
      };
    }
  },
};

// let sectionCentroidsLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/geohouse.1ve57zd7/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
//     token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
//     vectorTileLayerStyles: vectorTileStylingOptions,
// }).addTo(map);

// let sectionBoundaryLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/geohouse.actmjjf3/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
//     token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
//     vectorTileLayerStyles: vectorTileStylingOptions,
// }).addTo(map);

// let trCentroidsLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/geohouse.ashxwcy1/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
//     token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
//     vectorTileLayerStyles: vectorTileStylingOptions,
// }).addTo(map);

// let trBoundaryLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/geohouse.4rzngdch/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
//     token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
//     vectorTileLayerStyles: vectorTileStylingOptions,
// }).addTo(map);

let countyCentroidsLayer = L.vectorGrid
  .protobuf(
    "https://api.mapbox.com/v4/geohouse.7kk4fene/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
    {
      token:
        "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
      vectorTileLayerStyles: vectorTileStylingOptions,
      interactive: true,
      getFeatureId: function (element) {
        // Make the FIPS_COUN field (unique) the feature id for each of the county centroids
        return element.properties.FIPS_COUN;
      },
    }
  )
  .addTo(map);

console.log(countyCentroidsLayer);

// let countyBoundaryLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/geohouse.cl34ri1a70cpp21rx3s1lsnk8-3702a/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
//     token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
//     vectorTileLayerStyles: vectorTileStylingOptions,
// }).addTo(map);

// let stateBoundaryLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/geohouse.cl34p6beh1nx120s2y59y1ady-6nfmo/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
//     token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
//     vectorTileLayerStyles: vectorTileStylingOptions,
// }).addTo(map);

// state outline
//geohouse.cl34p6beh1nx120s2y59y1ady-6nfmo

// tr boundaries
//geohouse.4rzngdch

// tr centroids
//geohouse.ashxwcy1

// section bounds
//geohouse.actmjjf3

// section centers
//geohouse.1ve57zd7

/*
let countyBoundaryLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/geohouse.cl34ri1a70cpp21rx3s1lsnk8-3702a/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
    token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
    vectorTileLayerStyles: countyBoundaryOptions,
}).on('click', function(e) {console.log(e);
}).addTo(map);
*/

// var vectorTileOptions = {
//     vectorTileLayerStyles: {
//         // A plain set of L.Path options.
//         landuse: {
//             weight: 0,
//             fillColor: '#9bc2c4',
//             fillOpacity: 1,
//             fill: true
//         },
//         // A function for styling features dynamically, depending on their
//         // properties and the map's zoom level
//         admin: function(properties, zoom) {
//             var level = properties.admin_level;
//             var weight = 1;
//             if (level == 2) {weight = 4;}
//             return {
//                 weight: weight,
//                 color: '#cf52d3',
//                 dashArray: '2, 6',
//                 fillOpacity: 0
//             }
//         },
//         // A function for styling features dynamically, depending on their
//         // properties, the map's zoom level, and the layer's geometry
//         // dimension (point, line, polygon)
//         water: function(properties, zoom, geometryDimension) {
// 	    if (geometryDimension === 1) {   // point
// 	        return ({
//                     radius: 5,
//                     color: '#cf52d3',
//                 });
// 	    }

// 	    if (geometryDimension === 2) {   // line
//                  return ({
//                     weight: 1,
//                     color: '#cf52d3',
//                     dashArray: '2, 6',
//                     fillOpacity: 0
//                 });
// 	    }

// 	    if (geometryDimension === 3) {   // polygon
// 	         return ({
//                     weight: 1,
//                     fillColor: '#9bc2c4',
//                     fillOpacity: 1,
//                     fill: true
//                 });
// 	    }
//         },
//         // An 'icon' option means that a L.Icon will be used
//         place: {
//             icon: new L.Icon.Default()
//         },
//         road: []
//     }
// };

// let vectorTest = {
//     water: {
//       fill: true,
//       weight: 1,
//       fillColor: "#06cccc",
//       color: "#06cccc",
//       fillOpacity: 0.2,
//       opacity: 0.4
//     },
//     admin: {
//       weight: 1,
//       fillColor: "#f00",
//       color: "#f00",
//       fillOpacity: 0.2,
//       opacity: 0.4
//     }
// }

// let countyBoundaryLayer = L.vectorGrid.protobuf("https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg", {
//     token: "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg",
//     vectorTileLayerStyles: vectorTest,
// }).addTo(map);
