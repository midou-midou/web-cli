const chalk = require('chalk')
const ora = require('ora')

const logError = (err) => {
  if(err instanceof Error) {
    console.error('脚手架运行错误:'+ chalk.red('❌ ' + err.message))
  } else {
    console.error('脚手架运行错误:'+ chalk.red('❌ ' + err))
  }
}

const log = (...args) => {
  console.log(...args)
}

const spinner = (text) => {
  let timer = null
  let spin = ora({
    stream: process.stdout,
  })
  
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  timer = setInterval(() => {
    spin.text = text
    spin.color = 'yellow'
    spin.start()
  }, 1000)

  return () => {
    spin.stop()
    clearInterval(timer)
  }
}

module.exports = {
  logError,
  spinner,
  log
}
