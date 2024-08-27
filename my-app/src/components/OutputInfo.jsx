import React from "react";
import { processStartUpValue } from "../utils/Algorithm.js";

export function OutputInfo({ aMove, pMove }) {
    try {
        // Ensure aMove and pMove exist and have the required properties before processing
        if (!aMove || !pMove) {
            throw new Error("Move data is missing");
        }

        console.log("AMOVEID" , aMove.id);

        const frameAdvantage = -(processStartUpValue(aMove.advantage) + processStartUpValue(pMove.startup));
        console.log("frame advantage", frameAdvantage);

        let moveDetail = "";
        let perfectLanding = "";

        if (aMove.isAerial) {
            moveDetail = "If landing in the area of the first";
            perfectLanding = " perfectly landed";
        } else {
            moveDetail = "If hit near the first";
        }

        return (
            <div className="outputinfo">
                <h2 className="outputheader">Output</h2>
                <h3 className="outputtext">
                    {moveDetail} {frameAdvantage} Frames of {pMove.id}, a{perfectLanding} {aMove.id} can be punished
                </h3>
            </div>
        );
    } catch (err) {
        // Display the error in a user-friendly way
        return (
            <div className="outputinfo">
                <h2 className="outputheader">Error</h2>
                <h3 className="outputtext">An error occurred: {err.message}</h3>
            </div>
        );
    }
}

export default OutputInfo;
