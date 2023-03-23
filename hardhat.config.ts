import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

declare var process: {
   env: {
      PRIVATE_KEY: string;
   };
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
   const accounts = await hre.ethers.getSigners();

   for (const account of accounts) {
      console.log(account.address);
   }
});

const config: HardhatUserConfig = {
   solidity: "0.8.18",
   networks: {
      localhost: {
         url: "http://127.0.0.1:8545",
      },
      hardhat: {},
      testnet: {
         url: "https://data-seed-prebsc-1-s1.binance.org:8545",
         chainId: 97,
         gasPrice: 20000000000,
         accounts: [process.env.PRIVATE_KEY],
      },
   },
};

export default config;
