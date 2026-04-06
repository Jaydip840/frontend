import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Profile = () => {
    const { url, token } = useContext(StoreContext);
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);
    
    // OTP Modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [step, setStep] = useState(1); // 1: request, 2: verify + change
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Prevent instant redirect on initial render if token is still loading from local storage
        if (!token && !localStorage.getItem("token")) {
            navigate('/');
            return;
        }
        if (token) {
            fetchUserData();
            fetchUserOrders();
        }
    }, [token, navigate]);

    const fetchUserData = async () => {
        try {
            const response = await axios.post(url + "/api/user/profile", {}, { headers: { token } });
            if (response.data.success) {
                setUserData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching user data");
        }
        setLoading(false);
    };

    const fetchUserOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                // Filter specifically for "Delivered" orders
                const deliveredOrders = response.data.data.filter(order => order.status === "Delivered");
                setOrders(deliveredOrders.reverse()); // latest first
            }
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm("Are you sure you want to permanently clear your delivered order history?")) {
            return;
        }
        setIsClearing(true);
        try {
            const response = await axios.post(url + "/api/order/clearhistory", {}, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setOrders([]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error clearing history");
        }
        setIsClearing(false);
    };

    const handleSendOtp = async () => {
        if (!userData || !userData.email) return;
        setIsSendingOtp(true);
        try {
            const response = await axios.post(url + "/api/user/send-otp", { email: userData.email });
            if (response.data.success) {
                toast.success(response.data.message);
                setStep(2);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error sending OTP");
        }
        setIsSendingOtp(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(url + "/api/user/reset-password", {
                email: userData.email,
                otp,
                newPassword
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setShowPasswordModal(false);
                setStep(1);
                setOtp('');
                setNewPassword('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error resetting password");
        }
    };

    if (loading) {
        return <div className="profile-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="profile-dashboard">
            <div className="profile-layout">
                {/* --- Sidebar: User Details --- */}
                <div className="profile-sidebar">
                    <div className="sidebar-card">
                        <div className="avatar-large">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : ""}
                        </div>
                        <h2 className="user-name">{userData?.name}</h2>
                        <div className="user-email-badge">
                            <i className="fa-solid fa-envelope"></i>
                            <span>{userData?.email}</span>
                        </div>
                        
                        <div className="sidebar-divider"></div>
                        
                        <div className="sidebar-stats">
                            <div className="stat-box">
                                <h4>{orders.length}</h4>
                                <p>Delivered Orders</p>
                            </div>
                            <div className="stat-box">
                                <h4>₹{orders.reduce((acc, curr) => acc + curr.amount, 0)}</h4>
                                <p>Total Spent</p>
                            </div>
                        </div>

                        <button className="security-btn" onClick={() => setShowPasswordModal(true)}>
                            <i className="fa-solid fa-lock"></i> Change Password
                        </button>
                    </div>
                </div>

                {/* --- Main Content: Order History --- */}
                <div className="profile-main">
                    <div className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3>Order History</h3>
                            <span className="subtitle">Displaying your verified delivered orders.</span>
                        </div>
                        {orders.length > 0 && (
                            <button 
                                onClick={handleClearHistory} 
                                disabled={isClearing}
                                style={{ background: 'transparent', color: '#ff4757', border: '1.5px solid #ff4757', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: '0.3s', fontSize: '0.9rem' }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#ff4757'; e.currentTarget.style.color = '#fff'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff4757'; }}
                            >
                                <i className="fa-solid fa-trash"></i> {isClearing ? "Clearing..." : "Clear History"}
                            </button>
                        )}
                    </div>

                    <div className="history-list">
                        {orders.length === 0 ? (
                            <div className="empty-state">
                                <img src={assets.parcel_icon} alt="Empty" className="grayscale" />
                                <p>You have no delivered orders yet.</p>
                                <button onClick={() => navigate('/')}>Explore Menu</button>
                            </div>
                        ) : (
                            orders.map((order, index) => (
                                <div key={index} className="history-card">
                                    <div className="history-header">
                                        <div className="history-id">
                                            <i className="fa-solid fa-receipt"></i> 
                                            Order #{order._id ? order._id.slice(-6).toUpperCase() : `000${index}`}
                                        </div>
                                        <div className="history-status delivered">
                                            <span className="dot"></span> {order.status}
                                        </div>
                                    </div>
                                    
                                    <div className="history-body">
                                        <p className="history-items">
                                            {order.items.map((item, idx) => {
                                                return idx === order.items.length - 1 
                                                ? item.name + " x " + item.quantity 
                                                : item.name + " x " + item.quantity + ", ";
                                            })}
                                        </p>
                                        <div className="history-price">
                                            ₹{order.amount}.00
                                        </div>
                                    </div>
                                    <div className="history-footer">
                                        <span>{order.items.length} Items</span>
                                        <button className="reorder-btn" onClick={() => navigate('/')}>Order Again</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showPasswordModal && (
                <div className="otp-modal-overlay">
                    <div className="otp-modal">
                        <span className="close-btn" onClick={() => { setShowPasswordModal(false); setStep(1); }}>&times;</span>
                        <h2>Security Settings</h2>
                        
                        {step === 1 ? (
                            <div className="otp-step">
                                <p>We will send a secure One-Time Password to your registered email address: <br/><strong>{userData?.email}</strong></p>
                                <button className="send-otp-btn" onClick={handleSendOtp} disabled={isSendingOtp}>
                                    {isSendingOtp ? "Generating Secure OTP..." : "Send Reset Link"}
                                </button>
                            </div>
                        ) : (
                            <form className="otp-step" onSubmit={handleResetPassword}>
                                <p>Please enter the 6-digit secure code sent to your email along with your new password.</p>
                                <input 
                                    type="text" 
                                    placeholder="6-Digit OTP" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)} 
                                    required 
                                    maxLength={6}
                                    className="otp-input"
                                />
                                <input 
                                    type="password" 
                                    placeholder="New Password (min 8 characters)" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required 
                                    minLength={8}
                                    className="otp-input"
                                />
                                <button type="submit" className="verify-otp-btn">
                                    Update Password
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
