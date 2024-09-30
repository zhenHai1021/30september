require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat:{},
    maal: {
      url: 'https://node1.maalscan.io',
      accounts: ['6092df0391028987492844029d2f387adc77673b3770c5ed822f0f312d3aeeda'],
    }
  },
  etherscan: {
    apiKey: {
      sepolia: '7N1UFM7UYC4K4F5489PN9XXEEVDIXNTBRT',
      maal: '/',
    },
    customChains: [
      {
        network: "maal",
        chainId: 7860,
        urls: {
          apiURL: "https://backendapi-testnet.maalscan.io/api/",
          browserURL: "https://testnet.maalscan.io"
        }
      }
    ],
  },
};

