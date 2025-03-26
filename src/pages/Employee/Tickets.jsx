import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import CreateTicket from './CreateTicket';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(false);

  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (email) {
      axios
        .get(`https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/tickets/${email}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setTickets(response.data);
          setError(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError(true);
          } else {
            console.error('Error fetching tickets:', error);
          }
        });
    }
  }, [email, token]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.patch(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/tickets/status?ticketId=${ticketId}&status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
     
      <CreateTicket />

      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        All Tickets
      </Typography>

      {error ? (
        <Typography variant="body1" color="error">
          No tickets found.
        </Typography>
      ) : (
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
                  <TableCell>
                    <Select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="OPEN">OPEN</MenuItem>
                      <MenuItem value="CLOSE">CLOSE</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Tickets;
