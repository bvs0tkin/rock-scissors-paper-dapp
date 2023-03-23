import { ethers } from "hardhat";

async function main() {
   const [deployer] = await ethers.getSigners();
   console.log("Deploying the contracts by the: ", await deployer.address);
   const rspContractFactory = await ethers.getContractFactory(
      "RockScissorsPaper"
   );
   const rspContract = await rspContractFactory.deploy();
   await rspContract.deployed();

   console.log(`Contract deployed to ${rspContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
