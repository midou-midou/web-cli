#!/usr/bin/env node
const {WebCli} = require('../core/index')
const {checkNode} = require('../utils/index')
const {logError} = require('../lib/log')

// 检查node
checkNode()

try {
  const webcli = new WebCli()
  webcli.run()
} catch (error) {
  logError(error)
  process.exit(1)
}

