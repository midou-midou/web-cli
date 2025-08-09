const {CommanderError} = require('commander')
const chalk = require('chalk')
const { log } = require('../../lib/log')

const handleParseCmdError = (cmdErr) => {
  if (cmdErr instanceof CommanderError) {
    if (cmdErr.code === 'commander.excessArguments') {
      log(`${chalk.red('命令使用错误')} [输入的参数太多了]`)
    }
    if (cmdErr.code === 'commander.unknownOption') {
      log(`${chalk.red('命令使用错误')} [输入了无效参数]`)
    }
    if (cmdErr.code === 'commander.missingRequiredArgument') {
      log(`${chalk.red('命令使用错误')} [缺少必填参数]`)
    }
    if (cmdErr.code === 'commander.invalidArgument') {
      log(`${chalk.red('命令使用错误')} [参数不合法]`)
    }
  }
  process.exit(1)
}

module.exports = {
  handleParseCmdError
}