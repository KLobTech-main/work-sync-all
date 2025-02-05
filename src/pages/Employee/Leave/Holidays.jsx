import React, { useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function Holidays() {
  const holidaysData = [
    {
      name: "Republic Day",
      startDate: "2024-01-26",
      endDate: "2024-01-26",
      repeatsAnnually: "Yes",
      description: "-",
      availableFor: "All",
      created: "2024-01-23",
    },
    {
      name: "Dhuleti",
      startDate: "2024-03-25",
      endDate: "2024-03-25",
      repeatsAnnually: "No",
      description: "-",
      availableFor: "All",
      created: "2024-01-23",
    },
    {
      name: "Independence Day",
      startDate: "2024-08-15",
      endDate: "2024-08-15",
      repeatsAnnually: "Yes",
      description: "-",
      availableFor: "All",
      created: "2024-01-23",
    },
    {
      name: "Rakshabandhan",
      startDate: "2024-08-19",
      endDate: "2024-08-19",
      repeatsAnnually: "No",
      description: "-",
      availableFor: "All",
      created: "2024-01-23",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleApplyFilter = () => {
    setDialogOpen(false);
  };

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchQuery("");
  };

  const filteredData = holidaysData.filter((holiday) => {
    const holidayStartDate = new Date(holiday.startDate);
    const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDateRange =
      (!startDate || holidayStartDate >= new Date(startDate)) &&
      (!endDate || holidayStartDate <= new Date(endDate));
    return matchesSearch && matchesDateRange;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ padding: "16px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <Typography variant="h5" style={{ fontWeight: "600" }}>
            Holidays
          </Typography>
          <TextField
            placeholder="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "300px" }}
          />
        </div>

        <Paper style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "16px", gap: "8px" }}>
            <Button variant="contained" onClick={handleDialogOpen}>
              Time Period
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </Paper>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Repeats Annually</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Available For</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((holiday, index) => (
                  <TableRow key={index}>
                    <TableCell>{holiday.name}</TableCell>
                    <TableCell>{holiday.startDate}</TableCell>
                    <TableCell>{holiday.endDate}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          backgroundColor: holiday.repeatsAnnually === "Yes" ? "#2196F3" : "#4CAF50",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          fontWeight: "500",
                        }}
                      >
                        {holiday.repeatsAnnually}
                      </span>
                    </TableCell>
                    <TableCell>{holiday.description}</TableCell>
                    <TableCell>{holiday.availableFor}</TableCell>
                    <TableCell>{holiday.created}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Select Time Period</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                renderInput={(props) => <TextField {...props} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                renderInput={(props) => <TextField {...props} />}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleApplyFilter} variant="contained" color="primary">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}

export default Holidays;
