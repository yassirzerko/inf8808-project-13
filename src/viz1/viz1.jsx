
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { NavBar } from '../components/NavBar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button';
import HelpIcon from '@mui/icons-material/Help';
import *  as d3 from 'd3'
import { CSV_URL } from '../constants';
import { preprocessData, getDownloadsRanges, CONSTANTS } from './utils';
import { Selector } from '../components/Selector';


const createSVG = () => {
    return d3.select('.svg')
        .append('svg')
        .attr('width', '90%')
        .attr('height', '400%')
        .append('g')
        .attr("transform", "translate(" + 250 + "," + 20 + ")");
}

export function Categorical() {
    const [isAscending, setAscending] = React.useState(true)
    const [downloadsMetric, setDownloadMetric] = React.useState('brut')
    const [variable, setVariable] = React.useState('Category')
    const [downloadsRange, setDownloadsRange] = React.useState('1,000,000,000+')
    const [downloadsRanges, setDownloadsRanges] = React.useState(null)
    const [isDialogOpen, setDialogOpen] = React.useState(false)

    const createVisusalisation = () => {
        d3.csv(CSV_URL).then((data, error) => {
            if (error) {
                console.log(error)
                return
            }

            let preprocessedData = preprocessData(data, downloadsMetric, variable, isAscending, downloadsRange)
            let svg = createSVG()

            let xScale = d3.scaleLinear()
                .domain([d3.min(preprocessedData.map(row => row[downloadsMetric])), d3.max(preprocessedData.map(row => row[downloadsMetric]))])
                .range([0, window.screen.width * 0.75])

            svg.append("g")
                .attr("transform", "translate(-10,15)")
                .call(d3.axisBottom(xScale))
                .append("text")

                .style("text-anchor", "end")
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
        
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
                .attr('x', '-40')
                .text("Variable etudiee : " + variable);

            svg.append("text")
                .attr("text-anchor", "end")
                .attr('x', '80%')
                .text("Metrique de telechargement : " + downloadsMetric);

            let bars = svg.selectAll("myRect")
                .data(preprocessedData)
                .enter()
                .append('g')
                .attr("transform", "translate(-10," + 20 + ")")

            bars.append("rect")
                .attr("y", (row) => yScale(row.value))
                .attr("width", (row) => xScale(row[downloadsMetric]))
                .attr("height", () => yScale.bandwidth())
                .attr("fill", "steelblue")

            bars.append('text')
                .text(row => row[downloadsMetric])
                .style("text-anchor", "middle")
                .attr("x", (row) => xScale(row[downloadsMetric]) * 0.8)
                .attr("y", (row) => yScale(row.value) + yScale.bandwidth() - 10)
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "black")

            bars.on('click', () => setToolTip(true))
            bars.style('cursor', 'pointer')

            setDownloadsRanges(getDownloadsRanges(data))

        })
    }

    React.useEffect(() => {
        d3.select('.svg').selectAll('*').remove()
        createVisusalisation()
    }, [downloadsMetric, variable, isAscending, downloadsRange])

    const shouldDisplayDlsRangesSelector = (downloadsMetric === 'Nombre applications' || downloadsMetric === 'Nombre applications moyen')

    const [isToolTipOpen, setToolTip] = React.useState(false)



    const DialogCustom = () => (<Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Let Google help apps determine location. This means sending anonymous
                location data to Google, even when no apps are running.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Fermer</Button>
        </DialogActions>
    </Dialog>)

    const RadioButtons = () => (<FormControl>
        <Box pl={5}><FormLabel id="demo-row-radio-buttons-group-label">Ordonnancement</FormLabel></Box>

        <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={isAscending}
            onChange={(event) => setAscending(event.target.value === "true")}
        >
            <FormControlLabel value={true} control={<Radio />} label="Croissant" labelPlacement="top" />


            <FormControlLabel value={false} control={<Radio />} label="Decroissant" labelPlacement="top" />
        </RadioGroup>
    </FormControl>)

    const Selectors = () => (<Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '45%', paddingLeft: '5%' }}>
        <Selector inputLabel={CONSTANTS.variableSelector.label} 
            currentValue={variable} onChange={(event) => setVariable(event.target.value)} menuItemsValues={CONSTANTS.variableSelector.values} menuItemsText={CONSTANTS.variableSelector.texts} helperText={CONSTANTS.variableSelector.helper}
        />
        <Selector inputLabel={CONSTANTS.downloadsMetricSelector.label} 
            currentValue={downloadsMetric} onChange={(event) => setDownloadMetric(event.target.value)} menuItemsValues={CONSTANTS.downloadsMetricSelector.values} menuItemsText={CONSTANTS.downloadsMetricSelector.texts} helperText={CONSTANTS.downloadsMetricSelector.helper}
        />
        {shouldDisplayDlsRangesSelector &&
            <Selector inputLabel={'Nombre de telechargements'} 
            currentValue={downloadsRange} onChange={(event) => setDownloadsRange(event.target.value)} menuItemsValues={downloadsRanges ? downloadsRanges : []} menuItemsText={downloadsRanges ? downloadsRanges : []} helperText={"Choisir la tranche de telechargement"}
            ></Selector>
        }
    </Box>
    )
    
    return (
        <Box /*backgroundColor={'#d3d3d3'}*/ height={'100vh'} m={0} p={0}>
            <NavBar></NavBar>
            <Typography variant="h5" color="text.primary" pl={'10%'} pt={2}>
                Visualisation 1 : Exploration du comportement des variables catégoriques et des téléchargements
            </Typography>
            <Box pl={'40%'} pt={3}>
                <RadioButtons></RadioButtons>
                <DialogCustom></DialogCustom>
                <HelpIcon onClick={() => setDialogOpen(true)} />
            </Box>
            <Box pl={'25%'} pt={3} pb={2}>
                <Selectors></Selectors>
            </Box>
            <Box className='svg' height='100vh' p={2} ></Box>
        </Box>
    )
}