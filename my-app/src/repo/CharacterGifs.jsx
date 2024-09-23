import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../Config/firebase-config";
import { removeAllParentheses, lowercaseFirstLetter, removeSpecialSubstrings, capitaliseFirstLetter, transformId, invertId } from "../utils/stringManip.js";
import db from "../App.js";

const getGifRef = async (char, move) => {
    if (!db) {
        console.error("Database not loaded.");
        return null;
    }

    // Query the database for the image name
    const imageName = db.exec('SELECT image_name FROM moves WHERE character_name = ? AND move_name = ?', [char, move])[0]?.values[0]?.[0];
    
    if (imageName) {
        return lowercaseFirstLetter(char) + '/' + transformId(char) + ' ' + removeAllParentheses(removeSpecialSubstrings(move)) + '.gif';
    } else {
        console.error("No matching image found in the database.");
        return null;
    }
};


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

