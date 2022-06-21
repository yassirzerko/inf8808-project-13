import { Link } from "react-router-dom";
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';


const buttonData = [["/", "Accueil", "Page d'accueil"], ["/categorical", "Visualisation 1", "Exploration du comportement des variables catégoriques et des téléchargements"], ["/numerical", "Visualisation 2", "Exploration du comportement des variables numériques et des téléchargements"], ["/type", "Visualisation 3","Comparaison des distributions des applications gratuites et payantes" ]]

export function NavBar() {
  const ButtonGroups = () => {
    const currentPath = window.location.pathname
    let buttons = []
    for (let i = 0; i < buttonData.length; i++) {
      let [link, title, hover] = buttonData[i]
      buttons.push(<Tooltip title = {hover} placement="bottom">
        <Button key = {link} component={Link} to={link} variant="contained" color="primary" href="#"  disabled = {currentPath === link} >
      {title}
    </Button>
        </Tooltip>
      )
    }
    return (
      <ButtonGroup size="large" variant="contained" aria-label="outlined primary button group" sx = {{height:60}}>
        {
          buttons
        }
      </ButtonGroup>
    )
  }

  return (
    <AppBar position="sticky" variant = "outlined">
      <ButtonGroups/>
    </AppBar>
  )
}