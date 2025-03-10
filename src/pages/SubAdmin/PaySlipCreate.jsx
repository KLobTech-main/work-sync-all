import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";

const PaySlipCreate = () => {
  const [formData, setFormData] = useState({
    email: "",
    salary: "",
    netSalary: "",
    details: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");
  const subAdminEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/allUsers",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const emails = response.data.data.map((user) => user.email);
        setEmployeeEmails(emails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!startDate || !endDate) {
      setMessage("Please select both start and end dates.");
      setLoading(false);
      return;
    }

    const payRunPeriod = `${startDate} to ${endDate}`;

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append(
        "payslipRequest",
        JSON.stringify({
          adminEmail: subAdminEmail,
          paySlip: { ...formData, payRunPeriod },
        })
      );

      await axios.post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin/api/payslip",
        formDataObj,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Payslip created successfully!");
    } catch (error) {
      console.error("Error creating payslip:", error);
      setMessage("Failed to create payslip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="contained" sx={{ padding: "15px" }} color="primary" onClick={handleOpen}>
        Create Payslip
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Payslip</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label="Employee Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            >
              {employeeEmails.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label=" Payrun Period Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Payrun Period End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              fullWidth
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Net Salary"
              name="netSalary"
              value={formData.netSalary}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="description"
              name="details"
              value={formData.details}
              onChange={handleChange}
              margin="normal"
            />
            <input type="file" onChange={handleFileChange} required />

            {message && (
              <Typography color="secondary" style={{ marginTop: 10 }}>
                {message}
              </Typography>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Payslip"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaySlipCreate;