export const CONSTANTS = {
    variableSelector: {
        values: ['Category', 'Genres', 'Content Rating'],
        texts: ['Categorie', 'Genres', 'Evaluation de contenu'],
        helper: 'Choisir la variable categorique a visualiser',
        label: 'Variable'
    },
    radioButtons: {
        values: [true, false],
        texts: ['Croissant', 'Decroissant'],
        label: 'Ordonnancement'
    },
    title: 'Visualisation 2 : Comparaison des distributions des applications gratuites et payantes',

}

const addPositionsMetrics = (preprocessedData) => {
    const metrics = [...CONSTANTS.downloadsMetricSelector.values, 'distribution']
      for (let i = 0; i < metrics.length; i++) {
          let metric = metrics[i]
          handleSort(preprocessedData, false, metric)
  
          for (let j = 0; j < preprocessedData.length; j++) {
              preprocessedData[j][metric]['position'] = j + 1
          }
      }
  }

const handleSort = (preprocessedData, isAscending, type) => {
    let sortMethod = isAscending ? (b, a) => b.type.distribution - a[type].distribution : (b, a) => a[type].distribution - b[type].distribution
    preprocessedData.sort(sortMethod)
}

// Preprocess data for the first visualisation
export const preprocessData = (data, variableName, isAscending) => {
    let nAppByValueFree = new Map()
    let nAppByValuePaid = new Map()
    let totalFreeCount = 0
    let totalPaidCount = 0

    for (let i = 0; i < data.length; i++) {
        let row = data[i]
        let value = row[variableName]
        if (row.Type === "Free") {
            nAppByValueFree.set(value,nAppByValueFree.has(value) ? nAppByValueFree.get(value) + 1 : 1)
            nAppByValuePaid.set(value, nAppByValuePaid.has(value) ? nAppByValuePaid.get(value) : 0)
            totalFreeCount += 1
            continue
        }
        nAppByValuePaid.set(value, nAppByValuePaid.has(value) ? nAppByValuePaid.get(value) + 1 : 1)
        nAppByValueFree.set(value, nAppByValueFree.has(value) ? nAppByValueFree.get(value) : 0)
        totalPaidCount += 1
    }
    
    let preprocessedData = []

    for (let [value, freeCount] of nAppByValueFree) {
        let paidCount = nAppByValuePaid.get(value)
        let freeDistribution = (freeCount / totalFreeCount) * 100
        let paidDistribution = (paidCount / totalPaidCount) * 100

        preprocessedData.push({
            'value': value, 
            'free': {
                'count': freeCount,
                'distribution': freeDistribution.toFixed(2),

            },
            'paid' : {
                'count': paidCount,
                'distribution': paidDistribution.toFixed(2)
            }
        })
    }
    handleSort(preprocessedData, false, 'paid')
  
    for (let j = 0; j < preprocessedData.length; j++) {
        preprocessedData[j].paid.position = j + 1
    }
    handleSort(preprocessedData, isAscending, 'free')

    for (let j = 0; j < preprocessedData.length; j++) {
        preprocessedData[j].free.position = j + 1
    }
    
    console.log(preprocessedData,'s')
    return preprocessedData
}


