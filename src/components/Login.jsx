import React, { useState } from 'react';
import './CSS/Login.css';
import { login } from '../services/apiMethods';
import toast from 'react-hot-toast';
import { userAuth,refreshToken } from '../const/localStorage';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setReduxUser } from '../utils/reducers/userReducer';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Login = () => {

    const navigate=useNavigate()
    const dispatch=useDispatch()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const userData = useSelector((state)=> state?.user?.userData)


  useEffect(()=>{
    if(userData){
      navigate('/user/dashboard')
    }
  },[userData])
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

    if (!validateEmail(email)) {
      emailError = 'Please enter a valid email address';
    }

    if (!validatePassword(password)) {
      passwordError = 'Password must include uppercase, lowercase, number, special character (e.g. Abhinav@2000)';
    }

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
    } else {
        try {
            const response=await login({email,password})
            if(response.status===200){
                localStorage.setItem(userAuth,response.data.tokens.accessToken)
                localStorage.setItem(refreshToken, response.data.tokens.refreshToken);
                dispatch(setReduxUser({ userData: response.data ,validUser:true}));
                toast.success('Logined')
                navigate('/user/dashboard')
            }
        } catch (error) {
      toast.error(error?.response?.message || error?.message);
        }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
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

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="signup-link">
          <p>
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
