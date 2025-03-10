import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  TextField, 
  MenuItem, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper
} from "@mui/material";
import PaySlipCreate from "./PaySlipCreate";

const PayslipSearch = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users for the dropdown
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/allUsers",
        {
          headers: { Authorization: token },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch payslips based on selected user email
  const fetchPayslip = async () => {
    if (!selectedEmail) return alert("Please select an email!");

    try {
      setLoading(true);
      const subAdminEmail = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      const url = `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/api/payslip/by-email?subAdminEmail=${encodeURIComponent(
        subAdminEmail
      )}&userEmail=${encodeURIComponent(selectedEmail)}`;

      const response = await axios.get(url, {
        headers: { Authorization: token },
      });

      setPayslips(response.data.data);
    } catch (error) {
      console.error("Error fetching payslip:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{  padding: 20 }}>
    <div className="flex felx-row justify-between items-center">
      
      <h2 className="text-xl font-bold"> Payslip</h2>
<div className="flex flex-row gap-3 items-center justify-between">
    <span className=" mr-6">
      
      <PaySlipCreate />
    </span>
      

      <TextField
        select
        value={selectedEmail}
        onChange={(e) => setSelectedEmail(e.target.value)}
        variant="outlined"
              label="Select Employee Email"
    sx={{ width: "300px" }}
   
        >
        {users.map((user) => (
          <MenuItem key={user.email} value={user.email}>
            {user.email}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
    sx={{padding: "15px"}}
        onClick={fetchPayslip}
        disabled={loading}
        >
        {loading ? "Loading..." : "Get Payslip"}
      </Button>
          </div>
        </div>

      {payslips.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Pay Period</b></TableCell>
                <TableCell><b>Salary</b></TableCell>
                <TableCell><b>Net Salary</b></TableCell>
                <TableCell><b>Details</b></TableCell>
                <TableCell><b>Payslip</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payslips.map((payslip) => (
                <TableRow key={payslip.id}>
                  <TableCell>{payslip.name}</TableCell>
                  <TableCell>{payslip.email}</TableCell>
                  <TableCell>{payslip.payRunPeriod}</TableCell>
                  <TableCell>{payslip.salary}</TableCell>
                  <TableCell>{payslip.netSalary}</TableCell>
                  <TableCell>{payslip.details}</TableCell>
                  <TableCell>
                    <a href={payslip.paySlipUrl} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default PayslipSearch;
