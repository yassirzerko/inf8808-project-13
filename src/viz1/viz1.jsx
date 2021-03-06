import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { NavBar } from "../components/NavBar";
import React from "react";
import * as d3 from "d3";
import { CSV_URL } from "../constants";
import {
  preprocessData,
  getDownloadsRanges,
  getHtmlToolTip,
  getAxisName,
  CONSTANTS,
} from "./utils";
import { Selector } from "../components/Selector";
import { RadioButtons } from "../components/RadioButtons";
import { Modal } from "../components/Modal";
import "../index.css";
import { LegendViz1 } from "../components/Legend";
import { getDataContainer, addTooltip } from "../vizUtils";

export function Categorical() {
  const [isAscending, setAscending] = React.useState(false);
  const [downloadsMetric, setDownloadMetric] = React.useState(
    CONSTANTS.downloadsMetricSelector.values[0]
  );
  const [variable, setVariable] = React.useState(
    CONSTANTS.variableSelector.values[0]
  );
  const [downloadsRange, setDownloadsRange] = React.useState("1,000,000,000+");
  const [downloadsRanges, setDownloadsRanges] = React.useState(null);
  const [modalData, setModalData] = React.useState({
    isOpen: false,
    title: null,
    content: null,
  });
  const [stats, setStats] = React.useState({
    avg: null,
    std: null,
    top: null,
    low: null,
    nValues: null,
  });

  const createVisusalisation = () => {
    d3.csv(CSV_URL).then((data, error) => {
      if (error) {
        console.log(error);
        return;
      }
      let preprocessedData = preprocessData(
        data,
        downloadsMetric,
        variable,
        isAscending,
        downloadsRange
      );
      setStats({
        avg: preprocessedData.avg,
        std: preprocessedData.std,
        top: preprocessedData.topValue,
        low: preprocessedData.lowValue,
        nValues: preprocessedData.nValues,
      });
      let dataLength = preprocessedData.length;
      let xScale = d3
        .scaleLinear()
        .domain([
          d3.min(preprocessedData.map((row) => row[downloadsMetric].value)),
          d3.max(preprocessedData.map((row) => row[downloadsMetric].value)),
        ])
        .range([0, window.screen.width * 0.75]);

      let yScale = d3
        .scaleBand()
        .range([0, preprocessedData.length * 50])
        .domain(preprocessedData.map((row) => row.value))
        .padding(0.4);

      let dataContainer = getDataContainer(
        xScale,
        yScale,
        getAxisName(downloadsMetric, downloadsRange),
        getAxisName(variable),
        preprocessedData
      );
      let toolTip = addTooltip();

      dataContainer
        .append("rect")
        .attr("y", (row) => yScale(String(row.value)))
        .attr("width", (row) => xScale(row[downloadsMetric].value))
        .attr("height", () => yScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("opacity", 0.7)
        .attr("id", (row, i) => "bar-" + i)
        .on("mouseover", function (event, row) {
          d3.select(this).transition().duration(50).attr("opacity", 1);

          toolTip.transition().duration(50).style("opacity", 1);

          toolTip
            .html(getHtmlToolTip(row, dataLength, downloadsRange))
            .style("left", event.pageX + 20 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", function (event, row) {
          d3.select(this).transition().duration(50).attr("opacity", 0.7);

          toolTip.transition().duration(50).style("opacity", 0);
        });

      dataContainer
        .append("text")
        .text((row) => {
          return row[downloadsMetric].value % 1
            ? d3.format(".2f")(row[downloadsMetric].value)
            : row[downloadsMetric].value;
        })
        .style("text-anchor", "middle")
        .attr("x", 100)
        .attr("y", (row) => yScale(row.value) + yScale.bandwidth() - 10)
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .on("mouseover", function (event, row) {
          d3.select(this).transition().duration(50).attr("opacity", 1);

          toolTip.transition().duration(50).style("opacity", 1);

          toolTip
            .html(getHtmlToolTip(row, dataLength, downloadsRange))
            .style("left", event.pageX + 20 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", function (event, row) {
          d3.select(this).transition().duration(50).attr("opacity", 0.7);

          toolTip.transition().duration(50).style("opacity", 0);
        });

      setDownloadsRanges(getDownloadsRanges(data));
    });
  };

  React.useEffect(() => {
    createVisusalisation();
  }, [downloadsMetric, variable, isAscending, downloadsRange]);

  const shouldDisplayDlsRangesSelector =
    downloadsMetric === CONSTANTS.downloadsMetricSelector.values[2] ||
    downloadsMetric === CONSTANTS.downloadsMetricSelector.values[3];

  return (
    <Box height={"auto"} m={0} p={0}>
      <NavBar></NavBar>
      <Modal
        isOpen={modalData.isOpen}
        onClose={() =>
          setModalData({ isOpen: false, title: null, content: null })
        }
        title={modalData.title}
        content={modalData.content}
      />
      <Typography variant="h6" color="text.primary" pl={"30%"} pt={2}>
        {CONSTANTS.title}
      </Typography>
      <Box
        pl={"5%"}
        pt={2}
        sx={{ display: "flex", justifyContent: "center", minWidth: "100%" }}
      >
        <Box pr={10}>
          {" "}
          <RadioButtons
            label={CONSTANTS.radioButtons.label}
            currentValue={isAscending}
            onChange={(event) => setAscending(event.target.value === "true")}
            buttonsValues={CONSTANTS.radioButtons.values}
            buttonsText={CONSTANTS.radioButtons.texts}
            onClickToolTip={() =>
              setModalData({
                isOpen: true,
                title: CONSTANTS.radioButtons.label,
                content: CONSTANTS.radioButtons.modalContent,
              })
            }
          ></RadioButtons>
        </Box>

        <Box pr={10}>
          <Selector
            inputLabel={CONSTANTS.variableSelector.label}
            currentValue={variable}
            onChange={(event) => setVariable(event.target.value)}
            menuItemsValues={CONSTANTS.variableSelector.values}
            menuItemsText={CONSTANTS.variableSelector.texts}
            helperText={CONSTANTS.variableSelector.helper}
            onClickToolTip={() =>
              setModalData({
                isOpen: true,
                title: "Variable ",
                content: CONSTANTS.variableSelector.modalContent,
              })
            }
          />
        </Box>

        <Box pr={10}>
          <Selector
            inputLabel={CONSTANTS.downloadsMetricSelector.label}
            currentValue={downloadsMetric}
            onChange={(event) => setDownloadMetric(event.target.value)}
            menuItemsValues={CONSTANTS.downloadsMetricSelector.values}
            menuItemsText={CONSTANTS.downloadsMetricSelector.texts}
            helperText={CONSTANTS.downloadsMetricSelector.helper}
            onClickToolTip={() =>
              setModalData({
                isOpen: true,
                title: CONSTANTS.downloadsMetricSelector.label,
                content: CONSTANTS.downloadsMetricSelector.modalContent,
              })
            }
          />
        </Box>

        {shouldDisplayDlsRangesSelector && (
          <Selector
            inputLabel={CONSTANTS.downloadsRangeSelector.label}
            currentValue={downloadsRange}
            onChange={(event) => setDownloadsRange(event.target.value)}
            menuItemsValues={downloadsRanges ? downloadsRanges : []}
            menuItemsText={downloadsRanges ? downloadsRanges : []}
            helperText={CONSTANTS.downloadsRangeSelector.helper}
            onClickToolTip={() =>
              setModalData({
                isOpen: true,
                title: CONSTANTS.downloadsRangeSelector.label,
                content: CONSTANTS.downloadsRangeSelector.modalCOntent,
              })
            }
          ></Selector>
        )}
      </Box>
      <LegendViz1
        variableName={getAxisName(variable)}
        downloadsMetric={getAxisName(downloadsMetric, downloadsRange)}
        avg={stats.avg}
        std={stats.std}
        top={stats.top}
        low={stats.low}
        nValues={stats.nValues}
      ></LegendViz1>
      <Box id="svg" p={2}></Box>
    </Box>
  );
}
