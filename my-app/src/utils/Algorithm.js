import { fetchGifs } from "../repo/CharacterGifs";
import { invertId } from "./stringManip";


//handles the beginnning of the punish calculation
export const handlePunishCalc = async ({
  dropdownPCharID,
  dropdownACharID,
  dropdownAMoveID,
  moveSelect,
  pCharMoves,
  jumpSquat,
  previousAChar,
  previousAMove,
  previousPChar,
  setPreviousAChar,
  setPreviousAMove,
  setPreviousPChar,
  setShowSpinner,
  setIsPunishable,
  setPunishingMoves,
  setSSImages,
  setSingleImage,
  setCalcOutputVisible,
}) => {
  setShowSpinner(true);

  // Set jumpSquat based on the punishing character
  jumpSquat.current = dropdownPCharID === "Kazuya" ? 7 : 3;
  console.log("calculatePunish jumpsquat: " + jumpSquat.current);

  try {
    // Avoid recalculation for the same inputs
    if (
      previousAChar === dropdownACharID &&
      previousAMove === dropdownAMoveID &&
      previousPChar === dropdownPCharID
    ) {
      console.log("No need to recalculate, same inputs as before.");
      return;
    }

  
    // Perform punishment calculation
    const [newPunishingMoves, urls, url] = await punishCalculation(
      moveSelect,
      pCharMoves,
      dropdownPCharID,
      dropdownACharID,
      dropdownAMoveID,
      jumpSquat
    );

    if (newPunishingMoves.length > 0) {
      setIsPunishable(true);
      console.log("New Punishing Moves Length: " + newPunishingMoves.length);

      console.log("newPunishingMoves " + newPunishingMoves);
      setPunishingMoves(newPunishingMoves);
      setSSImages(urls);
      setSingleImage(url);
    } else {
      setIsPunishable(false);
      const [top3Moves, fastUrls] = await getFastestPCharMoves(
        pCharMoves,
        dropdownPCharID,
        jumpSquat
      );
      setPunishingMoves(top3Moves);
      setSSImages(fastUrls);
      setSingleImage(url);
    }

    // Update the previous character and move selections
    setPreviousAChar(dropdownACharID);
    setPreviousAMove(dropdownAMoveID);
    setPreviousPChar(dropdownPCharID);
    setCalcOutputVisible(true);
  } catch (err) {
    console.error(err);
  } finally {
    setShowSpinner(false);
  }
};


//retreives a useable start up value
export function processStartUpValue(value) {
  if (typeof value === 'string') {
      if (value.includes('/')) {
          const parts = value.split('/').map(part => part.trim());
          const numbers = parts.map(part => parseInt(part, 10)).filter(num => !isNaN(num));
          return numbers.length > 0 ? Math.min(...numbers) : null;
      } else {
          const number = parseInt(value, 10);
          return !isNaN(number) ? number : null;
      }
  }else if(typeof value === 'number'){
    return value;
  

  } else {
      // Log if the value is undefined or not a string
      console.warn("Invalid value for processStartUpValue:", value);
      return null;
  }
}


//adds start up frames that are dependant on move type
export function setStartUpCalc(move, initStartUp, jumpSquat) {
  console.log(move);
  console.log("current js: " + jumpSquat.current);

  const shieldDropLag = 11;
  const grabLag = 4;

  try {
    let newStartup = initStartUp;

    switch (true) {

      //Stops using aerial up b as never an optimal punish over normal up b
      case move.id.includes("B, Aerial") || move.id.includes("B, Air") || move.id.includes("Forward Air 2") || move.id.includes("Forward Air 3"):
        newStartup = 9999;
        break;

      case move.isUpB || move.isUpSmash:
        // No change to startup
        break;
     
      case move.isAerial:
        console.log("In isAerial JumpSquat: " + jumpSquat.current);
        newStartup += jumpSquat.current;
        break;

      case move.id.includes("Dash Grab"):
        newStartup += shieldDropLag;
        break;

      case move.id.includes("Grab"):
        newStartup += grabLag;
        break;

      case move.id.includes("Aerial"):
        newStartup += jumpSquat.current;
        break;

      default:
        newStartup += shieldDropLag;
        break;
    }

    return {
      ...move,
      startup: newStartup,
    };
  } catch (err) {
    console.log(err);
    return;
  }
}


//greater function for getting all start ups for a character
export const getStartUpMap = async (pCharMoves, selectedPChar, jumpSquat) =>{
  const startUpMap = new Map();
  
  for(const move of pCharMoves){
    if((move.id).includes(""))
    //calc all start ups
    console.log(move.startup);
    const startUp = await processStartUpValue(move.startup);
    if(startUp !== null) {
      console.log("start up not null " + startUp);
      startUpMap.set(move.id, setStartUpCalc(move, startUp, jumpSquat));
      console.log(" startUPmap object " + startUpMap.get(move.id));
    }else{
      console.log("start up null" + startUp);
    }
  }
  return startUpMap;
}



export const punishCalculation = async (moveSelect, pCharMoves, selectedPChar, selectedChar, selectedMoveId, jumpSquat) => {
  console.log("moveSelect " + moveSelect);
  console.log("pCharMoves " + pCharMoves);
  //make sure the a move is selected and punishing character also
  const isMoveSelectNotEmpty = moveSelect && typeof moveSelect === 'object' && Object.keys(moveSelect).length > 0;

  
  if(!isMoveSelectNotEmpty){
    //Insert Pop up saying a move must be selected
    return [[], [], null, selectedPChar, selectedChar, moveSelect];

  }
  if(isMoveSelectNotEmpty && pCharMoves.length > 0){
    try {
     //map for moves' id to total start up when calculated.
      
      
    

      if((moveSelect.advantage === "--" || moveSelect.advantage === "**")){
        const url = await handleACharFetchGifs(selectedChar, selectedMoveId);
        const [newPunishingMoves, urls] = await getFastestPCharMoves(pCharMoves, selectedPChar, jumpSquat);
        return [newPunishingMoves, urls, url];
      }
      
       //for each move the punishing character 
      const startUpMap = await getStartUpMap(pCharMoves, invertId(selectedPChar), jumpSquat);
     
      console.log("START UP MAP"  + startUpMap);

  
      // Retrieve all urls and moves
      const [urls, newPunishingMoves] = await handlePCharFetchGifs(moveSelect, startUpMap, selectedPChar);
      const url = await handleACharFetchGifs(selectedChar, selectedMoveId);
      return [newPunishingMoves, urls, url, selectedPChar, selectedChar, moveSelect];

    } catch (err) {
      console.log(err);
      return [[], [], null, selectedPChar, selectedChar, moveSelect];

    }
  }else{
    console.log("One Empty array at least");
    return [[], [], null, selectedPChar, selectedChar, moveSelect];

  }
}
export const getFastestPCharMoves = async (pCharMoves, selectedPChar, jumpSquat) => {
  console.log("in getFastestPCharMoves");

  // Get the map of all moves and their startup times
  const startUpMap = await getStartUpMap(pCharMoves, invertId(selectedPChar), jumpSquat);

  // Convert the Map to an array of entries ([moveId, moveObject])
  const startUpArray = Array.from(startUpMap.entries());

  // Sort the array based on the 'startup' value (ascending)
  const sortedStartUpArray = startUpArray.sort(([, moveA], [, moveB]) => moveA.startup - moveB.startup);

  // Get the top 3 fastest moves (still as [moveId, moveObject])
  const top3MovesEntries = sortedStartUpArray.slice(0, 3);

  // Extract just the move objects
  const top3MoveObjects = top3MovesEntries.map(([, moveObj]) => moveObj);

  // Optionally fetch gifs for these moves using their IDs
  const top3MoveIds = top3MovesEntries.map(([moveId]) => moveId);
  const urls = await fetchGifs(invertId(selectedPChar), top3MoveIds, true);

  console.log(top3MoveObjects);
  return [top3MoveObjects, urls];
};


async function handlePCharFetchGifs(moveSelect, startUpMap, selectedPChar) {
  var urls = []
  const newPunishingMoves = [];
  if(moveSelect.advantage === "Shield Breaks"){
    console.log("Found Shield Break")
    urls = moveSelect.advantage;
    return;
  }else if(moveSelect.advantage === "--"){
    urls = "No advantage found";
    return;
  }else{
    try {
      for (let [key, value] of startUpMap) {
        console.log("Move ID:", key);
        const processedAdvantage = await processStartUpValue(moveSelect.advantage);
        console.log(processedAdvantage);
        console.log("VALUE " + value);
        const difference = value.startup + processedAdvantage;
        try {
          if (difference < 0) {
            console.log("difference found " + difference);
            if(notFollowingHits(key)){
              newPunishingMoves.push(value);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
  
      console.log("New Punishing Moves", newPunishingMoves);
  
      // Set the new punishing moves to state
  
      // Fetch GIFs with the updated punishing moves
      urls = await fetchGifs(invertId(selectedPChar), newPunishingMoves, false);
    } catch (error) {
      console.error("Error fetching GIFs:", error);

    }
  }
  return [urls, newPunishingMoves];
}

async function handleACharFetchGifs(selectedChar, selectedMoveId){
  var url = "";
  try{
   url = await fetchGifs(invertId(selectedChar), selectedMoveId, true);
   console.log("Found url ", url);
  }catch(err){
   console.log(err);
  }

  return url;
}

function notFollowingHits(key){
  return !(key.includes("Hit 2") || key.includes("Hit 3") || key.includes("Hit 4") || key.includes("Jab 2") || key.includes("Jab 3") || key.includes("Rapid Jab") || key.includes("Pivot Grab"));
}