const WebCmd = require("./cmd");
const inquirer = require('inquirer');
const selectPackageTools = require("./prompts/selectPackageTools");
const { log, spinner } = require("../lib/log");
const chalk = require("chalk");
const { checkPackageJson } = require('./utils/index').utils
const { exec } = require('./utils/index').utils

class Install extends WebCmd {
  constructor() {
    super()
    this.commandPreset = 'install'
    this.description = '安装前端项目依赖'
    this.usage = '[选项]'
    this.tool = 'npm'
    this.allowExArg = true
    this.action = this.action.bind(this)
    this.options = [
      {
        name: '-v, --verbose',
        description: '显示安装依赖过程中的详细信息'
      }
    ]
  }

  async installDeps({verbose}) {
    let execOpt = {shell: true, stdio: verbose ? 'inherit' : 'ignore'}
    const logText = chalk.yellow(`📦 安装依赖中，请稍后...`)
    process.chdir(this.context.projectPath)
    let stopSpinner
    if (verbose) {
      log(logText)
    } else {
      stopSpinner = spinner(logText)
    }
    await exec(`${this.tool} install`, execOpt)
    stopSpinner && stopSpinner()
  }

  async action(opts) {
    const prompt = inquirer.createPromptModule();
    log(chalk.yellow(`🔍 正在搜索可用的包管理工具`))
    let { tool } = await selectPackageTools(prompt, this.context)

    if (!checkPackageJson(this.context.projectPath)) return
    tool && (this.tool = tool)
    await this.installDeps(opts)
  }

  postAction = () => {
    log(chalk.green(`🎉 已经完成项目依赖安装`))
    log(chalk.green(`👉 接下来进入目录 ${chalk.yellow(this.context.projectPath)}`))
    log(chalk.green(`🔧 并使用 ${chalk.yellow(this.tool)} 工具启动吧`))
  }
}

module.exports = Install