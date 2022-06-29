export const CONSTANTS = {
  variables: {
    Size: "Taille",
    Rating: "Note",
    Reviews: "Nombre d evaluation",
    Price: "Prix",
  },
  xAxisSelector: {
    helper: "Choisir la variable a visualiser sur l axe horizontal",
    label: "Axe horizontal",
    modalContent: "Choisir quelle variable explorer sur l axe horizontal",
  },
  yAxisSelector: {
    helper: "Choisir la variable a visualiser sur l axe vertical",
    label: "Axe vertical",
    modalContent: "Choisir quelle variable explorer sur l axe vertical",
  },
  title:
    "Visualisation 3 : Exploration du comportement des variables numériques et des téléchargements",
};
/* Get the axis name given the variable it represents  */
export const getAxisName = (variableName) => {
  if (variableName === "Size") {
    return "Taille en mega octets";
  }

  if (variableName === "Reviews") {
    return "Nombre d'evaluation";
  }

  if (variableName === "Rating") {
    return "Note ";
  }
};

/* Dynamically get the content of the tooltip  */
export const getHtmlToolTip = (row, axes) => {
  return `<h4> Moyenne des applications avec ${row.downloadRange} telechargements </h4> 
    <p> <b> Regroupe </b> : ${row.nApp} applications <p> 
    <p> <b> Valeur moyenne de ${getAxisName(axes.xAxis)} </b> : ${row.xAvg.toFixed(2)} <p>
    <p> <b> Valeur moyenne de ${getAxisName(axes.yAxis)} </b> : ${row.yAvg.toFixed(2)} <p>
    `;
};

/*Get text to display for each value in axis selector based on selected values */
export const getAxesData = (xAxisValue, yAxisValue) => {
  let variablesData = CONSTANTS.variables;
  let xAxisData = [];
  let yAxisData = [];
  for (let variableName in variablesData) {
    let variableText = variablesData[variableName];
    if (xAxisValue === variableName) {
      xAxisData.push([variableName, variableText]);
    } else if (yAxisValue === variableName) {
      yAxisData.push([variableName, variableText]);
    } else {
      xAxisData.push([variableName, variableText]);
      yAxisData.push([variableName, variableText]);
    }
  }

  return { xAxisData: xAxisData, yAxisData: yAxisData };
};

/* Sanitize data based on the variable it represents*/
const sanitizeData = (value, variable) => {
  if (!isNaN(value)) {
    return parseFloat(value);
  }

  if (variable === "Rating" || variable === "Reviews") {
    value = parseFloat(value);
  }

  if (variable === "Price") {
    value = parseFloat(value.includes("$") ? value.replaceAll("$", "") : value);
  }

  if (variable === "Size") {
    if (value === "Varies with device") {
      return null;
    }
    value =
      (value.includes("M")
        ? parseFloat(value.replaceAll("M", "")) * Math.pow(10, 6)
        : parseFloat(value.replaceAll("k", "")) * Math.pow(10, 3)) /
      Math.pow(10, 6);
  }

  return isNaN(value) ? null : value;
};

/* Preprocess and return the data */
export const preprocessData = (data, axes) => {
  let preprocessedData = [];
  let variablesValuesDownloadRanges = new Map();
  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    let downloadRange = row.Installs;

    if (
      downloadRange === "Free" ||
      downloadRange === "0" ||
      downloadRange === "0+"
    ) {
      continue;
    }

    if (!variablesValuesDownloadRanges.has(downloadRange)) {
      variablesValuesDownloadRanges.set(downloadRange, []);
    }
    variablesValuesDownloadRanges
      .get(downloadRange)
      .push([row[axes.xAxis], row[axes.yAxis]]);
  }

  for (let [downloadRange, variablesValues] of variablesValuesDownloadRanges) {
    let xSum = 0;
    let ySum = 0;
    let nApp = variablesValues.length;
    let skipped = 0;
    for (let i = 0; i < nApp; i++) {
      let [xValue, yValue] = variablesValues[i];
      xValue = sanitizeData(xValue, axes.xAxis);
      yValue = sanitizeData(yValue, axes.yAxis);
      if (!xValue || !yValue) {
        skipped += 1;
        continue;
      }

      xSum += xValue;
      ySum += yValue;
    }
    nApp -= skipped;
    let preprocessedRow = {};
    preprocessedRow = {
      downloadRange: downloadRange,
      xAvg: xSum / nApp,
      yAvg: ySum / nApp,
      nApp: nApp,
    };
    preprocessedData.push(preprocessedRow);
  }

  return preprocessedData;
};
