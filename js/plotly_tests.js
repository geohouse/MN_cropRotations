// Plotly tests

const d3 = Plotly.d3;

const graphHolder = document.getElementById('plotly');
        // Plotly.newPlot(graphHolder, [{
        //     x: [1,2,3,4,5],
        //     y: [1,2,4,8,16]}],{margin:{t:0}});

let layout = {};

let xMarker= [[1],[1],[1],[2],[2],[2],[3],[3],[3]];
let yMarker= [[1],[2],[3],[1],[2],[3],[1],[2],[3]];
   
  
let colorMarker = ['#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff'];
let sizeMarker = [10,20,15,30,13,8,16,12,5];
let opacityMarker = [100,100,100,100,100,100,100,100,100];
 
const xLookup = {1:2008,2:2009,3:2010,4:2011,5:2012,6:2013,7:2014,8:2015,9:2016,10:2017,11:2018,12:2019,13:2020,14:2021};
// y lookup keys have to be strings because the y values are floats. This is for the marker lookup
const yLookup = {"1":'Other',"1.9":'Dry beans', "2.8":'Sugar beets', "3.7":'Spring wheat', "4.6":'Hay', "5.5":'Soybeans', "6.4":'Corn'};
// The y lookup for lines is more complicated because there are 49 possibilities (7 crops to/from all 7 crops)
const yLookup_lines = {"1":'Other',"1.8":'Other',"2.6":'Other',"3.4":'Other',"4.2":'Other',"5.0":'Other',"5.8":'Other',
                        "1.1":'Dry beans',"1.9":'Dry beans',"2.7":'Dry beans',"3.5":'Dry beans',"4.3":'Dry beans',"5.1":'Dry beans',"5.9":'Dry beans',
                        "1.2":'Sugar beets',"2.0":'Sugar beets',"2.8":'Sugar beets',"3.6":'Sugar beets',"4.4":'Sugar beets',"5.2":'Sugar beets',"6.0":'Sugar beets',
                        "1.3":'Spring wheat',"2.1":'Spring wheat',"2.9":'Spring wheat',"3.7":'Spring wheat',"4.5":'Spring wheat',"5.3":'Spring wheat',"6.1":'Spring wheat',
                        "1.4":'Hay',"2.2":'Hay',"3.0":'Hay',"3.8":'Hay',"4.6":'Hay',"5.4":'Hay',"6.2":'Hay',
                        "1.5":'Soybeans',"2.3":'Soybeans',"3.1":'Soybeans',"3.9":'Soybeans',"4.7":'Soybeans',"5.5":'Soybeans',"6.3":'Soybeans',
                        "1.6":'Corn',"2.4":'Corn',"3.2":'Corn',"4.0":'Corn',"4.8":'Corn',"5.6":'Corn',"6.4":'Corn',
                    }
// let markers = {
//     x: [1,1,1,2,2,2,3,3,3],
//     y: [1,2,3,1,2,3,1,2,3],
//     mode: 'markers',
//     marker: {
//         color: ['#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff'],
//         size: [10,20,15,30,13,8,16,12,5],
//         opacity: [100,100,100,100,100,100,100,100,100]
//     }
// };

let xLine = [[1,1.2,1.4],
[1,1.2,1.4],
[1,1.2,1.4],
[2,2.2,2.4],
[2,2.2,2.4],
[2,2.2,2.4],
[3,3.2,3.4],
[3,3.2,3.4],
[3,3.2,3.4]];

let yLine = [[1,1.4,1.4],
[2,2.4,2.4],
[3,3.4,3.4],
[1,1.4,1.4],
[2,2.4,2.4],
[3,3.4,3.4],
[1,1.4,1.4],
[2,2.4,2.4],
[3,3.4,3.4]];

let colorLine = ['#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff'];
let sizeLine = [10,20,15,30,13,8,16,12,5];

let dataHolder = [];

for (let i = 0; i < xLine.length; i++){
    console.log(i);
    let lineOutput = {
        x: xLine[i],
        y: yLine[i],
        type: 'scatter',
        mode: 'lines',
        line: {
            color: colorLine[i],
            size: sizeLine[i]
        },
        text: null
    }


    // var result2 = {
    //     x: [xData[i][0], xData[i][xData[i].length - 1]],
    //     y: [yData[i][0], yData[i][11]],
    //     mode: 'markers',
    //     marker: {
    //       color: colors[i],
    //       size: 12
    //     }
    //   };


    let markerOutput = {
        x: xMarker[i],
        y: yMarker[i],
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: colorMarker[i],
            size: sizeMarker[i],
            opacity: opacityMarker[i]
        },
        //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
        text: `${yLookup[yMarker[i]]} covered<br>${sizeMarker[i]}% of area<br>in ${xLookup[xMarker[[i]]]}`
    };
    dataHolder.push(lineOutput, markerOutput);
};

//Plotly.newPlot(graphHolder,dataHolder, layout);

// let lines = {
//     x: [1,1.2,1.4],
//         [1,1.2,1.4],
//         [1,1.2,1.4],
//         [2,2.2,2.4],
//         [2,2.2,2.4],
//         [2,2.2,2.4],
//         [3,3.2,3.4],
//         [3,3.2,3.4],
//         [3,3.2,3.4]
//     y: [1,1.4,1.4, null,2,2.4,2.4, null,3,3.4,3.4, null,1,1.4,1.4, null,2,2.4,2.4, null,3,3.4,3.4, null,1,1.4,1.4, null,2,2.4,2.4, null,3,3.4,3.4, null ],
//     mode: 'lines',
//     connectgaps: false,
//     line: {
//         color: ['#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff'],
//         size:  [10,20,15,30,13,8,16,12,5]
//     }
// };


function importData(){
    console.log("test start");
    // Import and plot the markers first
    Plotly.d3.csv("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/imgData/state/MN_forPlotly2.csv", function(data) {
        processData_markers(data);
        console.log("testing");
    });
    // Then import the line data and update the existing plot to include the lines
    Plotly.d3.csv("https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/imgData/state/MN_forPlotly_lines.csv", function (data) {
        processData_lines(data);
        console.log("testing lines");
    });
};

function processData_markers(inputData){
    let currRow = {};
    let markerOutputCombined = [];
    let currHolderFrom = {}, currHolderTo = {};
    //console.log(inputData);
    //for(let i=0; i< 24; i++){
    for(let i=0; i< inputData.length; i++){
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
            x: [Number.parseInt(currRow['plotXAxisFrom'])],
            y: [Number.parseFloat(currRow['plotYAxisFrom'])],
            type: 'scatter',
            mode: 'markers',
            marker: {
                color:currRow['plottingColorFrom'],
                size: currRow['totalPercPixelsWiArea_cropYearFrom'],
                opacity: 100
            },
            //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
            text: `${yLookup[currRow['plotYAxisFrom']]} covered<br>${currRow['totalPercPixelsWiArea_cropYearFrom']}% of area<br>in ${xLookup[Number.parseInt(currRow['plotXAxisFrom'])]}`
        
        };

        currHolderTo = {
            x: [Number.parseInt(currRow['plotXAxisTo'])],
            y: [Number.parseFloat(currRow['plotYAxisTo'])],
            type: 'scatter',
            mode: 'markers',
            marker: {
                color:currRow['plottingColorTo'],
                size: currRow['totalPercPixelsWiArea_cropYearTo'],
                opacity: 100
            },
            //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
            text: `${yLookup[currRow['plotYAxisTo']]} covered<br>${currRow['totalPercPixelsWiArea_cropYearTo']}% of area<br>in ${xLookup[Number.parseInt(currRow['plotXAxisTo'])]}`
        
        };


        //console.log(`i is: ${i}`);
        //console.log(currRow['plotYAxisFrom']);

        markerOutputCombined.push(currHolderFrom);
        markerOutputCombined.push(currHolderTo);

        // let markerOutputTo = {
        //     x: xMarkTo[i],
        //     y: yMarkFrom[i],
        //     type: 'scatter',
        //     mode: 'markers',
        //     marker: {
        //         color: colorMarkFrom[i],
        //         size: sizeMarkFrom[i],
        //         opacity: 100
        //     },
        //     //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
        //     text: `${yLookup[yMarkFrom[i]]} covered<br>${sizeMarkFrom[i]}% of area<br>in ${xLookup[xMarkFrom[[i]]]}`
        // };
        // dataHolder.push(lineOutput, markerOutput);
    }
    //markerOutputCombined.push(markerOutputFrom, markerOutputTo)
    //console.log(markerOutputCombined);
    //Plotly.newPlot(graphHolder,markerOutputCombined, layout);
}

function processData_lines(inputData){
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
    //console.log(inputData);
    // The line data is given in 3-row chunks, where every 3 rows represents a new line
    for(let i=1; i<= (inputData.length / 3); i++){
        for(let chunkOffset=0; chunkOffset < 3; chunkOffset++){
            currRowNum = ((i - 1) * 3) + chunkOffset;
            //console.log(i);
            //console.log(chunkOffset);
            //console.log(currRowNum);
            currRow = inputData[currRowNum];
            // If this is the first row in the chunk, then get the color and the size to use
            if(chunkOffset === 0){
                currChunk_color = currRow['colorToUse'];
                currChunk_size = currRow['width'];
                currChunk_year1 = xLookup[Number.parseInt(currRow['plotXAxisTo'])]
            }

            if(chunkOffset === 1){
                // This will only be true if the xCoords for the curr row in the chunk are > xCoords in the first
                // row of the chunk, which means when using floor, they will return the same year from the xLookup.
                // In this case, currChunk_year2 = currChunk_year1 + 1
                if(xLookup[Math.floor(Number.parseFloat(currRow['xCoords']))] === currChunk_year1){
                    currChunk_year2 = currChunk_year1 + 1;
                } else{
                    currChunk_year2 = currChunk_year1 - 1;
                }

                if(currChunk_year1 > currChunk_year2){
                    currChunk_yearFrom = currChunk_year2;
                    currChunk_yearTo = currChunk_year1;
                } else{
                    currChunk_yearFrom = currChunk_year1;
                    currChunk_yearTo = currChunk_year2;
                }
            }

            currChunk_xCoords.push(currRow['xCoords']);
            currChunk_yCoords.push(currRow['yCoords']);

            if(chunkOffset === 2){
                currChunkHolder_line = {
                    x: currChunk_xCoords,
                    y: currChunk_yCoords,
                    mode: 'lines',
                    connectgaps: false,
                    line: {
                        color: currChunk_color,
                        size: currChunk_size
                    }
                    //text: ``
                }
                lineOutputCombined.push(currChunkHolder_line);
                if(i < 6){
                    console.log(currChunkHolder_line);
                 }
                currChunkHolder_line = {};
                currChunk_xCoords = [];
                currChunk_yCoords = [];
                currChunk_color = "";
                currChunk_size = "";
                currChunk_year1 = 0;
                currChunk_year2 = 0;
                currChunk_yearFrom = 0;
                currChunk_yearTo = 0;
            }
            //If this is the last row in the chunk, then build the plotly info for this block and push it to the 
            // holder.

        }
    }
    
    let testMarker = {
        x: [3],
        y: [4],
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: '#FFFF00',
            size: 50
        }
    };
    console.log(testMarker);
        
        //     x: xMarkTo[i],
        //     y: yMarkFrom[i],
        //     type: 'scatter',
        //     mode: 'markers',
        //     marker: {
        //         color: colorMarkFrom[i],
        //         size: sizeMarkFrom[i],
        //         opacity: 100
        //     },

    //Plotly.newPlot(graphHolder,[testMarker], layout);
    Plotly.newPlot(graphHolder,lineOutputCombined, layout);
}
      
    
    
    //currRow = inputData[i];

        //let lines = {
            //     x: [1,1.2,1.4],
            //         [1,1.2,1.4],
            //         [1,1.2,1.4],
            //         [2,2.2,2.4],
            //         [2,2.2,2.4],
            //         [2,2.2,2.4],
            //         [3,3.2,3.4],
            //         [3,3.2,3.4],
            //         [3,3.2,3.4]
            //     y: [1,1.4,1.4, null,2,2.4,2.4, null,3,3.4,3.4, null,1,1.4,1.4, null,2,2.4,2.4, null,3,3.4,3.4, null,1,1.4,1.4, null,2,2.4,2.4, null,3,3.4,3.4, null ],
            //     mode: 'lines',
            //     connectgaps: false,
            //     line: {
            //         color: ['#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff'],
            //         size:  [10,20,15,30,13,8,16,12,5]
            //     }
            // };

        // currHolderFrom = {
        //     x: [Number.parseInt(currRow['plotXAxisFrom'])],
        //     y: [Number.parseFloat(currRow['plotYAxisFrom'])],
        //     type: 'scatter',
        //     mode: 'markers',
        //     marker: {
        //         color:currRow['plottingColorFrom'],
        //         size: currRow['totalPercPixelsWiArea_cropYearFrom'],
        //         opacity: 100
        //     },
        //     //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
        //     text: `${yLookup[currRow['plotYAxisFrom']]} covered<br>${currRow['totalPercPixelsWiArea_cropYearFrom']}% of area<br>in ${xLookup[Number.parseInt(currRow['plotXAxisFrom'])]}`
        
        // };

        // currHolderTo = {
        //     x: [Number.parseInt(currRow['plotXAxisTo'])],
        //     y: [Number.parseFloat(currRow['plotYAxisTo'])],
        //     type: 'scatter',
        //     mode: 'markers',
        //     marker: {
        //         color:currRow['plottingColorTo'],
        //         size: currRow['totalPercPixelsWiArea_cropYearTo'],
        //         opacity: 100
        //     },
        //     //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
        //     text: `${yLookup[currRow['plotYAxisTo']]} covered<br>${currRow['totalPercPixelsWiArea_cropYearTo']}% of area<br>in ${xLookup[Number.parseInt(currRow['plotXAxisTo'])]}`
        
        // };


        //console.log(`i is: ${i}`);
        //console.log(currRow['plotYAxisFrom']);

        // markerOutputCombined.push(currHolderFrom);
        // markerOutputCombined.push(currHolderTo);

        // let markerOutputTo = {
        //     x: xMarkTo[i],
        //     y: yMarkFrom[i],
        //     type: 'scatter',
        //     mode: 'markers',
        //     marker: {
        //         color: colorMarkFrom[i],
        //         size: sizeMarkFrom[i],
        //         opacity: 100
        //     },
        //     //text: `Area covered by ${sizeMarker[i]}%<br>${yLookup[yMarker[i]]}<br>in ${xLookup[xMarker[[i]]]}`
        //     text: `${yLookup[yMarkFrom[i]]} covered<br>${sizeMarkFrom[i]}% of area<br>in ${xLookup[xMarkFrom[[i]]]}`
        // };
        // dataHolder.push(lineOutput, markerOutput);

    //markerOutputCombined.push(markerOutputFrom, markerOutputTo)
    //console.log(markerOutputCombined);
    //Plotly.newPlot(graphHolder,markerOutputCombined, layout);



importData();


//Plotly.newPlot(graphHolder,dataHolder, layout);


// var xData = [
//     [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013],
//     [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013],
//     [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013],
//     [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013]
//   ];
  
//   var yData = [
//     [74, 82, 80, 74, 73, 72, 74, 70, 70, 66, 66, 69],
//     [45, 42, 50, 46, 36, 36, 34, 35, 32, 31, 31, 28],
//     [13, 14, 20, 24, 20, 24, 24, 40, 35, 41, 43, 50],
//     [18, 21, 18, 21, 16, 14, 13, 18, 17, 16, 19, 23]
//   ];
  
//   var colors = ['rgba(67,67,67,1)', 'rgba(115,115,115,1)', 'rgba(49,130,189, 1)',
//     'rgba(189,189,189,1)'
//   ];
  
//   var lineSize = [2, 2, 4, 2];
  
//   var labels = ['Television', 'Newspaper', 'Internet', 'Radio'];
  
//   var data = [];
  
//   for ( var i = 0 ; i < xData.length ; i++ ) {
//     var result = {
//       x: xData[i],
//       y: yData[i],
//       mode: 'lines',
//       line: {
//         color: colors[i],
//         width: lineSize[i]
//       }
//     };
//     var result2 = {
//       x: [xData[i][0], xData[i][xData[i].length - 1]],
//       y: [yData[i][0], yData[i][11]],
//       mode: 'markers',
//       marker: {
//         color: colors[i],
//         size: 12
//       }
//     };
//     data.push(result, result2);
//   }
  
  
  //Plotly.newPlot(graphHolder,data, layout);
  


