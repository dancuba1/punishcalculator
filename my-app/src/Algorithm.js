import { getDocs, collection } from "firebase/firestore";
import { db } from "./Config/firebase-config";


export const getCharacterData = async (character) => {
    const characterWithMoves = [];
    try{
    const movesCollectionRef = collection(db, `characters/${character}/moves`);

    const movesSnapshot = await getDocs(movesCollectionRef);
    const movesData = movesSnapshot.docs.map((moveDoc) => ({
            ...moveDoc.data(),
            id: moveDoc.id,
    }));
            
    characterWithMoves.push({
        moves: movesData,
        id: character,
    });
    console.log(characterWithMoves)
    }catch(err){
    console.log(err);
    }
    return(characterWithMoves);

}

export const getAllCharactersData = async () => {
    const charactersCollectionRef = collection(db, "characters");
    try {
        // Fetch the main collection
        const data = await getDocs(charactersCollectionRef);
        
        // Initialize an empty array to store characters with their moves
        const charactersWithMoves = [];
        
        // Loop through each document in the main collection
        for (const doc of data.docs) {
          const characterData = doc.data();
          const movesCollectionRef = collection(db, `characters/${doc.id}/moves`);
          
          // Fetch the moves sub-collection
          const movesSnapshot = await getDocs(movesCollectionRef);
          const movesData = movesSnapshot.docs.map((moveDoc) => ({
            ...moveDoc.data(),
            id: moveDoc.id,
          }));
          
          // Add moves data to the character data
          charactersWithMoves.push({
            ...characterData,
            id: doc.id,
            name: transformId(doc.id),
            moves: movesData,
          });
        }

        // Set the state with the combined data
        console.log(charactersWithMoves);
        return  (charactersWithMoves);
      } catch (err) {
        console.log(err);
      }
}

const transformId = (id) => {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  };



export function processStartUpValue(value) {
    // Ensure the value is a string
    if (typeof value === 'string') {
        // Check if the value contains a '/'
        if (value.includes('/')) {
            // Split the string by '/' and trim any extra spaces
            const parts = value.split('/').map(part => part.trim());
            // Convert parts to integers and filter out non-numeric values
            const numbers = parts.map(part => parseInt(part, 10)).filter(num => !isNaN(num));
            // Return the lowest number if there are any valid numbers
            return numbers.length > 0 ? Math.min(...numbers) : null;
        } else {
            // Convert the string to an integer
            const number = parseInt(value, 10);
            // Return the integer if it is valid
            return !isNaN(number) ? number : null;
        }
    }
}


export function getImage(){
  return;
}

export function setStartUpCalc(move, initStartUp, jumpSquat){
  const shieldDropLag = 11;
  const grabLag = 4;
  try{
    if(move.isUpB || move.isUpSmash){
      return initStartUp;
    }else if(move.isAerial){
      return initStartUp + jumpSquat;
    }else if( (move.id).includes("Grab")){
      return initStartUp + grabLag;
    }else{
      return initStartUp + shieldDropLag;
    }
  }catch(err){
    console.log(err)
    return;
  }
}
 
  
