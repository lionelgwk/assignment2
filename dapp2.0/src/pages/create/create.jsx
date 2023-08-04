import React, { useEffect, useState } from 'react';
import { votingABI } from '../../abi/voting.js';
import { ethers } from 'ethers';
import "./create.css";


export default function Create() {

    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDuration, setEventDuration] = useState(600);
    const [constestantNameArray, setContestantNameArray] = useState([]);
    const [contestantImageArray, setContestantImageArray] = useState([]);


    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, votingABI, provider.getSigner());
    

    const [formValues, setFormValues] = useState([{ 
        contestantName: "",
        contestantImage: ""
    }])

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
      }
    
    let addFormFields = () => {
        setFormValues([...formValues, { contestantName: "", contestantImage: "" }])
      }
    
    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
    
    let handleSubmit = (event) => {
        event.preventDefault();
        const length = formValues.length;
        const contestantNames = [];
        const contestantImages = [];
        for (let i = 0; i < length; i++) {
            contestantNames.push(formValues[i].contestantName);
            contestantImages.push(formValues[i].contestantImage);
        }
        setContestantNameArray(contestantNames);
        setContestantImageArray(contestantImages);
        createEvent();
    }

    const createEvent = async () => {
        const length = formValues.length;
        const tx = await contract.createEvent(eventTitle, eventDescription, eventDuration, constestantNameArray, contestantImageArray);
        await tx.wait();
        alert("Event created!");
    }

    return (
        <>
            <header>
                <h1>Create an Event</h1>
            </header>

            <main>
                <section class="event-form">
                    <form onSubmit={handleSubmit}>
                        <label for="eventTitle">Event Title:</label>
                        <input type="text" id="eventTitle" name="eventTitle" onChange={(e) => setEventTitle(e.target.value)}required/>

                        <label for="eventDescription">Event Description:</label>
                        <textarea id="eventDescription" name="eventDescription" onChange={(e) => setEventDescription(e.target.value)} required></textarea>

                        <label for="eventDuration">Event Duration:</label>
                        <select type="text" id="eventDuration" name="eventDuration" onChange={(e) => setEventDuration(e.target.value)} required>
                            <option value="600">10 minutes</option>
                            <option value="86400">1 day</option>
                            <option value="253800">3 days</option>
                            <option value="604800">7 days</option>
                        </select>

                        <div id="contestants">
                            {formValues.map((element, index) => {
                                return (
                                    <div class="contestant-item">
                                        <h2>Contestant {index+1}</h2>
                                        <label for="contestantName">Contestant Name:</label>
                                        <input type="text" class="contestant-name" name="contestantName" onChange={e => handleChange(index, e)} required/>

                                        <label for="contestantImage">Contestant Image Link:</label>
                                        <input type="url" class="contestant-image" name="contestantImage" onChange={e => handleChange(index, e)} required/>
                                    </div>
                                )
                            })}
                        </div>

                        <button type="button" id="addContestantButton" onClick={addFormFields}>+ Add Contestant</button>

                        <button type="submit" >Create Event</button>
                    </form>
                </section>
            </main>
        </>
    )
}

