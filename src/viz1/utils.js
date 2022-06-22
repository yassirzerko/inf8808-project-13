export const CONSTANTS = {
    variableSelector: {
        values: ['Category', 'Genres', 'Type', 'Content Rating', 'Android Ver'],
        texts: ['Categorie', 'Genres', 'Type', 'Evaluation de contenu', 'Version minimale d’Android requise'],
        helper: 'Choisir la variable categorique a visualiser',
        label: 'Variable'
    },
    downloadsMetricSelector: {
        values: ['sum', 'avg', 'nApp', 'avgNApp'],
        texts: ['Somme', 'Moyenne', 'Nombre applications avec +', 'Nombre applications avec + moyen'],
        helper: 'Choisir la metrique de telechargement a visualiser',
        label: 'Metrique de telechargements'
    },
    radioButtons: {
        values: [true, false],
        texts: ['Croissant', 'Decroissant'],
        label: 'Ordonnancement'
    },
    title: 'Visualisation 1 : Exploration du comportement des variables catégoriques et des téléchargements',
    modal: {
        title: 'Informations supplementaires',
        content: 'TODO',
    },

}

export const getDownloadsRanges = (data) => {
    let uniques = new Set()
    for (let i = 0; i < data.length; i++) {
        uniques.add(data[i]['Installs'])
    }
    return Array.from(uniques).sort((a, b) => parseInt(b.replaceAll('+', '').replaceAll(',', '')) - parseInt(a.replaceAll('+', '').replaceAll(',', '')))
}

const handleSort = (preprocessedData, isAscending, downloadsMetric) => {
    let sortMethod = isAscending ? (b, a) => b[downloadsMetric].value - a[downloadsMetric].value : (b, a) => a[downloadsMetric].value - b[downloadsMetric].value
    preprocessedData.sort(sortMethod)
}

// nAppByValue is filled only if not nul
const fillMaps = (data, variableName, sumDlsByValue, occurrencesByValue, nAppByValueData) => {
    for (let i = 0; i < data.length; i++) {
        let row = data[i]
        let downloads = parseInt(row.Installs.replaceAll('+', '').replaceAll(',', ''))
        let variableValue = row[variableName]
        sumDlsByValue.set(variableValue, sumDlsByValue.has(variableValue) ? sumDlsByValue.get(variableValue) + downloads : downloads)
        occurrencesByValue.set(variableValue, occurrencesByValue.has(variableValue) ? occurrencesByValue.get(variableValue) + 1 : 1)

        if (nAppByValueData) {
            let [nAppByValue, download_number] = nAppByValueData
            if (row.Installs === download_number) {
                nAppByValue.set(variableValue, nAppByValue.has(variableValue) ? nAppByValue.get(variableValue) + 1 : 1)
            }
        }
    }
}

const addPositionsMetrics = (preprocessedData,) => {
  //  const metrics = [...CONSTANTS.downloadsMetricSelector.values, 'distribution']  cree un bug je sais pas prkoi
  const metrics = CONSTANTS.downloadsMetricSelector.values
    for (let i = 0; i < metrics.length; i++) {
        let metric = metrics[i]
        handleSort(preprocessedData, false, metric)

        for (let j = 0; j < preprocessedData.length; j++) {
            preprocessedData[j][metric]['position'] = j + 1
        }
    }



}

// Preprocess data for the first visualisation
export const preprocessData = (data, downloadsMetric, variableName, isAscending, downloadsRange) => {
    let sumDlsByValue = new Map()
    let occurrencesByValue = new Map()
    let nAppByValue = new Map()

    fillMaps(data, variableName, sumDlsByValue, occurrencesByValue, [nAppByValue, downloadsRange])

    let preprocessedData = []
    for (let [value, sumDls] of sumDlsByValue) {
        let distribution = (occurrencesByValue.get(value) / data.length) * 100
        let meanDls = sumDls / occurrencesByValue.get(value)
        let nApp = nAppByValue.has(value) ? nAppByValue.get(value) : 0
        let meanNApp = (nAppByValue.has(value) ? nAppByValue.get(value) : 0) / occurrencesByValue.get(value)

        let preprocessedValue = {
            'value': value, 'sum': { 'value': sumDls }, 'avg': { 'value': meanDls.toFixed(2) }, 'distribution': { 'value': distribution.toFixed(2) }, 'nApp': { 'value': nApp },
            'avgNApp': { 'value': meanNApp.toFixed(2) }
        }
        preprocessedData.push(preprocessedValue)
    }
    addPositionsMetrics(preprocessedData)
    handleSort(preprocessedData, isAscending, downloadsMetric)
    return preprocessedData
}


