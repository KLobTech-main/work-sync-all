import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

function CreateSubadmin() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subAdminPassword: "",
    subAdminEmail: "",
    subAdminAssignedUserEmail: "",
    approvedByAdmin: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const adminEmail = localStorage.getItem("email");

    if (!token || !adminEmail) {
      alert("Missing token or admin email!");
      return;
    }

    const url = `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin/api/sub-admin-register?adminEmail=${encodeURIComponent(adminEmail)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:token,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Sub-admin created successfully!");
      setOpen(false);
      setFormData({
        subAdminPassword: "",
        subAdminEmail: "",
        subAdminAssignedUserEmail: "",
        approvedByAdmin: true,
      });
    } else {
      alert(`Error: ${result.message || "Failed to create sub-admin"}`);
    }
  };

  return (
    <div>
      <Button variant="contained" sx={{padding:"14px"}} color="primary" onClick={() => setOpen(true)}>
        Create Subadmin
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Subadmin</DialogTitle>
        <DialogContent>
          <TextField
            label="Subadmin Email"
            name="subAdminEmail"
            value={formData.subAdminEmail}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Subadmin Password"
            name="subAdminPassword"
            type="password"
            value={formData.subAdminPassword}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Assigned User Email"
            name="subAdminAssignedUserEmail"
            value={formData.subAdminAssignedUserEmail}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateSubadmin;
