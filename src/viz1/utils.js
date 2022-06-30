import * as d3 from "d3";

export const CONSTANTS = {
  variableSelector: {
    values: ["Category", "Genres", "Type", "Content Rating", "Android Ver"],
    texts: [
      "Catégorie",
      "Genres",
      "Type",
      "Evaluation de contenu",
      "Version minimale d’Android requise",
    ],
    helper: "Choisir la variable catégorique à visualiser",
    label: "Variable",
    modalContent:
      " <h4> Choisir la variable dont vous voulez explorer le comportement .</h4> Vous avez le choix entre les 5 variables suivantes : <ul> <li> Catégorie </li> <li> Evaluation de contenu </li> <li> Version minimale Android requise </li> <li> Genres </li> <li> Type (application payante ou grauite) </li> </ul>",
  },
  downloadsMetricSelector: {
    values: ["sum", "avg", "nApp", "avgNApp"],
    texts: [
      "Somme",
      "Moyenne",
      "Nombre d'applications avec + ",
      "Nombre d'applications avec + moyen",
    ],
    helper: "Choisir la métrique de téléchargements à visualiser",
    label: "Metrique de telechargements",
    modalContent:
      "<h4> Choisir la métrique de téléchargements que vous voulez utiliser. </h4> Vous avez le choix entre les 4 métrique de téléchargements suivantes : <ul> <li> Nombre de téléchargements :  Somme des téléchargements de toutes les applications avec une certaines valeurs catégoriques (en fonction de la variable chosie) </li> <li> Nombre de téléchargements moyen : Ratio entre le nombre de téléchargements de toutes les applications avec une certaine valeur catégorique et le nombre d’applications avec cette valeur catégorique </li> <li> Nombre d’applications avec plus de n téléchargements : Nombre d’applications avec plus de n (+100, +100 000+, ...) téléchargements pour une certaine valeur catégorique </li> <li> Nombre d’applications avec plus de n téléchargements moyens : Ratio entre le nombre d’applications avec plus de n téléchargements pour une certaine valeur catégorique et le nombre d’applications avec cette valeur catégorique </li> <li> Nombre d’applications avec plus de n téléchargements moyens : Ratio entre le nombre d’applications avec plus de n téléchargement pour une certaine valeur catégorique et le nombre d’applications avec cette valeur catégorique </li> </ul>",
  },
  radioButtons: {
    values: [true, false],
    texts: ["Croissant", "Décroissant"],
    label: "Ordonnancement",
    modalContent:
      "Choisir l'ordre dans lequel les valeurs seront ordonnées selon la métrique de téléchargements choisies. ",
  },
  downloadsRangeSelector: {
    label: "Nombre de téléchargements",
    helper: "Choisir la tranche de téléchargements",
    modalCOntent:
      " “n” réfère à une valeur faisant reference a la tranche de telechargement d'une application ( “+10” , “+ 10 000” …). <ul> <li> Nombre d’applications avec plus de n téléchargements : Nombre d’applications avec plus de n téléchargements pour une certaine valeur catégorique </li> <li> Nombre d’applications avec plus de n téléchargements moyens : Ratio entre le nombre d’applications avec plus de n téléchargements pour une certaine valeur catégorique et le nombre d’applications avec cette valeur catégorique </li>",
  },
  title:
    "Visualisation 1 : Exploration du comportement des variables catégoriques et des téléchargements",
};

/* Dynamically get the content of the tooltip  */
export const getHtmlToolTip = (row, dataLength, downloadsRange) => {
  return `<h4> Valeur : ${row.value} </h4> 
    <p> <b> Distribution </b>: ${row.distribution.value.toLocaleString()}% (${
    row.distribution.position
  }/${dataLength}) </p> 
    <p> <b> Nombre total de telechargement </b>: ${row.sum.value.toLocaleString()} (${
    row.sum.position
  }/${dataLength})</p> 
    <p> <b> Nombre de telechargement moyen </b>: ${row.avg.value.toLocaleString()} (${
    row.avg.position
  }/${dataLength})</p> 
    <p> <b> Nombre d'applications avec ${downloadsRange.toLocaleString()} telechargements  </b>: ${
    row.nApp.value
  } (${row.nApp.position}/${dataLength})</p> 
    <p> <b> Nombre d'applications avec ${downloadsRange.toLocaleString()} telechargements moyen  </b>: ${
    row.avgNApp.value
  } (${row.avgNApp.position}/${dataLength})</p> `;
};

/* Get the axis name given the variable it represents  */
export const getAxisName = (variableName, downloadsRange) => {
  if (variableName === "Category") {
    return "Catégories";
  }

  if (variableName === "Content rating") {
    return "Evaluation de contenu";
  }

  if (variableName === "Android Ver") {
    return "Version minimale d'android requise";
  }

  if (variableName === "sum") {
    return "Nombre total de téléchargements";
  }
  if (variableName === "avg") {
    return "Nombre moyen de téléchargements";
  }
  if (variableName === "nApp") {
    return `Nombre d'application avec plus de ${downloadsRange} téléchargements`;
  }

  if (variableName === "avgNApp") {
    return `Nombre d'application moyen avec plus de ${downloadsRange} téléchargements`;
  }

  return variableName;
};

/* Extract and sanitize the downloads ranges from the data  */
export const getDownloadsRanges = (data) => {
  let uniques = new Set();
  for (const element of data) {
    let downloadRange = element["Installs"];
    if (
      downloadRange === "Free" ||
      downloadRange === "0" ||
      downloadRange === "0+"
    ) {
      continue;
    }
    uniques.add(downloadRange);
  }
  return Array.from(uniques).sort(
    (a, b) =>
      parseInt(b.replaceAll("+", "").replaceAll(",", "")) -
      parseInt(a.replaceAll("+", "").replaceAll(",", ""))
  );
};

/* Sort the data given the downloads metric */
const handleSort = (preprocessedData, isAscending, downloadsMetric) => {
  let sortMethod = isAscending
    ? (b, a) => b[downloadsMetric].value - a[downloadsMetric].value
    : (b, a) => a[downloadsMetric].value - b[downloadsMetric].value;
  preprocessedData.sort(sortMethod);
};

/* Fill the maps used by preprocessData */
const fillMaps = (
  data,
  variableName,
  sumDlsByValue,
  occurrencesByValue,
  nAppByValueData
) => {
  for (const element of data) {
    let row = element;
    if (
      (variableName === CONSTANTS.variableSelector.values[0] &&
        element[variableName] === "1.9") ||
      (variableName === CONSTANTS.variableSelector.values[3] &&
        element[variableName] === "")
    ) {
      continue;
    }
    let downloads = parseInt(
      row.Installs.replaceAll("+", "").replaceAll(",", "")
    )
      ? parseInt(row.Installs.replaceAll("+", "").replaceAll(",", ""))
      : 0;
    let variableValue = row[variableName];
    if (variableValue === "NaN") {
      continue;
    }
    sumDlsByValue.set(
      variableValue,
      sumDlsByValue.has(variableValue)
        ? sumDlsByValue.get(variableValue) + downloads
        : downloads
    );
    occurrencesByValue.set(
      variableValue,
      occurrencesByValue.has(variableValue)
        ? occurrencesByValue.get(variableValue) + 1
        : 1
    );

    let [nAppByValue, downloadsRange] = nAppByValueData;
    if (row.Installs === downloadsRange) {
      nAppByValue.set(
        variableValue,
        nAppByValue.has(variableValue) ? nAppByValue.get(variableValue) + 1 : 1
      );
    }
  }
};

/* Add to the preprocessed data the ranking of each element according to each metric */
const addRankingsMetrics = (preprocessedData) => {
  const metrics = [...CONSTANTS.downloadsMetricSelector.values, "distribution"];
  for (const metric of metrics) {
    handleSort(preprocessedData, false, metric);

    for (let j = 0; j < preprocessedData.length; j++) {
      preprocessedData[j][metric]["position"] = j + 1;
    }
  }
};

/* Add to the preprocessed data statistics about the data */
const addStatsMetrics = (preprocessedData, downloadsMetric, dataLength) => {
  let avg = 0;
  for (const element of preprocessedData) {
    avg += element[downloadsMetric].value;
  }
  avg = avg / preprocessedData.length;
  let standardDeviation = Math.sqrt(
    preprocessedData
      .map((x) => Math.pow(x[downloadsMetric].value - avg, 2))
      .reduce((a, b) => a + b) / preprocessedData.length
  );

  let first = preprocessedData[0];
  let last = preprocessedData[preprocessedData.length - 1];

  preprocessedData.avg = d3.format(".2f")(avg);
  preprocessedData.std = d3.format(".2f")(standardDeviation);

  preprocessedData.topValue = [first.value, first[downloadsMetric].value];
  preprocessedData.lowValue = [last.value, last[downloadsMetric].value];
  preprocessedData.nValues = dataLength;
};

/** Add Others value to the preprocessed data */
const getDataWithOthers = (preprocessedData) => {
  let others = preprocessedData.slice(20, preprocessedData.length);
  preprocessedData = preprocessedData.slice(0, 20);
  const metrics = [...CONSTANTS.downloadsMetricSelector.values, "distribution"];
  let othersData = {};
  othersData.value = "AUTRES";
  for (const metric of metrics) {
    othersData[metric] = { value: 0 };
    for (let i = 0; i < others.length; i++) {
      othersData[metric].value += others[i][metric].value;
    }
    if (
      metric === "distribution" ||
      metric === CONSTANTS.downloadsMetricSelector.values[0] ||
      metric === CONSTANTS.downloadsMetricSelector.values[2]
    ) {
      continue;
    }
    othersData[metric].value = isNaN(othersData[metric] / others.length)
      ? 0
      : othersData[metric] / others.length;
  }

  preprocessedData.push(othersData);
  return preprocessedData;
};

/* Preprocess and return the data */
export const preprocessData = (
  data,
  downloadsMetric,
  variableName,
  isAscending,
  downloadsRange
) => {
  let sumDlsByValue = new Map();
  let occurrencesByValue = new Map();
  let nAppByValue = new Map();

  fillMaps(data, variableName, sumDlsByValue, occurrencesByValue, [
    nAppByValue,
    downloadsRange,
  ]);

  let preprocessedData = [];
  for (let [value, sumDls] of sumDlsByValue) {
    let distribution = (occurrencesByValue.get(value) / data.length) * 100;
    let meanDls = sumDls / occurrencesByValue.get(value);
    let nApp = nAppByValue.has(value) ? nAppByValue.get(value) : 0;
    let meanNApp =
      (nAppByValue.has(value) ? nAppByValue.get(value) : 0) /
      occurrencesByValue.get(value);

    let preprocessedValue = {
      value: value,
      sum: { value: sumDls },
      avg: { value: meanDls },
      distribution: { value: distribution },
      nApp: { value: nApp },
      avgNApp: { value: meanNApp },
    };
    preprocessedData.push(preprocessedValue);
  }

  const originalLength = preprocessedData.length;
  handleSort(preprocessedData, isAscending, downloadsMetric);
  preprocessedData = getDataWithOthers(preprocessedData);
  handleSort(preprocessedData, isAscending, downloadsMetric);
  addStatsMetrics(preprocessedData, downloadsMetric, originalLength);
  addRankingsMetrics(preprocessedData);
  handleSort(preprocessedData, isAscending, downloadsMetric);
  return preprocessedData;
};
