import FormControl from '@mui/material/FormControl';
import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

export const Selector = (props) => {
    const {inputLabel, currentValue, onChange, menuItemsValues, menuItemsText ,helperText} = props

    let menuItems = []
    for (let i = 0; i < menuItemsValues.length; i++) {
        menuItems.push(<MenuItem value={menuItemsValues[i]} key={i}> {menuItemsText[i]}</MenuItem>)
    }

    return(
    <FormControl size='small'>
                <InputLabel id={"select-helper-"+inputLabel}>{inputLabel}</InputLabel>
                <Select
                    labelId={"simple-select-helper-label"+inputLabel}
                    id={"simple-select-helper-label"+inputLabel}
                    value={currentValue}
                    label={inputLabel}
                    onChange={onChange}
                    fullWidth
                >
                    {menuItems}
                </Select>
                <FormHelperText>{helperText}</FormHelperText>

    </FormControl>)
}