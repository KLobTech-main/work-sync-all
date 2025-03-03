import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNo: '',
    dob: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); 
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobileNo)) newErrors.mobileNo = 'Mobile number must be 10 digits';
    if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/register',
        formData
      );

      if (response.data) {
        setSnackbar({ open: true, message: 'Registration successful! Redirecting to login...', severity: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setLoading(false);

      if (error.response?.data?.message === 'Email is already registered!') {
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is already registered!' }));
      } else {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'An error occurred while registering. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-md bg-white rounded">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#1E3E62]">Work Sync</h1>

        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Mobile No"
              name="mobileNo"
              type="text"
              variant="outlined"
              fullWidth
              value={formData.mobileNo}
              onChange={handleChange}
              error={!!errors.mobileNo}
              helperText={errors.mobileNo}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              variant="outlined"
              fullWidth
              value={formData.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dob}
              helperText={errors.dob}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Role"
              name="role"
              type="text"
              variant="outlined"
              fullWidth
              value={formData.role}
              onChange={handleChange}
              error={!!errors.role}
              helperText={errors.role}
              required
            />
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button onClick={() => navigate('/login')} color="secondary">
              Return to Login
            </Button>
          </div>
        </form>
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
    </div>
  );
};

export default RegisterForm;
