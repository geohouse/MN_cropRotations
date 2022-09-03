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
            Math.round(currRow["totalPercPixelsWiArea_cropYearFrom"] * 100) /
            100
          }% of area<br>in ${
            xLookup[Number.parseInt(currRow["plotXAxisFrom"])]
          }`,
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

  function renderPlot() {
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
    if (geographyName === "state") {
      urlLines = urlStem + geographyName + "/MN_forPlotlyLines.csv";
      urlMarkers = urlStem + geographyName + "/MN_forPlotlyMarkers_2.csv";
      stringForTitle = "State-level crop rotation results";
    }
    if (geographyName === "cnty") {
      console.log("in county");
    }

    //Import and plot the data for the lines first so they get plotted below the points
    Plotly.d3.csv(urlLines, function (data) {
      processData_lines(data, stringForTitle);
      console.log("testing lines");
    });

    //Import and plot the markers second
    Plotly.d3.csv(urlMarkers, function (data) {
      processData_markers(data);
      console.log("testing markers");
    });
  }

  renderPlot();
}
