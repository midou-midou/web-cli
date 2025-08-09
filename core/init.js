const WebCmd = require("./cmd")
const inquirer = require('inquirer')
const fs = require('fs-extra')
const valid = require('validate-npm-package-name')
const path = require('path')
const selectTemplate = require("./prompts/selectTemplate")
const inputProjectName = require("./prompts/inputProjectName")
const inputTemplateUrl = require("./prompts/inputTemplateUrl")
const { log, spinner } = require("../lib/log")
const chalk = require("chalk");
const { writePackageJson,
  copyTemplate,
  cloneTemplate 
} = require("./utils/index").utils


class Init extends WebCmd {
  constructor() {
    super()
    this.commandPreset = 'init'
    this.description = '初始化前端项目'
    this.usage = '[选项]'
    this.action = this.action.bind(this)
    this.postAction = this.postAction.bind(this)
    this.options = [
      {
        name: '-c, --clone',
        description: '下载远程模板'
      }
    ]
  }

  async checkProjectName(name = '') {
    const { validForNewPackages, validForOldPackages } = valid(name)
    if (!validForNewPackages || !validForOldPackages) {
      throw ('项目名称不符合规范')
    }
  }

  async checkProjectPath(path = '') {
    if (fs.existsSync(path)) {
      throw ('文件夹已存在，删除后重试')
    }
    fs.mkdirSync(path, {
      recursive: true
    })

    // 如果创建文件夹后面的步骤执行失败了，文件夹已经创建了，还要回滚
    return () => {
      fs.removeSync(path)
    }
  }

  getProjectPath = (name) => {
    if (path.isAbsolute(name)) return name
    return path.join(process.cwd(), name)
  }

  async action(opts) {
    log(chalk.yellow('🚀 正在启动脚手架'))
    const prompt = inquirer.createPromptModule();
    let { name } = await inputProjectName(prompt)
    
    let projectName = path.basename(name)
    await this.checkProjectName(projectName)

    let fn = await this.checkProjectPath(name)
    fn && this.rollbackActions.push(fn)

    this.context.projectPath = this.getProjectPath(name)

    const {clone} = opts
    let select

    if (!clone) {
      // 选择模板
      const { template } = await selectTemplate(prompt)
      select = template
    } else {
      // 下载模板
      const {url} = await inputTemplateUrl(prompt)
      if (!url.endsWith('.git')) throw('输入的不是合法的git仓库地址')
      select = url.split('/').pop().replace('.git', '')
      let stopSpinner = spinner(chalk.yellow(`✨ 开始下载模板: ${chalk.green(select)}`))
      await cloneTemplate(url, select)
      stopSpinner()
    }
    // 复制模板到指定目录
    await copyTemplate(name, select)

    // 替换模板package.json
    await writePackageJson(name, select)

  }

  postAction = () => {
    process.argv = [process.argv[0], process.argv[1], 'install']
    this.run()
  }
}

module.exports = Init