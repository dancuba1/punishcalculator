import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebase-config";
import { invertId, transformId } from "../utils/stringManip.js";

export const getCharacterData = async (character) => {
    const characterWithMoves = [];
    try{
        const movesCollectionRef = collection(db, `characters/${character}/moves`);

        const movesSnapshot = await getDocs(movesCollectionRef);
        console.log("Number of moves found:", movesSnapshot.size);

        
        const movesData = movesSnapshot.docs.map((moveDoc) => ({
                ...moveDoc.data(),
                id: moveDoc.id,
        }));

        console.log(movesData);
        characterWithMoves.push({
            moves: movesData,
            id: character,
        });
        console.log("Character with moves " + characterWithMoves[0].moves);
    }catch(err){
        console.log(err);
    }
    return(characterWithMoves);
}


export const getCharacterMove = async (characterName, move) => {
  try {
    const charId = invertId(characterName);
    // Get a reference to the specific move document
    const moveDocRef = doc(db, `characters/${charId}/moves/${move}`);
    console.log(moveDocRef);
    // Retrieve the document
    const moveDocSnapshot = await getDoc(moveDocRef);

    // Check if the document exists
    if (moveDocSnapshot.exists()) {
      // If it exists, return the document data
      const moveData = moveDocSnapshot.data();
      moveData.id = move;
      return moveData;
    } else {
      // Handle the case where the document does not exist
      console.log("No such move");
      return null;
    }
  } catch (err) {
    // Handle errors
    console.error("Error retrieving move data:", err);
    return null;
  }
};

export const getAllCharacterNames = async () => {
  const charactersCollectionRef = await collection(db, "characters");
  
  try {
    // Fetch the main collection
    const data = await getDocs(charactersCollectionRef);
    
    // Extract and return only the character names (or IDs)
    const characterNames = data.docs.map(doc => doc.id); // Assuming doc.id is the character name or ID

    console.log(characterNames); // Log character names for debugging
    return characterNames; // Return only the names or IDs
  } catch (err) {
    console.error("Error fetching character names:", err);
    return []; // Return an empty array in case of an error
  }
};


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



export const getCharacterNames = async () => {
  const charactersCollectionRef = collection(db, "characters");
  
  try {
      // Fetch the main collection but only retrieve document IDs and required fields (e.g., name)
      const data = await getDocs(charactersCollectionRef);
      
      // Initialize an empty array to store character names
      const characterNames = [];
      
      // Loop through each document in the main collection
      for (const doc of data.docs) {
          const characterData = doc.data();
          
          // Only retrieve the necessary field, for example, `name`
          characterNames.push({
              id: doc.id,
              name: characterData.name, // Ensure you replace `name` with the actual field you need
          });
      }

      // Log the names or use them as needed
      console.log(characterNames);
      return characterNames;
  } catch (err) {
      console.log(err);
  }
}



