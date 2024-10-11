import React, { useState } from 'react';
import './CSS/ForgotPassword.css'; // Ensure you use the correct CSS file
import toast from "react-hot-toast";
import { forgotPassword } from '../services/apiMethods';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await forgotPassword({ email });
      if (response.status === 200) {
        const {email,otp}=response.data
        navigate('/Otpverification',{state:{email,otp,forgotPassword:true}}); 
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message || "An error occurred");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {error && <p className="error">{error}</p>}
          </div>

          <button type="submit" className="forgot-password-btn">
            Send Otp
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
