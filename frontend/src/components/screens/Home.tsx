import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { ethers } from "ethers";
import contractAddress from "@/contracts/contract-address.json";
import CMArtifact from "@/contracts/CM.json";

const Home = () => {
   const [selectedAddress, setSelectedAddress] = useState();
   const [smartContract, setSmartContract] = useState<ethers.Contract>();
   const [gameResult, setGameResult] = useState<boolean | null>(null);
   const [playValue, setPlayValue] = useState<number>();

   const connectWallet = async () => {
      const { ethereum } = window;
      if (!ethereum) {
         console.log("Metamask isn't installed");
         return;
      } else {
         console.log("MM is already installed");
      }
      const newSelectedAddress = await ethereum.request({
         method: "eth_requestAccounts",
      });
      setSelectedAddress(newSelectedAddress);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      const newSmartContract = new ethers.Contract(
         contractAddress.CM,
         CMArtifact.abi,
         provider.getSigner()
      );
      setSmartContract(newSmartContract);
      console.log(smartContract);
   };

   const playGame = async (id: number, value: number | undefined) => {
      if (smartContract && value) {
         const playTx = await smartContract.playWithSC(id, {
            value: ethers.utils.parseEther(value.toString()),
         });
         console.log("Mining... ", playTx.hash);
         const receipt = await playTx.wait();
         console.log(receipt);
         setGameResult(receipt.events[0].args[1]);
         // console.log(receipt.events[0].args[1]);
      }
   };

   // useEffect(() => {
   //    connectWallet();
   // }, []);

   return (
      <div className={styles.home}>
         <div>Address: {selectedAddress}</div>
         <button onClick={() => connectWallet()}>Connect</button>
         <section>
            <span>Game result: {gameResult ? "Win" : "Lose"}</span>
            <input
               type="text"
               onChange={(el) => setPlayValue(Number(el.target.value))}
            />
            <div>
               <button onClick={() => playGame(0, playValue)}>Rock</button>
               <button onClick={() => playGame(1, playValue)}>Scissors</button>
               <button onClick={() => playGame(2, playValue)}>Paper</button>
            </div>
         </section>
      </div>
   );
};

export default Home;
