
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


export const fetchGifs = async (char, moves, isId) => {
    console.log("in Fetch gifs");

    var urls = []
    if(Array.isArray(moves)){
        console.log("Found array");
        var moveIds = [];
        if(isId){
            for (const move of moves){
                console.log("Type of Move in fetchGifs:  ", typeof(move));
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


const getAllClosestImageUrls = async (characterName, moves) => {
    console.log("getAllClosestImageURLs moveName : " + moves, "characterName: " + characterName);
    const capitalChar = capitaliseFirstLetter(characterName);
    try {
        //UPDATE fetch URL
      const response = await fetch('https://findallimages-xdlwx36zpq-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moves, capitalChar, characterName }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      const fileNames = result.fileNames;
      console.log("Filenames: ", fileNames);
      
      let urls = [];
      for(const fileName of fileNames){
        const url = `https://firebasestorage.googleapis.com/v0/b/punish-calculator.appspot.com/o/${encodeURIComponent(`${fileName}`)}?alt=media`;
        urls.push(url);
      }
      return urls;
    } catch (error) {
      console.error('Error retrieving image:', error);
    }
}

const getClosestImageUrl = async (characterName, moveName) => {
    console.log("getClosestImageURL moveName : " + moveName, "characterName: " + characterName);
    const capitalChar = capitaliseFirstLetter(characterName);

    try {
      const response = await fetch('https://getbestmoveimage-xdlwx36zpq-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moveName, capitalChar, characterName }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      const fileName = result.fileName;
      console.log("Filename: ", fileName);
      
      const url = `https://firebasestorage.googleapis.com/v0/b/punish-calculator.appspot.com/o/${encodeURIComponent(`${fileName}`)}?alt=media`;
      return url;
    } catch (error) {
      console.error('Error retrieving image:', error);
    }
  };
  
  
  