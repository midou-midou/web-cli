const { selectPackageTools } = require("../utils/index").utils

module.exports = async (cli, context) => {
  const choices = await selectPackageTools(context)
  if (!choices.length) {
    throw('没有可以选择的工具')
  }

  return cli(
    {
      type: 'list',
      name: 'tool',
      message: '选择包管理工具',
      default: choices[0],
      choices
    }
  )
}