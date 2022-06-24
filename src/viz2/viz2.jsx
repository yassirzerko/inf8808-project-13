
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { NavBar } from '../components/NavBar';
import React from 'react';
import *  as d3 from 'd3'
import { CSV_URL } from '../constants';
import { preprocessData, CONSTANTS } from './utils';
import { Selector } from '../components/Selector';
import { RadioButtons } from '../components/RadioButtons';
import { Modal } from '../components/Modal';
import '../index.css';
import { LegendViz2, getDataViz2 } from '../components/Legend';

const createSVG = () => {
    return d3.select('#svg')
        .append('svg')
        .attr('width', '90%')
        .attr('height', '400%')
        .append('g')
        .attr("transform", "translate(" + 250 + "," + 20 + ")");
}

const getHtmlToolTip = (row, dataLength) => {
    return `<h4> ${row.value} </h4> 
    <h5> Free : <h5> 
    <p> <b> Distribution </b>: ${row.free.distribution} %  (${row.free.position}/${dataLength})</p> 
    <p> <b> Number of app </b>:  ${row.free.count}</p> 
    <h5> Paid : <h5> 
    <p> <b> Distribution </b>: ${row.paid.distribution} %  (${row.paid.position}/${dataLength})</p> 
    <p> <b> Number of app </b>:  ${row.paid.count}</p> 
    `
}

const getAxisName = (variableName) => {
    if (variableName === "Category") {
        return "Categories"
    }

    if (variableName === "Content rating") {
        return "Evaluation de contenu"
    }

    return variableName
}

export function Type() {
    const [isAscending, setAscending] = React.useState(false)
    const [variable, setVariable] = React.useState('Category')
    const [modalData, setModalData] = React.useState({ 'isOpen': false, 'title': null, 'content': null })
    const [avg, setAvg] = React.useState({ 'free': {'reviews': null, 'rating' : null}, 'paid': {'reviews': null, 'rating' : null}})

    const createVisusalisation = () => {
        d3.csv(CSV_URL).then((data, error) => {
            if (error) {
                console.log(error)
                return
            }
            d3.select('#svg').selectAll('*').remove()
            let {preprocessedData, free, paid} = preprocessData(data, variable, isAscending)
            setAvg({free: free, paid:paid})
            let svg = createSVG()
            let dataLength = preprocessedData.length

            let xScale = d3.scaleLinear()
                .domain([0,100])
                .range([0, window.screen.width * 0.7])


            svg.append("g")
                .attr("transform", "translate(-10,15)")
                .attr("position", "fixed") //todo : fix la position
                .call(d3.axisBottom(xScale))
                .append("text")
                .style("text-anchor", "end")
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "black")

            let yScale = d3.scaleBand()
                .range([0, (2 *preprocessedData.length) * 50])
                .domain(preprocessedData.map(row => row.value))
                .padding(0.5)


            svg.append("g")
                .call(d3.axisLeft(yScale))
                .attr("transform", "translate(-30,15)")
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")


            svg.append("text")
                .attr("text-anchor", "end")
                .attr('x', '-100')
                .attr('y', '200')
                .text(getAxisName(variable) )
                .attr("class", "axis")


            svg.append("text")
                .attr("text-anchor", "end")
                .attr('x', '80%')
                .text("Frequence (%) : ")
                .attr("class", "axis")

            let toolTip = d3.select("#svg").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // bars container
            let barContainer = svg.selectAll("myRect")
                .data(preprocessedData)
                .enter()
                .append('g')
                .attr("transform", "translate(-10," + 20 + ")")


            //Free bars
            barContainer.append("rect")
                .attr("y", (row) => yScale(row.value) - 21)
                .attr("width", (row) => xScale(row.free.distribution))
             
                .attr("height", () => 0.85* yScale.bandwidth())
                .attr("fill", "steelblue")
                .attr('opacity', 0.7)
                .attr('id', (row, i) => 'bar-' + i)
                .on('mouseover', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 1)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 1)

                    toolTip.html(getHtmlToolTip(row, dataLength))
                          .style("left", (event.pageX + 20) + "px")
                          .style("top", (event.pageY - 20) + "px")
                })
                .on('mouseout', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 0.7)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 0)
                })

            //Paid bars
            barContainer.append("rect")
                .attr("y", (row) => yScale(row.value) + 21)
                .attr("width", (row) => xScale(row.paid.distribution))
                .attr("height", () => 0.85 * yScale.bandwidth())
                .attr("fill", "red")
                .attr('opacity', 0.7)
                .attr('id', (row, i) => 'bar-' + i)
                .on('mouseover', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 1)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 1)

                    toolTip.html(getHtmlToolTip(row, dataLength))
                          .style("left", (event.pageX + 20) + "px")
                          .style("top", (event.pageY - 20) + "px")
                })
                .on('mouseout', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 0.7)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 0)
                })

           barContainer.append('text') // Todo : le texte ne dois pas annuler le hover sur la barre 
                .text(row => row.free.distribution + '%')
                .style("text-anchor", "middle")
                .attr("x", 100)
                .attr("y", (row) => yScale(row.value) - 21 + yScale.bandwidth()/2)
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "black")
                .on('mouseover', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 1)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 1)

                    toolTip.html(getHtmlToolTip(row, dataLength))
                          .style("left", (event.pageX + 20) + "px")
                          .style("top", (event.pageY - 20) + "px")
                })
                .on('mouseout', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 0.7)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 0)
                })

            barContainer.append('text') // Todo : le texte ne dois pas annuler le hover sur la barre 
                .text(row => row.paid.distribution + '%')
                .style("text-anchor", "middle")
                .attr("x", 100)
                .attr("y", (row) =>  yScale(row.value) + 21 + yScale.bandwidth()/2)
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "black")
                .on('mouseover', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 1)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 1)

                    toolTip.html(getHtmlToolTip(row, dataLength))
                          .style("left", (event.pageX + 20) + "px")
                          .style("top", (event.pageY - 20) + "px")
                })
                .on('mouseout', function (event, row) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', 0.7)

                    toolTip.transition()
                        .duration(50)
                        .style('opacity', 0)
                })

        })
    }

    React.useEffect(() => {
        createVisusalisation()
    }, [variable, isAscending])

    console.log(avg)
    return (
        <Box height={'500vh'} m={0} p={0}>
            <NavBar></NavBar>
            <Modal isOpen={modalData.isOpen} onClose={() => setModalData({ 'isOpen': false, 'title': null, 'content': null })} title={modalData.title} content={modalData.content} />
            <Typography variant="h6" color="text.primary" pl={'30%'} pt={2}>
                {CONSTANTS.title}
            </Typography>
            <Box pl={'5%'} pt={2} sx={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>
                <Box pr={10}> <RadioButtons label={CONSTANTS.radioButtons.label} currentValue={isAscending} onChange={(event) => setAscending(event.target.value === "true")}
                    buttonsValues={CONSTANTS.radioButtons.values} buttonsText={CONSTANTS.radioButtons.texts} onClickToolTip={() => setModalData({ 'isOpen': true, 'title': 'Ordonnacement', 'content': CONSTANTS.radioButtons.modalContent })}></RadioButtons>
                </Box>

                <Box pr={10}>
                    <Selector inputLabel={CONSTANTS.variableSelector.label}
                        currentValue={variable} onChange={(event) => setVariable(event.target.value)} menuItemsValues={CONSTANTS.variableSelector.values} menuItemsText={CONSTANTS.variableSelector.texts} helperText={CONSTANTS.variableSelector.helper}
                        onClickToolTip={() => setModalData({ 'isOpen': true, 'title': 'Variable ', 'content': CONSTANTS.variableSelector.modalContent })} />
                </Box >
              <Box >
                    <LegendViz2 data ={[getDataViz2('red', 'Applications payantes', avg.free.reviews ? avg.free.reviews.toLocaleString() : null, avg.free.rating ? avg.free.rating.toLocaleString() : null), getDataViz2('steelblue', 'Applications gratuites', avg.paid.reviews? avg.paid.reviews.toLocaleString() : null,  avg.paid.rating? avg.paid.rating.toLocaleString() : null)]}></LegendViz2>
              </Box>
            </Box>
            <Box id='svg' height='100vh' p={2} ></Box>
        </Box>
    )
}