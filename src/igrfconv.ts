import { parse } from 'csv-parse/sync'
import fs from 'fs/promises'
import { convert } from './convert'

async function go() {
  const data = parse(
    await fs.readFile(process.argv[2] || 'IGRF14coeffs.csv', 'utf8'),
    {
      bom: true,
    }
  )

  console.log(convert(data))
}

go()
