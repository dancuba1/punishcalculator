import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../Config/firebase-config";

const getGifRef = (char, move) => {
    console.log("MOVE " +removeAllParentheses(removeSpecialSubstrings(move)));
    return[lowercaseFirstLetter(char) + '/' + capitaliseFirstLetter(char) + ' ' + removeAllParentheses(removeSpecialSubstrings(move))  + '.gif'];
}

export const fetchGifs = async (char, moves) => {
    console.log("in Fetch gifs");

    var urls = []
    var attemptedUrls = []
    const moveRefMap = {};
    if(Array.isArray(moves)){
        console.log("Found array");
        for (const move of moves){
            const gifRef = getGifRef(char, move.id);
            console.log(`Generated gifRef for ${move.id}: `, gifRef);  // Debugging log

            moveRefMap[move.id] = gifRef;
        }
        try{
            attemptedUrls =  await Promise.allSettled(
                Object.values(moveRefMap).map(async (gifPath) => {
                    console.log("GIFREF " + gifPath)
                    const gifUrl = ref(storage, gifPath[0]);
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
        moveRefMap[moves.id] = getGifRef(char, moves);
        const gifRef = ref(storage, moveRefMap[moves.id]);
        urls =  await getDownloadURL(gifRef);
    }else{
        console.log(typeof(moves));

    }
    return urls;
}




function capitaliseFirstLetter(string) {
    if (string.length === 0) return string; // Handle empty string case
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function lowercaseFirstLetter(str) {
    if (!str) return str; // Check if the string is empty or undefined
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function removeAllParentheses(str) {
    // Use a regular expression to remove parentheses but keep their contents
    return str.replace(/\(([^()]+)\)/g, '$1');
  }

function removeSpecialSubstrings(str) {
    // Define an array of substrings to remove
    const substringsToRemove = ["Neutral B ", "Side B ", "Up B ", "Down B "];
  
    // Use a loop to remove each substring
    substringsToRemove.forEach(substring => {
      // Replace all occurrences of the substring with an empty string
      str = str.replaceAll(substring, '');
    });

    if (str.toLowerCase().includes("end")) {
        str = str.replaceAll(/end/gi, 'Finisher'); // 'gi' makes it case-insensitive
      }
      if (str.toLowerCase().includes("fire bird")) {
        str = str.replaceAll(/fire bird/gi, 'Firebird'); // 'gi' makes it case-insensitive
      }
  
    return str;
}