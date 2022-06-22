
import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/Help';
import '../index.css';


export const ToolTip = (props) => {
    const {onClick} = props
    return ( <HelpOutlineIcon onClick={onClick} className="icon"></HelpOutlineIcon>)
}