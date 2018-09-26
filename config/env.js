module.exports = {
  public: {
    ropstenURL: process.env.ropstenURL,
    contractAddress: process.env.contractAddress,
    apiEndpoint: process.env.apiEndpoint,
    blockchainAPIURL: process.env.blockchainAPIURL
  },
  www: {
    port: process.env.PORT,
  },
};
