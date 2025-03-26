import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import axios from 'axios';

const Task = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState(false);
  const [newDeadline, setNewDeadline] = useState('');
  const [reason, setReason] = useState('');
  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredTasks(allTasks.filter(task => task.status.toLowerCase().includes(filter.toLowerCase())));
    } else {
      setFilteredTasks(allTasks);
    }
  }, [filter, allTasks]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/tasks/get-given-tasks`,
        { headers: { Authorization: token }, params: { assignedTo: email } }
      );
      setAllTasks(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setAllTasks([]); // No tasks available
      } else {
        setError('Failed to fetch tasks. Please try again later.');
        setSnackbarMessage('Failed to fetch tasks. Please try again later.');
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/tasks/status`,
        null,
        { headers: { Authorization: token }, params: { taskId, email, status: newStatus } }
      );
      setSnackbarMessage(`Task status updated to ${newStatus}`);
      setSnackbarOpen(true);
      setAllTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task)));
    } catch (err) {
      setSnackbarMessage('Failed to update task status. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleDeadlineExtend = async () => {
    try {
      await axios.post(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/tasks/deadline-extension/request`,
        null,
        {
          headers: { Authorization: token },
          params: { taskId: selectedTask.id, newDeadline, reason }
        }
      );
      setSnackbarMessage('Deadline extension request sent successfully');
      setSnackbarOpen(true);
      setDeadlineDialogOpen(false);
    } catch (err) {
      setSnackbarMessage('Failed to request deadline extension');
      setSnackbarOpen(true);
    }
  };

  const openDeadlineDialog = (task) => {
    setSelectedTask(task);
    setDeadlineDialogOpen(true);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Task Management</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">{snackbarMessage}</Alert>
      </Snackbar>

      {/* Filter Tasks */}
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel>Filter by Status</InputLabel>
        <Select value={filter} onChange={e => setFilter(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="On Going">On Going</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Blocked">Blocked</MenuItem>
          <MenuItem value="On Hold">On Hold</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6">All Tasks</Typography>
      <TaskTable tasks={filteredTasks} loading={loading} onStatusChange={handleStatusChange} onExtendDeadline={openDeadlineDialog} />

      {/* Deadline Extend Dialog */}
      <Dialog open={deadlineDialogOpen} onClose={() => setDeadlineDialogOpen(false)}>
        <DialogTitle>Request Deadline Extension</DialogTitle>
        <DialogContent>
          <TextField fullWidth  type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} />
          <TextField fullWidth label="Reason" value={reason} onChange={e => setReason(e.target.value)} multiline rows={3} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeadlineDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeadlineExtend} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Table Component
const TaskTable = ({ tasks, loading, onStatusChange, onExtendDeadline }) => {
  if (loading) {
    return <Box sx={{ textAlign: 'center', margin: '20px' }}><CircularProgress /></Box>;
  }

  if (tasks.length === 0) {
    return <Typography>No tasks available.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Assigned By</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.assignedBy}</TableCell>
              <TableCell>
  {task.deadLine 
    ? new Date(task.deadLine).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) 
    : 'N/A'}
</TableCell>

              <TableCell>
  <Select  sx={{ width: '80%' }}
    value={task.status} 
    onChange={e => onStatusChange(task.id, e.target.value)}
  >
    <MenuItem value="" disabled>
      Select Status
    </MenuItem>
    <MenuItem  value="Pending">Pending</MenuItem>
    <MenuItem value="On Going">On Going</MenuItem>
    <MenuItem value="On Hold">On Hold</MenuItem>
    <MenuItem value="Completed">Completed</MenuItem>
    <MenuItem value="Blocked">Blocked</MenuItem>
  </Select>
</TableCell>

              <TableCell>
                <Button onClick={() => onExtendDeadline(task)}>Extend Deadline</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Task;
