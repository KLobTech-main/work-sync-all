import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

function Summary() {
  const [chartData, setChartData] = useState({
    labels: ["Regular", "Early", "Late", "On Leave"],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#9C27B0"],
        hoverBackgroundColor: ["#66BB6A", "#FFB74D", "#EF5350", "#AB47BC"],
      },
    ],
  });

  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("jwtToken");

    if (email && token) {
      fetch(
        `${baseUrl}/api/attendance/${email}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          const tableData = data.map((log) => ({
            date: log.date,
            punchedIn: log.punchIn,
            inGeolocation: log.inGeoLocation,
            punchedOut: log.punchOut,
            outGeolocation: log.outGeoLocation,
            behavior: log.behavior,
            type: log.type,
            breakTime: log.breakTime,
            totalHours: log.totalHours,
            entry: log.entry,
          }));
          setSummaryData(tableData);

          const behaviorCounts = {
            Regular: 0,
            Early: 0,
            Late: 0,
            "On Leave": 0,
          };

          data.forEach((log) => {
            if (log.onLeave) {
              behaviorCounts["On Leave"] += 1;
            } else if (log.behavior) {
              behaviorCounts[log.behavior] = (behaviorCounts[log.behavior] || 0) + 1;
            }
          });

          setChartData({
            labels: ["Regular", "Early", "Late", "On Leave"],
            datasets: [
              {
                data: [
                  behaviorCounts.Regular || 0,
                  behaviorCounts.Early || 0,
                  behaviorCounts.Late || 0,
                  behaviorCounts["On Leave"] || 0,
                ],
                backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#9C27B0"],
                hoverBackgroundColor: [
                  "#66BB6A",
                  "#FFB74D",
                  "#EF5350",
                  "#AB47BC",
                ],
              },
            ],
          });
        })
        .catch((error) => console.error("Error fetching summary data:", error));
    }
  }, []);

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" style={{ fontWeight: "600" }}>
          Summary
        </Typography>
        <Button variant="contained" color="success">
          Export
        </Button>
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>

        <Paper style={{ flex: 1, padding: "16px" }}>
          <Typography variant="subtitle1" style={{ marginBottom: "16px" }}>
            November, 2024
          </Typography>
          <Doughnut data={chartData} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "16px",
            }}
          >
            {chartData.labels.map((label, index) => (
              <div key={index}>
                <Typography style={{ color: chartData.datasets[0].backgroundColor[index] }}>
                  {label}
                </Typography>
                <Typography>{chartData.datasets[0].data[index]} Days</Typography>
              </div>
            ))}
          </div>
        </Paper>

        <Paper
          style={{
            flex: 2,
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
        <div className="flex flex-col justify-around"> 

          <div>
            <Typography>Total schedule hour</Typography>
            <Typography>234:00:00</Typography>
          </div>
          <div>
            <Typography>Leave hour (paid)</Typography>
            <Typography>00:00:00</Typography>
          </div>
          <div>
            <Typography>Total active hour</Typography>
            <Typography>147:41:52 (147.70 h)</Typography>
          </div>
        </div>
        
        <div className=" flex flex-col justify-around">

          <div>
            <Typography>Balance (Lack)</Typography>
            <Typography style={{ color: "red" }}>-86:08</Typography>
          </div>
          <div>
            <Typography>Total work availability</Typography>
            <Typography>63.12%</Typography>
          </div>
          <div>
            <Typography>Average Behaviour</Typography>
            <Typography style={{ color: "red" }}>Late</Typography>
          </div>
        </div>
        </Paper>
      </div>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Punched In</TableCell>
                <TableCell>In Geolocation</TableCell>
                <TableCell>Punched Out</TableCell>
                <TableCell>Out Geolocation</TableCell>
                <TableCell>Behavior</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Break Time</TableCell>
                <TableCell>Total Hours</TableCell>
                <TableCell>Entry</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.punchedIn}</TableCell>
                  <TableCell>{row.inGeolocation}</TableCell>
                  <TableCell>{row.punchedOut}</TableCell>
                  <TableCell>{row.outGeolocation}</TableCell>
                  <TableCell style={{ color: row.behavior === "Late" ? "red" : "green" }}>
                    {row.behavior}
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.breakTime}</TableCell>
                  <TableCell>{row.totalHours}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" size="small">
                      {row.entry}
                    </Button>
                  </TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default Summary;
