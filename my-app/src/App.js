import './App.css';
import { useState, useEffect, useReducer } from "react";
import {processStartUpValue, getImage, setStartUpCalc } from "./Algorithm.js";
import { getAllCharactersData, getAllCharacterNames, getCharacterData, getCharacterNames } from "./repo/FirebaseRepository.js";
import { fetchGifs } from "./repo/CharacterGifs.jsx";
import Dropdown from "./components/Dropdown.jsx";
import Slideshow from "./components/Slideshow.jsx";

import { getStorage, ref, getDownloadURL } from 'firebase/storage';


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
    if(selectedChar === "Select Character"){
      console.log("Not Character Select");
      const handleCharacterMoves = async () => {
        const characterWithMoves = await getCharacterData(selectedChar);
        console.log(characterWithMoves);
      
        setMoveIds(...moveIds, characterWithMoves[0].moves.map((move) => (move.id)));
      }
      handleCharacterMoves();
    }else{
      console.log("Character select = " + selectedChar);
    }
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
          console.log(move);
          const startUp = await processStartUpValue(move.startup);
          if(startUp !== null) {
            console.log("start up not null" + startUp);
            startUpMap[move.id] = setStartUpCalc(move, startUp, jumpSquat);
           
          }else{
            console.log("start up null" + startUp);
          }
        }
        async function handleFetchGifs() {
          try {
            // Wait for fetchGifs to complete and return URLs
            const urls = await fetchGifs(selectedPChar, pCharMoves);
            
            // Set the fetched URLs into the state
            setSSImages(urls);
          } catch (error) {
            console.error("Error fetching GIFs:", error);
            // Handle errors if needed
          }
        }
        
        // Calling the function
        handleFetchGifs();

      } catch (err) {
        console.log(err);
      }
    }else{
      console.log("One Empty array at least");
    }
  };

  useEffect(() => {
    getCharacterData(selectedChar);
  }, [selectedChar])

  const [imgSrc, setImgSrc] = useState(null);
  const [fallback, setFallback] = useState(false);

  const reloadSrc = e => { 
    if(fallback){
      e.target.src = '/img/blank_profile.png';
    }else{
      e.target.src = imgSrc
      setFallback(true)
    }
  }

  const [ssImages, setSSImages] = useState([]);
  const [singleImage, setSingleImage] = useState([]);
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
                    <div className='charGifs'>
                      <div className='sshow" aCharSlideShow'>
                        <Slideshow images ={singleImage}/>
                      </div>
                      <div className='sshow pCharSlideShow'>
                        <Slideshow images ={ssImages}/>
                      </div>
                    </div>
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
