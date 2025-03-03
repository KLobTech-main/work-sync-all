import  { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import InnerSidebar from "../../../components/Layout/EmployeeLayout/InnerSidbar";
import Profile from "../../../components/Layout/EmployeeLayout/Profile";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
        {
          headers: { Authorization: token },
        }
      );
      setPayslipData(response.data || []);
      filterDataByMonth(currentMonth, currentYear, response.data || []);
    } catch (err) {
      console.error("Error fetching payslip data:", err);
      setError("Failed to fetch payslip data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterDataByMonth = (month, year, data = payslipData) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const currentMonthName = monthNames[month];
    const filtered = data.filter(
      (item) =>
        item.payRunPeriod.includes(currentMonthName) && item.year === year
    );
    setFilteredData(filtered);
  };

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
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
      const filtered = payslipData.filter((item) => item.year === currentYear);
      setFilteredData(filtered);
    } else if (tab === "Total") {
      setFilteredData(payslipData);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = payslipData.filter(
      (item) =>
        item.payrun.toLowerCase().includes(query) ||
        item.payrunPeriod.toLowerCase().includes(query) ||
        item.payrunType.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
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
            <ArrowBackIos
              fontSize="small"
              className="cursor-pointer"
              onClick={() => handleMonthChange("prev")}
            />
            <Typography variant="subtitle1" className="font-medium mx-2">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <ArrowForwardIos
              fontSize="small"
              className="cursor-pointer"
              onClick={() => handleMonthChange("next")}
            />
          </div>

           {loading ? (
            <Box className="text-center">
              <CircularProgress />
              <Typography variant="body2" className="mt-2">
                Loading payslip data...
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          ) : (
            <>
              <Grid container spacing={3} className="mb-6">
                {[
                  { label: "Total Payslip", value: filteredData.length },
                  { label: "Payslip Sent", value: filteredData.filter((d) => d.status === "Sent").length },
                  { label: "Conflicted Payslip", value: 0 }, 
                ].map((item, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper className="p-5 text-center shadow-md rounded-lg">
                      <Typography
                        variant="h4"
                        className="font-bold text-gray-700 mb-2"
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        className="text-gray-500 font-medium"
                      >
                        {item.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <div className="flex justify-start space-x-4 mb-6">
                {["This month", "Last month", "This year", "Total"].map(
                  (tab, index) => (
                    <Typography
                      key={index}
                      onClick={() => handleTabChange(tab)}
                      className={`cursor-pointer ${
                        selectedTab === tab
                          ? "text-blue-500 font-bold border-b-2 border-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {tab}
                    </Typography>
                  )
                )}
              </div>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="mb-6"
              />

              <Paper className="p-5 shadow-md rounded-lg">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      {[
                        "Payrun",
                        "Payrun Period",
                        "Year",
                        "Payrun Type",
                        "Status",
                        "Salary",
                        "Net Salary",
                        "Details",
                      ].map((heading, index) => (
                        <th
                          key={index}
                          className="py-3 px-4 text-left font-semibold"
                        >
                          {heading}
                        </th>
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
                          <td className="py-3 px-4 text-blue-500 cursor-pointer">
                            View Details
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-6 text-center">
                          <Typography variant="body1" className="font-medium">
                            No data found.
                          </Typography>
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
