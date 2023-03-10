
const hre = require("hardhat");

async function main() {
  

  const StoreDocument = await hre.ethers.getContractFactory("StoreDocument");
  const storeDocument = await StoreDocument.deploy();

  await storeDocument.deployed();

  console.log(
    `deployed to ${storeDocument.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
