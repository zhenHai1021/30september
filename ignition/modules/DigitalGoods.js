const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const VoteBModule = buildModule("DigitalGoods", (m) => {
  const voteToken = m.contract("DigitalGoods");

  return { voteToken };
});

module.exports = VoteBModule;