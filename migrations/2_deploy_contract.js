// const Degrees = artifacts.require("Degrees");
const NFTDegrees = artifacts.require("NFTDegrees");
const Login = artifacts.require("Login");
module.exports = function(deployer) {
  deployer.deploy(NFTDegrees);
  deployer.deploy(Login)
};
