export default function makeInteractivePlot(geographyName) {
  // Plotly section

  const d3 = Plotly.d3;

  const graphHolder = document.querySelector("#plotly");

  // Plotly.newPlot(graphHolder, [{
  //     x: [1,2,3,4,5],
  //     y: [1,2,4,8,16]}],{margin:{t:0}});

  // let xMarker= [[1],[1],[1],[2],[2],[2],[3],[3],[3]];
  // let yMarker= [[1],[2],[3],[1],[2],[3],[1],[2],[3]];

  function initializeMarkerColorOpacityArrays() {
    const colorMarker = [
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
    const opacityMarker = [100, 100, 100, 100, 100, 100, 100, 100, 100];
    return [colorMarker, opacityMarker];
  }

  function initializeLookupObjects() {
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
    return { xLookup, yLookup, yLookup_lines };
  }

  const [colorMarker, opacityMarker] = initializeMarkerColorOpacityArrays();
  const { xLookup, yLookup, yLookup_lines } = initializeLookupObjects();

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
    // The line data is given in 3-entry chunks, where every 3 entries represents a new line
    for (let i = 1; i <= Object.keys(inputData).length / 3; i++) {
      for (let chunkOffset = 1; chunkOffset <= 3; chunkOffset++) {
        // starts from 1
        let currIndexNum = (i - 1) * 3 + chunkOffset;
        //console.log(i);
        //console.log(chunkOffset);
        //console.log(currRowNum);
        let currEntry = inputData[currIndexNum];
        // If this is the first row in the chunk, then get the color and the size to use
        if (chunkOffset === 1) {
          currChunk_color = currEntry["color"];
          // Round to 2 decimals
          currChunk_size = Math.round(currEntry["perCov"] * 100) / 100;
          //console.log(`curr size is: ${currChunk_size}`);

          currChunk_year1 = xLookup[Number.parseInt(currEntry["x"])];
          currChunk_coreCrop = yLookup_lines[currEntry["y"]];
        }

        currChunk_xCoords.push(currEntry["x"]);
        currChunk_yCoords.push(currEntry["y"]);

        if (chunkOffset === 3) {
          currChunk_satelliteCrop = yLookup_lines[currEntry["y"]];
          // This will only be true if the xCoords for the curr row in the chunk are > xCoords in the first
          // row of the chunk, which means when using floor, they will return the same year from the xLookup.
          // In this case, currChunk_year2 = currChunk_year1 + 1
          if (
            xLookup[Math.floor(Number.parseFloat(currEntry["x"]))] ===
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
            hovertemplate: `From: ${currChunk_fromCrop} (${currChunk_yearFrom}) <br>To: ${currChunk_toCrop} (${currChunk_yearTo}) <br>Covered<br>${currChunk_size}% of area<extra></extra>`,

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

  function processData_markers(inputDataJSON) {
    console.log("in process markers");
    let allMarkerHolder = [];
    let currHolder = {};
    //console.log(inputData);
    //for(let i=0; i< 24; i++){
    for (let indexKey in inputDataJSON) {
      let currEntry = inputDataJSON[indexKey];
      // xMarkFrom.push([Number.parseInt(currRow['plotXAxisFrom'])]);
      // xMarkTo.push([Number.parseInt(currRow['plotXAxisTo'])]);
      // yMarkFrom.push([Number.parseFloat(currRow['plotYAxisFrom'])]);
      // yMarkTo.push([Number.parseFloat(currRow['plotYAxisTo'])]);
      // colorMarkFrom.push(currRow['plottingColorFrom']);
      // colorMarkTo.push(currRow['plottingColorTo']);
      // sizeMarkFrom.push(currRow['totalPercPixelsWiArea_cropYearFrom']);
      // sizeMarkTo.push(currRow['totalPercPixelsWiArea_cropYearTo']);

      currHolder = {
        x: [Number.parseInt(currEntry["x"])],
        y: [Number.parseFloat(currEntry["y"])],
        type: "scatter",
        mode: "markers",
        showlegend: false,
        marker: {
          color: currEntry["color"],
          size: currEntry["percCov"] / 6,
          opacity: 100,
        },
        //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
        // Need to wrap the text string in an array, then can refer to it by name (in '%{}') in the hovertemplate call. This allows removal
        // of the extra coordinates and trace number labels showing up, by using the <extra></extra> tag.
        hovertemplate: [
          `${yLookup[currEntry["y"]]} covered<br>${
            Math.round(currEntry["percCov"] * 100) / 100
          }% of area<br>in ${
            xLookup[Number.parseInt(currEntry["x"])]
          }<extra></extra>`,
        ],
        //hovertemplate: "%{text}<extra></extra>",
      };
      allMarkerHolder.push(currHolder);
    }
    //console.log(markerOutputCombined);
    Plotly.addTraces(graphHolder, allMarkerHolder);
  }

  function renderPlot() {
    // urlStub is one of:
    //'state'
    //'cnty'
    //'tr_sec'

    let urlStem =
      "https://raw.githubusercontent.com/geohouse/MN_cropRotations/JSON-plotting-data/imgData";
    let urlLines = "";
    let urlMarkers = "";
    let stringForTitle = "";
    if (geographyName === "state") {
      urlLines = `${urlStem}/${geographyName}/MN_forPlotlyLines.json`;
      urlMarkers = `${urlStem}/${geographyName}/MN_forPlotlyMarkers.json`;
      stringForTitle = "State-level crop rotation results";
    }
    // for county, geographyName will be like 'cnty/Lake_of_the_Woods'
    // or 'cnty/Lac_Qui_Parle' or 'cnty/Rice' or 'cnty/St_Louis
    if (geographyName.slice(0, 4) === "cnty") {
      console.log("in county");
      // Get just the county name (for expected file name construction)
      // and replace the underscores with spaces (for graph title construction)
      const countyNameForURL = geographyName.slice(5, geographyName.length);
      const countyNameForDisplay = countyNameForURL.replaceAll("_", " ");

      urlLines = `${urlStem}/${geographyName}/${countyNameForURL}_forPlotlyLines.json`;
      urlMarkers = `${urlStem}/${geographyName}/${countyNameForURL}_forPlotlyMarkers.json`;
      stringForTitle = `Historical crop rotations in ${countyNameForDisplay} county`;
    }

    // For township/range
    // geographyName is like "tr_sec/T105_R31W"
    if (geographyName.slice(0, 6) === "tr_sec") {
      console.log("in TR");
      const trNameForURL = geographyName.slice(6, geographyName.length);
      // Matches 1-3 digits immediately following a 'T' - lookbehind assertion
      const townshipRe = /(?<=T)\d{1,3}/;
      const townshipNumAsString = trNameForURL.match(townshipRe);
      //Matches 1-3 digits immediately following a 'R' and immediately followed by
      // either 'W' or 'E' (look ahead assertion)
      const rangeRe = /(?<=R)\d{1,3}(?=W|E)/;
      const rangeNumAsString = trNameForURL.match(rangeRe);

      urlLines = `${urlStem}/${geographyName}/${trNameForURL}_forPlotlyLines.json`;
      urlMarkers = `${urlStem}/${geographyName}/${trNameForURL}_forPlotlyMarkers.json`;
      stringForTitle = `Historical crop rotations for Township ${townshipNumAsString} North, Range ${rangeNumAsString} West`;
    }

    //Import and plot the data for the lines first so they get plotted below the points
    // Plotly.d3.csv(urlLines, function (data) {
    //   processData_lines(data, stringForTitle);
    //   console.log("testing lines");
    // });

    // Tests for JSON data input to plotting
    console.log("json tests");

    fetch(urlLines)
      .then((response) => {
        if (!response.ok) {
          let error = new Error(`HTTP status code error: ${response.status}`);
          error.response = response;
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then((data) => {
        console.log("rendering lines");
        console.log(data);
        processData_lines(data);
      })
      .catch((error) => console.error(error));

    fetch(urlMarkers)
      .then((response) => {
        if (!response.ok) {
          let error = new Error(`HTTP status code error: ${response.status}`);
          error.response = response;
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then((data) => {
        console.log("rendering markers");
        console.log(data);
        processData_markers(data);
      })
      .catch((error) => console.error(error));
  }

  renderPlot();
}
