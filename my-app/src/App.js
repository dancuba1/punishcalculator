import './App.css';
import { useState, useEffect } from "react";
import { getAllCharactersData, getCharacterData, processStartUpValue, getImage, setStartUpCalc } from "./Algorithm.js";
import Dropdown from "./Dropdown.jsx";

function App() {
  //characters and all their moves
  const [characterList, setCharacterList] = useState([]);

  //characters names
  const [characterSelect, setCharacterSelect] = useState([]);
  //move names
  const [moveIds, setMoveIds] = useState([]);

  //all moves of character
  const [charMoves, setCharMoves] = useState([]);


  //selected move data of attacking character
  const [moveSelect, setMoveSelect] = useState([]);
  //all moves of punishing character                        //BOTH USED FOR ALGO
  const [pCharMoves, setPCharMoves] = useState([]);
  


  //selected move id
  const [selectedMoveId, setSelectedMoveId] = useState("Select Move");
  //selected char id  
  const [selectedChar, setSelectedChar] = useState("Select Character");               //USED FOR DROPDOWN SELECTIONS
  //selected pchar id
  const [selectedPChar, setSelectedPChar] = useState("Select Punishing Character");


  //boolean to detect when move selection should be reset to "Select Move"
  const [resetMove, setResetMove] = useState(false);

  useEffect(() => {
    const displayCharacterInfo = async () => {
      try {
        const characters = await getAllCharactersData();
        setCharacterList(characters);
        setCharacterSelect(characters.map(character => character.name));
        console.log(characters);
      } catch (err) {
        console.log(err);
      }
    };
    displayCharacterInfo();
  }, []);


  //set character data to the character selected and set the select move dropdown
  useEffect(() => {
    const getCharMoves = (charName) => {
      const character = characterList.find((char) => char.name === charName);
      return character ? character.moves : [];
    };

    if (selectedChar !== "Select Character") {
      if(resetMove){
        setSelectedMoveId("Select Move");
        setResetMove(false);
      }
      const moves = getCharMoves(selectedChar);
      setCharMoves(moves);
      setMoveIds(charMoves.map(move => move.id));
    }
  }, [selectedChar, charMoves]);

  //set pcharacter data to the character selected
  useEffect(() => {
    const getPCharMoves = (charName) => {
      const character = characterList.find((char) => char.name === charName);
      return character ? character.moves : [];
    };

    if (selectedPChar !== "Select Punishing Character") {
      const moves = getPCharMoves(selectedPChar);
      setPCharMoves(moves);
      console.log("punishing character moves:");
      console.log(moves);
    }
  }, [selectedPChar]);


  // sets the selected move to it's own object
  useEffect(() => {
    const getMoveData = (moveName) => {
      const move = charMoves.find((move) => move.name = moveName);
      return move;
    }
    if(selectedMoveId !== "Select Move"){
      const move = getMoveData(selectedMoveId);
      setResetMove(true);
      setMoveSelect(move);
      console.log(move.id)
    }
  }, [selectedMoveId, charMoves]); 


  const calculatePunish = async () => {
    console.log(moveSelect);
    console.log(pCharMoves.length);

    //make sure the a move is selected and punishing character also
    const isMoveSelectNotEmpty = Object.keys(moveSelect).length > 0;
    if(isMoveSelectNotEmpty && pCharMoves.length > 0){
      try {
       //map for moves' id to total start up when calculated.
        const startUpMap = {};

        
        var jumpSquat;
        if(selectedPChar === "Kazuya"){
          jumpSquat = 7;
        }else{
          jumpSquat = 3;
        }
         //for each move the punishing character 
        for(const move of pCharMoves){
          //calc all start ups
          const startUp = processStartUpValue(move.startup);
          if(startUp !== null) {
            startUpMap[move.id] = setStartUpCalc(move, startUp, jumpSquat);
          }
        }

      } catch (err) {
        console.log(err);
      }
    }else{
      console.log("One Empty array at least");
    }
  };

  return (
    <div className="App">
      <div className='content-container'>
        <div className="App-header">
          <h2>Smash Ultimate</h2>
          <div className="punishCalculator">
            <h1>Punish</h1>
            <h1>Calculator</h1>
          </div>
        </div>

        <div className="dropdownContainer">
          <div className="selectCharacter">
            <Dropdown
              options={characterSelect} 
              selected={selectedChar} 
              setSelected={setSelectedChar}
            />
          </div>
          <div className="selectMove">
            <Dropdown
              options={moveIds} 
              selected={selectedMoveId} 
              setSelected={setSelectedMoveId}
            />
          </div>
          <div className="selectPunishingCharacter">
            <Dropdown
              options={characterSelect} 
              selected={selectedPChar} 
              setSelected={setSelectedPChar}
            />
          </div>
        </div>
        <div className="calcOutput">
            <section className='calcRectangle'>
                <div className="r">
                  <div className='rec'>
                  <img className='inputAttack' alt='aChar' src={getImage("a")}/>
                  </div>
                </div>
              
            </section>
          </div>
        <div className='button'>
          <button className='calcButton' onClick={() => calculatePunish()}>
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
