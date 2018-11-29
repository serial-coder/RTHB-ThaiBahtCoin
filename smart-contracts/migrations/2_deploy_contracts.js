var BahtCoin = artifacts.require("./BahtCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(BahtCoin, 150, 130, 143000);
};