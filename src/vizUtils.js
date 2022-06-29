import *  as d3 from 'd3'

const getSVG = () => {
    return d3.select('#svg')
        .append('svg')
        .attr('width', '90%')
        .attr('height', '400%')
        .append('g')
        .attr("transform", "translate(" + 250 + "," + 20 + ")")
}

export const getDataContainer = (xScale, yScale, xName, yName,preprocessedData) => {
    d3.select('#svg').selectAll('*').remove()
    let svg = getSVG()

    svg.append("g")
    .attr("transform", "translate(-10,15)")
    .attr("position", "fixed") //todo : fix la position
    .call(d3.axisBottom(xScale))
    .append("text")
    .style("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", "black")

    svg.append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(-30,15)")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")

    svg.append("text")
    .attr("text-anchor", "end")
    .attr('x', '80%')
    .text(xName)
    .attr("class", "axis")

    svg.append("text")
    .attr("text-anchor", "end")
    .attr('x', '-100')
    .text(yName)
    .attr("class", "axis")

    return svg.selectAll("myRect")
                .data(preprocessedData)
                .enter()
                .append('g')
                .attr("transform", "translate(-10," + 20 + ")")
}

export const addTooltip = () => {
   return  d3.select("#svg").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
}