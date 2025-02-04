import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Button,
  Box,
  Dialog,
  TextField,
  CircularProgress,
} from "@mui/material";
import InnerSidbar from "../../Layout/InnerSidbar";
import Profile from "../../Layout/Profile";
import axios from "axios";

function Address() {
  const [open, setOpen] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("jwtToken");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email && token) {
      setLoading(true);
      axios
        .get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/users/get/user?email=${email}`,
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((response) => {
          const addressDetails = response.data.addressDetails;
          if (addressDetails) {
            setCurrentAddress(addressDetails.currentAddress || "");
            setPermanentAddress(addressDetails.permanentAddress || "");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching address:", err);
          setError("Failed to fetch address details.");
          setLoading(false);
        });
    }
  }, [email, token]);

  const handleOpen = (type) => {
    setAddressType(type);
    setInputAddress(type === "Current" ? currentAddress : permanentAddress);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleSubmit = () => {
    if (!inputAddress.trim()) {
      setError("Address cannot be empty.");
      return;
    }

    const data = {
      currentAddress: addressType === "Current" ? inputAddress : currentAddress,
      permanentAddress: addressType === "Permanent" ? inputAddress : permanentAddress,
    };

    setLoading(true);
    axios
      .post(
        `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/users/address?email=${email}`,
        data,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        if (addressType === "Current") setCurrentAddress(inputAddress);
        if (addressType === "Permanent") setPermanentAddress(inputAddress);
        setOpen(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error updating address:", err);
        setError("Failed to update address. Please try again.");
        setLoading(false);
      });
  };

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />
        <div className="flex-1 p-6 bg-gray-50">
          <Typography variant="h6" className="mb-6 font-semibold text-gray-800">
            Address Details
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Paper elevation={1} className="p-4 rounded-lg mb-6">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-800">Address Type</th>
                      <th className="px-4 py-2 text-left text-gray-800">Address</th>
                      <th className="px-4 py-2 text-left text-gray-800">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">Permanent Address</td>
                      <td className="px-4 py-2 text-gray-600">
                        {permanentAddress || "Permanent address not added."}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpen("Permanent")}
                        >
                          {permanentAddress ? "Edit" : "Add"}
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">Current Address</td>
                      <td className="px-4 py-2 text-gray-600">
                        {currentAddress || "Current address not added."}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpen("Current")}
                        >
                          {currentAddress ? "Edit" : "Add"}
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Paper>
            </>
          )}
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className="p-6 w-[400px]  max-w-md bg-white rounded-md ">
        <div className="flex  flex-row   justify-between">

          <Typography
            variant="h6"
            className="mb-6 font-semibold text-gray-800 top-0 left-0"
          >
            {addressType} Address
          </Typography>
          <Button
            className="absolute top-0 right-0 p-2"
            onClick={handleClose}
          >
            X
          </Button>
        </div>
        <div className="p-4">

          <TextField
            fullWidth
            label={`${addressType} Address`}
            variant="outlined"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            error={!!error}
            helperText={error}
            className="mt-12"
          />
        </div>
          <div className="flex justify-end gap-2 ">
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Address;
