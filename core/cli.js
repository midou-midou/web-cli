const {program} = require('commander')
const Init = require('./init')
const Install = require('./install')
const { handleParseCmdError } = require('./utils/cmd')
const pkgj = require('../package.json')
const Help = require('./help')
const Upgrade = require('./upgrade')

class WebCli {
  constructor() {}

  parseOpts () {
    const opts = program.opts()
    if (opts.help || opts.h) {
      program.help()
    }
    if (opts.version || opts.V) {
      console.log(pkgj.version)
    }
  }

  run() {
    const context = {
      projectPath: './'
    }
    const cmds = [
      new Init(),
      new Install(),
      new Upgrade(),
      new Help()
    ]
    program
      .name('web-cli')
      .version(pkgj.version, '-V, --version', '显示版本号')
      .usage('<子命令>')
      .option('-h, --help', '显示帮助信息')
      .exitOverride()
      .configureOutput({
        outputError: () => {}
      })
      
    cmds.forEach(cmd => {
      cmd.program = program
      cmd.context = context
      if (cmd.commandPreset.includes('help')) {
        program.addHelpCommand(cmd.commandPreset, cmd.description)
      } else {
        cmd.addCmd()
      }
    })

    try {
      program.parse(process.argv)
      this.parseOpts()
    } catch (error) {
      handleParseCmdError(error)
    }
  }
}

module.exports = WebCli