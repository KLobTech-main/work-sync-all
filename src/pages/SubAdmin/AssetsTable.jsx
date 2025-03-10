
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
const Assets = () => {
  const [open, setOpen] = useState(false); // Modal open state
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    assetName: "",
    assetsCode: "",
    serialNo: "",
    isWorking: "",
    type: "",
    issuedDate: "",
    note: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open Modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Close Modal
  const handleClose = () => {
    setOpen(false);
    setFormData({ // Reset form on close
      email: "",
      name: "",
      assetName: "",
      assetsCode: "",
      serialNo: "",
      isWorking: "",
      type: "",
      issuedDate: "",
      note: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminEmail = localStorage.getItem("email");
    const authToken = localStorage.getItem("token");

    if (!adminEmail || !authToken) {
      alert("Missing admin email or authentication token.");
      return;
    }

    const data = {
      adminEmail,
      asset: {
        ...formData,
      },
    };

    try {
      await axios.post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/api/assets/create",
        data,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Asset created successfully!");
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating asset:", error);
      alert("Failed to create asset.");
    }
  };

  return (
    <>
      <Box  >
        <Button variant="contained" sx={{height:"50px"}} color="primary" onClick={handleOpen}>
          Create Asset
        </Button>
      </Box>

      {/* Asset Form Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Asset</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "Email", name: "email" },
                { label: "Name", name: "name" },
                { label: "Asset Name", name: "assetName" },
                { label: "Assets Code", name: "assetsCode" },
                { label: "Serial Number", name: "serialNo" },
                { label: "Is Working", name: "isWorking" },
                { label: "Type", name: "type" },
                {
                  label: "Issued Date",
                  name: "issuedDate",
                  type: "date",
                  InputLabelProps: { shrink: true },
                },
                { label: "Note", name: "note" },
              ].map((field, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    type={field.type || "text"}
                    InputLabelProps={field.InputLabelProps || {}}
                    required
                  />
                </Grid>
              ))}
            </Grid>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Assets;
