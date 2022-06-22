export const getDownloadsRanges = (data) => {
    let uniques = new Set()
    for (let i = 0; i < data.length; i++) {
        uniques.add(data[i]['Installs'])
    }
    return Array.from(uniques).sort((a, b) => parseInt(b.replaceAll('+', '').replaceAll(',', '')) - parseInt(a.replaceAll('+', '').replaceAll(',', '')))
}

const handleSort = (preprocessedData, isAscending, downloadsMetric) => {
    let sortMethod = isAscending === true ? (a, b) => b[downloadsMetric] - a[downloadsMetric] : (a, b) => a[downloadsMetric] - b[downloadsMetric]
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

        if(nAppByValueData) {
            let [nAppByValue, download_number] = nAppByValueData
            if(row.Installs === download_number) {
                nAppByValue.set(variableValue, nAppByValue.has(variableValue) ? nAppByValue.get(variableValue) + 1 : 1)
            }
        }
    }
}

// Preprocess data for the first visualisation
export const preprocessData = (data, downloadsMetric, variableName, isAscending, downloadsRange) => {
    let sumDlsByValue = new Map()
    let occurrencesByValue = new Map()
    let nAppByValue = new Map()
    
    let shouldGetNApps = downloadsMetric === 'Nombre applications' || downloadsMetric === 'Nombre applications moyen'
    fillMaps(data, variableName, sumDlsByValue, occurrencesByValue, shouldGetNApps ? [nAppByValue, downloadsRange] : null )

    let preprocessedData = []
    for (let [value, sumDls] of sumDlsByValue) {
        let distribution = occurrencesByValue.get(value) / data.length
        let meanDls = sumDls / occurrencesByValue.get(value)
        let preprocessedValue = { 'value': value, 'brut': sumDls, 'moyen': meanDls , 'distribution': distribution}
        if(downloadsMetric === 'Nombre applications' ) { 
            preprocessedValue['Nombre applications'] = nAppByValue.has(value) ? nAppByValue.get(value) : 0
        }
        if (downloadsMetric === 'Nombre applications moyen'){
            preprocessedValue['Nombre applications moyen'] = (nAppByValue.has(value) ? nAppByValue.get(value) : 0) / occurrencesByValue.get(value)
        }
        preprocessedData.push(preprocessedValue)
    }

    handleSort(preprocessedData, isAscending, downloadsMetric)
    return preprocessedData
}

export const CONSTANTS = {
    variableSelector : {
        values : ['Category','Genres', 'Type', 'Content Rating', 'Android Ver'],
        texts : ['Categorie','Genres', 'Type', 'Evaluation de contenu', 'Version minimale d’Android requise'],
        helper: 'Choisir la variable categorique a visualiser',
        label: 'Variable'
    },
    downloadsMetricSelector : {
        values : ['brut','moyen', 'Nombre applications', 'Nombre applications moyen'],
        texts : ['Somme','Moyenne', 'Nombre applications avec +', 'Nombre applications avec + moyen'],
        helper: 'Choisir la metrique de telechargement a visualiser',
        label: 'Metrique de telechargements'
    }
  
}
