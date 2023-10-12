import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Navigation />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
