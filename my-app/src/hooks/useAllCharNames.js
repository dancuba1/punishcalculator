import { useEffect } from "react";
import { getAllCharacterNames } from "../repo/FirebaseRepository";
import { transformIds } from "../utils/stringManip";

export function useAllCharNames(setCharacterSelect) {
    useEffect(() => {
      const displayCharacterInfo = async () => {
        try {
          const charNames = await getAllCharacterNames();
          const transformedNames = transformIds(charNames);
          setCharacterSelect(transformedNames);
        } catch (err) {
          console.error("Error fetching character names:", err);
        }
      };
  
      displayCharacterInfo();
    }, [setCharacterSelect]);
}

/*
useEffect(() => {
    const displayCharacterInfo = async () => {
      try {
        //const characters = await getAllCharactersData();
        //setCharacterList(characters);
        const charNames = await getAllCharacterNames()
        setCharacterSelect(transformIds(charNames));
        console.log(characterSelect);
      } catch (err) {
        console.log(err);
      }
    };
    displayCharacterInfo();
  }, []);
  */