import "./register.css"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { votingABI } from "../../abi/voting"
import { MetamaskInstalledContext } from "../../context/MetamaskInstalledContext"

import Popup from "../../components/popup/popup"

export default function Register() {
    
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const walletAddress = localStorage.getItem("walletAddress");


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, votingABI, provider.getSigner());

    const navigate = useNavigate();

    const registerAccount = async (e) => {
        try {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const registered = await contract.registerUser(name);
            await registered.wait();
            console.log(registered);
            // const registeredStatus = await contract.getIfUserIsRegistered(walletAddress);
            // setExistingUser(registeredStatus);
            // Bring user to Home
            navigate("/home");
            
        }
        catch (err) {
            console.log(err);
        }
    }

    const ifRegistered = async () => {
        try{
            const registeredStatus = await contract.getIfUserIsRegistered(walletAddress);
            if (registeredStatus) {
                navigate("/home");
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        ifRegistered();
    }, []);

    return (
        <>  
            {walletAddress ? null : <Popup/>}
            <header>
                <h1>User Registration</h1>
            </header>

            <main>
                <section className="registration-form">
                <h2>Create an Account</h2>
                <form>

                    <label>Wallet Address:</label>
                    <input type="text" id="walletAddress" value={walletAddress}  required disabled/>

                    <label>Full Name:</label>
                    <input type="text" id="name" required/>

                    <button type="submit" onClick={registerAccount}>Register</button>

                </form>
                </section>
            </main>
        </>
    )
}