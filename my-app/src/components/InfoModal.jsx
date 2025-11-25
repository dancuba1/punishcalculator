import React, { useState, useRef, useEffect } from "react";

function InfoModal({ isVisible, setIsVisible }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const modalRef = useRef(null);

  const toggleExpand = () => setIsExpanded(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isVisible) return;

      const modal = modalRef.current;

      // If modal exists AND the click was outside it AND not on the info button:
      if (
        modal &&
        !modal.contains(event.target) &&
        !event.target.closest(".info-button")
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible, setIsVisible]);

  return (
    <div>
      <div
        ref={modalRef}
        className={`info-modal-content ${isVisible ? "clicked" : ""}`}
      >
        <div className="info-logo">
          <img
            style={{ width: "100%", height: "100%" }}
            src={`${window.location.origin}/images/info-logo.svg`}
            alt="Info Logo"
          />
        </div>

        <div className="info-content">
          <h6>USE CASE</h6>
          <p>
            Hate Mashers? Has anyone ever mashed a move over and over again on your shield, and you cannot seem to punish it?
            <br />
            It has happened to all Smash players.
          </p>
          <p>
            SSBU Punish Calculator allows users to know whether the spammed move is truly punishable, which moves you can use to punish it, and if not, what are your quickest options regardless.
            <br />
            This tool accounts for varying out of shield punish startup times, including either jumpsquat or shield drop when necessary.
          </p>


        </div>
        <div className="info-content tutorial">
         <h6>HOW TO USE</h6>
        <p>
          1. Select the character attacking your shield (attacking character)
          <br />
          2. Pick the move that they are using
          <br />
          3. Select your own character
          <br />
          4. CALCULATE
        </p>
        </div>

        <h6>Example Calculation:</h6>

        <img
          className={`example-calc ${isExpanded ? "expanded" : ""}`}
          src={`${window.location.origin}/images/example-calc.png`}
          alt="Example Calculation"
          onClick={toggleExpand}
        />

        <div className="info-content tutorial">
          <h6>Output Interpretation</h6>
        <p>
          You will be given visuals of the attacking move, and all possible options that can true punish, provided the hitbox (indicated by red or purple boxes) is spaced to be within the punishing attack’s range.
          <br /> 
          If no punish is found, you will be shown your quickest options regardless.
          <br /> 
          Note that this calculator assumes optimal shield pressure and reaction times.
          <br />
        </p>
        </div>
        <div className="info-content tutorial disclaimer">
          <h6>DISCLAIMER!</h6>
        <p>
          Please take into account spacing and the punishing attack's hitbox, when determining whether that move can actually punish the attacking move. 
          <br />
          <br />
          Example: Although Falco Up Air can mathematically punish Greninja's Dash Attack, due to Greninja being grounded and Falco attacking upwards while airborne, this cannot be true punished with this move. 
          <br />
          The calculator isn’t perfect due to this issue, and I will work toward a solution. For now, please take each output with a grain of salt and refer to the hitboxes and character models when making your assumptions.        </p>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
