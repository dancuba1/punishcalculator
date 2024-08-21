import { getDocs, collection } from "firebase/firestore";
import { db } from "../Config/firebase-config";

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
            id: 
            character,
        });
        console.log(characterWithMoves)
    }catch(err){
        console.log(err);
    }
        return(characterWithMoves);
}

export const getAllCharacterNames = async () => {
  const charactersCollectionRef = collection(db, "characters");
  
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



const transformId = (id) => {
    return id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    };