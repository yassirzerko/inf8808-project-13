
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { NavBar } from '../components/NavBar';
import React from 'react';
import *  as d3 from 'd3'
import { CSV_URL } from '../constants';
import { preprocessData, CONSTANTS, getAxesData } from './utils';
import { Selector } from '../components/Selector';
import { Modal } from '../components/Modal';
import '../index.css';
import { getDataContainer, addTooltip } from '../vizUtils';

const createSVG = () => {
    return d3.select('#svg')
        .append('svg')
        .attr('width', '90%')
        .attr('height', '400%')
        .append('g')
        .attr("transform", "translate(" + 250 + "," + 20 + ")");
}

const getHtmlToolTip = (row, axes) => {
    return `<h4> ${row.downloadRange} </h4> 
    <p> Containing : ${row.nApp} apps <p> 
    <p> <b> Average of ${axes.xAxis} </b> : ${row.xAvg.toFixed(2)} <p>
    <p> <b> Average of ${axes.yAxis} </b> : ${row.yAvg.toFixed(2)} <p>
    `
}

const getAxisName = (variableName) => {
    if (variableName === "Size") {
        return "Taille en mega octets"
    }

    if (variableName === "Reviews") {
        return "Nombre d'evaluation"
    }

    if (variableName === "Rating") {
        return "Note "
    }
}



export function Numerical() {
    const [axes, setAxes] = React.useState({xAxis : 'Size', yAxis : 'Rating' })
    const [modalData, setModalData] = React.useState({ 'isOpen': false, 'title': null, 'content': null })


    const createVisusalisation = () => {
        d3.csv(CSV_URL).then((data, error) => {
            if (error) {
                console.log(error)
                return
            }

            let preprocessedData = preprocessData(data, axes)

            let xScale = d3.scaleLinear()
                .domain([d3.min(preprocessedData.map(data => data.xAvg)),d3.max(preprocessedData.map(data => data.xAvg))])
                .range([0, window.screen.width * 0.7])

            let radiusScale = d3.scaleSqrt()
            .domain([d3.min(preprocessedData.map(data => parseInt(data.downloadRange.replaceAll('+', '').replaceAll(',', '')))),d3.max(preprocessedData.map(data => parseInt(data.downloadRange.replaceAll('+', '').replaceAll(',', ''))))])
            .range([20, 120])


            let yScale = d3.scaleLinear()
            .domain([d3.min(preprocessedData.map(data => data.yAvg)),d3.max(preprocessedData.map(data => data.yAvg))])
            .range([0, window.screen.height * 0.7])


            let dataContainer = getDataContainer(xScale, yScale, getAxisName(axes.xAxis), getAxisName(axes.yAxis), preprocessedData)


            let toolTip = addTooltip()

            //Free bars
            dataContainer.append("circle")
                .attr("cy", (row) => yScale(row.yAvg))
                .attr("cx", (row) => xScale(row.xAvg))
                .attr("r", (row) => radiusScale(row.downloadRange.replaceAll('+', '').replaceAll(',', '')) )
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

                    toolTip.html(getHtmlToolTip(row, axes))
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

            dataContainer.append('text') // Todo : le texte ne dois pas annuler le hover sur la barre 
                .text(row => row.downloadRange)
                .style("text-anchor", "middle")
                .attr("x", row => xScale(row.xAvg))
                .attr("y", (row) => yScale(row.yAvg))
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

                    toolTip.html(getHtmlToolTip(row, axes))
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
    }, [axes])

    const {xAxisData, yAxisData} =  getAxesData(axes.xAxis, axes.yAxis)

    return (
        <Box height={'500vh'} m={0} p={0}>
            <NavBar></NavBar>
            <Modal isOpen={modalData.isOpen} onClose={() => setModalData({ 'isOpen': false, 'title': null, 'content': null })} title={modalData.title} content={modalData.content} />
            <Typography variant="h6" color="text.primary" pl={'30%'} pt={2}>
                {CONSTANTS.title}
            </Typography>
            <Box pl={'5%'} pt={2} sx={{ display: 'flex', justifyContent: 'center', minWidth: '100%' }}>
                <Selector inputLabel={CONSTANTS.xAxisSelector.label}
                    currentValue={axes.xAxis} onChange={(event) => setAxes({xAxis : event.target.value, yAxis : axes.yAxis})} menuItemsValues={xAxisData.map(data => data[0])} menuItemsText={xAxisData.map(data => data[1])} helperText={CONSTANTS.xAxisSelector.helper}
                    onClickToolTip={() => setModalData({ 'isOpen': true, 'title': 'Axe horizontal ', 'content': CONSTANTS.xAxisSelector.modalContent })} />
                <Box pl={'5%'} >
                <Selector  inputLabel={CONSTANTS.yAxisSelector.label}
                    currentValue={axes.yAxis} onChange={(event) => setAxes({xAxis : axes.xAxis, yAxis : event.target.value})} menuItemsValues={yAxisData.map(data => data[0])} menuItemsText={yAxisData.map(data => data[1])} helperText={CONSTANTS.yAxisSelector.helper}
                    onClickToolTip={() => setModalData({ 'isOpen': true, 'title': 'Axe vertical ', 'content': CONSTANTS.yAxisSelector.modalContent })} />
                </Box>
               
            </Box>

            <Box id='svg' height='100vh' p={2} ></Box>
        </Box>
    )
}