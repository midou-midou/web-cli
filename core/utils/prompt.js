const fs = require('fs-extra')
const exec = require('./exec')
const { templateFolderPath } = require('./template').template


const selectTemplateList = () => {
  if (fs.pathExistsSync(templateFolderPath)) {
    const templates = fs.readdirSync(templateFolderPath)
    return templates.map(template => template)
  } else {
    throw ('没有找到模板文件夹')
  }
}

const selectPackageTools = async (context) => {
  const choices = [
    {name: 'npm', lock: 'package-lock.json'}, 
    {name: 'yarn', lock: 'yarn.lock'}, 
    {name: 'pnpm', lock: 'pnpm-lock.yaml'}]
  const res = await Promise.allSettled([
    ...choices.map(tool => exec(`${tool.name} -v`, { shell: true }))
  ])

  // 本机安装的包管理器
  const host = res.map((v, k) => {
    if (v.status === 'fulfilled' && v.value.stdout) {
      return choices[k]
    }
  }).filter(v => !!v)

  // 模板目录有.lock文件，就以此文件对应的工具为准
  const template = host.find(tool => {
    return fs.pathExistsSync(`${context.projectPath}/${tool.lock}`)
  })

  return template ? [template.name] : host.map(tool => tool.name)
}

module.exports = {
  selectTemplateList,
  selectPackageTools
}