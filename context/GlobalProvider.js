import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "lib/firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = async (uid) => {
    if (!uid) {
      setIsLoading(false)
      setUser(null)
      setIsLogged(false)
      return;
    }
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
        setIsLogged(true)
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
      setUser(null);
      setIsLogged(false)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      if (typeof unSub === "function") {
        unSub();
      }
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;