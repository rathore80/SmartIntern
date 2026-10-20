import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">

      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>© 2026 SmartIntern. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Layout;