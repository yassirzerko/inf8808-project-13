
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

const getDownloadsNumber = (data) => {
    let uniques = new Set()
    for (let i = 0; i < data.length; i++) {
        uniques.add(data[i]['Installs'])
    }
    return Array.from(uniques).sort((a, b) => parseInt(b.replaceAll('+', '').replaceAll(',', '')) - parseInt(a.replaceAll('+', '').replaceAll(',', '')))
}

const handleSort = (preprocessedData, order, downloads_metric) => {
    let sortMethod = order ==="croissant" ? (a, b) => b[downloads_metric] - a[downloads_metric] : (a, b) => a[downloads_metric] - b[downloads_metric]
    preprocessedData.sort(sortMethod)
}

// nAppByValue is filled only if not nul
const fillMaps = (data, variableName, sumDlsByValue, occurrencesByValue, nAppByValueData) => {
    for (let i = 0; i < data.length; i++) {
        let row = data[i]
        let downloads = parseInt(row.Installs.replaceAll('+', '').replaceAll(',', ''))
        let variableValue = row[variableName]
        sumDlsByValue.set(variableValue, sumDlsByValue.has(variableValue) ? sumDlsByValue.get(variableValue) + downloads : downloads)
        occurrencesByValue.set(variableValue, occurrencesByValue.has(variableValue) ? occurrencesByValue.get(variableValue) + 1 : 1)

        if(nAppByValueData) {
            let [nAppByValue, download_number] = nAppByValueData
            if(row.Installs === download_number) {
                nAppByValue.set(variableValue, nAppByValue.has(variableValue) ? nAppByValue.get(variableValue) + 1 : 1)
            }
        }
    }
}

const preprocessData = (data, downloads_metric, variableName, order, download_number) => {
    let sumDlsByValue = new Map()
    let occurrencesByValue = new Map()
    let nAppByValue = new Map()
    
    let shouldGetNApps = downloads_metric === 'Nombre applications' || downloads_metric === 'Nombre applications moyen'
    fillMaps(data, variableName, sumDlsByValue, occurrencesByValue, shouldGetNApps ? [nAppByValue, download_number] : null )

    let preprocessedData = []
    for (let [value, sumDls] of sumDlsByValue) {
        let distribution = occurrencesByValue.get(value) / data.length
        let meanDls = sumDls / occurrencesByValue.get(value)
        let preprocessedValue = { 'value': value, 'brut': sumDls, 'moyen': meanDls , 'distribution': distribution}
        if(downloads_metric === 'Nombre applications' ) { 
            preprocessedValue['Nombre applications'] = nAppByValue.has(value) ? nAppByValue.get(value) : 0
        }
        if (downloads_metric === 'Nombre applications moyen'){
            preprocessedValue['Nombre applications moyen'] = (nAppByValue.has(value) ? nAppByValue.get(value) : 0) / occurrencesByValue.get(value)
        }
        preprocessedData.push(preprocessedValue)
    }

    handleSort(preprocessedData, order, downloads_metric)
    return preprocessedData
}

const createSVG = () => {
    return d3.select('.svg')
        .append('svg')
        .attr('width', '90%')
        .attr('height', '400%')
        .append('g')
        .attr("transform", "translate(" + 250 + "," + 20 + ")");
}


export function Categorical(props) {
    const createVisusalisation = () => {
        d3.csv(CSV_URL).then((data, error) => {
            if (error) {
                console.log(error)
                return
            }

            let preprocessedData = preprocessData(data, downloads_metric, variable, order, download_number)
            let svg = createSVG()

            let xScale = d3.scaleLinear()
                .domain([d3.min(preprocessedData.map(row => row[downloads_metric])), d3.max(preprocessedData.map(row => row[downloads_metric]))])
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
                .text("Metrique de telechargement : " + downloads_metric);

            let bars = svg.selectAll("myRect")
                .data(preprocessedData)
                .enter()
                .append('g')
                .attr("transform", "translate(-10," + 20 + ")")

            bars.append("rect")
                .attr("y", (row) => yScale(row.value))
                .attr("width", (row) => xScale(row[downloads_metric]))
                .attr("height", () => yScale.bandwidth())
                .attr("fill", "steelblue")

            bars.append('text')
                .text(row => row[downloads_metric])
                .style("text-anchor", "middle")
                .attr("x", (row) => xScale(row[downloads_metric]) * 0.8)
                .attr("y", (row) => yScale(row.value) + yScale.bandwidth() - 10)
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "black")

            bars.on('click', () => setToolTip(true))
            bars.style('cursor', 'pointer')

            const downloadValues = getDownloadsNumber(data)
            setDownloadValues(downloadValues)

        })
    }

    const [order, setOrder] = React.useState('croissant')
    const [downloads_metric, setDownloadMetric] = React.useState('brut')
    const [variable, setVariable] = React.useState('Category')
    const [download_number, setDownloadNumber] = React.useState('1,000,000,000+')
    const [download_values, setDownloadValues] = React.useState(null)
    const [isToolTipOpen, setToolTip] = React.useState(false)

    const getDownloadsSelectors = () => {
        let array = []
        for (let i = 0; i < download_values.length; i++) {
            array.push(<MenuItem value={download_values[i]} key={i}> {download_values[i]}</MenuItem>)
        }
        return array
    }

    const [isDialogOpen, setDialogOpen] = React.useState(false)
    React.useEffect(() => {
        d3.select('.svg').selectAll('*').remove()
        createVisusalisation()
    }, [downloads_metric, variable, order, download_number])



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
            value={order}
            onChange={(event) => setOrder(event.target.value)}
        >
            <FormControlLabel value="croissant" control={<Radio />} label="Croissant" labelPlacement="top" />


            <FormControlLabel value="decroissant" control={<Radio />} label="Decroissant" labelPlacement="top" />
        </RadioGroup>
    </FormControl>)

    const Selectors = () => (<Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '45%', paddingLeft: '5%' }}>
        <FormControl size='small'>
            <InputLabel id="demo-simple-select-helper-label-">Variable</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label-variable"
                id="demo-simple-select-helper-label-variable"
                value={variable}
                label="Variable"
                onChange={(event) => setVariable(event.target.value)}
                fullWidth
            >
                <MenuItem value={'Category'}>Categories</MenuItem>
                <MenuItem value={'Genres'}>Genres</MenuItem>
                <MenuItem value={'Type'}>Type</MenuItem>
                <MenuItem value={'Content Rating'}>Evaluation du contenu</MenuItem>
                <MenuItem value={'Android Ver'}>Version minimale d’Android requise </MenuItem>
            </Select>
            <FormHelperText>Choisir la variable categorique a visualiser</FormHelperText>

        </FormControl>
        <FormControl size='small'>
            <InputLabel id="demo-simple-select-helper-label-">Metrique de telechargements</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label-dl"
                id="demo-simple-select-helper-label-dl"
                value={downloads_metric}
                label="Metrique de telechargement"
                onChange={(event) => setDownloadMetric(event.target.value)}
                fullWidth
            >
                <MenuItem value={'brut'}>Brut</MenuItem>
                <MenuItem value={'moyen'}>Moyen</MenuItem>
                <MenuItem value={'Nombre applications'}>Par tranche d'applications </MenuItem>
                <MenuItem value={'Nombre applications moyen'}>Par tranche d'applications moyen (TODO)</MenuItem>
            </Select>
            <FormHelperText>Choisir la metrique de telechargement a visualiser</FormHelperText>
        </FormControl>
        {(downloads_metric === 'Nombre applications' || downloads_metric === 'Nombre applications moyen') &&
            <FormControl size='small'>
                <InputLabel id="demo-simple-select-helper-labeld">Nombre de telechargements </InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label-variable"
                    id="demo-simple-select-helper-label-variable"
                    value={download_number}
                    label="Variable"
                    onChange={(event) => setDownloadNumber(event.target.value)}
                    fullWidth
                >
                    {getDownloadsSelectors()}
                </Select>
                <FormHelperText>Choisir le nombre de telechargement a considerer</FormHelperText>

            </FormControl>
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