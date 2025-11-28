import { useEffect } from "react";
import { getCharacterData } from "../repo/FirebaseRepository";
import { invertId } from "../utils/stringManip";
import exclusions from "../utils/invalidAttackingMoves.json";


export function useCharacterMoves(dropdownACharID, setMoveIds) {
  useEffect(() => {
    if (!dropdownACharID) return; // Prevent running if dropdownACharID is null or undefined

    const handleCharacterMoves = async () => {
      try {
        console.log("Fetching Character Moves...");
        const characterWithMoves = await getCharacterData(invertId(dropdownACharID));
        console.log(characterWithMoves);

        // Update move IDs in state
        setMoveIds(
          filterMoves(characterWithMoves[0].moves)
        );
              } catch (error) {
        console.error("Error fetching character moves:", error);
      }
    };

    handleCharacterMoves();
  }, [dropdownACharID, setMoveIds]); // Dependency array
}


export function filterMoves(moves) {
  if (!Array.isArray(moves)) return [];

  // list your exclusions here
  console.log("Exclusions : " + exclusions );
  
  const loweredExclusions = exclusions.map(e => e.toLowerCase().trim());

  return moves
    .filter(move => {
      const id = move.id.toLowerCase();
      return !loweredExclusions.some(ex => id.includes(ex));
    })
    .map(move => move.id);
}
