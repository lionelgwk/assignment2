import { useState } from "react";
import { Link } from "react-router-dom";
import "./card.css";

export default function Card({event}) {
  const [singleEvent, setSingleEvent] = useState(event);
  const timeNow = Date.now();
  const dateFormat = new Date(parseInt(event.end._hex)*1000).toLocaleDateString("en-SG")
  const timeFormat = new Date(parseInt(event.end._hex)*1000).toLocaleTimeString("en-SG")

  // const [nft, setNft] = useState(props);
  // const [nftImage, setNftImage] = useState(() => {
  //   if (nft?.image) {
  //     return nft.image.includes("ipfs")
  //       ? `https://ipfs.io/ipfs/${nft.image.split("ipfs://")[1]}`
  //       : nft.image.split("\\")[0];
  //   }
  // });

  return (
    <div className="card">
      <h3 className="card-title">{event.title}</h3>
      <p className="card-description">{event.description}</p>
      {parseInt(event.end._hex)*1000 >= timeNow ? (
        <p className="card-time">Ends on {dateFormat} {timeFormat}</p>
      ) : (
        <p className="card-time">Ended</p>
        
      )}
      <Link to={`/event/${event.eventId}`} className="button">
        <button className="card-button">View</button>
      </Link>
      
    </div>
  );
}