import { Link } from "react-router-dom";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import { Box } from "@mui/material";

const buttonData = [
  ["/", "Accueil", "Page d'accueil"],
  [
    "/categorical",
    "Visualisation 1",
    "Exploration du comportement des variables catégoriques et des téléchargements",
  ],
  [
    "/type",
    "Visualisation 2",
    "Comparaison des distributions des applications gratuites et payantes",
  ],
  [
    "/numerical",
    "Visualisation 3",
    "Exploration du comportement des variables numériques et des téléchargements",
  ],
];

export function NavBar() {
  const ButtonGroups = () => {
    const currentPath = window.location.pathname;
    let buttons = [];
    for (const element of buttonData) {
      let [link, title, hover] = element;
      const isCurrentPage = currentPath === link;
      buttons.push(
        <Tooltip key={link} title={hover} placement="bottom">
          <Button
            key={link}
            component={Link}
            to={link}
            variant="contained"
            color="primary"
            href="#"
            disabled={isCurrentPage}
          >
            <Box
              sx={
                isCurrentPage
                  ? { borderBottom: "1px solid" }
                  : { borderBottom: "none" }
              }
            >
              {title}
            </Box>
          </Button>
        </Tooltip>
      );
    }
    return (
      <ButtonGroup
        size="large"
        variant="contained"
        aria-label="outlined primary button group"
        sx={{ height: 60 }}
      >
        {buttons}
      </ButtonGroup>
    );
  };

  return (
    <AppBar position="sticky">
      <ButtonGroups />
    </AppBar>
  );
}
