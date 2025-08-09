const handlebars = require('handlebars');
const path = require('path')
const fs = require('fs-extra');
const chalk = require('chalk');
const exec = require('./exec');
const { log, spinner } = require('../../lib/log');

const templatePath = path.join(__dirname.split('web-cli')[0], 'web-cli', 'template')

const cloneTemplate = async (url, name) => {
  const tpath = path.join(templatePath, name)

  if (fs.pathExistsSync(tpath)) return

  try {
    await exec('git', [
      'clone',
      url,
      tpath
    ], { shell: true, stdio: 'ignore' })
  } catch (error) {
    throw (`下载模板失败: ${error.message}`)
  }
}

const writePackageJson = async (context, select) => {
  // 读取模板 package.json 或 package.json.hbs
  const source = path.join(templatePath, select)
  const hbsPath = path.join(source, 'package.json.hbs')
  const jsonPath = path.join(source, 'package.json')
  const target = path.join(context, 'package.json')

  if (fs.pathExistsSync(hbsPath)) {
    fs.writeFileSync(
      target,
      handlebars.compile(fs.readFileSync(hbsPath, 'utf-8'))({ project_name: path.basename(context) })
    )
  }
  else if (fs.pathExistsSync(jsonPath)) {
    log(chalk.gray('⚠️ 没有检测到模板的package.json.hbs文件，使用默认的package.json，可能会丢失格式'))
    let json = fs.readJSONSync(jsonPath, {
      encoding: 'utf-8'
    })
    json.name = path.basename(context)
    fs.writeJSONSync(target, json, { spaces: 2 })
  } else {
    fs.rmSync(path.join(context), { force: true })
    throw ('没有找到模板中的package.json或package.json.hbs文件，确认模板是否合法')
  }
}

const copyTemplate = async (target, select) => {
  const source = path.join(templatePath, select)
  fs.copySync(
    source,
    target,
    {
      filter: (src) => !src.endsWith('package.json.hbs')
    }
  )
}

const checkPackageJson = (target) => {
  const packageJsonPath = path.join(target, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    throw (`在文件夹 ${chalk.yellow(target)} 没有找到package.json文件`)
  }
  return true
}

const isUpgradeTemplate = async (select) => {
  const git = path.join(templatePath, select, '.git')

  if (!fs.pathExistsSync(path.join(git, 'HEAD'))) 
    throw(`模板 ${chalk.yellow(select)} 不是一个合法的git仓库，无法更新`)

  const stopSpinner = spinner(chalk.yellow(`🔍 检测模板 ${chalk.green(select)} 是否有更新`))
  
  // fetch
  const {stderr: fetchErr} = await exec('git', [
    '-C',
    path.join(templatePath, select),
    'fetch'
  ], { shell: true, stdio: 'pipe' })

  if (fetchErr) {
    stopSpinner()
    throw ('检测模板更新失败，有可能是网络问题')
  }

  // 获取远程分支
  const {stdout: branches} = await exec('git', [
    '-C',
    path.join(templatePath, select),
    'rev-parse',
    '--abbrev-ref',
    'HEAD'
  ], { shell: true, stdio: 'pipe' })


  const {stdout: count} = await exec('git', [
    '-C',
    path.join(templatePath, select),
    'rev-list',
    `HEAD..origin/${branches}`,
    '--count'
  ], { shell: true, stdio: 'pipe' })

  stopSpinner()

  if(parseInt(count.trim()) > 0) {
    return true
  } else {
    log(chalk.green(`🎉 模板 ${chalk.yellow(select)} 已经是最新版本`))
    return false
  }
}

const upgradeTemplate = async (select) => {
  const isUpgrade = await isUpgradeTemplate(select)
  if (!isUpgrade) return

  const stopSpinner = spinner(chalk.yellow(`✨ 开始更新模板 ${chalk.green(select)}`))
  try {
    await exec('git', [
      '-C',
      path.join(templatePath, select),
      'pull'
    ], { shell: true, stdio: 'ignore' })
  } catch (error) {
    stopSpinner()
    throw (`更新模板失败 ${error.message}`)
  }
}

exports.template = {
  writePackageJson,
  copyTemplate,
  checkPackageJson,
  cloneTemplate,
  isUpgradeTemplate,
  upgradeTemplate,
  templateFolderPath: templatePath
}
