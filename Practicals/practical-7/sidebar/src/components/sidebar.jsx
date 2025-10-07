import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [openCharusat, setOpenCharusat] = useState(false);
  const [openDepstar, setOpenDepstar] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <>
      <div className={`sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}>
        <button className="hamburger-btn" onClick={toggleSidebar}>
          &#9776;
        </button>

        {sidebarExpanded && (
          <>
            <ul className="menu">
              <li><Link to="/">Home</Link></li>

              <li>
                <div className="menu-item" onClick={() => setOpenCharusat(!openCharusat)}>
                  Charusat {openCharusat ? "▲" : "▼"}
                </div>
                {openCharusat && (
                  <ul className="submenu">
                    <li><Link to="/charusat">Charusat Page</Link></li>

                    <div className="menu-item" onClick={() => setOpenDepstar(!openDepstar)}>
                      Depstar {openDepstar ? "▲" : "▼"}
                    </div>
                    {openDepstar && (
                      <ul className="submenu">
                        <li><Link to="/charusat/depstar">Depstar Page</Link></li>
                        <li><Link to="/charusat/depstar/cse">CSE</Link></li>
                        <li><Link to="/charusat/depstar/ce">CE</Link></li>
                        <li><Link to="/charusat/depstar/it">IT</Link></li>
                      </ul>
                    )}
                  </ul>
                )}
              </li>

              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default Sidebar;
