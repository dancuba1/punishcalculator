import React from "react";

export function MoveInfo({ currentMove, isPMove }){
    if(isPMove){
        try{
            const startUp = currentMove.startup;
            const baseDamage = currentMove.baseDamage;
            return(
                <div className="moveinfo">
                    <h3 className="startupinfo">Startup: {startUp} Frames </h3>
                    <h4 className="activeinfo">Base Damage: {baseDamage}</h4>
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
                <h3 className="advantageinfo">On Shield: {advantage}</h3>
                <h4 className="endlaginfo">End Lag: {endlag} Frames</h4>
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