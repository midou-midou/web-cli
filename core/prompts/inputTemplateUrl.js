const chalk = require('chalk')

module.exports = (cli) => cli(
  [
    {
      name: 'url',
      message: `输入模板的${chalk.green('Git仓库地址')}`
    }
  ]
)