import { useState, useEffect } from "react";
import { getCharacterMove } from "../repo/FirebaseRepository"; // Adjust the path

export function useSelectedMove(selectedMoveId, selectedChar, moveIds, resetMove, setResetMove) {
  const [moveSelect, setMoveSelect] = useState(null);

  useEffect(() => {
    const fetchMove = async () => {
      if (selectedMoveId !== "Select Move" && moveIds.length > 0) {
        try {
          const move = await getCharacterMove(selectedChar, selectedMoveId);
          setResetMove(true); // Update resetMove in the parent component
          setMoveSelect(move);
          console.log(move);
        } catch (err) {
          console.error("Error fetching move:", err);
        }
      }
    };

    fetchMove();
  }, [selectedMoveId, selectedChar, moveIds, setResetMove]); // Ensure setResetMove is in the dependency array

  return { moveSelect, resetMove }; // No need to return setResetMove, as it's passed from the parent
}
