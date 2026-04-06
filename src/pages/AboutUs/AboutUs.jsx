import React, { useState, useContext } from "react";
import "./AboutUs.css";
import { StoreContext } from "../../context/StoreContext";
import { Heart, Target, Zap, Linkedin, Globe, Mail, MessageSquare, Send, Phone, MapPin } from "lucide-react";

const AboutUs = () => {
  const creators = [
    {
      name: "Chauhan Jaydip",
      role: "Full Stack Developer",
      email: "jatinchohan2005@gmail.com",
      phone: "+91 96249 83883",
      avatar: "/images/creators/jaydip.png",
      bio: "Mastermind behind the seamless tech stack of Food Masters."
    },
    {
      name: "Dhameliya Kaushal",
      role: "Creative Lead",
      email: "kaushal2005@gmail.com",
      phone: "+91 91234 56789",
      avatar: "/images/creators/kaushal.png",
      bio: "Designing the flavors of the UI with a minimalist touch."
    },
    {
      name: "Dhameliya Prince",
      role: "Problem Solver",
      email: "prince2005@gmail.com",
      phone: "+91 99887 77665",
      avatar: "/images/creators/prince.png",
      bio: "Crushing bugs and ensuring every bite of our app is perfect."
    },
  ];

  const values = [
    { icon: <Heart className="v-icon" />, title: "Passion", desc: "We love food as much as we love clean code." },
    { icon: <Target className="v-icon" />, title: "Precision", desc: "Every pixel and every delivery matters to us." },
    { icon: <Zap className="v-icon" />, title: "Speed", desc: "Fast app, faster delivery. That's our promise." },
  ];

  const { token } = useContext(StoreContext);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in before sending a message.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="reveal-text">We Are <span>Food Masters</span></h1>
          <p className="hero-subtext">Redefining the way you experience local flavors with every tap.</p>
          <div className="hero-scroll-btn">
            <span className="mouse"></span>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="values-section">
        <div className="section-header">
          <h2>Our Core <span>Values</span></h2>
          <div className="header-line"></div>
        </div>
        <div className="values-grid">
          {values.map((v, i) => (
            <div className="value-card" key={i} style={{ "--delay": i * 0.2 }}>
              <div className="value-icon-box">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-glass-card">
          <div className="contact-info">
            <h2>Get in <span>Touch</span></h2>
            <p>Have a question or feedback? We'd love to hear from you!</p>
            <div className="info-items">
              <div className="info-item">
                <MapPin className="i-icon" size={24} />
                <span>Piplod, Surat, Gujarat</span>
              </div>
              <div className="info-item">
                <Mail className="i-icon" size={24} />
                <span>support@foodmasters.com</span>
              </div>
            </div>
          </div>

          <div className="contact-form-side">
            {!token ? (
              <div className="login-prompt">
                <div className="prompt-icon">🔒</div>
                <h3>Authentication Required</h3>
                <p>Please sign in to your account to send us a secure message.</p>
              </div>
            ) : (
              <form className="premium-form" onSubmit={handleSubmit}>
                <div className="input-field">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label>Full Name</label>
                </div>
                <div className="input-field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label>Email Address</label>
                </div>
                <div className="input-field">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  ></textarea>
                  <label>Your Message</label>
                </div>
                <button type="submit" className="glow-btn" disabled={loading}>
                  {loading ? "Sending..." : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            )}
            {success && <p className="success-banner">✨ Message sent successfully!</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
