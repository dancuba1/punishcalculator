import { useState } from "react";
import InfoModal from "./InfoModal";

export function AppHeader() {
  const [isClicked, setIsClicked] = useState(false);
  const toggleClicked = () => setIsClicked(prev => !prev);

  return (
    <div className="App-header">

      <div className="App-header-row">
        <div className="header-text">
          <h2>Smash Ultimate</h2>
          <div className="punishCalculator">
            <h1>Punish</h1>
            <h1>Calculator</h1>
          </div>
          <h4>v0.2.0</h4>
        </div>

        <div className="info-modal-button-container">
          <div onClick={toggleClicked} className="info-button">
            <img
              style={{ width: "100%", height: "100%" }}
              src={`${window.location.origin}/images/info-logo.svg`}
              alt="Info Logo"
            />
          </div>
        </div>
      </div>

      {isClicked && (
        <div className="info-modal-wrapper">
          <InfoModal
            isVisible={isClicked}
            setIsVisible={setIsClicked}
          />
        </div>
      )}

    </div>
  );
}
