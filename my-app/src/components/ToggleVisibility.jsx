import React, { useState } from 'react'

const ToggleVisibility = ({ children }) => {
    const [show, setShow] = useState(true)

    return (
        <React.Fragment>
            {show && children}
            <button onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
            </button>
        </React.Fragment>
    )
}

export default ToggleVisibility