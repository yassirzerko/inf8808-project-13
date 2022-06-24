export const CONSTANTS = {
    variableSelector: {
        values: ['Category', 'Genres', 'Type', 'Content Rating', 'Android Ver'],
        texts: ['Categorie', 'Genres', 'Type', 'Evaluation de contenu', 'Version minimale d’Android requise'],
        helper: 'Choisir la variable categorique a visualiser',
        label: 'Variable',
        modalContent:'Choisir la variable dont vous voulez explorer le comportement. Vous avez le choix entre les 5 variables suivantes :Categorie, Evaluation de contenu, Version minimale Android requise, Genres, Type (Payante ou grauite).'
    },
    downloadsMetricSelector: {
        values: ['sum', 'avg', 'nApp', 'avgNApp'],
        texts: ['Somme', 'Moyenne', 'Nombre applications avec', 'Nombre applications avec'],
        helper: 'Choisir la metrique de telechargement a visualiser',
        label: 'Metrique de telechargements',
        modalContent : 'Choisir la metrique de telechargement que vous voulez utiliser. Vous avez le choix entre 4 metriques Nombre de téléchargements :  Somme des téléchargements de toutes les applications avec une certaines valeurs catégoriques.Nombre de téléchargements moyens : Ratio entre le nombre de téléchargements de toutes les applications avec une certaine valeur catégorique et le nombre d’applications avec cette valeur catégorique.Nombre d’applications avec plus de n téléchargements : Nombre d’applications avec plus de n téléchargement pour une certaine valeur catégorique.Nombre d’applications avec plus de n téléchargements moyens : Ratio entre le nombre d’applications avec plus de n téléchargement pour une certaine valeur catégorique et le nombre d’applications avec cette valeur catégorique.Nombre d’applications avec plus de n téléchargements moyens : Ratio entre le nombre d’applications avec plus de n téléchargement pour une certaine valeur catégorique et le nombre d’applications avec cette valeur catégorique.'
    },
    radioButtons: {
        values: [true, false],
        texts: ['Croissant', 'Decroissant'],
        label: 'Ordonnancement',
        modalContent : 'Choisir l ordre dans lequel les valeurs seront ordonnee. '
    },
    title: 'Visualisation 1 : Exploration du comportement des variables catégoriques et des téléchargements',
}

export const getDownloadsRanges = (data) => {
    let uniques = new Set()
    for (const element of data) {
        uniques.add(element['Installs'])
    }
    return Array.from(uniques).sort((a, b) => parseInt(b.replaceAll('+', '').replaceAll(',', '')) - parseInt(a.replaceAll('+', '').replaceAll(',', '')))
}

const handleSort = (preprocessedData, isAscending, downloadsMetric) => {
    let sortMethod = isAscending ? (b, a) => b[downloadsMetric].value - a[downloadsMetric].value : (b, a) => a[downloadsMetric].value - b[downloadsMetric].value
    preprocessedData.sort(sortMethod)
}

// nAppByValue is filled only if not nul
const fillMaps = (data, variableName, sumDlsByValue, occurrencesByValue, nAppByValueData) => {
    for (const element of data) {
        let row = element
        let downloads = parseInt(row.Installs.replaceAll('+', '').replaceAll(',', '')) ?  parseInt(row.Installs.replaceAll('+', '').replaceAll(',', '')) : 0
        let variableValue = row[variableName]
        if(variableValue ==="NaN") {
            continue;
        }
        sumDlsByValue.set(variableValue, sumDlsByValue.has(variableValue) ? sumDlsByValue.get(variableValue) + downloads : downloads)
        occurrencesByValue.set(variableValue, occurrencesByValue.has(variableValue) ? occurrencesByValue.get(variableValue) + 1 : 1)

      
        let [nAppByValue, download_number] = nAppByValueData
        if (row.Installs === download_number) {
            nAppByValue.set(variableValue, nAppByValue.has(variableValue) ? nAppByValue.get(variableValue) + 1 : 1)
        }
    }
}

const addPositionsMetrics = (preprocessedData) => {
  const metrics = [...CONSTANTS.downloadsMetricSelector.values, 'distribution']
    for (const element of metrics) {
        let metric = element
        handleSort(preprocessedData, false, metric)

        for (let j = 0; j < preprocessedData.length; j++) {
            preprocessedData[j][metric]['position'] = j + 1
        }
    }
}

const addStatsMetrics = (preprocessedData) => {
    // Todo
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


