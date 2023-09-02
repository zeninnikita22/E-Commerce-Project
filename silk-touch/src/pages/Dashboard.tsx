import React from "react";

const Dashboard = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInName,
  setLoggedInName,
}) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <>
      <p>/// This is hidden dashboard ///</p>
      <p>Hello, {loggedInName}</p>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default Dashboard;
