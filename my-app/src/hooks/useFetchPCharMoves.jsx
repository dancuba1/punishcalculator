import { useEffect } from "react";
import { getCharacterData } from "../repo/FirebaseRepository";
import { invertId } from "../utils/stringManip";

const getPCharMoves = async (charName) => {
    const character = await getCharacterData(invertId(charName));
    console.log("in getPCharMoves", character);
    return character ? character[0].moves : [];
};

export function useFetchPCharMoves(dropdownPCharID, setPCharMoves) {
    useEffect(() => {
        const fetchPCharMoves = async () => {
            if (dropdownPCharID !== "Select Punishing Character") {
                console.log("in dropdownPCharID " + dropdownPCharID);
                const moves = await getPCharMoves(dropdownPCharID);
                setPCharMoves(moves);
                console.log("punishing character moves:", moves);
            }
        };
        fetchPCharMoves();
    }, [dropdownPCharID, setPCharMoves]);
}
