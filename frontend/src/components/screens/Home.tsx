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
         <div>Instructions:</div>
         <div>1. Connect a Wallet</div> 
         <div>2. Input TBNB quantity</div> 
         <div>3. Choose a shape by clicking the corresponding button and confirm a transaction in your wallet</div>
         
         <div>Address: {selectedAddress}</div>
         <button class="button button5" onClick={() => connectWallet()}>Connect Wallet</button>
         <section>
            <label for="fname">Input TBNB quantity (i.e. 0.001): </label>
            <input
               id="fname" 
               name="fname" 
               type="text"
               onChange={(el) => setPlayValue(Number(el.target.value))}
            />
            <div>Choose your shape: </div>
            <div>
               <button class="button button1" onClick={() => playGame(0, playValue)}>Rock</button>
               <button class="button button2" onClick={() => playGame(1, playValue)}>Scissors</button>
               <button class="button button3" onClick={() => playGame(2, playValue)}>Paper</button>
            </div>
            <div><span>Game result: {gameResult ? "Win" : "Lose"}</span></div>

         </section>
      </div>
   );
};

export default Home;
