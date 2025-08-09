const WebCmd = require("./cmd");

class Help extends WebCmd {
  constructor() {
    super()
    this.commandPreset = 'help <子命令>'
    this.description = '显示子命令帮助信息'
    this.allowExArg = true
  }
}

module.exports = Help