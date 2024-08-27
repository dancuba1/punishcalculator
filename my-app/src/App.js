import './App.css';
import { useState, useEffect, useReducer } from "react";
import {processStartUpValue, getImage, setStartUpCalc } from "./utils/Algorithm.js";
import { getAllCharactersData, getAllCharacterNames, getCharacterData, getCharacterNames, getCharacterMove } from "./repo/FirebaseRepository.js";
import { fetchGifs } from "./repo/CharacterGifs.jsx";
import Dropdown from "./components/Dropdown.jsx";
import Slideshow from "./components/Slideshow.jsx";
import CalcOutput from "./components/CalcOutput.jsx";

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ToggleVisibility from './components/ToggleVisibility.jsx';
import { getStartUpMap } from './utils/Algorithm.js';


function reducer(state, action){
  switch(action.type){
    case "setAChar":
      return [];
    default:
      return;
  }
}

function App() {

  const[aChar, dispatch] = useReducer(reducer, []);
  

  function setAChar(char){
    dispatch({type: "setAChar"})
  }

  const storage = getStorage();
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
        //const characters = await getAllCharactersData();
        //setCharacterList(characters);
        
        setCharacterSelect(await getAllCharacterNames());
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
          const characterWithMoves = await getCharacterData(selectedChar);
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

  //set character data to the character selected and set the select move dropdown

  const setACharData = () => {

  }
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
        const moves = getCharMoves(selectedChar);
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
      const character = await getCharacterData(charName);
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

  var calcToggle = false;

  const [punishingMoves, setPunishingMoves] = useState([]);
  const calculatePunish = async () => {
    calcToggle = true;
    console.log("moveSelect " + moveSelect);
    console.log("pCharMoves " + pCharMoves);
    //make sure the a move is selected and punishing character also
    const isMoveSelectNotEmpty = moveSelect && typeof moveSelect === 'object' && Object.keys(moveSelect).length > 0;

    if(!isMoveSelectNotEmpty){
      //Insert Pop up saying a move must be selected
    }
    if(isMoveSelectNotEmpty && pCharMoves.length > 0){
      try {
       //map for moves' id to total start up when calculated.

        
         //for each move the punishing character 
         const startUpMap = await getStartUpMap(pCharMoves, selectedPChar);
       
        console.log("START UP MAP"  + startUpMap);

        async function handlePCharFetchGifs() {
          try {
            // Wait for fetchGifs to complete and return URLs
            //ADD VARIATION TO DIFFERENT ADVANTAGES
            for(let [key, value] of startUpMap){
              console.log("Move ID:", key);

              const processedAdvantage = await processStartUpValue(moveSelect.advantage)
              console.log(processedAdvantage);

              const difference = value.startUp + processedAdvantage;
              try{
                if(difference < 0){
                  setPunishingMoves(prevMoves => [value, ...(prevMoves || [])]);
                }
              }catch(err){
                handleError(err);
              }
            }
              
           
            console.log("Punishing Moves " + punishingMoves)
           
            const urls = await fetchGifs(selectedPChar, punishingMoves);
            
            // Set the fetched URLs into the state
            setSSImages(urls);
          } catch (error) {
            console.error("Error fetching GIFs:", error);
            // Handle errors if needed
          }
        }
        
        async function handleACharFetchGifs(){
           try{
            const url = await fetchGifs(selectedChar, selectedMoveId);

            setSingleImage(url);
           }catch(err){
            console.log(err);
           }
        }
        // Calling the function
        handlePCharFetchGifs();
        handleACharFetchGifs();

      } catch (err) {
        console.log(err);
      }
    }else{
      console.log("One Empty array at least");
    }
  };



  const [ssImages, setSSImages] = useState([]);
  const [singleImage, setSingleImage] = useState([]);

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
  
  const handleError = (error) => {
    // Handle the error
    console.error(error);
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
        <div className="calcOutput">
          <CalcOutput
            ssImages = {ssImages}
            singleImage = {singleImage}
            aMove = {moveSelect}
            pMoves={punishingMoves}
            />
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
