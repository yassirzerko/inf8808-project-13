import { Box } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import React from "react";
import { ToolTip } from "./ToolTip";

export const RadioButtons = (props) => {
  const {
    label,
    currentValue,
    onChange,
    buttonsValues,
    buttonsText,
    onClickToolTip,
  } = props;

  let radioButtons = [];
  for (let i = 0; i < buttonsValues.length; i++) {
    radioButtons.push(
      <FormControlLabel
        value={buttonsValues[i]}
        control={<Radio />}
        label={buttonsText[i]}
        labelPlacement="top"
      />
    );
  }
  return (
    <Box sx={{ display: "flex" }}>
      <FormControl>
        <Box pl={5}>
          <FormLabel id={"row-radio-buttons-group-label-" + label}>
            {label}
          </FormLabel>
        </Box>
        <RadioGroup
          row
          aria-labelledby={"row-radio-buttons-group-label-" + label}
          name={"row-radio-buttons-group-" + label}
          value={currentValue}
          onChange={onChange}
        >
          {radioButtons}
          {onClickToolTip && <ToolTip onClick={onClickToolTip}></ToolTip>}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
