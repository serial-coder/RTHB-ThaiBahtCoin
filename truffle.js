// See <http://truffleframework.com/docs/advanced/configuration>
// to customize your Truffle configuration!

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    } 
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};