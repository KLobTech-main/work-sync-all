import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, SentimentDissatisfied } from "@mui/icons-material";
import axios from "axios";
import InnerSidebar from "../../../components/Layout/EmployeeLayout/InnerSidbar";
import Profile from "../../../components/Layout/EmployeeLayout/Profile";

function PaySlip() {
  const [payslipData, setPayslipData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("This month");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  const fetchPayslipData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/payslip/?email=${email}`,
        { headers: { Authorization: token } }
      );
      setPayslipData(response.data || []);
      filterDataByMonth(currentMonth, currentYear, response.data || []);
    } catch (err) {
      console.error("Error fetching payslip data:", err);
      if (err.response && err.response.status === 404) {
        setError("No Payslip Found.");
      } else {
        setError("Failed to fetch payslip data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterDataByMonth = (month, year, data = payslipData) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthName = monthNames[month];
    const filtered = data.filter((item) => item.payRunPeriod.includes(currentMonthName) && item.year === year);
    setFilteredData(filtered);
  };

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
      setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
    } else {
      setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
      setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (tab === "This month") {
      filterDataByMonth(currentMonth, currentYear);
    } else if (tab === "Last month") {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      filterDataByMonth(lastMonth, lastMonthYear);
    } else if (tab === "This year") {
      setFilteredData(payslipData.filter((item) => item.year === currentYear));
    } else {
      setFilteredData(payslipData);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      payslipData.filter(
        (item) =>
          item.payrun.toLowerCase().includes(query) ||
          item.payrunPeriod.toLowerCase().includes(query) ||
          item.payrunType.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query)
      )
    );
  };

  useEffect(() => {
    fetchPayslipData();
  }, []);

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidebar />

        <Box className="flex-1 p-5 bg-gray-100">
          <Typography variant="h6" className="font-bold mb-4">
            Payslip
          </Typography>

          <div className="flex items-center mb-6">
            <ArrowBackIos fontSize="small" className="cursor-pointer" onClick={() => handleMonthChange("prev")} />
            <Typography variant="subtitle1" className="font-medium mx-2">
              {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
            </Typography>
            <ArrowForwardIos fontSize="small" className="cursor-pointer" onClick={() => handleMonthChange("next")} />
          </div>

          {loading ? (
            <Box className="text-center">
              <CircularProgress />
              <Typography variant="body2" className="mt-2">
                Loading payslip data...
              </Typography>
            </Box>
          ) : error ? (
            <Box display="flex" flexDirection="column" alignItems="center" className="text-center mt-4">
               <Typography variant="h6" className="mt-2" color="textSecondary">
                {error}
              </Typography>
            </Box>
          ) : (
            <>
              <TextField fullWidth variant="outlined" placeholder="Search" value={searchQuery} onChange={handleSearch} className="mb-6" />

              <Paper className="p-5 shadow-md rounded-lg">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      {["Payrun", "Payrun Period", "Year", "Payrun Type", "Status", "Salary", "Net Salary", "Details"].map((heading, index) => (
                        <th key={index} className="py-3 px-4 text-left font-semibold">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row) => (
                        <tr key={row.id} className="border-t">
                          <td className="py-3 px-4">{row.payrun}</td>
                          <td className="py-3 px-4">{row.payrunPeriod}</td>
                          <td className="py-3 px-4">{row.year}</td>
                          <td className="py-3 px-4">{row.payrunType}</td>
                          <td className="py-3 px-4">{row.status}</td>
                          <td className="py-3 px-4">{row.salary}</td>
                          <td className="py-3 px-4">{row.netSalary}</td>
                          <td className="py-3 px-4 text-blue-500 cursor-pointer">View Details</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-6 text-center">
                          <Typography variant="body1" className="font-medium">No payslip found.</Typography>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Paper>
            </>
          )}
        </Box>
      </div>
    </>
  );
}

export default PaySlip;
