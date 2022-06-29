import FormControl from "@mui/material/FormControl";
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import { Box } from "@mui/material";
import { ToolTip } from "./ToolTip";

// Pass onClickToolTip if you want a toolTip
export const Selector = (props) => {
  const {
    inputLabel,
    currentValue,
    onChange,
    menuItemsValues,
    menuItemsText,
    helperText,
    onClickToolTip,
  } = props;

  let menuItems = [];
  for (let i = 0; i < menuItemsValues.length; i++) {
    menuItems.push(
      <MenuItem value={menuItemsValues[i]} key={i}>
        {" "}
        {menuItemsText[i]}
      </MenuItem>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <FormControl size="small">
        <InputLabel id={"select-helper-" + inputLabel}>{inputLabel}</InputLabel>
        <Select
          labelId={"simple-select-helper-label" + inputLabel}
          id={"simple-select-helper-label" + inputLabel}
          value={currentValue}
          label={inputLabel}
          onChange={onChange}
          fullWidth
        >
          {menuItems}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
      {onClickToolTip && (
        <Box sx={{ paddingTop: "10px", paddingLeft: "15px" }}>
          <ToolTip onClick={onClickToolTip}></ToolTip>
        </Box>
      )}
    </Box>
  );
};
