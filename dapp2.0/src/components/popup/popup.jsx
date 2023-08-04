import "./popup.css"
import React, { useState, useContext, useEffect } from "react"
import { ethers } from "ethers";
import { votingABI } from "../../abi/voting.js"
import { useNavigate } from "react-router-dom"
import { MetamaskInstalledContext } from "../../context/MetamaskInstalledContext";

export default function Popup() {

    const metamaskInstalled = useContext(MetamaskInstalledContext);
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, votingABI, provider.getSigner());
    const navigate = useNavigate();

    useEffect(() => {
        connectWallet();
    }, [metamaskInstalled]);


    const getAccount = async () => {
        return window.ethereum.request({
          method: 'eth_requestAccounts'
        });
    }

    const connectWallet = async () => {
        try {
            const accounts = await getAccount();
            localStorage.setItem("walletAddress", String(accounts[0]));
            const alreadyRegistered = await contract.getIfUserIsRegistered(String(accounts[[0]]));
            if (alreadyRegistered) {
                navigate("/home");
                window.location.reload();
            }
            window.location.reload();
        }
        catch (err) {
            console.log(err);
        }        
    }

    return(
        <>
            <div className="overlay">
                <div className="popup">
                    <span>
                        <h2>Connect to MetaMask</h2>
                        <p>Please connect to your MetaMask account to proceed with registration.</p>
                        <button id="connect-metamask" onClick={connectWallet}>Connect</button>
                    </span>                  
                </div>
            </div>
        </>
    )
}