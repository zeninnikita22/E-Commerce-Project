import React from "react";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <p>/// This is hidden dashboard ///</p>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default Dashboard;
