import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

  const { food_list } = useContext(StoreContext)

  if (!food_list || food_list.length === 0) {
    return (
      <div className="food-display-loader">
        <div className="spinner"></div>
        <p>Loading dishes...</p>
      </div>
    )
  }

  return (
    <div className='food-display' id='food-display'>
      <h2 data-aos="fade-up">Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} ingredients={item.ingredients} index={index} />
          }
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
