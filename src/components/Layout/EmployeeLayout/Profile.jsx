import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import { AttachMoney, CalendarToday, Work } from "@mui/icons-material";
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setLoading(false);  
    } else {
      if (!email || !token) {
        setError('No email or token found in local storage.');
        setLoading(false);
        return;
      }

      axios
        .get(`${baseUrl}/api/users/get/user?email=${email}`, {
          headers: { Authorization: token }
        })
        .then((response) => {
          setUserData(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data)); 
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data.');
          setLoading(false);
        });
    }
  }, [email, token]); 
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          margin:"20px",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} display="flex" alignItems="center">
            <Avatar
              sx={{ width: 80, height: 80, marginRight: "20px" }}
              alt={userData.name}
              src=""
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {userData.name}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  backgroundColor: "#007bff",
                  display: "inline-block",
                  padding: "2px 10px",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  marginBottom: "5px",
                }}
              >
                Permanent
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userData.role}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                EMP-18 | Employee
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Department
                </Typography>
                <Typography variant="body1">{userData.role}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Salary
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                  <AttachMoney fontSize="small" sx={{ marginRight: "5px" }} />
                  {userData.salaryOverview || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Work Shift
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#007bff",
                      cursor: "pointer",
                    }}
                  >
                    <Work fontSize="small" sx={{ marginRight: "5px" }} />
                    Regular Work Shift
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Joining Date
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CalendarToday fontSize="small" sx={{ marginRight: "5px" }} />
                  {new Date(userData.JoiningDate).toLocaleDateString() || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Profile;
