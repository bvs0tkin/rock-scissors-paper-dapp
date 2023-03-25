import { artifacts, ethers } from "hardhat";
import { RockScissorsPaper } from "../typechain-types";
import path from "path";
import fs from "fs";

async function main() {
   const [deployer] = await ethers.getSigners();
   console.log("Deploying the contracts by the: ", await deployer.address);
   const rspContractFactory = await ethers.getContractFactory(
      "RockScissorsPaper"
   );
   const rspContract = await rspContractFactory.deploy();
   await rspContract.deployed();
   saveFrontendFiles(rspContract);

   console.log(`Contract deployed to ${rspContract.address}`);
}

function saveFrontendFiles(cm: RockScissorsPaper) {
   const contractsDir = path.join(__dirname, "/../frontend/src/contracts");
   if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
   }
   fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify({ CM: cm.address }, null, 2)
   );
   // `artifacts` is a helper property provided by Hardhat to read artifacts
   const CMArtifact = artifacts.readArtifactSync("RockScissorsPaper");
   fs.writeFileSync(
      contractsDir + "/CM.json",
      JSON.stringify(CMArtifact, null, 2)
   );
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
