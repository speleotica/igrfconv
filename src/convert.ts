const cols = {
  cossin: 0,
  degree: 1,
  order: 2,
  data: 3,
}

const rows = {
  header1: 2,
  header2: 3,
  data: 4,
}

export function convert(data: string[][]): string {
  const output: string[] = []

  const numCols = data[rows.data].length

  for (let col = cols.data; col < numCols - 1; col++) {
    const model = data[rows.header1][col]
    const year = parseInt(data[rows.header2][col])
    const modelName = `${model}${String(
      year < 2000 ? year - 1900 : year
    ).padStart(2, '0')}`

    const rowsByDegreeOrder: {
      [K in `${number}-${number}`]: [
        number,
        number,
        number,
        number,
        number,
        number
      ]
    } = {}

    for (let row = rows.data; row < data.length; row++) {
      const cossin = data[row][cols.cossin]
      const degree = parseInt(data[row][cols.degree])
      const order = parseInt(data[row][cols.order])

      const key: `${number}-${number}` = `${degree}-${order}`
      const rowdata =
        rowsByDegreeOrder[key] ||
        (rowsByDegreeOrder[key] = [degree, order, 0, 0, 0, 0])

      rowdata[cossin === 'h' ? 3 : 2] = parseFloat(data[row][col])
      if (col === numCols - 2) {
        rowdata[cossin === 'h' ? 5 : 4] = parseFloat(data[row][col + 1])
      }
    }

    const modelRows = Object.values(rowsByDegreeOrder).sort(
      (a, b) => a[0] - b[0] || a[1] - b[1]
    )
    const numDegrees = modelRows.reduce(
      (best, r) => (r[2] || r[3] ? Math.max(best, r[0]) : best),
      0
    )
    const numSvDegrees = modelRows.reduce(
      (best, r) => (r[4] || r[5] ? Math.max(best, r[0]) : best),
      0
    )
    const toYear = parseInt(data[rows.header2][col + 1]) ?? year + 5
    let i = 0
    output.push(
      [
        modelName.padStart(11),
        year.toFixed(2).padStart(9),
        String(numDegrees).padStart(3),
        String(numSvDegrees).padStart(3),
        String(0).padStart(3),
        year.toFixed(2).padStart(8),
        toYear.toFixed(2).padStart(8),
        (-1).toFixed(1).padStart(7),
        (600).toFixed(1).padStart(7),
        modelName.padStart(17),
        String(i++).padStart(4),
      ].join('')
    )
    for (const [degree, order, a, b, c, d] of modelRows) {
      if (degree > numDegrees) continue
      output.push(
        [
          String(degree).padStart(2),
          String(order).padStart(3),
          a.toFixed(2).padStart(10),
          b.toFixed(2).padStart(10),
          c.toFixed(2).padStart(10),
          d.toFixed(2).padStart(10),
          modelName.padStart(31),
          String(i++).padStart(4),
        ].join('')
      )
    }
  }

  return output.join('\n')
}
