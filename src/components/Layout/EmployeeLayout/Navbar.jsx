import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton,Menu, Avatar, CircularProgress, Button } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To handle redirect after logout

const Navbar = ({ darkMode, setDarkMode }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');
  
  const navigate = useNavigate(); // Hook to navigate to other pages

  useEffect(() => {
    if (!email || !token) {
      setError('No email or token found in local storage.');
      setLoading(false);
      return;
    }

    // Fetch the user data from API
    axios
      .get(`https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/get/user?email=${email}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      });
  }, [email, token]);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userName',(userData.name));
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    
    // Redirect to login page
    navigate('/login');
  };

  if (loading) {
    return (
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: darkMode ? '#0B192C' : '#ffffff',
          color: darkMode ? '#ffffff' : '#333',
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: darkMode ? '#ffffff' : '#333',
            }}
          >
            Work Sync
          </Typography>
          <CircularProgress color="inherit" />
        </Toolbar>
      </AppBar>
    );
  }

  if (error) {
    return (
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: darkMode ? '#0B192C' : '#ffffff',
          color: darkMode ? '#ffffff' : '#333',
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
         <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)} sx={{ marginRight: 2 }}>
          <Menu />
        </IconButton>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: darkMode ? '#ffffff' : '#333',
            }}
          >
            Work Sync
          </Typography>
          <Typography color="error">{error}</Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 2 }}>
          Logout
        </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: darkMode ? '#0B192C' : '#ffffff',
        color: darkMode ? '#ffffff' : '#333',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            color: darkMode ? '#ffffff' : '#333',
          }}
        >
          Work Sync
        </Typography>
        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      
        <Avatar
          sx={{
            marginLeft: 2,
            backgroundColor: darkMode ? '#1E3E62' : '#1976d2',
          }}
        >
          {userData ? userData.name.charAt(0) : 'U'} 
        </Avatar>
        <Typography variant="body2" color={darkMode ? '#ffffff' : '#333'} sx={{ marginLeft: 1 }}>
          {userData ? userData.name : 'Loading...'}
        </Typography>
        <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 2 }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
