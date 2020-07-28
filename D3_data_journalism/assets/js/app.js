//// TO DO ////
// Create Tooltips
// Create Animations
// Add other axis labels
// Add all the changes when other axis is clicked

// Define some variables
let svgWidth = 900;
let svgHeight = 500;

let margin = {
    top: 50,
    right: 40,
    bottom: 100,
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


// Read in the csv 

d3.csv("assets/data/Data.csv").then(function(data) {

    // Convert to numbers
    data.forEach(function(d){
        console.log(d);
        // Need healthcare v poverty
        d.healthcare = +d.healthcare;
        d.poverty = +d.poverty;
        // Need smokes v age
        d.smokes = +d.smokes;
        d.age = +d.age;
    })

    // Create scales and axis

    let xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([0,width]);

    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.income)])
        .range([height, 0]);

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Append x axis label
    chartGroup.append("text")
        .attr("y", height+40)
        .attr("x", (width/2)-100)
        .attr("dy", "1em")
        .attr("style","font-weight: bold; font-size: larger;")
        .text("Heathcare Coverage")

    // Append y axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -100)
        .attr("x", -275)
        .attr("dy", "1em")
        .attr("style","font-weight: bold; font-size: larger;")
        .text("Average Income")

    // Add the circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.income))
        .attr("r",17)
        .attr("fill", "blue")
        .attr("opacity",".5")

    // Get the state abbr in the center
    let textGroup = chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.income-900))
        .text(d => d.abbr)
        .attr("style","font-weight: bold;")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
    
})