import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./CSS/PasswordReset.css"; // Import the above CSS
import { resetPassword } from "../services/apiMethods";
import toast from "react-hot-toast";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const location=useLocation()
  const navigate=useNavigate()
  const email = location?.state?.email || '';
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    } else {
        try {
        const response=await resetPassword({email,password})
        if(response.status===200){
            toast.success('Password Changed Successful')
            navigate('/')
        }    
        } catch (error) {
    toast.error(error?.response?.message || error?.message);
        }
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Enter Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Re-enter Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="password-reset-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
