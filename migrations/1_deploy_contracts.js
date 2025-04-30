const ArsenContract = artifacts.require("ArsenContract");

module.exports = function(deployer) {
  const tokenAmount = web3.utils.toWei("1000000", "ether"); 
  deployer.deploy(ArsenContract, tokenAmount);
};


