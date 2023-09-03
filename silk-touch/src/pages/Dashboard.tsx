import React from "react";
import CartIcon from "./CartIcon";

const Dashboard = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInName,
  setLoggedInName,
  loggedInUserId,
  numberOfCartItems,
}) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <>
      <p>/// This is hidden dashboard ///</p>
      <div>
        ICON and Number of items in a cart:{" "}
        <CartIcon
          numberOfCartItems={numberOfCartItems}
          loggedInUserId={loggedInUserId}
        />
      </div>
      <p>Hello, {loggedInName}</p>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default Dashboard;
