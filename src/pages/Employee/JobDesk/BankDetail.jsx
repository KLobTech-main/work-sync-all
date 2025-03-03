import React, { useState, useEffect } from "react";
import InnerSidbar from "../../../components/Layout/EmployeeLayout/InnerSidbar";
import Profile from "../../../components/Layout/EmployeeLayout/Profile";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function BankDetail() {
  const [open, setOpen] = useState(false);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      setLoading(true);
      axios
        .get(
          `${baseUrl}/api/users/get/user?email=${email}`,
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((response) => {
          if (response.data && response.data.bankDetails) {
            setBankDetails(response.data.bankDetails);
          }
        })
        .catch((error) => {
          console.error("Error fetching bank details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [email, token]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!accountHolderName || !accountType || !accountNumber || !ifscCode || !bankName) {
      setError("All fields are required.");
      return;
    }

    const requestData = {
      accountHolderName,
      accountType,
      accountNumber,
      ifscCode,
      bankName,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/users/bankDetails?email=${email}`,
        requestData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setOpen(false);
      setBankDetails(response.data.bankDetails);
    } catch (err) {
      console.error("Error adding bank details:", err.response || err);
      setError("Failed to add bank details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />
        <div className="flex-1 p-8 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h5" className="font-semibold">
              Bank Details
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add
            </Button>
          </div>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : bankDetails ? (
            <TableContainer component={Paper} className="mb-6">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell><strong>Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Account Holder Name</TableCell>
                    <TableCell>{bankDetails.accountHolderName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Account Type</TableCell>
                    <TableCell>{bankDetails.accountType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Account Number</TableCell>
                    <TableCell>{bankDetails.accountNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IFSC Code</TableCell>
                    <TableCell>{bankDetails.ifscCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bank Name</TableCell>
                    <TableCell>{bankDetails.bankName}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" className="text-gray-500 mb-6">
              Bank details not added yet.
            </Typography>
          )}

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Bank Details</DialogTitle>
            <DialogContent>
              <form className="space-y-4">
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
                <TextField
                  label="Account Holder Name"
                  variant="outlined"
                  fullWidth
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  required
                />
                <TextField
                  label="Account Type"
                  variant="outlined"
                  fullWidth
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  required
                />
                <TextField
                  label="Account Number"
                  variant="outlined"
                  fullWidth
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
                <TextField
                  label="IFSC Code"
                  variant="outlined"
                  fullWidth
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  required
                />
                <TextField
                  label="Bank Name"
                  variant="outlined"
                  fullWidth
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                className="bg-blue-500"
                disabled={loading}
                >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default BankDetail;
