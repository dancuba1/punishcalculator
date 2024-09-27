import './App.css';
import { useState, useEffect, useReducer, useRef } from "react";
import ToastList from "./components/ToastList/ToastList";

import {processStartUpValue, getImage, setStartUpCalc, punishCalculation, getFastestPCharMoves } from "./utils/Algorithm.js";
import { getAllCharactersData, getAllCharacterNames, getCharacterData, getCharacterNames, getCharacterMove } from "./repo/FirebaseRepository.js";
import { fetchGifs } from "./repo/CharacterGifs.jsx";
import Dropdown from "./components/Dropdown.jsx";
import Slideshow from "./components/Slideshow.jsx";
import { useJumpSquat } from './hooks/useJumpSquat.js';
import CalcOutput from "./components/CalcOutput.jsx";

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ToggleVisibility from './components/ToggleVisibility.jsx';
import { getStartUpMap } from './utils/Algorithm.js';
import { invertId, invertIds, transformId, transformIds } from './utils/stringManip.js';
import { AppHeader } from './components/AppHeader.jsx';





function App() {

  
  const jumpSquat = useJumpSquat();

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


  //GET ALL CHARACTER NAMES, runs once
  useEffect(() => {
    const displayCharacterInfo = async () => {
      try {
        //const characters = await getAllCharactersData();
        //setCharacterList(characters);
        const charNames = await getAllCharacterNames()
        setCharacterSelect(transformIds(charNames));
        console.log(characterSelect);
      } catch (err) {
        console.log(err);
      }
    };
    displayCharacterInfo();
  }, []);



  useEffect(() => {
      console.log("Not Character Select");
      const handleCharacterMoves = async () => {
        try {
          const characterWithMoves = await getCharacterData(invertId(selectedChar));
          console.log(characterWithMoves);
  
          // Set move IDs with new array, not by spreading existing state
          setMoveIds(characterWithMoves[0].moves.map((move) => move.id));
        } catch (error) {
          console.error("Error fetching character moves:", error);
        }
      };
      handleCharacterMoves();
      console.log("moveIds" + moveIds);
    
  }, [selectedChar])

  
  useEffect(() => {
    if(characterList.length > 0){
      const getCharMoves = (charName) => {
        const character = characterList.find((char) => char.name === charName);
        return character ? character.moves : [];
      };
  
      if (selectedChar !== "Select Character") {
        if(resetMove){
          setSelectedMoveId("Select Move");
          setResetMove(false);
        }
        const moves = getCharMoves(invertIds(selectedChar));
        setCharMoves(moves);
        setMoveIds(charMoves.map(move => move.id));
      }
    }
    
  }, [selectedChar, charMoves]);

  //set pcharacter data to the character selected
  useEffect(() => {
    const fetchPCharMoves = async () => {
        if (selectedPChar !== "Select Punishing Character") {
            console.log("in selectedPChar " + selectedPChar);
            
            // Await the result of the asynchronous function
            const moves = await getPCharMoves(selectedPChar);
            
            // Update the state with the fetched moves
            setPCharMoves(moves);
            
            console.log("punishing character moves:", moves);
        }
    };

      fetchPCharMoves();  
  }, [selectedPChar]);

  const getPCharMoves = async (charName) => {
      const character = await getCharacterData(invertId(charName));
      console.log("in getPCharMoves", character);
      
      // Return the moves or an empty array if not found
      return character ? character[0].moves : [];
  };


  // sets the selected move to it's own object
  useEffect(() => {
    if (selectedMoveId !== "Select Move" && moveIds.length > 0) {
      const fetchMove = async () => {
        const move = await getCharacterMove(selectedChar, selectedMoveId);
        setResetMove(true);
        setMoveSelect(move);
        console.log(move);
      };
      fetchMove(); // Fetch the move data and handle state updates
    }
  }, [selectedMoveId]); 

  const [toasts, setToasts] = useState([]);
  const [autoClose, setAutoClose] = useState(true);
  const [autoCloseDuration, setAutoCloseDuration] = useState(5);
  const [position, setPosition] = useState("bottom-right");

  const positions = {
    "top-right": "Top-right",
    "top-left": "Top-left",
    "bottom-right": "Bottom-right",
    "bottom-left": "Bottom-left",
  };
  const showToast = (message, type) => {
    const toast = {
      id: Date.now(),
      message,
      type,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);

    if (autoClose) {
      setTimeout(() => {
        removeToast(toast.id);
      }, autoCloseDuration * 1000);
    }
  };
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const handleDurationChange = (event) => {
    setAutoCloseDuration(Number(event.target.value));
  };

  const handleAutoCloseChange = () => {
    setAutoClose((prevAutoClose) => !prevAutoClose);
    removeAllToasts();
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  
  const [punishingMoves, setPunishingMoves] = useState([]);
  const [previousAChar, setPreviousAChar] = useState("");
  const [previousAMove, setPreviousAMove] = useState("");
  const [previousPChar, setPreviousPChar] = useState("");
  const calculatePunish = async () => {
    setShowSpinner(true);
    if(selectedPChar === "Kazuya"){
      jumpSquat.current = 7;
    }else{
      jumpSquat.current = 3;
    }
    console.log("calculatePunish jumpsquat" + jumpSquat.current); 

    try{
      if (previousAChar === selectedChar && previousAMove === selectedMoveId && previousPChar === selectedPChar) {
        // No need to recalculate since the inputs are the same
        console.log("No need to recalculate, same inputs as before.");
        return;
      }

      if(selectedMoveId.includes("Grab")){
        //handleGrabInput();
        return;
      }
      const [newPunishingMoves, urls, url] = await punishCalculation(
        moveSelect,
        pCharMoves,
        selectedPChar,
        selectedChar,
        selectedMoveId,
        jumpSquat);

      if(newPunishingMoves.length>0){
        setIsPunishable(true);
        console.log("nPMoves length " + newPunishingMoves.length);
        setPunishingMoves(newPunishingMoves);
        setSSImages(urls);
        setSingleImage(url);  
      }else{
        setIsPunishable(false);
        const [top3Moves, urls] = await getFastestPCharMoves(pCharMoves, selectedPChar, jumpSquat)
        setPunishingMoves(top3Moves);
        setSSImages(urls);
        setSingleImage(url);
      }
      

      setPreviousAChar(selectedChar);
      setPreviousAMove(selectedMoveId);
      setPreviousPChar(selectedPChar);
      setShowSpinner(false);
      setCalcOutputVisible(true);
    }catch(err){
      console.error(err);
      showToast("Error on our part!", "failure");
    }
   
 
   
  };


  const [isPunishable, setIsPunishable] = useState(true);
  const [ssImages, setSSImages] = useState([]);
  const [singleImage, setSingleImage] = useState([]);
  
  const [calcOutputVisibile, setCalcOutputVisible] = useState(false);
  const [showSpinner, setShowSpinner]= useState(false);


  return (
    <div className="App">
      <div className='content-container'>
        <AppHeader/>
        <div className="dropdownContainer">
            <Dropdown
              className = "selectCharacter"
              options={characterSelect} 
              selected={selectedChar} 
              setSelected={setSelectedChar}
            />
            <Dropdown
              className = "selectMove"
              options={moveIds} 
              selected={selectedMoveId} 
              setSelected={setSelectedMoveId}
              />
            <Dropdown
              className = "selectPunishingCharacter"
              options={characterSelect} 
              selected={selectedPChar} 
              setSelected={setSelectedPChar}
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
          <button className='calcButton' onClick={() => calculatePunish()}>
            Calculate
          </button>
        </div>
      </div>
      <ToastList data={toasts} position={position} removeToast={removeToast}/>
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
