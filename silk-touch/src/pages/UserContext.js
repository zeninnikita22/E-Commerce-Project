import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let currentUserId = "";

    if (isSignedIn) {
      currentUserId = user.id;
    } else {
      let guestUserId = localStorage.getItem("guestUserId");
      if (!guestUserId) {
        guestUserId = uuidv4();
        localStorage.setItem("guestUserId", guestUserId);
      }
      currentUserId = guestUserId;
    }

    setUserId(currentUserId);
  }, [isSignedIn, user]);

  return (
    <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
  );
};

export const useUserId = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserId must be used within a UserProvider");
  }
  return context.userId;
};
