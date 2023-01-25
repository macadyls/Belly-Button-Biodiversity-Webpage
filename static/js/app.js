/**
 * Helper function to select data
 * metadata
 * @param {array} rows
 * @param {integer} index
 * index 0 - id
 * index 1 - ethnicity
 * index 2 - gender
 * index 3 - age
 * index 4 - location
 * index 5 - bbtype
 * index 6 - wfreq
 */
/**
 * samples
 * @param {array} rows2
 * @param {integer} index2
 * index 0 - id
 * index 1 - otu_ids
 * index 2 - otu_labels
 * index 3 - sample_values
*/

url = "data/samples.json";

function buildMetadata(sample) {
    d3.json(url).then((data) => {
        // Reference top panel
        var panel = d3.select('#sample-metadata');
        // Clears the panel
        panel.html("");

        var metadata = data.metadata;
        var resultsArray = metadata.filter(object => 
            object.id == sample
        );
        var result = resultsArray[0];

        // Populate panel
        Object.entries(result).forEach( ([key, value]) => {
            panel
                .append('h6')
                .append('b')
                .text(`${key}: ${value}`)
        });
    })
}

function buildCharts(sample) {
    d3.json(url).then((data) => {
        var samples = data.samples;
        var resultsArray = samples.filter(object => 
            object.id == sample
        );
        var result = resultsArray[0];

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        // Variable to hold wash frequency in Gauge chart
        var metadataArray = data.metadata.filter(object =>
            object.id == sample
        );
        var metadataResults= metadataArray[0];
        var wfreq = metadataResults.wfreq;

        // Bar Chart
        var trace1 = {
            x: values.slice(0,10).reverse(),
            y: ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: labels.slice(0,10).reverse(),
            name: "OTU IDs",
            type: 'bar',
            orientation: 'h'
        };

        var bar_data = [trace1];

        var layout1 = {
            title: "Top 10 OTU Bacteria Cultures",
            margin: { t: 30, l: 150 }
            };

        // Render Bar Chart on 'bar' ID
        Plotly.newPlot("bar", bar_data, layout1);

        // Bubble Chart
        var trace2 = {
            x: ids,
            y: values,
            text: labels,
            mode: 'markers',
            marker: {
                color: ids,
                size: values,
                colorscale: 'Jet'
            }
        };

        var bubble_data = [trace2];

        var layout2 = {
            xaxis: {title: 'OTU ID'},
            margin: {t: 0},
            showlegend: false,
        };

        // Render Bubble chart on 'bubble' ID
        Plotly.newPlot("bubble", bubble_data, layout2);

        // Gauge Chart
        var trace3 = {
            type: "pie",
            showlegend: false,
            hole: 0.5,
            rotation: 90,
            values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100],
            text:["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9",""],
            direction: "clockwise",
            textinfo: "text",
            textposition: "inside",
            marker: {
              colors: ["rgba(255,238,153,0.6)","rgba(255,230,102, 0.6)","rgba(255, 255,102, 0.6)","rgba(255,255,51, 0.6)",
              "rgba(255,255,1, 0.6)","rgba(179,255,102, 0.6)",
              "rgba(106,255,77, 0.6)",
              "rgba(43,255,0, 0.6)",
              "rgba(0,179,0, 0.6)","white"]
        
            },
            labels:["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9",""],
            hoverinfo: "label"
            };
        
        var degrees =(wfreq+0.5)*20, radius = 2;
        var radians = degrees * Math.PI /180;
        var x_val = -1 * radius * Math.cos(radians);
        var y_val = radius * Math.sin(radians);
        
        var theta = degrees;
        var r = radius;
        var x_head = r * Math.cos(Math.PI/180*theta);
        var y_head = r * Math.sin(Math.PI/180*theta);  
        
        var layout3 = {
            shapes:[{
              type: 'line',
              x0: 0.5,
              y0: 0.5,
              x1: (x_val*0.11)+0.5,
              y1: (y_val*0.11)+0.5,
              line: {
                color: 'red',
                width: 7
              }
            }],
            title: "Belly Button Washing Frequency<br>Scrubs per Week",
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1,1]},
            };
        
        var gauge_data = [trace3];
        
        // Render the Gauge Chart
        Plotly.newPlot('gauge', gauge_data, layout3);
        
    });
}

// Initialising dashboard
function init() {
    d3.json(url).then((data) => {
        // Reference to dropdown menu
        var selector = d3.select("#selDataset");
        var sampleNames = data.names;

        // Populates selector with OTU names
        sampleNames.forEach((sample) => {
            selector
                .append('option')
                .text(sample)
                .property("value", sample);
        });

        // Initialise with first sample
        const firstSample = sampleNames[0];
        buildMetadata(firstSample);
        buildCharts(firstSample);
    });
}

// Note this function is called upon in 'index.html'
function optionChanged(newSample) {
    // Fetch new data for new sample selected
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Initialise dashboard
init();