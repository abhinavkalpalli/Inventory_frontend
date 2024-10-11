import React, { useState, useEffect } from "react";
import OtpInput from "../components/OtpInput";
import { useLocation, useNavigate } from "react-router-dom";
import { otpVerify, resendOtp } from "../services/apiMethods";
import "./CSS/Otpverification.css";
import toast from "react-hot-toast";

const OtpVerification = () => {
  const [otp2, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [otpInput, setOtpInput] = useState("");
  const location = useLocation();
  const { email, otp, forgotPassword } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    setOtpInput(otp);
  }, [otp]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (otpInput === otp2) {
        if (forgotPassword) {
          return navigate("/passwordReset", { state: { email } });
        }
        const response = await otpVerify({ email });
        if (response.status === 200) {
          navigate("/");
        }
      } else {
        setError("Otp mismatch");
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({ email });
      if (response.status === 200) {
        setOtpInput(response.data.otp);
        setTimeLeft(60);
      }
    } catch (error) {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      {error && (
        <div className="text-red-600 text-sm font-extralight py-2">
          ! {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <OtpInput length={6} onChangeOtp={handleOtpChange} />
        <button type="submit" disabled={timeLeft === 0}>
          {timeLeft > 0 ? `Verify OTP (${timeLeft}s)` : "Reset OTP"}
        </button>
      </form>
      {timeLeft === 0 && <button onClick={handleResendOtp}>Resend OTP</button>}
    </div>
  );
};

export default OtpVerification;
