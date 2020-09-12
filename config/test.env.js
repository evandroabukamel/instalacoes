var merge = require('webpack-merge');
var devEnv = require('./dev.env');

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_URL: '"http://192.168.1.4/usuario/evandro/instalacoes/api.php"',
});
