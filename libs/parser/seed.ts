import fs from 'fs'
import path from 'path'
import { parseBotswanaSic } from './parser/parseBotswanaSic'
import { insertSicNodes } from './parser/insertSicNodes'

async function seedSic() {
  const filePath = path.join(
    process.cwd(),
    'data/botswana_sic_hierarchy.txt'
  )

  if (!fs.existsSync(filePath)) {
    throw new Error(`SIC TXT file not found at ${filePath}`)
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/)

  console.log(`Loaded ${lines.length} lines from SIC file`)

  const nodes = parseBotswanaSic(lines)

  console.log(`Parsed ${nodes.length} SIC nodes`)

  await insertSicNodes(nodes)
}

seedSic()
  .then(() => {
    console.log('SIC seeding finished successfully')
    process.exit(0)
  })
  .catch(err => {
    console.error('SIC seeding failed')
    console.error(err)
    process.exit(1)
  })
