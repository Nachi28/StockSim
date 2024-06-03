import React, { useEffect, useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import StockSimLogo from "../assets/StockSim.png";
import { handleRegisterSubmit } from "../helper/helper";



const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");

  useEffect(() => {
    if (token !== "") {
      toast.success("You already logged in");
      navigate("/dashboard");
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const lastname = e.target.lastname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    handleRegisterSubmit(name, lastname, email, password, confirmPassword, navigate);
  };

  return (
    <div className="register-main">
      <div className="register-left">
        <img src={StockSimLogo} alt="" />
      </div>
      <div className="register-right">
        <div className="register-right-container">
          {/* <div className="register-logo">
            <img src={Logo} alt="" />
          </div> */}
          <div className="register-center">
            <h2>Welcome to our website!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" name="name" required={true} />
              <input type="text" placeholder="Lastname" name="lastname" required={true} />
              <input type="email" placeholder="Email" name="email" required={true} />
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" required={true} />
                {showPassword ? <FaEyeSlash onClick={() => { setShowPassword(!showPassword) }} /> : <FaEye onClick={() => { setShowPassword(!showPassword) }} />}

              </div>
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" name="confirmPassword" required={true} />
                {showPassword ? <FaEyeSlash onClick={() => { setShowPassword(!showPassword) }} /> : <FaEye onClick={() => { setShowPassword(!showPassword) }} />}

              </div>
              <div className="register-center-buttons">
                <button type="submit">Sign Up</button>
                {/* <button type="submit">
                  <img src={GoogleSvg} alt="" />
                  Sign Up with Google
                </button> */}
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            Already have an account? <Link to="/login">Login</Link>
          </p>


        </div>
      </div>
    </div>
  );
};

export default Register;
