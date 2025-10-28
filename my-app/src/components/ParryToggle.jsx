import React, { useState } from "react";

const ParryToggle = ({ isParry, setIsParry,  }) => {

const handleToggle = () => {
    setIsParry(!isParry);

};

return ( <div className="toggle-container">
<button
onClick={handleToggle}
className={`toggle-button ${isParry ? "parry" : "shield"}`}
>
{isParry ? "Parry" : "Shield"} </button> </div>
);
};

export default ParryToggle;
