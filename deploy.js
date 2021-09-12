require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFile = require("./compile");
const interface = compiledFile.abi;
const bytecode = compiledFile.evm.bytecode.object;

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

    const result = await new web3.eth.Contract(interface)
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: "1000000" });

    console.log(interface);
    console.log("Contract deployed to", result.options.address);

    provider.engine.stop();
  } catch (error) {
    console.error(error);
  }
})();
