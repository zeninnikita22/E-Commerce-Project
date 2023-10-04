import Navigation from "./Navigation";

const Layout = ({ children }) => {
  return (
    <div>
      <Navigation
      // openDashboard={openDashboard}
      // setOpenDashboard={setOpenDashboard}
      />
      <main>{children}</main>
      <footer>Footer Content</footer>
    </div>
  );
};

export default Layout;
