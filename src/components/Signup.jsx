import React, { useState } from 'react';
import './CSS/Signup.css';
import toast from "react-hot-toast";
import { register } from '../services/apiMethods';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', rePassword: '' });
  const navigate=useNavigate()

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Password validation regex (example: Abhinav@2000)
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    let emailError = '';
    let passwordError = '';
    let rePasswordError = '';

    if (!validateEmail(email)) {
      emailError = 'Please enter a valid email address';
    }

    if (!validatePassword(password)) {
      passwordError = 'Password must include uppercase, lowercase, number, special character (e.g. Abhinav@2000)';
    }

    if (password !== rePassword) {
      rePasswordError = 'Passwords do not match';
    }

    if (emailError || passwordError || rePasswordError) {
      setErrors({ email: emailError, password: passwordError, rePassword: rePasswordError });
    } else {
      try {
        const response=await register({email,password})
        if(response.status===201){
            const {email,otp}=response.data
            toast.success(`${email}`)
            navigate('/Otpverification',{state:{email,otp}})
        }else{
            toast.error(response.message)
        }
      } catch (error) {
      toast.error(error?.response?.message || error?.message || "An error occurred");
        
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="input-group">
            <label>Re-enter Password</label>
            <input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Re-enter your password"
            />
            {errors.rePassword && <p className="error">{errors.rePassword}</p>}
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
