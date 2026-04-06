import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="cards">
        <div className="card">
          <div className="face front" />
          <div className="face back" />
        </div>
        <div className="card">
          <div className="face front" />
          <div className="face back" />
        </div>
        <div className="card">
          <div className="face front" />
          <div className="face back" />
        </div>
        <div className="card">
          <div className="face front" />
          <div className="face back" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
