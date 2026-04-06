import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail === "foodizo17@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken("");
    navigate("/");
    setIsAdmin(false);
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      <div className={`navbar-hamburger ${showMobileMenu ? 'active' : ''}`} onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-menu ${showMobileMenu ? 'mobile-active' : ''}`}>
        <Link to='/' onClick={() => { setMenu("home"); setShowMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={menu === "home" ? "active" : ""} style={{ "--i": 1 }}>Home</Link>
        <a href='#explore-menu' onClick={() => { setMenu("menu"); setShowMobileMenu(false); }} className={menu === "menu" ? "active" : ""} style={{ "--i": 2 }}> Menu</a>
        <Link to='/restaurants' onClick={() => { setMenu("restaurants"); setShowMobileMenu(false); }} className={menu === "restaurants" ? "active" : ""} style={{ "--i": 3 }}> Find Restaurant </Link>
        <Link to='/aboutus' onClick={() => { setMenu("aboutus"); setShowMobileMenu(false); }} className={menu === "about-us" ? "active" : ""} style={{ "--i": 4 }}>About Us</Link>
        <Link to='/policy' onClick={() => { setMenu("policy"); setShowMobileMenu(false); }} className={`mobile-only ${menu === "policy" ? "active" : ""}`} style={{ "--i": 5 }}>Privacy Policy</Link>
      </ul>

      <div className='navbar-right'>
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='nav-profile-dropdown'>
              {isAdmin && (
                <>
                  {/* <li onClick={() => { window.location.href = "https://foodizo-on-admin.netlify.app"; }}> */}
                  <li onClick={() => { window.location.href = "http://localhost:5174"; }}>
                    <img src={assets.settings_icon} alt="" />
                    <p>Admin</p>
                  </li>

                  <hr />
                </>
              )}
              <li onClick={() => navigate('/profile')}><img src={assets.profile_icon} alt="" /><p>profile</p></li>
              <hr />
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
