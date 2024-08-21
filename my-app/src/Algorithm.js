import { getDocs, collection } from "firebase/firestore";
import { db } from "./Config/firebase-config";



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
 
  
