// Plotly tests
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
const yLookup = {1:'Other',2:'Dry beans', 3:'Sugar beets', 4:'Spring wheat', 5:'Hay', 6:'Soybeans', 7:'Corn'};

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


 Plotly.newPlot(graphHolder,dataHolder, layout);

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
  


