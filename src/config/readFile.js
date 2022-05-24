const fs = window.require('fs').promises

export async function readFile(fileLocation) {
  return await fs.readFile(fileLocation, 'utf-8')
}
