import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, Tag, Truck, Receipt } from 'lucide-react';

const Cart = () => {
  const { 
    cartItems, 
    food_list, 
    addToCart, 
    removeFromCart, 
    removeAllFromCart, 
    clearCart, 
    getTotalCartAmount, 
    url, 
    deliveryFee, 
    setDeliveryFee, 
    ingredientMap 
  } = useContext(StoreContext);
  
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const applyPromoCode = () => {
    if (promoCode.trim().toUpperCase() === "PJK840") {
      setDeliveryFee(0);
      setPromoApplied(true);
    } else {
      alert("Invalid Promo Code");
      setDeliveryFee(50);
      setPromoApplied(false);
    }
  };

  const hasItems = Object.keys(cartItems).some(key => cartItems[key] > 0);

  if (!hasItems) {
    return (
      <div className='cart-empty-container fade-in'>
        <div className="empty-content">
          <div className="empty-img-wrapper">
             <img src="/images/empty-cart.png" alt="Empty Cart" />
          </div>
          <h1>Your cart is <span>empty</span></h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className='shop-now-btn' onClick={() => navigate('/')}>
            Go Shopping <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='cart-page-wrapper'>
      <div className="cart-header">
        <h1>Your <span>Shopping Bag</span></h1>
        <button className='clear-all-btn' onClick={clearCart}>
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="cart-content-grid">
        <div className="cart-items-section">
          {Object.keys(cartItems).map((cartKey, index) => {
            if (cartItems[cartKey] > 0) {
              const [itemId, size, extrasStr] = cartKey.split("_");
              const extras = extrasStr ? extrasStr.split(",") : [];
              const item = food_list.find((p) => p._id === itemId);

              if (item) {
                let itemPrice = item.price;
                if (size === "Medium") itemPrice *= 1.25;
                else if (size === "Large") itemPrice *= 1.5;

                const categoryExtras = ingredientMap[item.category] || ingredientMap["default"];
                extras.forEach(extraName => {
                  const option = categoryExtras.find(o => o.name === extraName);
                  if (option) itemPrice += option.price;
                });

                const finalPrice = Math.round(itemPrice);

                return (
                  <div className="cart-item-card" key={cartKey} style={{'--delay': index * 0.1 + 's'}}>
                    <div className="item-img-box">
                      <img src={url + "/images/" + item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <div className="item-main-info">
                        <h3>{item.name}</h3>
                        <p className="item-variant">{size} {extras.length > 0 && `• ${extras.join(", ")}`}</p>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-stepper">
                          <button onClick={() => removeFromCart(cartKey)}><Minus size={14} /></button>
                          <span>{cartItems[cartKey]}</span>
                          <button onClick={() => addToCart(itemId, size, extras)}><Plus size={14} /></button>
                        </div>
                        <div className="item-price-info">
                          <span className="unit-price">₹{finalPrice} / unit</span>
                          <span className="total-item-price">₹{finalPrice * cartItems[cartKey]}</span>
                        </div>
                        <button className='remove-variation-btn' onClick={() => removeAllFromCart(cartKey)} title="Remove all units">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            }
            return null;
          })}
        </div>

        <div className="cart-summary-section">
          <div className="summary-glass-card">
            <h2>Order <span>Summary</span></h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span><Receipt size={18} /> Subtotal</span>
                <span>₹{getTotalCartAmount()}</span>
              </div>
              <div className="summary-row">
                <span><Truck size={18} /> Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'fee-free' : ''}>
                  {getTotalCartAmount() === 0 ? '₹0' : (deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`)}
                </span>
              </div>
              <div className="promo-box">
                <div className="promo-input-group">
                  <Tag size={18} className='tag-icon' />
                  <input 
                    type="text" 
                    placeholder="Enter Promo Code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={applyPromoCode}>Apply</button>
                </div>
                {promoApplied && <p className="promo-msg">✨ Code <b>PJK840</b> applied!</p>}
              </div>
              <div className="total-divider"></div>
              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryFee}</span>
              </div>
            </div>
            <button className='checkout-btn' onClick={() => navigate('/order')}>
              Proceed to Checkout <ArrowRight size={20} />
            </button>
            <p className="secure-text">🔒 Secure Checkout Guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart