import React, { useState, useEffect } from "react";
import { processStartUpValue, setStartUpCalc } from "../utils/Algorithm.js";

export function OutputInfo({ aMove, pMove, jumpSquat }) {
    const [frameAdvantage, setFrameAdvantage] = useState(0);
    const [updatedPMove, setUpdatedPMove] = useState(pMove);

    // Update pMove when dependencies change
    useEffect(() => {
        if (!aMove || !pMove) {
            console.warn("Move data is missing");
            return;
        }

        const initStartUp = pMove.startup; 
        console.log("initStartUp", initStartUp);
        const newPMove = setStartUpCalc(pMove, initStartUp, jumpSquat); // Already the full object
        setUpdatedPMove(newPMove);
        console.log("amove advantage: ", aMove.advantage);
        const calculatedFrameAdvantage = -(processStartUpValue(aMove.advantage) + pMove.startup);
        setFrameAdvantage(calculatedFrameAdvantage);
    }, [aMove, pMove, jumpSquat]);


    // Get output messages for the move
    const [moveDetail, perfectLanding, noTruePunishMessage] = getDialogue(aMove);
  

    // Prepare the output based on whether aMove is an aerial move or not
    
   
    //Returns a message for if a move is unpunishable
    if(pMove==="Unpunishable"){
        return(
            <div className="outputinfo">
            <h2 className="outputheader">OUTPUT</h2>
            <h3 className="outputtext">
                {aMove?.id} cannot be true punished, however, 3 of the punishing character's fastest moves have been provided, {noTruePunishMessage} 
            </h3>
        </div>
        );
    }

    return (
        <div className="outputinfo">
            <h2 className="outputheader">OUTPUT</h2>
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
