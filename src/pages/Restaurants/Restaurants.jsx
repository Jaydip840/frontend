import React, { useState } from "react";
import "./Restaurants.css";
import { assets } from "../../assets/assets.js";

const Location = () => {
  const [query, setQuery] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyB7PGQSeNrE3LQ6SUQnIoRJQj40RggBgUs&q=${encodeURIComponent(
      query
    )}`;
    setMapUrl(url);
  };

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Surat restaurants with real details
  const restaurants = [
    { 
      name: "Leonardo Italian Mediterranean Dining", 
      img: "/images/restaurants/leonardo.jpg", 
      cuisine: "Italian, Mediterranean", 
      location: "Piplod, Surat", 
      rating: "4.4",
      address: "Behind Iscon Mall, At Spice Villa, 3rd Floor, Piplod, Dumas Road, Surat, 395007",
      hours: "11:30 AM - 12:00 AM",
      phone: "+91 261 272 5555",
      description: "A premium rooftop dining experience offering authentic Italian and Mediterranean flavors with a stunning view."
    },
    { 
      name: "Sizzling Salsa", 
      img: "/images/restaurants/sizzling_salsa.jpg", 
      cuisine: "Indian, Continental", 
      location: "Dumas, Surat", 
      rating: "4.0",
      address: "Surat-Dumas Road, Opposite ISKCON Mall, Piplod, Surat, 395007",
      hours: "11:30 AM - 11:30 PM",
      phone: "+91 261 272 1111",
      description: "Lively atmosphere with a wide variety of Sizzlers and fusion Indian dishes."
    },
    { 
      name: "Glorious Restaurant", 
      img: "/images/restaurants/glorious.jpg", 
      cuisine: "North Indian, Chinese", 
      location: "Adajan Gam, Surat", 
      rating: "4.0",
      address: "1st Floor, Madhav Complex, Honey Park Road, Opposite Prime Market, Adajan, Surat, 395009",
      hours: "11:00 AM - 3:00 PM, 3:30 PM - 11:00 PM",
      phone: "+91 261 653 7333",
      description: "Known for its consistent quality and delicious vegetarian North Indian and Chinese cuisine."
    },
    { 
      name: "Table 101", 
      img: "/images/restaurants/table_101.jpg", 
      cuisine: "Fine Dining, International", 
      location: "Athwa, Surat", 
      rating: "4.9",
      address: "Surat Marriott Hotel, Near Ambikaniketan, Athwalines, Surat, 395007",
      hours: "6:30 AM - 11:00 AM, 12:30 PM - 3:00 PM, 7:00 PM - 12:00 AM",
      phone: "+91 261 711 7000",
      description: "An elegant all-day dining restaurant featuring interactive kitchens and a global menu."
    },
    { 
      name: "Vintage Asia", 
      img: "/images/restaurants/vintage_asia.jpg", 
      cuisine: "Asian, Pan-Asian", 
      location: "Dumas Road, Surat", 
      rating: "4.9",
      address: "Surat Marriott Hotel, Ambikaniketan, Athwalines, South Surat, 395007",
      hours: "7:00 PM - 11:30 PM",
      phone: "+91 261 711 7000",
      description: "Authentic Pan-Asian flavors in a sophisticated setting, specializing in Teppanyaki and Dim Sum."
    },
    { 
      name: "Spice Terrace", 
      img: "/images/restaurants/spice_terrace.jpg", 
      cuisine: "Indian, Vegetarian", 
      location: "Dumas, Surat", 
      rating: "3.5",
      address: "Dumas Road, Magdalla, Surat, 395007",
      hours: "12:00 PM - 11:00 PM",
      phone: "+91 99090 12345",
      description: "Spacious outdoor seating with a focused menu of traditional Indian delicacies."
    },
    { 
      name: "Hungrilla Fast Food", 
      img: "/images/restaurants/hungrilla.jpg", 
      cuisine: "Fast Food, Snacks", 
      location: "Udhana Darwaja, Surat", 
      rating: "4.6",
      address: "2/671, Next to Revaa House, Udhana Darwaja, Surat, 395002",
      hours: "11:00 AM - 9:00 PM",
      phone: "+91 96240 91007",
      description: "Popular spot for quick bites, burgers, and classic street-style fast food."
    },
    { 
      name: "Crystal Palace", 
      img: "/images/restaurants/crysttal_palace.jpg", 
      cuisine: "Indian, Vegetarian", 
      location: "Ring Road, Surat", 
      rating: "4.3",
      address: "Ring Road, Near Textile Market, Surat, 395002",
      hours: "11:00 AM - 11:00 PM",
      phone: "+91 261 234 5678",
      description: "A family-friendly restaurant offering a rich variety of North Indian vegetarian dishes."
    }
  ];

  return (
    <div className="location-container">
      {/* Detail Modal */}
      {selectedRestaurant && (
        <div className="res-modal-overlay" onClick={() => setSelectedRestaurant(null)}>
          <div className="res-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="res-close-btn" onClick={() => setSelectedRestaurant(null)}>×</button>
            <div className="res-modal-left">
              <img src={selectedRestaurant.img} alt={selectedRestaurant.name} />
              <div className="res-modal-badges">
                <span className="res-modal-rating">★ {selectedRestaurant.rating}</span>
                <span className="res-modal-cuisine">{selectedRestaurant.cuisine}</span>
              </div>
            </div>
            <div className="res-modal-right">
              <h2>{selectedRestaurant.name}</h2>
              <p className="res-modal-desc">{selectedRestaurant.description}</p>
              
              <div className="res-detail-item">
                <span className="icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>{selectedRestaurant.address}</p>
                </div>
              </div>

              <div className="res-detail-item">
                <span className="icon">⏰</span>
                <div>
                  <strong>Hours</strong>
                  <p>{selectedRestaurant.hours}</p>
                </div>
              </div>

              <div className="res-detail-item">
                <span className="icon">📞</span>
                <div>
                  <strong>Contact</strong>
                  <p>{selectedRestaurant.phone}</p>
                </div>
              </div>

              <div className="res-modal-actions">
                <button className="directions-btn" onClick={() => {
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRestaurant.name + ' ' + selectedRestaurant.address)}`, '_blank');
                }}>Get Directions</button>
                <button className="call-btn" onClick={() => window.location.href = `tel:${selectedRestaurant.phone}`}>Call Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="location-hero">
        <h2 className="section-title">Discover <span>Local Flavors</span></h2>
        <p className="section-subtitle">Find the best dining experiences near you in Surat</p>

        <form onSubmit={handleSearch} className="location-search-box">
          <div className="search-input-wrapper">
            <img src={assets.search_icon} alt="" className="search-icon-img" />
            <input
              type="text"
              placeholder="Search for a restaurant or area..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">Find Restaurants</button>
        </form>
      </div>

      <div className="location-main-content">
        {mapUrl ? (
          <div className="location-map-section fade-in">
            <div className="map-card">
              <iframe
                title="search-map"
                src={mapUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="location-placeholder fade-in">
            <div className="placeholder-content">
              <img src={assets.parcel_icon} alt="" />
              <h3>Enter a location to view the map</h3>
              <p>Search for specific restaurants to see their exact locations and details</p>
            </div>
          </div>
        )}

        <div className="restaurant-showcase">
          <div className="showcase-header">
            <h3>Featured Restaurants</h3>
            <div className="scroll-hint">
              <span>Scroll to explore</span>
              <div className="hint-line"></div>
            </div>
          </div>

          <div className="restaurant-slider">
            <div className="slider-track">
              {restaurants.concat(restaurants).map((res, idx) => (
                <div 
                  key={idx} 
                  className="restaurant-card" 
                  style={{ "--i": idx % restaurants.length }}
                  onClick={() => setSelectedRestaurant(res)}
                >
                  <div className="restaurant-img-wrapper">
                    <img src={res.img} alt={res.name} loading="lazy" />
                    <div className="rating-badge">★ {res.rating}</div>
                  </div>
                  <div className="restaurant-info">
                    <h3>{res.name}</h3>
                    <p className="cuisine">{res.cuisine}</p>
                    <div className="location-line">
                      <span>📍</span> {res.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
