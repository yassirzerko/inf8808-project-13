
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { NavBar } from '../components/NavBar';
import React from 'react';
import *  as d3 from 'd3'
import { CSV_URL } from '../constants';
import { preprocessData, getDownloadsRanges, CONSTANTS } from './utils';
import { Selector } from '../components/Selector';
import { RadioButtons } from '../components/RadioButtons';
import { Modal } from '../components/Modal';
import '../index.css';
import { LegendViz1} from '../components/Legend';

const createSVG = () => {
    return d3.select('#svg')
        .append('svg')
        .attr('width', '90%')
        .attr('height', '400%')
        .append('g')
        .attr("transform", "translate(" + 250 + "," + 20 + ")");
}

const getHtmlToolTip = (row, dataLength, downloadsRange) => {
    console.log(row.avg.value)
    return `<h4> ${row.value} </h4> 
    <p> <b> Distribution </b>: ${row.distribution.value}% (${row.distribution.position}/${dataLength}) </p> 
    <p> <b> Total download </b>: ${row.sum.value.toLocaleString()} (${row.sum.position}/${dataLength})</p> 
    <p> <b> Average download </b>: ${row.avg.value.toLocaleString()} (${row.avg.position}/${dataLength})</p> 
    <p> <b> Number of app with  ${downloadsRange} downloads  </b>: ${row.nApp.value} (${row.nApp.position}/${dataLength})</p> 
    <p> <b> Number of app with ${downloadsRange} downloads average  </b>: ${row.avgNApp.value} (${row.avgNApp.position}/${dataLength})</p> `
}

const getAxisName = (variableName, downloadsRange) => {
    if (variableName === "Category") {
        return "Categories"
    }

    if (variableName === "Content rating") {
        return "Evaluation de contenu"
    }

    if (variableName === "Android Ver") {
        return "Version minimale d'android requise"
    }

    if (variableName === 'sum') {
        return "Nombre total de telechargement"
    }
    if (variableName === 'avg') {
        return "Nombre moyen de telechargement"
    }
    if (variableName === 'nApp') {
        return `Nombre d application avec plus de ${downloadsRange} telechargement`
    }

    if (variableName === 'avgNApp') {
        return `Nombre d application moyen avec plus de ${downloadsRange} telechargement`
    }



    return variableName
}


export function Categorical() {
    const [isAscending, setAscending] = React.useState(false)
    const [downloadsMetric, setDownloadMetric] = React.useState(CONSTANTS.downloadsMetricSelector.values[0])
    const [variable, setVariable] = React.useState('Category')
    const [downloadsRange, setDownloadsRange] = React.useState('1,000,000,000+')
    const [downloadsRanges, setDownloadsRanges] = React.useState(null)
    const [modalData, setModalData] = React.useState({ 'isOpen': false, 'title': null, 'content': null })

    const createToolTip = () => {
        
    }

    const createVisusalisation = () => {
        d3.csv(CSV_URL).then((data, error) => {
            if (error) {
                console.log(error)
                return
            }
            d3.select('#svg').selectAll('*').remove()
            let preprocessedData = preprocessData(data, downloadsMetric, variable, isAscending, downloadsRange)
            let svg = createSVG()
            let dataLength = preprocessedData.length

            let xScale = d3.scaleLinear()
                .domain([d3.min(preprocessedData.map(row => row[downloadsMetric].value)), d3.max(preprocessedData.map(row => row[downloadsMetric].value))])
                .range([0, window.screen.width * 0.75])

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
                .range([0, preprocessedData.length * 50])
                .domain(preprocessedData.map(row => row.value))
                .padding(0.4)


            svg.append("g")
                .call(d3.axisLeft(yScale))
                .attr("transform", "translate(-30,15)")
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")


            svg.append("text")
                .attr("text-anchor", "end")
                .attr('x', '-100')
                .text(getAxisName(variable))
                .attr("class", "axis")


            svg.append("text")
                .attr("text-anchor", "end")
                .attr('x', '80%')
                .text(getAxisName(downloadsMetric, downloadsRange))
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


            //real bars
            let bars = barContainer.append("rect")
                .attr("y", (row) => yScale(row.value))
                .attr("width", (row) => xScale(row[downloadsMetric].value))
                .attr("height", () => yScale.bandwidth())
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

                    toolTip.html(getHtmlToolTip(row, dataLength, downloadsRange))
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
                .text(row => row[downloadsMetric].value)
                .style("text-anchor", "middle")
                .attr("x", 100)
                .attr("y", (row) => yScale(row.value) + yScale.bandwidth() - 10)
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

                    toolTip.html(getHtmlToolTip(row, dataLength, downloadsRange))
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

            setDownloadsRanges(getDownloadsRanges(data))

        })
    }

    React.useEffect(() => {
        createVisusalisation()
    }, [downloadsMetric, variable, isAscending, downloadsRange])

    const shouldDisplayDlsRangesSelector = (downloadsMetric === CONSTANTS.downloadsMetricSelector.values[2] || downloadsMetric === CONSTANTS.downloadsMetricSelector.values[3])

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

                <Box pr={10}>
                    <Selector inputLabel={CONSTANTS.downloadsMetricSelector.label}
                        currentValue={downloadsMetric} onChange={(event) => setDownloadMetric(event.target.value)} menuItemsValues={CONSTANTS.downloadsMetricSelector.values} menuItemsText={CONSTANTS.downloadsMetricSelector.texts} helperText={CONSTANTS.downloadsMetricSelector.helper}
                        onClickToolTip={() => setModalData({ 'isOpen': true, 'title': 'Metrique de telechargement', 'content': CONSTANTS.downloadsMetricSelector.modalContent })} />
                </Box>

                <Box >
                    <LegendViz1></LegendViz1>
                </Box>

                {shouldDisplayDlsRangesSelector &&
                   
                        <Selector inputLabel={'Nombre de telechargements'}
                            currentValue={downloadsRange} onChange={(event) => setDownloadsRange(event.target.value)} menuItemsValues={downloadsRanges ? downloadsRanges : []} menuItemsText={downloadsRanges ? downloadsRanges : []} helperText={"Choisir la tranche de telechargement"}
                            onClickToolTip={() => setModalData({ 'isOpen': true, 'title': 'Nombre de telechargement', 'content': 'Explication' })} ></Selector>
                    }
            </Box>

            <Box id='svg' height='100vh' p={2} ></Box>
        </Box>
    )
}