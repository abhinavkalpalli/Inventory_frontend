
import './App.css';
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import AuthRoutes from './routes/authRoutes';
import UserRoutes from './routes/userRoutes';




function App() {
  return (
  <>
   <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path="/*" element={<AuthRoutes/>}/>
      <Route path="/user/*" element={<UserRoutes/>}/>
    </Routes>
  </>
  );
}

export default App;
