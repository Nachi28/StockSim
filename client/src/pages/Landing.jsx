import React from 'react'
import "../styles/Landing.css";
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='landing-main'>
      <h1 style={styles.h1}><span style={styles.span}>StockSim</span> 📈</h1>
      <p>Hello and welcome!</p>
      <Link to="/login" className="landing-login-button">Login</Link>
      <Link to="/register" className="landing-register-button">Register</Link>
    </div>
  )
}
const styles = {
  span: {
    color: "red",
    background: "-webkit-linear-gradient(left, #ffbe0b, #fb5607)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "rgb(122 74 74 / 50%) 7px 6px 12px",
    transform: "rotateY(20deg)",
  },
  h1: {
    textShadow: "rgb(122 74 74 / 50%) 5px 6px 10px",

  },
  logo: {
    width: "100px", // Adjust the size of the logo as needed
    verticalAlign: "middle",
    textShadow: "rgb(122 74 74 / 50%) 5px 6px 10px"

  }
};

export default Landing