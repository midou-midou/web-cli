const execa = require('execa');

module.exports = async (...arg) => {
  try {
    const {stderr, stdout} = await execa(...arg);
    return {stderr, stdout}
  } catch (error) {
    return Promise.reject(error);
  }
}