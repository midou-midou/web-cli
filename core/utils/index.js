const {selectTemplateList, selectPackageTools} = require('./prompt')
const {
  writePackageJson,
  copyTemplate,
  templateFolderPath,
  checkPackageJson,
  cloneTemplate,
  isUpgradeTemplate,
  upgradeTemplate
} = require('./template').template
const exec = require('./exec')
const {handleParseCmdError} = require('./cmd')

exports.utils = {
  selectTemplateList,
  selectPackageTools,
  checkPackageJson,
  writePackageJson,
  copyTemplate,
  templateFolderPath,
  handleParseCmdError,
  cloneTemplate,
  isUpgradeTemplate,
  upgradeTemplate,
  exec
}
