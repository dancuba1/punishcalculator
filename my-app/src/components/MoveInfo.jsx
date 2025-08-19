import React from "react";

export function MoveInfo({ currentMove, isPMove }){
    if(isPMove){
        try{
       
            console.log("Startup: " + currentMove.startup);
            return(
                <div className="moveinfo">
                    <h2 className="movename">{currentMove.id}</h2> 
                    <h3 className="startupinfo">Startup: {currentMove.startup}F</h3>
                    <h4 className="activeinfo">Base Damage: {currentMove.baseDamage}</h4>
                </div>
            
            );
        }catch(err){
            return(
                <div className="moveinfo">
                    <h3 className="startupinfo">{currentMove} </h3>
                </div>
            
            );
        }
        
    }else{
        try{    
        const advantage = currentMove.advantage;
        const endlag = currentMove.endLag;
        return(
            <div className="moveinfo">
                <h2 className="movename">{currentMove.id}</h2> 
                <h3 className="advantageinfo">On Shield: {advantage}</h3>
                <h4 className="endlaginfo">End Lag: {endlag}F</h4>
            </div>
        )
        }catch(err){
            return(
                <div className="moveinfo">
                    <h3 className="startupinfo">{currentMove} </h3>
                </div>
            
            );
        }
    }
    
}

export default MoveInfo;