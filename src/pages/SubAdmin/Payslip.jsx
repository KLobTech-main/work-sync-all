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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from "@mui/material";
import PaySlipCreate from "./PaySlipCreate";

const PayslipSearch = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/allUsers",
        { headers: { Authorization: token } }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPayslip = async () => {
    if (!selectedEmail) {
      alert("Find Payslip by Email");
      return;
    }

    try {
      setLoading(true);
      const subAdminEmail = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      const url = `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/api/payslip/by-email?subAdminEmail=${encodeURIComponent(
        subAdminEmail
      )}&userEmail=${encodeURIComponent(selectedEmail)}`;

      const response = await axios.get(url, { headers: { Authorization: token } });

      setPayslips(response.data.data);
      setNoData(response.data.data.length === 0);
    } catch (error) {
      console.error("Error fetching payslip:", error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold">Payslip</h2>
        <div className="flex flex-row gap-3 items-center justify-between">
          <span className="mr-6">
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
            sx={{ padding: "15px" }}
            onClick={fetchPayslip}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Payslip"}
          </Button>
        </div>
      </div>

      {payslips.length === 0 && !loading && noData && (
        <div className="flex justify-center items-center h-40 text-xl font-semibold">
          Payslip Not Found
        </div>
      )}

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
                <TableCell><b>Payslip</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payslips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payslip) => (
                <TableRow key={payslip.id} onClick={() => { setSelectedPayslip(payslip); setOpenDialog(true); }}>
                  <TableCell>{payslip.name}</TableCell>
                  <TableCell>{payslip.email}</TableCell>
                  <TableCell>{payslip.payRunPeriod}</TableCell>
                  <TableCell>{payslip.salary}</TableCell>
                  <TableCell>{payslip.netSalary}</TableCell>
                  <TableCell>
                    <a href={payslip.paySlipUrl} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={payslips.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}

      {/* Dialog for displaying full payslip details */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Payslip Details</DialogTitle>
        <DialogContent>
          {selectedPayslip && (
            <div>
              <p><b>Name:</b> {selectedPayslip.name}</p>
              <p><b>Email:</b> {selectedPayslip.email}</p>
              <p><b>Pay Period:</b> {selectedPayslip.payRunPeriod}</p>
              <p><b>Salary:</b> {selectedPayslip.salary}</p>
              <p><b>Net Salary:</b> {selectedPayslip.netSalary}</p>
              <p><b>Details:</b> {selectedPayslip.details}</p>
              <p><b>Payslip:</b> <a href={selectedPayslip.paySlipUrl} target="_blank" rel="noopener noreferrer">Download</a></p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PayslipSearch;
