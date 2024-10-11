// src/components/OtpInput.js
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CSS/OtpInput.css'

const OtpInput = ({ length, onChangeOtp }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    onChangeOtp(otp.join(''));
  }, [otp, onChangeOtp]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value) || value === '') {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      if (value !== '' && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-input">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputsRef.current[index] = el)}
          className="otp-input__field"
        />
      ))}
    </div>
  );
};

OtpInput.propTypes = {
  length: PropTypes.number.isRequired,
  onChangeOtp: PropTypes.func.isRequired,
};

export default OtpInput;
