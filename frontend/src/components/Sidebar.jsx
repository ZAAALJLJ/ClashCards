import React from "react";
import { FaBook } from "react-icons/fa";
import { GiApothecary } from "react-icons/gi";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoSettingsSharp } from "react-icons/io5";
import "../css/Sidebar.css";

function Sidebar() {
  return <nav className="sidebar">
    <div className="sidebar-brand">
      <Link to="/">
        <GiApothecary className="logo-icon"/>
      </Link>
    </div>
    <div className="sidebar-links">
      <Link to='/' className="nav-link">
        <FaBook className="brand-icon"/>
        <div className="icon-title">
          Library
        </div>
      </Link>
      <Link to='/profile' className="nav-link">
        <CgProfile className="brand-icon"/>
        <div className="icon-title">
            Profile
        </div>
      </Link>
      <Link to='/' className="nav-link">
        <IoSettingsSharp className="brand-icon"/>
        <div className="icon-title">
            Settings
        </div>
      </Link>
    </div>

  </nav>
}

export default Sidebar;