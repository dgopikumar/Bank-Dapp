const hre = require("hardhat");

async function getBalance(address) {
    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
    for(const address of addresses){
        console.log(`Address: ${address} : `, await getBalance(address));
    }
}

async function main() {
    const [signer1, signer2] = await hre.ethers.getSigners();
    const addresses = [signer1.address, signer2.address];
    console.log("== before deployed ==");
    await printBalances(addresses);
    const Bank = await hre.ethers.getContractFactory("Bank", signer1);
    const bankContract = await Bank.deploy();

    const Matic = await hre.ethers.getContractFactory("Matic", signer2);
    const matic = await Matic.deploy();
    await matic.deployed();
    const Shib = await hre.ethers.getContractFactory("Shib", signer2);
    const shib = await Shib.deploy();
    await shib.deployed();
    const Usdt =await hre.ethers.getContractFactory("Usdt", signer2);
    const usdt = await Usdt.deploy();
    await usdt.deployed();

    await bankContract.AddWhitelistToken(hre.ethers.utils.formatBytes32String('MATIC'), matic.address);
    await bankContract.AddWhitelistToken(hre.ethers.utils.formatBytes32String('SHIB'), shib.address);
    await bankContract.AddWhitelistToken(hre.ethers.utils.formatBytes32String('USDT'), usdt.address);
    await bankContract.AddWhitelistToken(hre.ethers.utils.formatBytes32String('ETH'), '0xB2e97B52d62Fb49f01F3e3b309D91C7d4Ba7bAf7');

    console.log("Bank deployed to:", bankContract.address, "by", signer1.address);
    console.log("Matic deployed to:", matic.address, "by", signer2.address);
    console.log("Shib deployed to:", shib.address, "by", signer2.address);
    console.log("Teather deployed to:", usdt.address, "by", signer2.address);

    console.log("== after deployed ==");
    await printBalances(addresses);

     const maticValue = await bankContract.GetBalance(hre.ethers.utils.formatBytes32String('MATIC'));
    // const ShibValue = await bankContract.GetBalance(hre.ethers.utils.formatBytes32String('Shib'));
    // const UsdtValue = await bankContract.GetBalance(hre.ethers.utils.formatBytes32String('Usdt'));
    // const EthValue = await bankContract.GetBalance(hre.ethers.utils.formatBytes32String('Eth'));

     console.log("== token values after deployed ==");
    // console.log("Eth value: ", EthValue);
     console.log("Matic value: ", maticValue);
    // console.log("Shib value: ", ShibValue);
    // console.log("Usdt value: ", UsdtValue);
     
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});