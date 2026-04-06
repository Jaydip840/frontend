import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime aperiam beatae pariatur eaque ad tenetur recusandae fuga, alias voluptas ipsum laudantium nihil aliquam repudiandae explicabo veritatis quibusdam repellendus quo libero!</p>
            <div className="footer-social-icons">
                <a href="https://www.facebook.com/"><img src={assets.facebook_icon}  alt="Facebook" /></a>
                <a href="https://x.com/"><img src={assets.twitter_icon}  alt="Instagram" /></a>
                <a href="https://in.linkedin.com/"><img src={assets.linkedin_icon}  alt="Twitter" /></a>
            </div>
        </div>
        <div className="footer-content-center">
            <h2>EXPLORE</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Aboutus">About Us</Link></li>
                <li><Link to="/Restaurants">Restaurants</Link></li>
                <li><Link to="/policy">Privacy Policy</Link></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-962-4983-883</li>
                <li>+91-000-0000-000</li>
                <li>foodmasters18@gmail.com</li>
                <li><b>Location:</b><br />Gujarat,Surat India</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">© {new Date().getFullYear()} Food Masters. All rights reserved.</p>
    </div>
  )
}

export default Footer
