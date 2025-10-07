import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="brand"><Link to="/list">Pokédex Explorer</Link></div>
      <div className="links">
        <NavLink to="/list" className={({isActive})=> isActive?'active':''}>List</NavLink>
        <NavLink to="/gallery" className={({isActive})=> isActive?'active':''}>Gallery</NavLink>
      </div>
    </nav>
  );
}
