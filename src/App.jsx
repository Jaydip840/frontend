import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import ScrollToTop from './components/ScrollToTop'
import AboutUs from './pages/AboutUs/AboutUs'
import Policy from './pages/Policy/Policy.jsx'
import Restaurants from './pages/Restaurants/Restaurants'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from './components/Loader/Loader.jsx'
import Verify from './pages/Verify/Verify.jsx'
import MyOrders from './pages/MyOrders/MyOrders.jsx'
import FoodDetails from './pages/FoodDetails/FoodDetails.jsx'
import Profile from './pages/Profile/Profile.jsx'
import AOS from 'aos'
import 'aos/dist/aos.css'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out'
    })
    
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <Loader />
      </div>
    )
  }

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <ToastContainer position="top-right" autoClose={3000} />
        <ScrollToTop />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/Restaurants" element={<Restaurants />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/food/:id" element={<FoodDetails />} />

        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App
