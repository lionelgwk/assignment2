import React, { useEffect, useState } from 'react';
import { votingABI } from '../../abi/voting.js';
import { ethers } from 'ethers';
import "./event.css";
import { useParams } from 'react-router-dom';

export default function Event() {

    const { id } = useParams();
    
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, votingABI, provider.getSigner());

    const [event, setEvent] = useState([]);
    const [ownerName, setOwnerName] = useState("");
    const [contestants, setContestants] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [yourVote, setYourVote] = useState(0);
    const [eventClosed, setEventClosed] = useState(false);
    const [contestantVotes, setContestantVotes] = useState([]);
    const [winnerList, setWinnerList] = useState(null);

    const getEvent = async () => {
        const event = await contract.eventIdToEvent(id);
        const ownerAddress = event.owner;
        const ownerName = await contract.getUserName(ownerAddress);
        const dateFormat = new Date(parseInt(event.end._hex)*1000).toLocaleDateString("en-SG")
        const timeFormat = new Date(parseInt(event.end._hex)*1000).toLocaleTimeString("en-SG")
        const eventClosedBool = await contract.hasEventEnded(id);
        const contestantList = await contract.getContestantList(id);
        let toReturn = [];
        for (let i = 0; i <= contestantList.length; i++) {
            const noOfVotes = await contract.getContestantVotes(id, i);
            toReturn.push(parseInt(noOfVotes._hex));
        }
        setContestantVotes(toReturn);
        setEvent(event);
        setOwnerName(ownerName);
        setContestants(contestantList);
        setEventClosed(eventClosedBool);
        setDate(dateFormat);
        setTime(timeFormat);

        if (eventClosedBool) {
            const winners = await contract.getWinners(id);
            let finalWinners = [];
            for (let i = 0; i < winners.length; i++) {
                let winnerId = parseInt(winners[i]._hex);
                let winner = await contract.eventIdToContestantIdToContestant(id, winnerId);
                let winnerName = winner.contestantName;
                finalWinners.push(winnerName);
            }       
            setWinnerList(finalWinners);
        }
        
    }

    // const getAllConstestantVotes = async () => {
    //     try {
            
    //         console.log(toReturn);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // }



    const getNoOfVotes = async (contestantId) => {
        try {
            const noOfVotes = await contract.getContestantVotes(id, contestantId);
            return parseInt(noOfVotes._hex);
        }
        catch (err) {
            console.log(err);
        }
    }

    const getYourVote = async () => {
        try {
            const res = await contract.getYourVote(id);
            setYourVote(res);
            console.log(yourVote)
        }
        catch (err) {
            console.log(err);
        }
    }

    const castVote = async (contestantId) => {
        try {
            await contract.castVote(id, contestantId);
            getYourVote();
            alert("Vote casted!");
            window.location.reload();
        }
        catch (err) {
            alert("Error casting vote!");
        }
    }



    useEffect(() => {
        getEvent();
        setWalletAddress(localStorage.getItem("walletAddress"));
        getYourVote();

        // const interval = setInterval(() => {
        //     if (event.ultimateDecision) {
        //         if (eventClosed && parseInt(event.ultimateDecision._hex) == 0) {
        //             // run function to get ultimate decision
        //         }
        //     }
        //   }, 1000);
        //   return () => clearInterval(interval);
    }, []);



    return (
        <>

            <header>
                <h1>Event Details</h1>
            </header>

            <button onClick={() =>
                console.log(winnerList)
            }>
                click me
            </button>

            <main>
                <section className="event-details">
                    <section className="event-card">
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        Owner: <p>{ownerName}</p>
                        <p>Ends on: {date} {time}</p>
                        {/* {event.ultimateDecision ? 
                            parseInt(event.ultimateDecision._hex) === 0 ?
                            null 
                            :
                            <p>Ultimate Verdict:{parseInt(event.ultimateDecision._hex)}</p> 
                            : 
                            null} */}
                        {eventClosed && winnerList ? <p>{winnerList.length} Winner(s): 
                            {winnerList.map((winner, index) => {
                                return (
                                    <span key={index}>{index+1}. {winner} </span>
                                )
                            })}
                        </p> : null}
                    </section>
                    {/* {contestants.map (async (contestant, index) => {
                        console.log(contestant.contestantId);
                        const noOfVotes = await getNoOfVotes(parseInt(contestant.contestantId._hex));
                        return (
                            <div className="contestant-card">
                                <h3>{contestant.contestantName}</h3>
                                <p>{noOfVotes}</p>
                                <button className="vote-button">Vote</button>
                            </div>
                            
                            )}
                        )} */}
                    <section className="contestants">
                        {contestants.map ( contestant => {
                            const contestantIdHelper = parseInt(contestant.contestantId._hex);
                                return (
                                    <div className="contestant-card" key={contestant.contestantId._hex}>
                                        <img src={contestant.contestantImg} alt="" />
                                        <h3>{contestant.contestantName}</h3>
                                        <h4>Number of Votes: {contestantVotes[contestantIdHelper]}</h4>
                                        {
                                            eventClosed ? 
                                                
                                                <button className="vote-button-disabled" disabled>Voting is Over!</button>
                                                :
                                                yourVote == contestantIdHelper ? 
                                                <span>
                                                    <p>✅ Your Vote</p>
                                                    <button className="vote-button-disabled" disabled>You have already voted!</button>
                                                </span> : 
                                                <button className="vote-button" onClick={() => castVote(contestantIdHelper)}>Vote</button> 
                                                
                                        }
                                        
                                    </div>
                                )
                            }
                        )}
                    </section>
                            
                </section>
            </main>

        </>
    );
}