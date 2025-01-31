import './App.css';
import { useState} from "react";
import { handlePunishCalc } from './utils/Algorithm.js';
import Dropdown from "./components/Dropdown.jsx";
import { useJumpSquat } from './hooks/useJumpSquat.js';
import { useAllCharNames } from './hooks/useAllCharNames.js';
import CalcOutput from "./components/CalcOutput.jsx";
import { AppHeader } from './components/AppHeader.jsx';
import { useSelectedMove } from './hooks/useSelectedMove.js';
import { useCharacterMoves } from './hooks/useCharacterMoves.jsx';
import { useFetchPCharMoves } from './hooks/useFetchPCharMoves.jsx';



// A stands for Attacking (character), so the character that is using the initial move

// P stands for Punishing (character), so the character that is punishing A's move


function App() {

  //sets a mutable jumpsquat state for throughout the code, that varies whether pchar is kazuya or not
  const jumpSquat = useJumpSquat();
  
  //characters names
  const [allCharacterNames, setAllCharacterNames] = useState([]);
  //GETs ALL CHARACTER NAMES, runs once
  useAllCharNames(setAllCharacterNames);

  //selected achar id  
  const [dropdownACharID, setDropdownACharID] = useState("Select Character");              
  //selected amove id
  const [dropdownAMoveID, setDropdownAMoveID] = useState("Select Move");                 //USED FOR DROPDOWN SELECTIONS
  //selected pchar id
  const [dropdownPCharID, setDropdownPCharID] = useState("Select Punishing Character");

  
  //acharmove names
  const [aMoveIds, setAMoveIds] = useState([]);
  //Gives moves to dropdown, based on character selected
  useCharacterMoves(dropdownACharID, setAMoveIds);



  //all moves of punishing character                        
  const [pCharMoves, setPCharMoves] = useState([]);
  //set pcharacter data to the character selected
  useFetchPCharMoves(dropdownPCharID, setPCharMoves);




  //boolean to detect when move selection should be reset to "Select Move"
  const [resetMove, setResetMove] = useState(false);
  // sets the selected move to it's own object && wheether the move 
  const { moveSelect } = useSelectedMove(
    dropdownAMoveID,
    dropdownACharID,
    aMoveIds,
    resetMove,
    setResetMove
  );
  



   
  const [previousAChar, setPreviousAChar] = useState("");
  const [previousAMove, setPreviousAMove] = useState("");     //detects whether a recalculation is needed
  const [previousPChar, setPreviousPChar] = useState("");

  //Moves that can be used to punish
  const [punishingMoves, setPunishingMoves] = useState([]);

  
  const [isPunishable, setIsPunishable] = useState(true);

  //slideshow images(pcharmoves) and acharmove image
  const [ssImages, setSSImages] = useState([]);
  const [singleImage, setSingleImage] = useState([]);
  
  const [calcOutputVisibile, setCalcOutputVisible] = useState(false);
  const [showSpinner, setShowSpinner]= useState(false);

  const calc = async () => {
    await handlePunishCalc({
      //all data used in calc
      dropdownPCharID,
      dropdownACharID,
      dropdownAMoveID,
      moveSelect,
      pCharMoves,
      jumpSquat,
      previousAChar,
      previousAMove,
      previousPChar,
      //all states to be updated
      setPreviousAChar,
      setPreviousAMove,
      setPreviousPChar,
      setShowSpinner,
      setIsPunishable,
      setPunishingMoves,
      setSSImages,
      setSingleImage,
      setCalcOutputVisible,
    });
  };





  return (
    <div className="App">
      <div className='content-container'>
        <AppHeader/>
        <div className="dropdownContainer">
            <Dropdown
              className = "selectCharacter"
              options={allCharacterNames} 
              selected={dropdownACharID} 
              setSelected={setDropdownACharID}
            />
            <Dropdown
              className = "selectMove"
              options={aMoveIds} 
              selected={dropdownAMoveID} 
              setSelected={setDropdownAMoveID}
              />
            <Dropdown
              className = "selectPunishingCharacter"
              options={allCharacterNames} 
              selected={dropdownPCharID} 
              setSelected={setDropdownPCharID}
            />
        </div>
        { showSpinner &&
        <img src='./loading-spinner.svg' alt='spinner'/>
        }
        { calcOutputVisibile &&
        <div className="calcOutput">
          <CalcOutput
            ssImages = {ssImages}
            singleImage = {singleImage}
            aMove = {moveSelect}
            pMoves={punishingMoves}
            jumpSquat={jumpSquat}
            isPunishable={isPunishable}
            />
        </div>
        }
        <div className='button'>
          <button className='calcButton' onClick={() => calc()}>
            Calculate
          </button>
        </div>
      </div>
     
    </div>
  );
}

/*
  //example calc
  useEffect(() =>  {
    const storage = getStorage();
    const refs = [
      ref(storage, 'falco/Falco Up Smash.gif'),
      ref(storage, 'falco/Falco Up Tilt.gif'),
      ref(storage, 'falco/Falco Forward Air.gif')
    ];
    const single = ref(storage, 'falco/Falco Up Smash.gif');
  
    // Fetch single image
    getDownloadURL(single).then((url) => {
      setSingleImage(url);
    }).catch(handleError);
  
    // Fetch multiple images
    const fetchImages = async () => {
      const urls = await Promise.all(
        refs.map((fRef) => getDownloadURL(fRef).catch(handleError))
      );
      setSSImages(urls);
    };
  
    fetchImages();
  }, []); // Dependency array to prevent re-runs
  */

export default App;
