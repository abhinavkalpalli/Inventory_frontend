import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const user=useSelector((state)=>state.user.userData)
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
     {`Hi Welcome ${user.email}`}
    </Box>
  );
};

export default Dashboard;
