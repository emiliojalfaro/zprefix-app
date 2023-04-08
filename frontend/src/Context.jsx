import React, { createContext, useState } from "react";

const Context = createContext({});

export const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Context.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
