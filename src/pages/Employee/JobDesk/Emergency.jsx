import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Button,
  Box,
  Dialog,
  TextField,
  CircularProgress,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import InnerSidbar from "../../../components/Layout/EmployeeLayout/InnerSidbar";
import Profile from "../../../components/Layout/EmployeeLayout/Profile";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Emergency() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  const fetchEmergencyContacts = () => {
    if (!email || !token) return;

    setLoading(true);
    axios
      .get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/get/user?email=${email}`,
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        const data = response.data;
        if (data && data.emergencyContactDetails) {
          setEmergencyContacts(data.emergencyContactDetails);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching emergency contacts:", err);
        setLoading(false);
      });
  };

  const handleOpen = () => {
    setName("");
    setPhone("");
    setRelation("");
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleSave = () => {
    if (!name || !phone || !relation) {
      setError("All fields are required.");
      return;
    }

    const data = {
      emergencyContactNo: phone,
      emergencyContactName: name,
      relation,
    };

    setLoading(true);
    axios
      .post(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/emergency/contact?email=${email}`,
        data,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        fetchEmergencyContacts(); 
        handleClose();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error saving emergency contact:", err);
        setError("Failed to save contact. Please try again.");
        setLoading(false);
      });
  };

  const handleDeleteDialogOpen = (contactName) => {
    setContactToDelete(contactName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  const handleDelete = () => {
    if (!email || !token || !contactToDelete) return;

    setDeleting(contactToDelete);
    axios
      .delete(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/emergency/contact?email=${email}&contactName=${contactToDelete}`,
        {
          headers: { Authorization: token },
        }
      )
      .then(() => {
        fetchEmergencyContacts(); 
        setDeleting(null);
        setDeleteDialogOpen(false); 
      })
      .catch((err) => {
        console.error("Error deleting emergency contact:", err);
        setDeleting(null);
        setDeleteDialogOpen(false); 
      });
  };

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />
        <div className="flex-1 p-6 bg-gray-50">
          <Typography variant="h6" className="mb-6 font-semibold text-gray-800">
            Emergency Contact
          </Typography>

          <Paper elevation={1} className="p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <Box className="w-10 h-10 bg-blue-100 rounded-full flex justify-center items-center">
                <PersonAddAltIcon className="text-blue-500" />
              </Box>
              <div className="ml-4">
                <Typography variant="body1" className="text-gray-600">
                  Emergency Contact
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  You can add multiple contacts
                </Typography>
              </div>
            </div>
            <Button variant="contained" color="primary" size="small" onClick={handleOpen}>
              Add
            </Button>
          </Paper>

          {loading ? (
            <div className="flex justify-center mt-6">
              <CircularProgress />
            </div>
          ) : emergencyContacts.length > 0 ? (
            <div className="mt-6">
              {emergencyContacts.map((contact, index) => (
                <Paper
                  key={index}
                  className="p-4 rounded-lg mb-4 flex justify-between items-center"
                >
                  <div>
                    <Typography variant="body1" className="text-gray-800">
                      Name: {contact.emergencyContactName}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Phone: {contact.emergencyContactNo}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Relation: {contact.relation}
                    </Typography>
                  </div>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteDialogOpen(contact.emergencyContactName)}
                    disabled={deleting === contact.emergencyContactName}
                  >
                    {deleting === contact.emergencyContactName ? (
                      <CircularProgress size={24} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </Paper>
              ))}
            </div>
          ) : (
            <Typography className="text-gray-500 text-center mt-6">
              No emergency contacts added yet.
            </Typography>
          )}
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className="p-6 w-full max-w-md bg-white rounded-md">
          <Typography variant="h6" className="mb-6 font-semibold text-gray-800">
            Add Emergency Contact
          </Typography>
          <div className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!error && !name}
              helperText={!!error && !name && "Name is required"}
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!error && !phone}
              helperText={!!error && !phone && "Phone number is required"}
            />
            <TextField
              fullWidth
              label="Relation"
              variant="outlined"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              error={!!error && !relation}
              helperText={!!error && !relation && "Relation is required"}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this contact?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Emergency;
