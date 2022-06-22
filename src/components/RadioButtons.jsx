import { Box } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import React from 'react';


export const RadioButtons = (props) => {
    const {label, currentValue, onChange, buttonsValues, buttonsText} = props

    let radioButtons = []
    for (let i = 0; i < buttonsValues.length; i++) {
        radioButtons.push( <FormControlLabel value={buttonsValues[i]} control={<Radio />} label={buttonsText[i]} labelPlacement="top" />)
    }
    return (
    <FormControl>
    <Box pl={5}><FormLabel id={"row-radio-buttons-group-label-"+label}>{label}</FormLabel></Box>

    <RadioGroup
        row
        aria-labelledby={"row-radio-buttons-group-label-"+label}
        name={"row-radio-buttons-group-"+label}
        value={currentValue}
        onChange={onChange}
    >
    {radioButtons}
    </RadioGroup>
</FormControl>)}