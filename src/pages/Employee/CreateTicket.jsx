
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { AddCircleOutline as AddIcon } from '@mui/icons-material';
import axios from 'axios';

const Tickets = () => {
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: '',
    status: 'OPEN',
  });
  
  const [openDialog, setOpenDialog] = useState(false);

  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateTicket = async () => {
    const ticketData = {
      email: email,
      title: newTicket.title,
      description: newTicket.description,
      priority: newTicket.priority,
      status: newTicket.status,
    };

    try {
      await axios.post(
        'https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/tickets',
        ticketData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      setNewTicket({ title: '', description: '', priority: '', status: 'OPEN' });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again later.');
    }
  };

  return (
    <Box sx={{ width:"100%" ,display: 'flex', flexDirection: 'row', alignItems: 'center' ,justifyContent:"space-between"}}>

      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Tickets
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
      >
        Create Ticket
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create a New Ticket</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={12}>
              <TextField
                label="Ticket Title"
                variant="outlined"
                fullWidth
                name="title"
                value={newTicket.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={newTicket.priority}
                  onChange={handleChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                name="description"
                value={newTicket.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTicket} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tickets;