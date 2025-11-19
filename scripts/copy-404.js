const fs = require('fs')
const path = require('path')

const docsDir = path.resolve(__dirname, '..', 'docs')
const source = path.join(docsDir, 'index.html')
const target = path.join(docsDir, '404.html')

if (!fs.existsSync(source)) {
  console.error(`Cannot create 404.html – missing ${source}`)
  process.exit(1)
}

fs.copyFileSync(source, target)
console.log(`Created ${path.relative(process.cwd(), target)} from index.html`)
