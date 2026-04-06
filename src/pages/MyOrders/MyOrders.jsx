import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {

    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    //function
    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        // Filter out delivered orders from the list
        const activeOrders = response.data.data.filter(order => order.status !== "Delivered");
        setData(activeOrders.reverse());
    }
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => {
                    const isCancelled = order.status === "Cancelled";
                    return (
                        <div key={index} className={`order-card ${isCancelled ? 'cancelled-card' : ''}`}>
                            <div className="order-card-header">
                                <div className="order-id">
                                    <img src={assets.parcel_icon} alt="parcel" style={{opacity: isCancelled ? 0.5 : 1}} />
                                    <span style={{textDecoration: isCancelled ? 'line-through' : 'none'}}>
                                        Order #{order._id ? order._id.slice(-6).toUpperCase() : `000${index}`}
                                    </span>
                                </div>
                                <div className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>
                                    <span className="dot"></span> {order.status}
                                </div>
                            </div>
                            
                            <div className="order-card-body">
                                <div className="order-items">
                                    <p style={{textDecoration: isCancelled ? 'line-through' : 'none', color: isCancelled ? '#999' : 'inherit'}}>
                                        {order.items.map((item, idx) => {
                                            if (idx === order.items.length - 1) {
                                                return item.name + " x " + item.quantity;
                                            } else {
                                                return item.name + " x " + item.quantity + ", ";
                                            }
                                        })}
                                    </p>
                                    <span className="item-count">{order.items.length} items</span>
                                </div>
                                <div className="order-price">
                                    <h3 style={{textDecoration: isCancelled ? 'line-through' : 'none', color: isCancelled ? '#999' : 'inherit'}}>
                                        ₹{order.amount}.00
                                    </h3>
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <button className='track-btn' onClick={fetchOrders} disabled={isCancelled} style={{opacity: isCancelled ? 0.5 : 1}}>
                                    <i className="fa-solid fa-rotate-right"></i> {isCancelled ? 'Order Cancelled' : 'Track Order'}
                                </button>
                            </div>
                        </div>
                    )
                })}
                {data.length === 0 && (
                    <div style={{textAlign: 'center', padding: '50px 0', color: '#666'}}>
                        <p>No active orders found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders
