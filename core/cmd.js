const { program, Command } = require('commander');
const { logError } = require('../lib/log');
const { handleParseCmdError } = require('./utils/cmd');
const chalk = require('chalk');

class WebCmd {
  constructor() {
    this.rollbackActions = []
    this.program = program
    this.allowExArg = true
    this.context = {}
    // option类型 {name: '选项flag', description: '选项描述'}
    this.options = []

    this.listenExitKey()
  }

  rollBackAction = () => {
    // 从后往前执行回滚
    this.rollbackActions.reverse().forEach(fn => fn())
  }

  handleActionError = (fn) => {
    return async (...arg) => {
      try {
        await fn(...arg)
      } catch (error) {
        console.log(error);
        logError(error)
        this.rollBackAction()
        process.exit(1)
      }
    }
  }

  addCmd = () => {
    const cmd = new Command(this.commandPreset)
    if (this.options.length) {
      this.options.forEach(opt => {
        cmd.option(opt.name, opt.description)
      })
    }
    this.usage && cmd.usage(this.usage)
    cmd
      .description(this.description)
      .action(this.handleActionError(this.action))
      .allowExcessArguments(this.allowExArg)
      .showHelpAfterError(chalk.yellow(`使用 help ${this.commandPreset} 查看帮助`))
      .helpOption('-h, --help', '显示子命令帮助信息')
      .exitOverride()
      .configureOutput({
        outputError: () => { }
      })

    this.postAction && cmd.hook('postAction', this.postAction)
    this.program.addCommand(cmd)
  }

  async run() {
    this.addCmd()
    try {
      await this.program.parseAsync(process.argv)
    } catch (error) {
      handleParseCmdError(error)
    }
  }

  listenExitKey = () => {
    process.stdin.on('keypress', (_, key) => {
      if (key && key.ctrl && key.name === 'c') {
        this.rollBackAction()
        process.exit(130)
      }
    });

  }

}

module.exports = WebCmd