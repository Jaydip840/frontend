import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './FoodDetails.css';

const FoodDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { food_list, addToCart, url, ingredientMap, itemRatings, updateRating } = useContext(StoreContext);
    const [food, setFood] = useState(null);
    const [selectedSize, setSelectedSize] = useState("Small");
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [hoverRating, setHoverRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

    const rating = itemRatings[id] || 4;

    useEffect(() => {
        const item = food_list.find((item) => item._id === id);
        if (item) setFood(item);
    }, [id, food_list]);

    if (!food) return <div className="loader">Loading...</div>;

    const extrasOptions = ingredientMap[food.category] || ingredientMap["default"];
    const sizes = ["Small", "Medium", "Large"];

    const toggleExtra = (extra) => {
        setSelectedExtras(prev =>
            prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]
        );
    };

    const calculateCurrentPrice = () => {
        let price = food.price;
        if (selectedSize === "Medium") price *= 1.25;
        else if (selectedSize === "Large") price *= 1.5;

        selectedExtras.forEach(extraName => {
            const option = extrasOptions.find(o => o.name === extraName);
            if (option) price += option.price;
        });

        return Math.round(price) * quantity;
    };

    const handleAddToCart = () => {
        addToCart(food._id, selectedSize, selectedExtras, quantity);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleRatingClick = (e, star) => {
        e.stopPropagation();
        updateRating(id, star);
    };

    return (
        <div className="food-details-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <img src={assets.cross_icon} alt="back" />
            </button>

            <div className="food-details-content">
                <div className="food-details-image-section">
                    <div className="image-wrapper">
                        <img src={url + "/images/" + food.image} alt={food.name} />
                    </div>
                </div>

                <div className="food-details-info-section">
                    <div className="food-header">
                        <h1>{food.name}</h1>
                        <p className="category-tag">{food.category}</p>
                    </div>

                    <div className="rating-section">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={(e) => handleRatingClick(e, star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="rating-text">({rating}.0 Rating)</span>
                    </div>

                    <p className="description">{food.description}</p>

                    <div className="options-section">
                        <h3>Quantity</h3>
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>

                        <h3>Select Size</h3>
                        <div className="size-selector">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <h3>Extra Ingredients</h3>
                        <div className="extras-grid">
                            {extrasOptions.map(option => (
                                <label key={option.name} className={`extra-item ${selectedExtras.includes(option.name) ? 'selected' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedExtras.includes(option.name)}
                                        onChange={() => toggleExtra(option.name)}
                                    />
                                    <span className="extra-name">{option.name}</span>
                                    {option.price > 0 && <span className="extra-price">+₹{option.price}</span>}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="food-footer">
                        <div className="price-tag">
                            <span className="label">Total Price</span>
                            <span className="value">₹{calculateCurrentPrice()}</span>
                        </div>
                        <div className="action-wrapper">
                            {showSuccess && <span className="success-msg">Added to Cart!</span>}
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;
