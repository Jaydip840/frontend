import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

import { useNavigate } from 'react-router-dom';

const FoodItem = ({ id, name, price, description, image, index }) => {
  const { cartItems, addToCart, removeFromCart, url, getItemCount, removeFromCartById, itemRatings, updateRating } = useContext(StoreContext);
  const navigate = useNavigate();
  const itemCount = getItemCount(id);
  const currentRating = itemRatings[id] || 4; // Default to 4

  return (
    <>
      <div className='food-item' data-aos="fade-up" style={{ "--i": index }} onClick={() => navigate(`/food/${id}`)}>
        <div className="food-item-img-container">
          <img className='food-item-image' src={url + "/images/" + image} alt="" />
          {itemCount === 0
            ? <img className='add' onClick={(e) => { e.stopPropagation(); addToCart(id, "Small", [], 1); }} src={assets.add_icon_white} alt="" />
            : <div className='food-item-counter' onClick={(e) => e.stopPropagation()}>
              <img onClick={() => removeFromCartById(id)} src={assets.remove_icon_red} alt="" />
              <p>{itemCount}</p>
              <img onClick={() => addToCart(id, "Small", [], 1)} src={assets.add_icon_green} alt="" />
            </div>
          }
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <div className="item-stars" onClick={(e) => e.stopPropagation()}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`item-star ${star <= currentRating ? 'filled' : ''}`}
                  onClick={() => updateRating(id, star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="food-item-desc">{description}</p>
          <p className="food-item-price"><b>₹</b>{price}</p>
        </div>
      </div>
    </>
  );
};

export default FoodItem;
