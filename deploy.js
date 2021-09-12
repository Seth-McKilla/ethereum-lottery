require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MNEMONIC,
  },
  providerOrUrl: process.env.RINKEBY_API,
});

const web3 = new Web3(provider);

(async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: bytecode,
      })
      .send({ gas: "1000000", from: accounts[0], gasPrice: "5000000000" });

    console.log("Contract deployed to", result.options.address);
  } catch (error) {
    console.error(error);
  }
})();

provider.engine.stop();
