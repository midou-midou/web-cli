const WebCmd = require("./cmd");
const inquirer = require('inquirer');
const selectTemplate = require("./prompts/selectTemplate");
const { upgradeTemplate } = require('./utils/index').utils

class Upgrade extends WebCmd {
  constructor() {
    super()
    this.commandPreset = 'upgrade'
    this.description = '更新模板'
    this.allowExArg = false
    this.action = this.action.bind(this)
  }

  async action() {
    const prompt = inquirer.createPromptModule();
    let { template } = await selectTemplate(prompt)

    await upgradeTemplate(template)
  }
}

module.exports = Upgrade