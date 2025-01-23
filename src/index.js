import fs from "fs/promises"
import path from "path"
import yaml from "js-yaml"

export default class ConvertYmlToJson {
  constructor({path, verbose, ...restProps}) {
    const restPropsKeys = Object.keys(restProps)

    if (restPropsKeys.length > 0) {
      throw new Error(`Invalid props: ${restPropsKeys}`)
    }

    this.path = path
    this.verbose = verbose
  }

  async execute() {
    await this.scanPath(this.path)
  }

  async scanPath(dirPath) {
    const files = await fs.readdir(dirPath)

    for (const file of files) {
      const fullPath = `${dirPath}/${file}`
      const stat = await fs.stat(fullPath) // eslint-disable-line no-await-in-loop

      if (stat.isDirectory()) {
        if (this.verbose) console.log(`Directory: ${fullPath}`)

        await this.scanPath(fullPath)
      } else {
        const ext = path.extname(file)

        if (ext == ".yml") {
          const rawYmlContent = String(await fs.readFile(fullPath)) // eslint-disable-line no-await-in-loop
          const content = yaml.load(rawYmlContent) // eslint-disable-line import/no-named-as-default-member
          const fileWithoutExt = file.slice(0, file.length - ext.length)
          const jsonFilePath = `${dirPath}/${fileWithoutExt}.json`

          if (this.verbose) console.log(`File: ${fullPath}`, {ext, content})

          await fs.writeFile(jsonFilePath, JSON.stringify(content, null, 2)) // eslint-disable-line no-await-in-loop
          await fs.unlink(fullPath) // eslint-disable-line no-await-in-loop
        }
      }
    }
  }
}
