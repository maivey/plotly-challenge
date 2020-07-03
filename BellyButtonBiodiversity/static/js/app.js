// Call updatePlotly2 and updateDemoInfo functions to change the bar chart, bubble chart, demographic info, and gauge chart upon selection of id in dropdown menu
function optionChanged(id) {
    updatePlotly2(id);
    updateDemoInfo(id)
};

// Create init() function so page loads on first dropdown option when going to the html page
function init() {
    d3.json("samples.json").then((data) => {
        // Create array to hold all names (all ID names)
        var names = data.samples.map(x=>x.id)
        // Append an option in the dropdown for each name in names (each ID name)
        names.forEach(function(name) {
            d3.select('#selDataset')
                .append('option')
                .text(name);
            });
    // Create arrays for sample_values, OTU ids, and OTU labels        
    var sample_values = data.samples.map(x=> x.sample_values);
    var otu_ids = data.samples.map(x=> x.otu_ids);
    var otu_label = data.samples.map(x=> x.otu_labels);
    
    // Get the top 10 OTU for the selected ID
    var sorted_test = sample_values.sort(function(a, b){return b-a});
    var top_ten = sorted_test.map(x => x.slice(0,10));
    var sorted_ids = otu_ids.sort(function(a, b){return b-a});
    var top_ids = sorted_ids.map(x =>x.slice(0,10));
    var sorted_labels = otu_label.sort(function(a, b){return b-a});
    var top_labels = sorted_labels.map(x =>x.slice(0,10));

    // Get the first ID to display on page on load
    var firstID = data.metadata[0]// first id
    var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
    
    //-------------------------------------------------
    // Display the first ID's demographic information
    var sampleMetadata = sampleMetadata1.data(d3.entries(firstID))
    sampleMetadata.enter()
                    .append('h1')
                    .merge(sampleMetadata)
                    .text(d => `${d.key} : ${d.value}`)
                    .style('font-size','12px')
  
    sampleMetadata.exit().remove()
    
    //-------------------------------------------------
    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
    // 1. Use sample_values as the values for the bar chart
    // 2. Use otu_ids as the labels for the bar chart
    // 3. Use otu_labels as the hovertext for the chart

    // Create trace for bar chart
    var trace1 = {
        x : top_ten[0],
        y : top_ids[0].map(x => "OTU" + x),
        text : top_labels[0],
        type : 'bar',
        orientation : 'h',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]
    };
    // Create layout for bar chart
    var layout1 = {
        title : '<b>Top 10 OTU</b>'
    };

    // Create bar chart
    var data = [trace1];
    var config = {responsive:true}
    Plotly.newPlot('bar', data, layout1,config);

    //-------------------------------------------------
    // Create a bubble chart that displays each sample.
    // 1. Use otu_ids for the x values.
    // 2. Use sample_values for the y values.
    // 3. Use sample_values for the marker size.
    // 4. Use otu_ids for the marker colors.
    // 5. Use otu_labels for the text values

    // Create the trace for the bubble chart
    var trace2 = {
        x : otu_ids[0],
        y : sample_values[0],
        text : otu_label[0],
        mode : 'markers',
        marker : {
            color : otu_ids[0],
            size : sample_values[0]
        }
    };

    // Create layout for the bubble chart
    var layout2 = {
        title: '<b>Bubble Chart</b>',
        automargin: true,
        autosize: true,
        showlegend: false,
        // height: 500,
        // width: 900,
            margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
              }
    };
    var config = {responsive:true}

    // Create the bubble chart
    var data2 = [trace2];
    Plotly.newPlot('bubble',data2,layout2,config);


    //--------------------------------------------------------
    //Plot the weekly washing frequency of the individual in a gauge chart.

    // Get the first ID's washing frequency
    var firstWFreq = firstID.wfreq;

    // Calculations for gauge needle
    var firstWFreqDeg = firstWFreq * 20;
    var degrees = 180 - firstWFreqDeg;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(degrees * Math.PI / 180);
    var y = radius * Math.sin(degrees * Math.PI / 180);

    // Create path for gauge needle
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // Create trace for gauge chart (both the chart and the pointer)
    var dataGauge = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: firstWFreq,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "rgba(0, 105, 11, .5)",
              "rgba(10, 120, 22, .5)",
              "rgba(14, 127, 0, .5)",
              "rgba(110, 154, 22, .5)",
              "rgba(170, 202, 42, .5)",
              "rgba(202, 209, 95, .5)",
              "rgba(210, 206, 145, .5)",
              "rgba(232, 226, 202, .5)",
              "rgba(240, 230, 215, .5)",
              "rgba(255, 255, 255, 0)"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];

    // Create the layout for the gauge chart
    var layoutGauge = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        // height: 500,
        // width: 500,
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      };
      var config = {responsive:true}
      // Plot the gauge chart
      Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
    

    }); //Ends d3.json
}; // Ends init() function


// Call init function so page loads on the first ID selection
init();


// Update the bar chart and bubble chart 
function updatePlotly2(id) {
    d3.json("samples.json").then((data) => {
        // Get the sample data for the selected ID in the dropdown menu
        var test = data.samples.filter(x => x.id === id);

        // Get the top 10 sample values
        var sample_values = test.map(x => x.sample_values).sort(function(a, b){return b-a});
        var top_values = sample_values.map(x => x.slice(0,10));

        // Get the top ten IDs
        var otu_ids = test.map(x=> x.otu_ids).sort(function(a, b){return b-a});
        var top_ids = otu_ids.map(x => x.slice(0,10));

        // Get the top ten labels
        var otu_label = test.map(x=> x.otu_labels).sort(function(a, b){return b-a});
        var top_labels = otu_label.map(x => x.slice(0,10));

        //-------------------------------------------------
        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
        // 1. Use sample_values as the values for the bar chart
        // 2. Use otu_ids as the labels for the bar chart
        // 3. Use otu_labels as the hovertext for the chart

        // Create the trace for the bar chart
        var trace = {
            x : top_values[0],
            y : top_ids[0].map(x => "OTU" + x),
            text : top_labels[0],
            type : 'bar',
            orientation : 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
              }]
        };

        // Create the layout for the bar chart
        var layout1 = {
            title: "<b>Top 10 OTU</b>"
        };
        var data1 = [trace];
        var config = {responsive:true}

        // Plot the bar chart using Plotly
        Plotly.newPlot('bar', data1,layout1,config);

        //-------------------------------------------------
        // Create a bubble chart that displays each sample.
        // 1. Use otu_ids for the x values.
        // 2. Use sample_values for the y values.
        // 3. Use sample_values for the marker size.
        // 4. Use otu_ids for the marker colors.
        // 5. Use otu_labels for the text values

        // Create the trace for the bubble chart
        var trace2 = {
            x : test.map(x=> x.otu_ids)[0],
            y : test.map(x => x.sample_values)[0],
            text : test.map(x=> x.otu_labels),
            mode : 'markers',
            marker : {
                color : test.map(x=> x.otu_ids)[0],
                size : test.map(x => x.sample_values)[0]
            }   
        };

        // Create the layout for the bubble chart
        var layout2 = {
            title: '<b>Bubble Chart</b>',
            automargin: true,
            autosize: true,
            showlegend: false,
            // height: 500,
            // width: 500,
            // width: 900,
            margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
              }
        };

        // Plot the new bubble chart using Plotly
        var data2 = [trace2];
        var config = {responsive:true}
        Plotly.newPlot('bubble', data2,layout2,config)
    });
};

// Update the demographic information and gauge chart when a new ID is selected
function updateDemoInfo(id) {
    d3.json("samples.json").then((data) => {

        // Filter for the selected ID
        var metadataSamples = data.metadata.filter(x => x.id === +id)[0];

        // Get the demographic information for the selected ID
        var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
        var sampleMetadata = sampleMetadata1.data(d3.entries(metadataSamples))
        sampleMetadata.enter().append('h1').merge(sampleMetadata).text(d => `${d.key} : ${d.value}`).style('font-size','12px');

        // Get the wash frequency for the current ID            
        var wFreq = metadataSamples.wfreq;
        var wFreqDeg = wFreq * 20;

        // Calculations for gauge pointer
        var degrees = 180 - wFreqDeg;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(degrees * Math.PI / 180);
        var y = radius * Math.sin(degrees * Math.PI / 180);

        // Path for gauge pointer
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        // Create trace for gauge plot
        var dataGauge = [
            {
            type: "scatter",
            x: [0],
            y: [0],
            marker: { size: 12, color: "850000" },
            showlegend: false,
            name: "Freq",
            text: wFreq,
            hoverinfo: "text+name"
            },
            {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                "rgba(0, 105, 11, .5)",
                "rgba(10, 120, 22, .5)",
                "rgba(14, 127, 0, .5)",
                "rgba(110, 154, 22, .5)",
                "rgba(170, 202, 42, .5)",
                "rgba(202, 209, 95, .5)",
                "rgba(210, 206, 145, .5)",
                "rgba(232, 226, 202, .5)",
                "rgba(240, 230, 215, .5)",
                "rgba(255, 255, 255, 0)"
                ]
            },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
            }
        ];
        // Create layout for gauge plot
        var layoutGauge = {
            shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                color: "850000"
                }
            }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            // height: 500,
            // width: 500,
            xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            },
            yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            }
        };
        var config = {responsive:true}

        // Plot the new gauge chart
        Plotly.newPlot('gauge', dataGauge,layoutGauge,config);

    });
};
