import { createContext, useState } from "react";

const UserContext = createContext();

function UserProvider({children}) {
  const [user, setUser] = useState("");
  const [parejas, setParejas] = useState([]);

  function reset(){
    setUser("");
    setParejas([]);
  }
  
  const value = {user, setUser, parejas, setParejas, reset}
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext };