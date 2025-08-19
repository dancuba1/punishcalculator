// context/AppContext.js
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalValue, setGlobalValue] = useState("0");

  return (
    <AppContext.Provider value={{ globalValue, setGlobalValue }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
