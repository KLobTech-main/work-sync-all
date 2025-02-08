import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const Assets = () => {
  const [formData, setFormData] = useState({
    id: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      const response = await axios.post(
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/assets/create",
        data,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Asset created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating asset:", error);
      alert("Failed to create asset.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Paper
          elevation={3}
          style={{ padding: "20px", backgroundColor: "#fff" }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create Asset
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                // { label: "ID", name: "id" },
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
                  InputLabelProps: {
                    shrink: true,
                  },
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
            <Box mt={3} textAlign="center">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Assets;
