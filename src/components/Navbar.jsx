import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Gamepad2 className="logo-icon" size={28} />
          <span>PlayPocket</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <Trophy size={18} className="nav-icon" />
            <span>Games</span>
          </Link>
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
