import React, { useState } from "react";

function InfoModal() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block", padding: "10px" }}>
      {/* Circular button */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "3vw",
          height: "3vw",
          borderRadius: "50%",
          backgroundColor: "#FFFFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          userSelect: "none",
          fontWeight: "bold",
          WebkitTextStroke: "1px black",
        }}
        
      >
        i
      </div>

      {/* Modal always rendered, animation handled via class */}
      <div className={`info-modal-content ${isHovered ? "hovered" : ""}`}>
          <div className="info-logo">
          i
        </div>

        <p>
          Hate Mashers?: Has anyone ever mashed a move over and over again on your shield, and you cannot seem to punish it?
          <br />
          It has happened to me.
          <br />
          <br />
          SSBU Punish Calculator allows users to know whether the spammed move is truly punishable, which moves you can use to punish it, and if not, what are your quickest options regardless.
        </p>
        
        <h6>How to Use:</h6>
        <p>
          1. Select the character attacking your shield (attacking character)
          <br />
          2. Pick the move that they are using
          <br />
          3. Select your own character
        </p>

        <p>
          You will be given visuals of the attacking move, and all possible options for that are can be true punished, providing the hit-box (indicated by red or purple boxes) is spaced to be within the punishing attack’s range.
        </p>
      </div>
    </div>
  );
}

export default InfoModal;
