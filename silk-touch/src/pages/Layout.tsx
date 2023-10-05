import Navigation from "./Navigation";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Navigation
      // openDashboard={openDashboard}
      // setOpenDashboard={setOpenDashboard}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
