mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wza2RhZXByMGpvNjNibHB6MDNrM3RjbyJ9.HgWFzeB_YwdX9Z_AIFN8vg";

const stateToCountyZoomThresh = 9;
const countyToTRZoomThresh = 11;
const TRtoSectionZoomThresh = 14;
const maxZoomLevel = 22; // was 22

// Will hold info about the currently displayed interactive graph to be able to show/hide as needed
let currDisplayImageInfo = {};

// Will need to implement clustering and zoom levels to show these data (~12Mb)
//let geojsonURL = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/geojson/MN_sectionCentroids_CRS4326_v2.geojson";
// operational, but commented out
let geojsonURL =
  "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/geojson/MN_countyCentroids_CRS4326_v3.geojson";

// Layers are rendered in the same order they are defined; layers near the top of the file are rendered first (i.e. under)
// layers at the bottom of the file

const map = new mapboxgl.Map({
  container: "map", // container ID from the div
  style: "mapbox://styles/mapbox/satellite-v9", // Build the map with the tilesets manually here instead of using a custom style so have
  // control over
  //style: 'mapbox://styles/geohouse/cl3519a0d000414oi9vytp125/draft', // my custom style url from Mapbox studio
  center: [-93.934, 46.535],
  zoom: 6,
});

// This works as POC (when code calling it below is uncommented), but seems like a very hacky way to get
// unique images onto a map. Now adding all needed images into the map's style, and then matching ids between
// those images and a unique name field in the tileset properties (from the geojson properties).
// function plotURLIcons(inputGeojson) {
//   for (marker of inputGeojson.features) {
//     console.log("Marker");
//     console.log(marker);
//     let iconDiv = document.createElement("div");
//     const width = 100;
//     const height = 100;
//     iconDiv.className = "icon";
//     // There are spaces in some of the county names, so need to escape those to html for the
//     // images to load correctly.
//     let imageURI = marker.properties.imgUrl;
//     let imageURI_encoded = encodeURI(imageURI);
//     iconDiv.style.backgroundImage = `url(${imageURI_encoded})`;
//     //iconDiv.style.backgroundImage = "url('img/cnty/Crow Wing.png')";
//     //iconDiv.style.backgroundImage = "url('https://github.com/geohouse/MN_cropRotations/blob/main/img/cnty/Otter%20Tail.png?raw=true')";
//     iconDiv.style.width = `${width}px`;
//     iconDiv.style.height = `${height}px`;
//     console.log(iconDiv);
//     new mapboxgl.Marker(iconDiv)
//       .setLngLat(marker.geometry.coordinates)
//       .addTo(map);
//   }
// }

// // >>> import json
// // >>> test = [{'a':"tester"},{'b':"tester2"}]
// // >>> json.dumps(test)
// // '[{"a": "tester"}, {"b": "tester2"}]'

// let countyCentroidJSON_CR = [];
// let trCentroidJSON_CR = [];
// let tr_secCentroidJSON_CR = [];

// // loadJSONImageMap(
// //   "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/state_CR_images.json"
// // );

// // async function loadJSONImageMap_cnty(JSON_url) {
// //   let jsonObject = await fetch(JSON_url).then((response) => response.json());
// //   //console.log(jsonObject);
// //   countyCentroidJSON_CR = jsonObject;
// //   //return jsonObject;
// // }

// // loadJSONImageMap_cnty(
// //   "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/cnty_CR_images.json"
// // );

// // async function loadJSONImageMap_tr(JSON_url){
// //     let jsonObject = await fetch(JSON_url).then(response => response.json());
// //     //console.log(jsonObject);
// //     trCentroidJSON_CR = jsonObject;
// //     return jsonObject;
// // }

// // loadJSONImageMap_tr("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/tr_CR_images.json");

// // async function loadJSONImageMap_tr_sec(JSON_url){
// //     let jsonObject = await fetch(JSON_url).then(response => response.json());
// //     //console.log(jsonObject);
// //     tr_secCentroidJSON_CR = jsonObject;
// //     return jsonObject;
// // }

// // loadJSONImageMap_tr_sec("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/tr_sec_CR_images.json");

// //console.log(stateCentroidJSON_CR.json());

function addMapImages(url) {
  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.map((img) => {
        map.loadImage(img.url, function (error, image) {
          if (error) throw error;
          console.log({ img });
          map.addImage(img.id, image);
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// //   //    images.map(img => new Promise((resolve, reject) => {
// //   //        map.loadImage(img.url, function (error, image) {
// //   //            if (error) throw error;
// //   //            map.addImage(img.id, image)
// //   //            resolve();
// //   //        })
// //   //    })),

const stateGraphsJsonUrl =
  "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/state_CR_images.json";
const countyGraphsJsonUrl =
  "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/cnty_CR_images.json";
const trGraphsJsonUrl =
  "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/tr_CR_images.json";
const secGraphsJsonUrl =
  "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/json/tr_sec_CR_images.json";

addMapImages(stateGraphsJsonUrl);
//addMapImages(countyGraphsJsonUrl);
//addMapImages(trGraphsJsonUrl);
//addMapImages(secGraphsJsonUrl);

// Plotly section

const d3 = Plotly.d3;

const graphHolder = document.querySelector("#plotly");
// Plotly.newPlot(graphHolder, [{
//     x: [1,2,3,4,5],
//     y: [1,2,4,8,16]}],{margin:{t:0}});

// let xMarker= [[1],[1],[1],[2],[2],[2],[3],[3],[3]];
// let yMarker= [[1],[2],[3],[1],[2],[3],[1],[2],[3]];

let colorMarker = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
];
let sizeMarker = [10, 20, 15, 30, 13, 8, 16, 12, 5];
let opacityMarker = [100, 100, 100, 100, 100, 100, 100, 100, 100];

const xLookup = {
  1: 2008,
  2: 2009,
  3: 2010,
  4: 2011,
  5: 2012,
  6: 2013,
  7: 2014,
  8: 2015,
  9: 2016,
  10: 2017,
  11: 2018,
  12: 2019,
  13: 2020,
  14: 2021,
};
// y lookup keys have to be strings because the y values are floats. This is for the marker lookup
const yLookup = {
  1: "Other",
  1.9: "Dry beans",
  2.8: "Sugar beets",
  3.7: "Spring wheat",
  4.6: "Hay",
  5.5: "Soybeans",
  6.4: "Corn",
};
// The y lookup for lines is more complicated because there are 49 possibilities (7 crops to/from all 7 crops)
const yLookup_lines = {
  1: "Other",
  1.8: "Other",
  2.6: "Other",
  3.4: "Other",
  4.2: "Other",
  5: "Other",
  5.8: "Other",
  1.1: "Dry beans",
  1.9: "Dry beans",
  2.7: "Dry beans",
  3.5: "Dry beans",
  4.3: "Dry beans",
  5.1: "Dry beans",
  5.9: "Dry beans",
  1.2: "Sugar beets",
  2: "Sugar beets",
  2.8: "Sugar beets",
  3.6: "Sugar beets",
  4.4: "Sugar beets",
  5.2: "Sugar beets",
  6: "Sugar beets",
  1.3: "Spring wheat",
  2.1: "Spring wheat",
  2.9: "Spring wheat",
  3.7: "Spring wheat",
  4.5: "Spring wheat",
  5.3: "Spring wheat",
  6.1: "Spring wheat",
  1.4: "Hay",
  2.2: "Hay",
  3: "Hay",
  3.8: "Hay",
  4.6: "Hay",
  5.4: "Hay",
  6.2: "Hay",
  1.5: "Soybeans",
  2.3: "Soybeans",
  3.1: "Soybeans",
  3.9: "Soybeans",
  4.7: "Soybeans",
  5.5: "Soybeans",
  6.3: "Soybeans",
  1.6: "Corn",
  2.4: "Corn",
  3.2: "Corn",
  4: "Corn",
  4.8: "Corn",
  5.6: "Corn",
  6.4: "Corn",
};

function importData(urlStub, fileName) {
  // urlStub is one of:
  //'state'
  //'cnty'
  //'tr_sec'

  console.log("test start");
  let urlStem =
    "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/imgData/";
  let urlLines = "";
  let urlMarkers = "";
  let stringForTitle = "";
  if (urlStub === "state") {
    urlLines = urlStem + urlStub + "/MN_forPlotly_lines.csv";
    urlMarkers = urlStem + urlStub + "/MN_forPlotly_markers.csv";
    stringForTitle = "State-level crop rotation results";
  }
  //Import and plot the data for the lines first so they get plotted below the points
  Plotly.d3.csv(
    "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/imgData/state/MN_forPlotlyLines.csv",
    function (data) {
      processData_lines(data, stringForTitle);
      console.log("testing lines");
    }
  );

  //Import and plot the markers second
  Plotly.d3.csv(
    "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/imgData/state/MN_forPlotlyMarkers_2.csv",
    function (data) {
      processData_markers(data);
      console.log("testing markers");
    }
  );
}

function processData_lines(inputData, titleString) {
  // holds the current data row
  let currRow = {};
  // Calc the current row value from the combination of the chunk number and the offset within each chunk
  let currRowNum = 0;
  // holds all of the individual line outputs ready for plotting
  let lineOutputCombined = [];
  // holds the info for plotting the current line segment (chunk of 3 lines in the input data)
  let currChunkHolder_line = {};
  // keeps the x coords to use for the current chunk (filled iteratively for each of the 3 rows of input data representing
  // the chunk before it's used to build the plotly call for the current chunk's line segment)
  let currChunk_xCoords = [];
  let currChunk_yCoords = [];
  // The color and line size for the current chunk are single values and are read from the first line of the chunk only
  // (should be the same for all input data lines of the same chunk)
  let currChunk_color = "";
  let currChunk_size = 0;
  // These years will be parsed from the xCoords values using the xLookup. year1 is assigned from the
  // first row in the chunk, and year2 is assigned to either the next year or the previous year
  // depending on whether the xCoords value for the second row in the chunk is > or < the first.
  let currChunk_year1 = 0;
  let currChunk_year2 = 0;
  // Once the year1 and year2 are filled, they are re-assigned to year from and year to based on which has the
  // later date
  let currChunk_yearFrom = 0;
  let currChunk_yearTo = 0;

  // For y values, the 1st row in the chunk is the 'core' crop that the line's either going from or to (depending on the direction)
  // and the 3rd row is the 'satellite' crop that the line has arrived from or has gone to (depending on direction)
  let currChunk_coreCrop = "";
  let currChunk_satelliteCrop = "";
  //Once the order is known (from yearFrom/to), then assign the crops to from/to
  let currChunk_fromCrop = "";
  let currChunk_toCrop = "";

  console.log(`The title string is: ${titleString}`);

  let layout = {
    hovermode: "closest",
    title: titleString,
    yaxis: {
      tickmode: "array",
      tickvals: [1, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4],
      ticktext: [
        "Other",
        "Dry beans",
        "Sugar beets",
        "Spring wheat",
        "Hay",
        "Soybeans",
        "Corn",
      ],
    },
    xaxis: {
      tickmode: "array",
      tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      ticktext: [
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
      ],
    },
  };

  //console.log(inputData);
  // The line data is given in 3-row chunks, where every 3 rows represents a new line
  for (let i = 1; i <= inputData.length / 3; i++) {
    for (let chunkOffset = 0; chunkOffset < 3; chunkOffset++) {
      currRowNum = (i - 1) * 3 + chunkOffset;
      //console.log(i);
      //console.log(chunkOffset);
      //console.log(currRowNum);
      currRow = inputData[currRowNum];
      // If this is the first row in the chunk, then get the color and the size to use
      if (chunkOffset === 0) {
        currChunk_color = currRow["colorToUse"];
        // Round to 2 decimals
        currChunk_size = Math.round(currRow["width"] * 100) / 100;
        //console.log(`curr size is: ${currChunk_size}`);

        currChunk_year1 = xLookup[Number.parseInt(currRow["xCoords"])];
        currChunk_coreCrop = yLookup_lines[currRow["yCoords"]];
      }

      currChunk_xCoords.push(currRow["xCoords"]);
      currChunk_yCoords.push(currRow["yCoords"]);

      if (chunkOffset === 2) {
        currChunk_satelliteCrop = yLookup_lines[currRow["yCoords"]];
        // This will only be true if the xCoords for the curr row in the chunk are > xCoords in the first
        // row of the chunk, which means when using floor, they will return the same year from the xLookup.
        // In this case, currChunk_year2 = currChunk_year1 + 1
        if (
          xLookup[Math.floor(Number.parseFloat(currRow["xCoords"]))] ===
          currChunk_year1
        ) {
          currChunk_year2 = currChunk_year1 + 1;
        } else {
          currChunk_year2 = currChunk_year1 - 1;
        }

        if (currChunk_year1 > currChunk_year2) {
          currChunk_yearFrom = currChunk_year2;
          currChunk_yearTo = currChunk_year1;
          currChunk_toCrop = currChunk_coreCrop;
          currChunk_fromCrop = currChunk_satelliteCrop;
        } else {
          currChunk_yearFrom = currChunk_year1;
          currChunk_yearTo = currChunk_year2;
          currChunk_fromCrop = currChunk_coreCrop;
          currChunk_toCrop = currChunk_satelliteCrop;
        }

        currChunkHolder_line = {
          x: currChunk_xCoords,
          y: currChunk_yCoords,
          type: "scatter",
          mode: "lines",
          connectgaps: false,
          showlegend: false,
          line: {
            color: currChunk_color,
            // Makes a ramp of line sizes between 1 (for entries on order of 0.001%) and 5 (for entries of 100%)
            // slope of 4/5 because 4 size diffs over 5 log10 magnitudes.
            width: 1 + (4 / 5) * (Math.log10(currChunk_size) + 3),
          },
          // Can't get the custom tag formatting without the extra info on the hovers working for the lines like it does for the markers. I have no
          // idea why.
          text: `From: ${currChunk_fromCrop} (${currChunk_yearFrom}) <br>To: ${currChunk_toCrop} (${currChunk_yearTo}) <br>Covered<br>${currChunk_size}% of area`,

          //hovertemplate:'%{text}<extra></extra>'
        };
        lineOutputCombined.push(currChunkHolder_line);
        if (i < 6) {
          console.log(currChunkHolder_line);
        }
        currChunkHolder_line = {};
        currChunk_xCoords = [];
        currChunk_yCoords = [];
        currChunk_color = "";
        currChunk_size = 0;
        currChunk_year1 = 0;
        currChunk_year2 = 0;
        currChunk_yearFrom = 0;
        currChunk_yearTo = 0;
        currChunk_coreCrop = "";
        currChunk_satelliteCrop = "";
        currChunk_fromCrop = "";
        currChunk_toCrop = "";
      }
      //If this is the last row in the chunk, then build the plotly info for this block and push it to the
      // holder.
    }
  }

  Plotly.newPlot(graphHolder, lineOutputCombined, layout);
  //Plotly.addTraces(graphHolder,lineOutputCombined);
}

function processData_markers(inputData) {
  console.log("in process markers");
  let currRow = {};
  let markerOutputCombined = [];
  let currHolderFrom = {},
    currHolderTo = {};
  //console.log(inputData);
  //for(let i=0; i< 24; i++){
  for (let i = 0; i < inputData.length; i++) {
    currRow = inputData[i];
    // xMarkFrom.push([Number.parseInt(currRow['plotXAxisFrom'])]);
    // xMarkTo.push([Number.parseInt(currRow['plotXAxisTo'])]);
    // yMarkFrom.push([Number.parseFloat(currRow['plotYAxisFrom'])]);
    // yMarkTo.push([Number.parseFloat(currRow['plotYAxisTo'])]);
    // colorMarkFrom.push(currRow['plottingColorFrom']);
    // colorMarkTo.push(currRow['plottingColorTo']);
    // sizeMarkFrom.push(currRow['totalPercPixelsWiArea_cropYearFrom']);
    // sizeMarkTo.push(currRow['totalPercPixelsWiArea_cropYearTo']);

    currHolderFrom = {
      x: [Number.parseInt(currRow["plotXAxisFrom"])],
      y: [Number.parseFloat(currRow["plotYAxisFrom"])],
      type: "scatter",
      mode: "markers",
      showlegend: false,
      marker: {
        color: currRow["plottingColorFrom"],
        size: currRow["totalPercPixelsWiArea_cropYearFrom"] / 6,
        opacity: 100,
      },
      //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
      // Need to wrap the text string in an array, then can refer to it by name (in '%{}') in the hovertemplate call. This allows removal
      // of the extra coordinates and trace number labels showing up, by using the <extra></extra> tag.
      text: [
        `${yLookup[currRow["plotYAxisFrom"]]} covered<br>${
          Math.round(currRow["totalPercPixelsWiArea_cropYearFrom"] * 100) / 100
        }% of area<br>in ${xLookup[Number.parseInt(currRow["plotXAxisFrom"])]}`,
      ],
      hovertemplate: "%{text}<extra></extra>",
    };

    currHolderTo = {
      x: [Number.parseInt(currRow["plotXAxisTo"])],
      y: [Number.parseFloat(currRow["plotYAxisTo"])],
      type: "scatter",
      mode: "markers",
      showlegend: false,
      marker: {
        color: currRow["plottingColorTo"],
        size: currRow["totalPercPixelsWiArea_cropYearTo"] / 6,
        opacity: 100,
      },
      //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
      // Need to wrap the text string in an array, then can refer to it by name (in '%{}') in the hovertemplate call. This allows removal
      // of the extra coordinates and trace number labels showing up, by using the <extra></extra> tag.
      text: [
        `${yLookup[currRow["plotYAxisTo"]]} covered<br>${
          Math.round(currRow["totalPercPixelsWiArea_cropYearTo"] * 100) / 100
        }% of area<br>in ${xLookup[Number.parseInt(currRow["plotXAxisTo"])]}`,
      ],
      hovertemplate: "%{text}<extra></extra>",
    };

    //console.log(`i is: ${i}`);
    //console.log(currRow['plotYAxisFrom']);

    markerOutputCombined.push(currHolderFrom);
    markerOutputCombined.push(currHolderTo);
  }
  //console.log(markerOutputCombined);
  Plotly.addTraces(graphHolder, markerOutputCombined);
}

//importData("state", "dummyFileName");

// Wait until map has finished loading
map.on("load", () => {
  //console.log(stateCentroidJSON_CR);
  //console.log(stateCentroidJSON_CR);

  // map.loadImage('https://github.com/geohouse/MN_cropRotations/blob/main/img/test.jpg?raw=true', (error, image) => {
  //     if (error) throw error;
  //     // Add the loaded image to the style's sprite with the ID 'kitten'.
  //     map.addImage('kitten', image);
  //     });
  // console.log("added cat");

  // The URLs MUST be from raw.githubusercontent.com/geohouse/MN_cropRotations/main
  // and end with the image file extension, otherwise mapbox gives CORS error if using the version of the
  // file from the GitHub webpage -> copy image link (that ends with i.e. .jpg?raw=true)
  //const images = [{url:'https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/cnty/Hennepin.png',id:'Hennepin'},{url:'https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/cnty/Otter%20Tail3.png',id:'Otter Tail'},{url:'https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/cnty/Crow%20Wing.png',id:'Crow Wing'}];
  //console.log(images);
  //const stateTests = [{"url":"https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/state/MN_CRPlot_resized.png","id":"Y"}]
  // Code to add all images to the map's style asynchronously, then to place each image as a marker where
  // it should go based on matching id values (I can define what these should be) between the images and a
  // property in the tileset (which was a property in the geojson file). Doing it this way also allows
  // image add/remove based on zoom level like all the rest of the properties of the style.
  // This code is from here:
  // https://github.com/mapbox/mapbox-gl-js/issues/4736

  // Promise.all(
  //   //    images.map(img => new Promise((resolve, reject) => {
  //   //        map.loadImage(img.url, function (error, image) {
  //   //            if (error) throw error;
  //   //            map.addImage(img.id, image)
  //   //            resolve();
  //   //        })
  //   //    })),

  //   stateCentroidJSON_CR.then((images) => {
  //     ap(
  //       (img) =>
  //         new Promise((resolve, reject) => {
  //           map.loadImage(img.url, function (error, image) {
  //             if (error) throw error;
  //             map.addImage(img.id, image);
  //             resolve();
  //           });
  //         })
  //     );
  //   }),

  //   countyCentroidJSON_CR.map(
  //     (img) =>
  //       new Promise((resolve, reject) => {
  //         map.loadImage(img.url, function (error, image) {
  //           if (error) throw error;
  //           map.addImage(img.id, image);
  //           resolve();
  //         });
  //       })
  //   ),

  //   trCentroidJSON_CR.map(
  //     (img) =>
  //       new Promise((resolve, reject) => {
  //         map.loadImage(img.url, function (error, image) {
  //           if (error) throw error;
  //           map.addImage(img.id, image);
  //           resolve();
  //         });
  //       })
  //   )

  //   // tr_secCentroidJSON_CR.map(
  //   //   (img) =>
  //   //     new Promise((resolve, reject) => {
  //   //       map.loadImage(img.url, function (error, image) {
  //   //         if (error) throw error;
  //   //         map.addImage(img.id, image);
  //   //         resolve();
  //   //       });
  //   //     })
  //   // )
  // ).then(console.log("Images Loaded"));

  // $.getJSON(geojsonURL, function(jsonData){
  //    plotURLIcons(jsonData);
  // });

  //console.log("Testing");
  //console.log(geojsonData);

  // Add my custom vector tilesets

  map.addSource("stateCentroid", {
    type: "vector",
    url: "mapbox://geohouse.cl54dzjzq42y723o39gtpfd29-9weht",
  });
  map.addLayer({
    id: "stateCenter",
    source: "stateCentroid",
    "source-layer": "MN_stateCentroid_CRS4326",
    minzoom: 0,
    maxzoom: stateToCountyZoomThresh,
    type: "symbol",
    layout: {
      // Tell it which field in the geojson to plot should match with the image id in order for the
      // correct image to be placed in the correct location (by name id); STATE field == Y
      "icon-image": ["get", "STATE"],
    },
    //'type': 'circle',
    //'paint':{
    //    'circle-radius': 4,
    //    'circle-color': '#0f0'
    //}
  });

  map.addSource("stateBoundaries", {
    type: "vector",
    url: "mapbox://geohouse.cl34p6beh1nx120s2y59y1ady-6nfmo",
  });
  map.addLayer({
    id: "stateBound",
    source: "stateBoundaries",
    "source-layer": "MN_stateBoundary_CRS4326",
    minzoom: 0,
    maxzoom: stateToCountyZoomThresh,
    type: "line",
    paint: {
      "line-color": "#fff",
      "line-width": 2,
    },
  });

  map.addSource("countyBoundaries", {
    type: "vector",
    url: "mapbox://geohouse.cl34ri1a70cpp21rx3s1lsnk8-3702a",
  });
  map.addLayer({
    id: "countyBound",
    source: "countyBoundaries",
    "source-layer": "MN_countyBoundaries_CRS4326",
    minzoom: stateToCountyZoomThresh,
    maxzoom: countyToTRZoomThresh,
    type: "line",
    paint: {
      "line-color": "#f00",
      "line-width": 4,
    },
  });

  map.addSource("countyCentroids", {
    type: "vector",
    url: "mapbox://geohouse.cl364uk210mzw20od5lzldwmo-8l9mh",
  });
  map.addLayer({
    id: "countyCenters",
    source: "countyCentroids",
    "source-layer": "MN_countyCentroids_CRS4326",
    minzoom: stateToCountyZoomThresh,
    maxzoom: countyToTRZoomThresh,
    type: "symbol",
    layout: {
      // Tell it which field in the geojson to plot should match with the image id in order for the
      // correct image to be placed in the correct location (by name id)
      "icon-image": ["get", "COUN_LC"],
      // units relative to default size (1). Must be > 0.
      //'icon-size': 0.2
    },
    //'type': 'circle',
    //'paint':{
    //    'circle-radius': 4,
    //    'circle-color': '#0f0'
    //}
  });

  map.addSource("townshipRangeBoundaries", {
    type: "vector",
    url: "mapbox://geohouse.4rzngdch",
  });
  map.addLayer({
    id: "trBound",
    source: "townshipRangeBoundaries",
    "source-layer": "MN_townshipRangeBoundaries_CR-165sgr",
    minzoom: countyToTRZoomThresh,
    maxzoom: TRtoSectionZoomThresh,
    type: "line",
    paint: {
      "line-color": "#00f",
      "line-width": 2,
    },
  });

  map.addSource("townshipRangeCentroids", {
    type: "vector",
    url: "mapbox://geohouse.2lnt8uoz",
  });
  map.addLayer({
    id: "trCenters",
    source: "townshipRangeCentroids",
    "source-layer": "MN_townshipRangeCentroids_CRS-3oq9pf",
    minzoom: countyToTRZoomThresh,
    maxzoom: TRtoSectionZoomThresh,
    type: "symbol",
    layout: {
      // Tell it which field in the geojson to plot should match with the image id in order for the
      // correct image to be placed in the correct location (by name id)
      "icon-image": ["get", "TWP_LABEL"],
      // units relative to default size (1). Must be > 0.
      //'icon-size': 0.2
    },
  });

  map.addSource("sectionBoundaries", {
    type: "vector",
    url: "mapbox://geohouse.actmjjf3",
  });
  map.addLayer({
    id: "sectionBound",
    source: "sectionBoundaries",
    "source-layer": "MN_sectionBoundaries_CRS4326-5yduoq",
    minzoom: TRtoSectionZoomThresh,
    maxzoom: maxZoomLevel,
    type: "line",
    paint: {
      "line-color": "#0ff",
      "line-width": 1,
    },
  });

  map.addSource("sectionCentroids", {
    type: "vector",
    url: "mapbox://geohouse.3ux2j5tq",
  });
  map.addLayer({
    id: "sectionCenters",
    source: "sectionCentroids",
    "source-layer": "MN_sectionCentroids_CRS4326-v-45qel9",
    minzoom: TRtoSectionZoomThresh,
    maxzoom: maxZoomLevel,
    type: "symbol",
    layout: {
      // Tell it which field in the geojson to plot should match with the image id in order for the
      // correct image to be placed in the correct location (by name id)
      "icon-image": ["get", "TWP_SEC_LABEL"],
      // units relative to default size (1). Must be > 0.
      //'icon-size': 0.2
    },
  });

  /* For image styling, load data directly from web-hosted geojson instead of vector tiles
    map.addSource('imageTests', {
        type: 'vector',
        url: 'mapbox://geohouse.0yc9mwo8'
    });
    */
  map.addSource("imageTests", {
    type: "geojson",
    data: "https://github.com/geohouse/MN_cropRotations/blob/main/mapBox_pointImageTest.geojson",
  });

  map.addLayer({
    id: "testImagePoints",
    source: "imageTests",
    minzoom: stateToCountyZoomThresh,
    maxzoom: countyToTRZoomThresh,
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#ff0",
    },
  });

  map.on("click", (e) => {
    const features = map.queryRenderedFeatures(e.point);
    // Limit the number of properties we're displaying for
    // legibility and performance
    const displayProperties = [
      "type",
      "properties",
      "id",
      "layer",
      "source",
      "sourceLayer",
    ];

    const displayFeatures = features.map((feat) => {
      const displayFeat = {};
      displayProperties.forEach((prop) => {
        displayFeat[prop] = feat[prop];
      });
      return displayFeat;
    });

    // Write object as string with an indent of two spaces.
    //document.getElementById("features").innerHTML = JSON.stringify(
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

    //features[0].layer.id,
    //null,
    //2
    //);

    if (features[0].layer.id === "stateCenter") {
      console.log("fired");
      importData("state", "dummyFileName");
      // currDisplayImageInfo = { layer: features[0].layer.id, imgType: "CR" };
      // const graphTest = document.createElement("img");
      // graphTest.src =
      //   "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/state/MN_CRPlot_resized.png";
      // document.getElementById("plotly").appendChild(graphTest);
    }
  });

  // Plotly tests
  // const graphHolder = document.getElementById('plotly');
  // Plotly.newPlot(graphHolder, [{
  //     x: [1,2,3,4,5],
  //     y: [1,2,4,8,16]}],{margin:{t:0}});
});
