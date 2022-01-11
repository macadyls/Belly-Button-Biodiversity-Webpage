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

        // Render Bubble char on 'bubble' ID
        Plotly.newPlot("bubble", bubble_data, layout2);
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