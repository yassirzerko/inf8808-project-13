export const CONSTANTS = {
  variableSelector: {
    values: ["Category", "Genres", "Content Rating"],
    texts: ["Catégorie", "Genres", "Evaluation de contenu"],
    helper: "Choisir la variable catégorique à visualiser",
    label: "Variable",
    modalContent:
      " <h4> Choisir la variable dont vous voulez explorer le comportement .</h4> Vous avez le choix entre les 3 variables suivantes : <ul> <li> Catégorie </li> <li> Evaluation de contenu </li> <li> Genres </li> </ul>",
  },
  radioButtons: {
    values: [true, false],
    texts: ["Croissant", "Décroissant"],
    label: "Ordonnancement",
    modalContent:
      "Choisir l'ordre dans lequel les valeurs seront ordonnées selon la métrique de téléechargements choisie. ",
  },
  title:
    "Visualisation 2 : Comparaison des distributions des applications gratuites et payantes",
  legend: "* l'ordonnancement s'applique sur les applications gratuites",
};

/* Dynamically get the content of the tooltip  */
export const getHtmlToolTip = (row, dataLength) => {
  return `<h4> Valeur : ${row.value} </h4> 
    <p> <b> Distribution de cette valeur parmi les applications gratuites </b>: ${row.free.distribution.toLocaleString()} %  (${
    row.free.position
  }/${dataLength})</p> 
    <p> <b> Nombre d'applications gratuites avec cette valeur </b>:  ${
      row.free.count
    }</p> 
    <p> <b> Distribution de cette valeur parmi les applications payantes </b>: ${row.paid.distribution.toLocaleString()} %  (${
    row.paid.position
  }/${dataLength})</p> 
    <p> <b> Nombre d'applications payante avec cette valeur </b>:  ${
      row.paid.count
    }</p> 
    `;
};

/* Get the axis name given the variable it represents  */
export const getAxisName = (variableName) => {
  if (variableName === "Category") {
    return "Catégories";
  }

  if (variableName === "Content rating") {
    return "Evaluation de contenu";
  }

  return variableName;
};

/* Sort the data given the variable */
const handleSort = (preprocessedData, isAscending, type) => {
  let sortMethod = isAscending
    ? (b, a) => b[type].distribution - a[type].distribution
    : (b, a) => a[type].distribution - b[type].distribution;
  preprocessedData.sort(sortMethod);
};

/** Add Others value to the preprocessed data */
const getDataWithOthers = (preprocessedData) => {
  if (preprocessedData.length <= 20) {
    return preprocessedData;
  }
  let others = preprocessedData.slice(20, preprocessedData.length);
  preprocessedData = preprocessedData.slice(0, 20);
  let othersData = {
    free: { count: 0, distribution: 0 },
    paid: { count: 0, distribution: 0 },
  };
  othersData.value = "AUTRES";
  for (const other of others) {
    othersData.free.count += other.free.count;
    othersData.free.distribution += parseFloat(other.free.distribution);
    othersData.paid.count += other.paid.count;
    othersData.paid.distribution += parseFloat(other.paid.distribution);
  }

  othersData.paid.distribution = othersData.paid.distribution.toFixed(2);
  othersData.free.distribution = othersData.free.distribution.toFixed(2);
  preprocessedData.push(othersData);
  return preprocessedData;
};

/* Skip the outlier data */
const shouldSkip = (variableName, value) => {
  return (
    (variableName === CONSTANTS.variableSelector.values[0] &&
      value === "1.9") ||
    (variableName === CONSTANTS.variableSelector.values[2] && value === "") ||
    (variableName === CONSTANTS.variableSelector.values[1] &&
      value === "February 11, 2018")
  );
};

/* Preprocess the data */
export const preprocessData = (data, variableName, isAscending) => {
  let nAppByValueFree = new Map();
  let nAppByValuePaid = new Map();
  let totalFreeCount = 0;
  let totalFreeReviews = 0;
  let totalPaidCount = 0;
  let totalPaidReviews = 0;
  let totalFreeRate = 0;
  let totalPaidRate = 0;
  let skippedFreeRate = 0;
  let skippedPaidRate = 0;

  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    let value = row[variableName];
    if (shouldSkip(variableName, value)) {
      if (row.Type === "Free") {
        skippedFreeRate += 1;
      } else {
        skippedPaidRate += 1;
      }
      continue;
    }
    if (row.Type === "Free") {
      nAppByValueFree.set(
        value,
        nAppByValueFree.has(value) ? nAppByValueFree.get(value) + 1 : 1
      );
      nAppByValuePaid.set(
        value,
        nAppByValuePaid.has(value) ? nAppByValuePaid.get(value) : 0
      );
      totalFreeCount += 1;
      totalFreeReviews += parseFloat(row.Reviews);
      if (isNaN(parseFloat(row.Rating))) {
        skippedFreeRate += 1;
        continue;
      }
      totalFreeRate += parseFloat(row.Rating);
      continue;
    }
    nAppByValuePaid.set(
      value,
      nAppByValuePaid.has(value) ? nAppByValuePaid.get(value) + 1 : 1
    );
    nAppByValueFree.set(
      value,
      nAppByValueFree.has(value) ? nAppByValueFree.get(value) : 0
    );
    totalPaidCount += 1;
    totalPaidReviews += parseFloat(row.Reviews);
    if (isNaN(parseFloat(row.Rating))) {
      skippedPaidRate += 1;
      continue;
    }
    totalPaidRate += parseFloat(row.Rating);
  }
  let preprocessedData = [];

  for (let [value, freeCount] of nAppByValueFree) {
    let paidCount = nAppByValuePaid.get(value);
    let freeDistribution = (freeCount / totalFreeCount) * 100;
    let paidDistribution = (paidCount / totalPaidCount) * 100;

    preprocessedData.push({
      value: value,
      free: {
        count: freeCount,
        distribution: freeDistribution.toFixed(2),
      },
      paid: {
        count: paidCount,
        distribution: paidDistribution.toFixed(2),
      },
    });
  }

  handleSort(preprocessedData, isAscending, "free");
  preprocessedData = getDataWithOthers(preprocessedData);
  for (let j = 0; j < preprocessedData.length; j++) {
    preprocessedData[j].free.position = j + 1;
  }

  handleSort(preprocessedData, isAscending, "paid");

  for (let j = 0; j < preprocessedData.length; j++) {
    preprocessedData[j].paid.position = j + 1;
  }

  handleSort(preprocessedData, isAscending, "free");

  return {
    preprocessedData: preprocessedData,
    free: {
      reviews: totalFreeReviews / totalFreeCount,
      rating: totalFreeRate / (totalFreeCount - skippedFreeRate),
    },

    paid: {
      reviews: totalPaidReviews / totalPaidCount,
      rating: totalPaidRate / (totalPaidCount - skippedPaidRate),
    },
  };
};
