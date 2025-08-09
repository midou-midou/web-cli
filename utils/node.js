const chalk = require('chalk');
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

module.exports = checkNode = () => {
  if (!semver.satisfies(process.version, requiredVersion)){
    console.log(
      `${chalk.red('node版本不符合要求')}，请安装${requiredVersion}版本，当前版本${process.version}`
    );
    process.exit(1)
  }
}