import React, { createContext, useContext, useState, useEffect } from "react";
import { trpc } from "../pages/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const migrateCartItemsToUser = trpc.migrateCart.useMutation();
  const { isSignedIn, user } = useUser();
  const [userId, setUserId] = useState("");
  const [wasGuest, setWasGuest] = useState(false);

  useEffect(() => {
    let currentUserId = "";

    if (isSignedIn) {
      currentUserId = user.id;
      if (wasGuest) {
        // Retrieve the guest user ID from local storage
        const guestUserId = localStorage.getItem("guestUserId");
        if (guestUserId) {
          migrateCartItemsToUser.mutate(
            {
              guestUserId: guestUserId,
              authorizedUserId: currentUserId,
            },
            {
              onSuccess: (data) => {
                // Invalidate specific queries after the mutation is successful
                queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
                console.log(
                  "Successfully migrated items from guest to user cart",
                  data
                );
              },
            }
          );
          setWasGuest(false); // Reset the flag after transfer
        }
      }
    } else {
      let guestUserId = localStorage.getItem("guestUserId");
      if (!guestUserId) {
        guestUserId = uuidv4();
        localStorage.setItem("guestUserId", guestUserId);
      }
      currentUserId = guestUserId;
      setWasGuest(true);
    }

    setUserId(currentUserId);
  }, [isSignedIn, user, migrateCartItemsToUser, queryClient]);

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
