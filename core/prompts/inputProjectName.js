const chalk = require('chalk')

module.exports = (cli) => cli(
  [
    {
      name: 'name',
      message: `输入项目${chalk.green('名称')}或${chalk.green('路径')}`,
      default: 'web-demo'
    }
  ]
)