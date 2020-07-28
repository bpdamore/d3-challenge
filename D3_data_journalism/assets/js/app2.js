// @TODO:
// Create SVG area
// Connect to data
// Create Axis
// Select id Scatter
// Append circles

// Define some variables
let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create svg area
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append the svg group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

////////////////////// UNSURE ABOUT THIS /////////////////////////
// let chosenXaxis = "poverty"
//////////////////////////////////////////////////////////////////

function xScale(povertyData, chosenXaxis) {
    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d[chosenXaxis]) * 0.8,
    d3.max(povertyData, d=> d[chosenXaxis]) *1.2
    ])
    .range([0,width]);

    return xLinearScale;
}

// function to update xaxis when clicked

function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(500)
        .call(bottomAxis);

    return xAxis;
}

// update the circles group with transition

function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXaxis]));

    return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {

    let label;

    if (chosenXAxis === "obesity") {
        label = "Obesity Rate %";
    }
    else {
        label = "Poverty Rate %"
    }

    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
        })

circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
})
return circlesGroup;
}

// Get that data and execute everything

d3.csv("hairData.csv").then(function(povertyData) {
    povertyData.forEach(function(data){
        data.obsesity = +data.obesity
        data.poverty = +data.poverty
        data.smokes = +data.smokes
        data.healthcare = +data.healthcare
    });

    let xLinearScale = xScale(povertyData, chosenXAxis);
    
    // Create y scale function
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(povertyData, d => d.healthcare)])
        .range([height, 0]);

    // Create the initial axises
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(ylinearScale);

    // append x axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Append initial circles
    let circlesGroup = chartGroup.slectAll("circles")
        .data(povertyData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r",15)
        .attr("fill", "blue")
        .attr("opacity",".5")

    let xLabelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height +20})`);
    

})
