import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Header.CSS'

const Header = () => {

  const navigate = useNavigate();

  const handleViewMenu = () => {
    if (window.innerWidth <= 768) {
      navigate('/gallery');
    } else {
      console.log("Desktop view — not navigating to gallery");
    }
  };
  return (
    <div className='header'>
      <div className="header-contents" data-aos="zoom-in">
        <h2>Order your favourite food here </h2>
        <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
        <button onClick={handleViewMenu}>View Menu</button>
      </div>

    </div>
  )
}

export default Header
