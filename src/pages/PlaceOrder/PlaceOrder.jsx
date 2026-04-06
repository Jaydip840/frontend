import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url, deliveryFee, setCartItems } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to Cash on Delivery
  const [upiId, setUpiId] = useState(""); // Dummy UPI state
  const [loading, setLoading] = useState(false)

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const navigate = useNavigate();

  const placeOrder = async (event) => {
    event.preventDefault();

    setLoading(true)

    let orderItems = [];
    food_list.forEach((item) => {
      // Find all variations of this item in the cart
      Object.keys(cartItems).forEach(cartKey => {
        if (cartKey.startsWith(item._id + "_") && cartItems[cartKey] > 0) {
          const [id, size, extrasStr] = cartKey.split("_");
          const extras = extrasStr ? extrasStr.split(",") : [];
          
          let itemInfo = { ...item };
          itemInfo["quantity"] = cartItems[cartKey];
          itemInfo["size"] = size;
          itemInfo["extras"] = extras;
          orderItems.push(itemInfo);
        }
      });
    });
    
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryFee,
      deliveryFee,
      paymentMethod
    }
    
    // UPI Dummy Verification step
    if (paymentMethod === "UPI") {
      if (!upiId) {
        toast.error("Please enter your UPI ID.");
        setLoading(false);
        return;
      }
      // Simulate real-world scanning/payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      
      if (response.data.success) {
        if (paymentMethod === "Stripe") {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          // COD or UPI success flow
          toast.success("Order Placed Successfully!");
          setCartItems({}); // Clean up cart locally since backend did it too
          navigate('/myorders');
        }
      } else {
        toast.error("Error placing order");
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing request");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])


  return (
    <form onSubmit={placeOrder} className="place-order place-order-animate">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details total-amount">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryFee}</b>
            </div>
          </div>

          <div className="payment-options">
            <h2>Payment Method</h2>
            
            <div 
              className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
            >
              <div 
                className="payment-option-header" 
                onClick={() => setPaymentMethod('COD')}
                style={{display: 'flex', alignItems: 'center', gap: '15px', width: '100%'}}
              >
                <div className="radio-circle"></div>
                <div className="payment-info">
                  <h4>Cash on Delivery</h4>
                  <p>Pay safely when your food arrives.</p>
                </div>
              </div>
            </div>

            <div 
              className={`payment-option ${paymentMethod === 'Stripe' ? 'selected' : ''}`}
            >
              <div 
                className="payment-option-header" 
                onClick={() => setPaymentMethod('Stripe')}
                style={{display: 'flex', alignItems: 'center', gap: '15px', width: '100%'}}
              >
                <div className="radio-circle"></div>
                <div className="payment-info">
                  <h4>Credit / Debit Card</h4>
                  <p>Pay securely via Stripe.</p>
                </div>
              </div>
            </div>

            <div 
              className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}
            >
              <div 
                className="payment-option-header" 
                onClick={() => setPaymentMethod('UPI')}
                style={{display: 'flex', alignItems: 'center', gap: '15px'}}
              >
                <div className="radio-circle"></div>
                <div className="payment-info">
                  <h4>UPI / QR Scan</h4>
                  <p>Pay instantly using your UPI ID.</p>
                </div>
              </div>
              
              {paymentMethod === 'UPI' && (
                <div className="upi-input-container">
                  <input 
                    type="text" 
                    placeholder="Enter UPI ID (e.g. name@okbank)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <button type='submit' disabled={loading} className="checkout-btn">
            {loading ? (
              <div className="load-row">
                <span></span><span></span><span></span><span></span>
              </div>
            ) : (
              paymentMethod === "UPI" ? `VERIFY & PAY (₹${getTotalCartAmount() + deliveryFee})` : `PLACE ORDER (₹${getTotalCartAmount() + deliveryFee})`
            )}
          </button>

        </div>
      </div>
    </form>
  )
}

export default PlaceOrder

