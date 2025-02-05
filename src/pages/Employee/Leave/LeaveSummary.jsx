  import React, { useState, useEffect } from "react";
  import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
  } from "@mui/material";
  import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

  const LeaveSummary = () => {
    const [selectedFilter, setSelectedFilter] = useState("This month");
    const [leaveData, setLeaveData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const today = new Date();
    const maxMonth = today.getMonth();
    const maxYear = today.getFullYear();

    useEffect(() => {
      fetchLeaveData();
    }, []);

    const fetchLeaveData = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("jwtToken");

        if (!email || !token) {
          console.error("Email or token missing in localStorage");
          return;
        }

        const response = await fetch(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/leaves/${encodeURIComponent(
            email
          )}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch leave data:", response.statusText);
          return;
        }

        const data = await response.json();
        setLeaveData(data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    const handleFilterChange = (filter) => {
      setSelectedFilter(filter);
    };

    const handleMonthChange = (direction) => {
      if (direction === "prev") {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else if (direction === "next") {
        if (currentMonth === maxMonth && currentYear === maxYear) {
          return;
        }
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
    };

    const applyFilters = () => {
      let filteredData = [...leaveData];

      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);

      switch (selectedFilter) {
        case "Today":
          filteredData = filteredData.filter(
            (leave) =>
              new Date(leave.startDate).toDateString() ===
              new Date().toDateString()
          );
          break;
        case "This week":
          filteredData = filteredData.filter(
            (leave) =>
              new Date(leave.startDate) >= weekStart &&
              new Date(leave.startDate) <= weekEnd
          );
          break;
        case "Last week":
          const lastWeekStart = new Date(
            weekStart.setDate(weekStart.getDate() - 7)
          );
          const lastWeekEnd = new Date(
            weekEnd.setDate(weekEnd.getDate() - 7)
          );
          filteredData = filteredData.filter(
            (leave) =>
              new Date(leave.startDate) >= lastWeekStart &&
              new Date(leave.startDate) <= lastWeekEnd
          );
          break;
        case "This month":
          filteredData = filteredData.filter(
            (leave) =>
              new Date(leave.startDate) >= monthStart &&
              new Date(leave.startDate) <= monthEnd
          );
          break;
        case "Last month":
          const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
          const lastMonthEnd = new Date(currentYear, currentMonth, 0);
          filteredData = filteredData.filter(
            (leave) =>
              new Date(leave.startDate) >= lastMonthStart &&
              new Date(leave.startDate) <= lastMonthEnd
          );
          break;
        case "This year":
          filteredData = filteredData.filter(
            (leave) => new Date(leave.startDate).getFullYear() === currentYear
          );
          break;
        default:
          break;
      }

      return filteredData.sort((a, b) => {
        if (new Date(a.startDate) > new Date()) return -1;
        if (new Date(b.startDate) > new Date()) return 1;
        return 0;
      });
    };

    const filteredAndSortedData = applyFilters();

    return (
      <Box className="p-8 bg-gray-50 min-h-screen">
        {/* Summary Header */}
        <Grid container spacing={2} className="mb-6">
          <Grid item xs={12} sm={4}>
            <Paper className="p-6 shadow-md text-center">
              <Typography variant="h5" className="font-bold">
                {leaveData.filter((leave) => leave.status === "Approved").length}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Leave approved (Days)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="p-6 shadow-md text-center">
              <Typography variant="h5" className="font-bold">
                {leaveData.filter(
                  (leave) => new Date(leave.startDate) > new Date()
                ).length}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Upcoming leave (Days)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="p-6 shadow-md text-center">
              <Typography variant="h5" className="font-bold">
                {leaveData.filter((leave) => leave.status === "Pending").length}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Pending request
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box className="mb-6 flex space-x-4">
          {["Today", "This week", "Last week", "This month", "Last month", "This year"].map((filter) => (
            <Button
              key={filter}
              className={`${
                selectedFilter === filter
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </Button>
          ))}
        </Box>

        {/* Month Navigation */}
        <Box className="flex items-center mb-4">
          <ArrowBackIos
            fontSize="small"
            className="cursor-pointer"
            onClick={() => handleMonthChange("prev")}
          />
          <Typography variant="subtitle1" className="mx-4">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <ArrowForwardIos
            fontSize="small"
            className="cursor-pointer"
            onClick={() => handleMonthChange("next")}
            disabled={currentMonth === maxMonth && currentYear === maxYear}
          />
        </Box>

        {/* Table Section */}
        <Paper className="p-6 shadow-md">
          {filteredAndSortedData.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  {["Start Date", "End Date", "Leave Type", "Days", "Reason", "Status"].map(
                    (heading, index) => (
                      <TableCell key={index} className="font-bold text-gray-600">
                        {heading}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.startDate || "N/A"}</TableCell>
                    <TableCell>{leave.endDate || "N/A"}</TableCell>
                    <TableCell>{leave.leaveType || "N/A"}</TableCell>
                    <TableCell>{leave.days || "N/A"}</TableCell>
                    <TableCell>{leave.reason || "N/A"}</TableCell>
                    <TableCell className="py-3 px-4">
                                        {leave.status === "PENDING"
                                          ? "Pending"
                                          : leave.status === "REJECTED"
                                          ? "Rejected"
                                          : "Approved"}
                                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box className="flex flex-col items-center py-10">
              <Typography variant="body1" className="text-gray-600">
                No leave data available
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  export default LeaveSummary;
