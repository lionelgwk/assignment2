import React from 'react';
import "./noMetamask.css";

export default function NoMetamask() {

    const installMetamask = () => {
        window.open("https://metamask.io/", "_blank");
    }

    return (
        <div className="overlay">
            <div className="popup">
                <h1>Metamask not installed</h1>
                <p>Click the button below to install Metamask</p>
                <button id="connect-metamask" onClick={installMetamask}>Install</button>
            </div>
        </div>
    );
}