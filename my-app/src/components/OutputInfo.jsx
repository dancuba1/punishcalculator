import React, { useState, useEffect } from "react";
import { processStartUpValue, setStartUpCalc } from "../utils/Algorithm.js";

export function OutputInfo({ aMove, pMove, jumpSquat }) {
    const [frameAdvantage, setFrameAdvantage] = useState(0);

    useEffect(() => {
        try {
            // Ensure aMove and pMove exist and have the required properties before processing
            if (!aMove || !pMove) {
                throw new Error("Move data is missing");
            }

            const initStartUp = pMove.startup;
            const newPMove = setStartUpCalc(pMove, initStartUp, jumpSquat);
            console.log("newPMove startup " + newPMove.startup);
            // Calculate the frame advantage and update state
        } catch (err) {
            console.error("An error occurred:", err.message);
        }
    },[]); // Re-run effect only when aMove, pMove, or jumpSquat change

    //calculate new frame advantage, when a new pMove is loaded
    useEffect(() => {
        if(pMove!= null){
            handleFrameAdvantage()
        }
    }, [pMove])
  
    function handleFrameAdvantage(){
            const calculatedFrameAdvantage = -(processStartUpValue(aMove.advantage) + pMove.startup);
            setFrameAdvantage(calculatedFrameAdvantage);
    }
    // Prepare the output based on whether aMove is an aerial move or not
    
    const [moveDetail, perfectLanding, noTruePunishMessage] = getDialogue(aMove);
   
    //Returns a message for if a move is unpunishable
    if(pMove==="Unpunishable"){
        return(
            <div className="outputinfo">
            <h2 className="outputheader">Output</h2>
            <h3 className="outputtext">
                {aMove?.id} cannot be true punished, however, 3 of the punishing character's fastest moves have been provided, {noTruePunishMessage} 
            </h3>
        </div>
        );
    }

    return (
        <div className="outputinfo">
            <h2 className="outputheader">Output</h2>
            <h3 className="outputtext">
                {moveDetail} {frameAdvantage} Frames of {pMove?.id}, a{perfectLanding} {aMove?.id} can be punished
            </h3>
        </div>
    );
}

const getDialogue = (aMove) => {
    let moveDetail = "";
    let perfectLanding = "";
    let noTruePunishMessage = "";
    if (aMove && aMove.isAerial) {
        moveDetail = "If landing in the area of the first";
        perfectLanding = " perfectly landed";
        noTruePunishMessage = "in case of an imperfectly landed attack"
    } else {
        moveDetail = "If hit near the first";
        noTruePunishMessage = "in case of your opponent mashing"
    }
    return[moveDetail, perfectLanding, noTruePunishMessage];
}
export default OutputInfo;
