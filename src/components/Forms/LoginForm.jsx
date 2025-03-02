import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [openDialog, setOpenDialog] = useState(false); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMsg(''); 
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMsg(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(
        'https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/login',
        formData
      );

      if (response.data) {
        const { token, user } = response.data;

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('email', user.email); 

        setSnackbar({ open: true, message: 'Login successful! Redirecting...', severity: 'success' });
        setTimeout(() => navigate('/'));
      }
    } catch (error) {
      setLoading(false);

      if (error.response?.data?.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'An error occurred while logging in. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setSnackbar({
        open: true,
        message: 'No token found. Please log in again.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/reset/password',
        resetPasswordData,
        {
          headers: {
            Authorization: token, 
          },
        }
      );

      if (response.data) {
        setSnackbar({
          open: true,
          message: 'Password reset successful. You can now login.',
          severity: 'success',
        });
        setOpenDialog(false); 
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setLoading(false);

      if (error.response?.data?.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'An error occurred while resetting the password. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleDialogClose = () => setOpenDialog(false); 

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-md bg-white rounded">
       
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1E3E62]">Work Sync</h1>

        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          <div className="mt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <Button
            variant="text"
            color="primary"
            fullWidth
            onClick={() => navigate('/register')}
          >
            Go to Register
          </Button>
        </div>

        <div className="mt-4">
          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={() => setOpenDialog(true)} 
          >
            Forgot Password?
          </Button>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                value={resetPasswordData.email}
                onChange={handleResetChange}
                required
              />
            </div>
            <div className="mb-4">
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                variant="outlined"
                fullWidth
                value={resetPasswordData.newPassword}
                onChange={handleResetChange}
                required
              />
            </div>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm;
