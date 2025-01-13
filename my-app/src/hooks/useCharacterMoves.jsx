import { useEffect } from "react";
import { getCharacterData } from "../repo/FirebaseRepository";
import { invertId } from "../utils/stringManip";

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
          characterWithMoves[0].moves
            .filter((move) => !move.id.toLowerCase().includes("grab"))
            .map((move) => move.id)
        );
              } catch (error) {
        console.error("Error fetching character moves:", error);
      }
    };

    handleCharacterMoves();
  }, [dropdownACharID, setMoveIds]); // Dependency array
}

