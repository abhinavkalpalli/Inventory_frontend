import { lazy,Suspense } from "react";
import {Routes,Route} from 'react-router-dom'

const Login=lazy(()=>import("../components/Login"))
const Signup=lazy(()=>import("../components/Signup"))
const OtpVerification=lazy(()=>import('../components/Otp-verification'))
const ForgotPassword=lazy(()=>import('../components/ForgotPassword'))
const PasswordReset=lazy(()=>import('../components/PasswordReset'))
function AuthRoutes() {
    return (
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Signup" element={<Signup/>} />
          <Route path="/Otpverification" element={<OtpVerification/>} />
          <Route path="/forgotPassword" element={<ForgotPassword/>} />
          <Route path="/passwordReset" element={<PasswordReset/>} />
          </Routes>
        </Suspense>
      </>
    );
  }
  export default AuthRoutes