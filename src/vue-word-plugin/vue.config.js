const fs = require('fs')
const path = require('path')
const homedir = require('os').homedir()

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  baseUrl:
    process.env.NODE_ENV === 'development' ? '/' : '/vue-word-addin/',
  transpileDependencies: true,
  devServer:
    process.env.NODE_ENV === 'development'
      ? {
          port: 3000,
          https: {
            key: fs.readFileSync(
              path.resolve(`${homedir}/.office-addin-dev-certs/localhost.key`)
            ),
            cert: fs.readFileSync(
              path.resolve(`${homedir}/.office-addin-dev-certs/localhost.crt`)
            ),
            ca: fs.readFileSync(
              path.resolve(`${homedir}/.office-addin-dev-certs/ca.crt`)
            )
          }
        }
      : undefined
})
