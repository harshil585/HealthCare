import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <Stethoscope size={28} className="logo-icon" />
          <span>HealthCare+</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
