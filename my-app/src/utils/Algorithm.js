



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
      move.startUp = initStartUp;
      return move;
    }else if(move.isAerial){
      move.startUp = initStartUp + jumpSquat;
      return move
    }else if( (move.id).includes("Grab")){
      move.startUp = initStartUp + grabLag;
      return move;
    }else{
      move.startUp = initStartUp + shieldDropLag;
      return move;
    }
  }catch(err){
    console.log(err)
    return;
  }
}

export const getStartUpMap = async (pCharMoves, selectedPChar) =>{
  const startUpMap = new Map();
  var jumpSquat;
  if(selectedPChar === "Kazuya"){
    jumpSquat = 7;
  }else{
    jumpSquat = 3;
  }
  for(const move of pCharMoves){
    if((move.id).includes(""))
    //calc all start ups
    console.log(move);
    const startUp = await processStartUpValue(move.startup);
    if(startUp !== null) {
      console.log("start up not null" + startUp);
      startUpMap.set(move.id, setStartUpCalc(move, startUp, jumpSquat));
      console.log(" startUPmap object " + startUpMap.get(move.id));
    }else{
      console.log("start up null" + startUp);
    }
  }
  return startUpMap;
}
 
  
