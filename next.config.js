const nextTranslate = require('next-translate')

module.exports = {
  reactStrictMode: true,
  env:{
    API_HOST: process.env.API_HOST,
    APPLICATION: process.env.APPLICATION,
  },
  ...nextTranslate()
}
