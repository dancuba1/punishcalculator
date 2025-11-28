
import { capitaliseFirstLetter, removeAllParentheses, removeSpecialSubstrings } from "../utils/stringManip.js";

/*
const getGifRef = (char, move) => {
    console.log("MOVE " +removeAllParentheses(removeSpecialSubstrings(move)));
    return(lowercaseFirstLetter(char) + '/' + transformId(char) + ' ' + removeAllParentheses(removeSpecialSubstrings(move))  + '.gif');
}
*/

const getCompatMove = (move) => {
    return removeAllParentheses(removeSpecialSubstrings(move));
}
/*

export const fetchGifs = async (char, moves, isId) => {
    console.log("in Fetch gifs");

    var urls = []
    var attemptedUrls = []
    const moveRefMap = {};
    if(Array.isArray(moves)){
        console.log("Found array");
        if(isId){
            for (const move of moves){
                const gifRef = getGifRef(char, move);
                console.log(`Generated gifRef for ${move.id}: `, gifRef); 
                moveRefMap[move] = gifRef;
            }
        }else{
            for (const move of moves){
                const gifRef = getGifRef(char, move.id);
                console.log(`Generated gifRef for ${move.id}: `, gifRef);  // Debugging log
    
                moveRefMap[move.id] = gifRef;
            }
        }
        
        try{
            attemptedUrls =  await Promise.allSettled(
                Object.values(moveRefMap).map(async (gifPath) => {
                    console.log("GIFREF " + gifPath)
                    const gifUrl = ref(storage, gifPath);
                    console.log("Gif URL  " + gifUrl);
                    return await getDownloadURL(gifUrl);
                })
            );
            urls = attemptedUrls
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value);
            console.log("Found Urls");
        } catch (err){
            console.error("Error in gif fetch: " + err);
        }
       

    }else if(typeof moves === "string"){
        console.log("Found string");
        const moveRef = getGifRef(char, moves);
        console.log(moveRef);
        const gifRef = ref(storage, moveRef);
        console.log(gifRef);
        urls =  await getDownloadURL(gifRef);
    }else{
        console.log(typeof(moves));

    }
    return urls;
}
    */

/*
export const fetchMultipleAttackingGifs = async (characterName , moveName) => {
  let urls = []
  if(characterName === "Min Min" && moveName === "Forward Smash"){
    
  }

  return urls;
}
*/


export const fetchGifs = async (char, moves, isId) => {
    console.log("in Fetch gifs");

    var urls = []
    if(Array.isArray(moves)){
        console.log("Found array");
        var moveIds = [];
        if(isId){
            for (const move of moves){
                console.log("Type of Move in fetchGifs:  ", typeof(move));
                console.log("Move in fetchGifs:  ", move);

                moveIds.push(getCompatMove(move));
            }
            urls = await getAllClosestImageUrls(char, moveIds);
            /*
            for (const move of moves){
                try{
                    const url = await getClosestImageUrl(char, move);
                    console.log(`Generated gifRef for ${move}: `, url); 
                    urls.push(url);
                }catch(err){
                    console.error(err, " move: ", move);
                }
                
            }
            */
        }else{
            for (const move of moves){
                console.log("Move in fetchGifs:  ", move);
                const moveId = move.id;
                moveIds.push(getCompatMove(moveId));
            }
            urls = await getAllClosestImageUrls(char, moveIds);

            /*
            for (const move of moves){
                try{
                    const url = await getClosestImageUrl(char, move.id);
                    console.log(`Generated gifRef for ${move.id}: `, url);  // Debugging log
                    urls.push(url);
                }catch(err){
                    console.error(err, " move: ", move.id);
                }
              
            }
                */
        }
        
        
       

    }else if(typeof moves === "string"){
        /*
        console.log("Found string");
        const moveRef = getGifRef(char, moves);
        console.log(moveRef);
        const gifRef = ref(storage, moveRef);
        console.log(gifRef);
        urls =  await getDownloadURL(gifRef);
        
        */

        urls = await getClosestImageUrl(char, getCompatMove(moves));
    }else{
        console.log(typeof(moves));

    }
    if(!(typeof urls === "string")){
        for(const url of urls){
            console.log("url in urls: " ,url);
        }
    }
    
    return urls;
}

const FALLBACK_IMAGE = `${window.location.origin}/images/no-image.png`;
// local fallback image

// temporary list of moves you know have no images
// (you can later import this from a JSON)
const MISSING_MOVE_IMAGES = [
  "Aura Sphere, Full Charge",
  "Aura Sphere",
  "Dragon Fang Shot",
  "Dragon Fang Shot chomp",
  "Chomp",
  "Dragon Lunge, Air",
  "Bang",
  "Sizz",
  "Whack",
  "Splattershot",
  "Air, Grappling Attack",
  "Grappling Hook",
  "PK Thunder",
  "Teleport",
  "Shadow Ball",
  "Shadow Ball, Fully Charged",
  "Shot Put",
  "Watergun",
];

const getAllClosestImageUrls = async (characterName, moves) => {
  console.log("getAllClosestImageURLs moveName : " + moves, "characterName: " + characterName);
  const capitalChar = capitaliseFirstLetter(characterName);

  // 1️⃣ Detect missing moves before sending to API
  const validMoves = [];
  const resultUrls = new Array(moves.length).fill(null); // preserve ordering

  moves.forEach((move, index) => {    
    if (MISSING_MOVE_IMAGES.includes(move)) {
      console.log(`Skipping missing move "${move}"`);
      resultUrls[index] = FALLBACK_IMAGE; // pre-fill fallback
    } else {
      if(move === "Forward Tilt" && characterName === "mega_man"){
        //megaman exception for forward tilt as same animation as jab
        const jab = "jab";
        validMoves.push({ jab , index });
      
      }else if(move === "Needle Storm, Full Charge" && characterName === "sheik"){
        console.log("Found needle Storm");
        const needleStorm = "Needle Storm";
        validMoves.push({ needleStorm , index });
      }else{
        validMoves.push({ move, index });
      }
    }
  });

  // 2️⃣ If all moves missing, return all fallbacks immediately
  if (validMoves.length === 0) {
    console.warn("All moves have missing images — returning all fallbacks.");
    return resultUrls;
  }

  // 3️⃣ Fetch only valid moves
  try {
    const response = await fetch("https://findallimages-xdlwx36zpq-uc.a.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moves: validMoves.map((m) => m.move),
        capitalChar,
        characterName,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    const fileNames = result.fileNames || [];
    console.log("FileNames returned:", fileNames);

    // 4️⃣ Merge valid results back into correct positions
    validMoves.forEach((item, i) => {
      const fileName = fileNames[i];
      resultUrls[item.index] = fileName
        ? `https://firebasestorage.googleapis.com/v0/b/punish-calculator.appspot.com/o/${encodeURIComponent(
            fileName
          )}?alt=media`
        : FALLBACK_IMAGE; // fallback if missing entry
    });

    return resultUrls;
  } catch (error) {
    console.error("Error retrieving images:", error);
    return moves.map(() => FALLBACK_IMAGE);
  }
};

const getClosestImageUrl = async (characterName, moveName) => {
  console.log("getClosestImageURL moveName : " + moveName, "characterName: " + characterName);
  const capitalChar = capitaliseFirstLetter(characterName);

  // skip API if this move has no image
  if (MISSING_MOVE_IMAGES.includes(moveName)) {
    console.log(`Skipping API request for "${moveName}" — returning fallback.`);
    return FALLBACK_IMAGE;
  }

  try {
    if(moveName === "Forward Tilt" && characterName === "mega_man"){
      //megaman exception for forward tilt as same animation as jab
      moveName = "jab";
    }
    if(moveName === "Needle Storm, Full Charge" && characterName === "sheik"){
        console.log("Found needle Storm");
        moveName = "Needle Storm";
      ;
    }

    const response = await fetch("https://getbestmoveimage-xdlwx36zpq-uc.a.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moveName, capitalChar, characterName }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    const fileName = result.fileName;

    if (!fileName) {
      console.warn(`No match for ${moveName} — using fallback.`);
      return FALLBACK_IMAGE;
    }

    return `https://firebasestorage.googleapis.com/v0/b/punish-calculator.appspot.com/o/${encodeURIComponent(
      fileName
    )}?alt=media`;
  } catch (error) {
    console.error("Error retrieving image:", error);
    return FALLBACK_IMAGE;
  }
};
