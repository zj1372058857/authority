'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://localhost:8000"'
  //BASE_API: '"http://192.168.0.238:8000"'
  BASE_API: '"http://192.168.0.238:8083"'
  //http://192.168.1.212:8084/project/insertProject
})
