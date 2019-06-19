'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  EXPLORER_URL: '"http://172.16.1.10:4200"',
  IPFS_URL: '"http://172.16.1.12:8080"'
})
