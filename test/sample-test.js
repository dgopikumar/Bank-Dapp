const { expect } = require("chai");
const hre  = require("hardhat");

describe("Bank", function () {
  it("Bank values", async function () {
    const [signer1, signer2] = await hre.ethers.getSigners();
    //const addresses = [signer1.address, signer2.address];

    const Bank = await hre.ethers.getContractFactory("Bank", signer1);
    const bankContract = await Bank.deploy();
    await bankContract.deployed();

    const Matic = await hre.ethers.getContractFactory("Matic", signer2);
    const matic = await Matic.deploy();
    await matic.deployed();

    const Shib = await hre.ethers.getContractFactory("Shib", signer2);
    const shib = await Shib.deploy();
    await shib.deployed();

    const Usdt =await hre.ethers.getContractFactory("Usdt", signer2);
    const usdt = await Usdt.deploy();
    await usdt.deployed();
    
    //console.log("Matic Balance:", await bankContract.GetBalance(hre.ethers.utils.formatBytes32String('Matic')));
    //expect(await bankContract.GetBalance(hre.ethers.utils.formatBytes32String('Matic'))).to.greaterThanOrEqual(1);
    
  });
});
