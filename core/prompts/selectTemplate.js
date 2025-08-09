const { selectTemplateList } = require("../utils/index").utils

module.exports = (cli) => {
  const choices = selectTemplateList()
  if (!choices.length) {
    throw new Error('没有可以选择的模板')
  }

  return cli(
    {
      type: 'list',
      name: 'template',
      message: '选择项目模板',
      default: choices[0],
      choices
    }
  )
}