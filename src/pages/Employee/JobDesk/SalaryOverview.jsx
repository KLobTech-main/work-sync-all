import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InnerSidbar from '../../../components/Layout/EmployeeLayout/InnerSidbar';
import Profile from '../../../components/Layout/EmployeeLayout/Profile';
import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function SalaryOverview() {
  
  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');

  const [salaryOverview, setSalaryOverview] = useState(null);

  useEffect(() => {
    const fetchSalaryOverview = async () => {
      try {
        const response = await axios.get(`https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/get/user?email=${email}`, {
          headers: {
            Authorization: token,
          }
        });
        setSalaryOverview(response.data.salaryOverview);
      } catch (error) {
        console.error("Error fetching salary overview:", error);
      }
    };

    fetchSalaryOverview();
  }, [email, token]);
  return (
    <>

    <Profile />
      <div className="flex">
        <InnerSidbar />
    <div className="flex flex-col items-start w-full p-4 bg-gray-100">
      <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
        Salary Overview
      </Typography>

      <Paper elevation={1} className="w-full p-4 rounded-lg">
        <div className="flex items-center">
          <Box
            className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full"
            aria-label="Salary Icon"
          >
            <AttachMoneyIcon className="text-blue-500" />
          </Box>

          <div className="ml-4">
            <Typography variant="body1" className="text-gray-600">
              Salary
            </Typography>
            <Typography
              variant="body2"
              className="mt-1 font-medium text-gray-500 bg-gray-50 rounded px-2 py-1"
            >
              {salaryOverview !== null ? salaryOverview : "Not added yet"}
            </Typography>
          </div>
        </div>
      </Paper>
        
    </div>
        </div>
    </>
  );
}

export default SalaryOverview;
