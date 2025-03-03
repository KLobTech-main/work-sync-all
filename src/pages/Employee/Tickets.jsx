import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { AddCircleOutline as AddIcon } from '@mui/icons-material';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Tickets = () => {
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: '',
    status: 'OPEN',
  });

  const [tickets, setTickets] = useState([]);

  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (email) {
      axios
        .get(`${baseUrl}/api/tickets/${email}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setTickets(response.data);
        })
        .catch((error) => {
          console.error('Error fetching tickets:', error);
        });
    }
  }, [email, token]);

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
      status: newTicket.status,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/tickets`,
        ticketData,
        {
         headers: {
  Authorization: token,
  'Content-Type': 'application/json'
}

        }
      );

      setTickets([...tickets, response.data]);
      setNewTicket({ title: '', description: '', priority: '', status: 'OPEN' });
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again later.');
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Tickets
      </Typography>

      <Box sx={{ marginBottom: '30px' }}>
        <Typography variant="h6">Create a New Ticket</Typography>
        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ticket Title"
              variant="outlined"
              fullWidth
              name="title"
              value={newTicket.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Priority"
              variant="outlined"
              fullWidth
              name="priority"
              value={newTicket.priority}
              onChange={handleChange}
            />
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
        <Button
          sx={{ marginTop: '20px' }}
          variant="contained"
          color="primary"
          onClick={handleCreateTicket}
          startIcon={<AddIcon />}
        >
          Create Ticket
        </Button>
      </Box>

      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        All Tickets
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tickets;
