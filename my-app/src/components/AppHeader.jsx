import InfoModal from "./InfoModal";

export function AppHeader(){
return(<div className="App-header">
        <div className="header-text">
          <h2>Smash Ultimate</h2>
          <div className="punishCalculator">
            <h1>Punish</h1>
            <h1>Calculator</h1>
          </div>
          <h4>v0.1.0</h4>
          </div>
          <div className="info-modal">
            <InfoModal />
          </div>
        </div>);}