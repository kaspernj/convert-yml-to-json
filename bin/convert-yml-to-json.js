#!/usr/bin/env node

import ConvertYmlToJson from "../src/index.js"

const processArgs = process.argv.slice(2)
const args = {}

for (let i = 0; i < processArgs.length; i++) {
  const arg = processArgs[i]

  if (arg == "--help" || arg == "-h") {
    console.log("Usage: libraries-watcher [options]")
    console.log("Options:")
    console.log("--help, -h: Show this help message")
    console.log("--path, -p: Path to the directory containing the files")
    console.log("--verbose, -v: Show more information about what is happening")

    exit()
  } else if (arg == "--path" || arg == "-p") {
    args.path = processArgs[++i]
  } else if (arg == "--verbose" || arg == "-v") {
    args.verbose = true
  } else {
    throw new Error(`Unknown argument ${arg}`)
  }
}

if (args.verbose) console.log(`Using path ${args.path}`)

const convertYmlToJson = new ConvertYmlToJson({path: args.path, verbose: args.verbose})

await convertYmlToJson.execute()
