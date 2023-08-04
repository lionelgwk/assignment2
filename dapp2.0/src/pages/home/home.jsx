import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ethers } from 'ethers';
import { votingABI } from '../../abi/voting.js';
import "./home.css";
import Card from '../../components/card/card';

export default function Home() {

    const [name, setName] = useState("");
    const [events, setEvents] = useState([]);
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const walletAddress = localStorage.getItem("walletAddress");
    const [endStatus, setEndStatus] = useState(false);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, votingABI, provider.getSigner());
    const navigate = useNavigate();

    const getNameFromAddress = async () => {
        try {
            const userName = await contract.getUserName(walletAddress);
            setName(userName);
        }
        catch (err) {
            console.log(err);
        }
    }

    const ifNotRegistered = async () => {
        try {
            const registeredStatus = await contract.getIfUserIsRegistered(walletAddress);
            if (!registeredStatus) {
            navigate("/");
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const getEvents = async () => {
        try {
            const allEvents = await contract.getAllEvents();
            let toReturn = [];
            if (endStatus){
                for (let i = 0; i < allEvents.length; i++) {
                    if (parseInt(allEvents[i].end._hex)*1000 < Date.now()){
                        toReturn.push(allEvents[i]);
                    }
                }
                setEvents(toReturn);
            }
            else {
                for (let i = 0; i < allEvents.length; i++) {
                    if (parseInt(allEvents[i].end._hex)*1000 >= Date.now()){
                        toReturn.push(allEvents[i]);
                    }
                }
                setEvents(toReturn);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getNameFromAddress();
        ifNotRegistered();
        getEvents();
    }, [endStatus]);



    return (
        <>
            <header>
                <h1>Welcome to Vote Dashboard</h1>
            </header>

            <main>
                <section className="greeting">
                    <h2>Hello, {name}!</h2>
                    {endStatus ? <button onClick={() => setEndStatus(false)}>Click here to see events that are ongoing!</button> : <button onClick={() => setEndStatus(true)}>Click here to see events that have ended!</button>}
                    {endStatus ? <p>Here are the events that have ended:</p> : <p>Here are the ongoing events:</p>}
                    {events.length == 0 ? <h2>There are no events.</h2> :     <section className="votes">
                        {events.map((event, index) => {
                            return (
                                <div className="vote">  
                                    <Card key={index} event={event} />
                                </div>
                            )
                        })}
                    </section>}
            </section>
            </main>

        </>
    )
}