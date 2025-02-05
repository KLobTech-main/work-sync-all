import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { AddCircleOutline as AddIcon } from '@mui/icons-material';
import axios from 'axios';

const Task = () => {
  const [newTask, setNewTask] = useState({
    assignedTo: '',
    title: '',
    description: '',
    deadLine: '',
    status: 'On Going',
  });
  const [allTasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');
  console.log(allTasks)
  
  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/users/get-all-users',
        {
          headers: { Authorization: token },
          params: { email },
        }
      );
      const emailList = response.data.map((user) => user.email); 
      setUsers(emailList);
    } catch (err) {
      console.error('Error fetching users:', err.response || err.message);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const [assignedByResponse, assignedToResponse] = await Promise.all([

        axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/tasks/get-assigned-tasks`,
          { headers: { Authorization: token }, params: { email } }
        ),
        axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/tasks/get-given-tasks`,
          { headers: { Authorization: token }, params: { assignedTo: email } }
        ),
      ]);

      const assignedByTasks = assignedByResponse.data.tasks.map((task) => ({
        ...task,
        type: 'Assigned By Me',
      }));
      const assignedToTasks = assignedToResponse.data.tasks.map((task) => ({
        ...task,
        type: 'Assigned To Me',
      }));
      setAllTasks([...assignedByTasks, ...assignedToTasks]);
    } catch (err) {
      console.error('Error fetching tasks:', err.response || err.message);
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.assignedTo || !newTask.title || !newTask.description) {
      setError('Please fill in all required fields.');
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarOpen(true);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post(
        'https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/tasks/create-task',
        { ...newTask, assignedBy: email },
        { headers: { Authorization: token } }
      );

      fetchTasks();
      setNewTask({ assignedTo: '', title: '', description: '', deadLine: '', status: 'On Going' });
    } catch (err) {
      console.error('Error creating task:', err.response || err.message);
      setError('Failed to create task. Please try again.');
      setSnackbarMessage('Failed to create task. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAssignedToChange = (e) => {
    const value = e.target.value;
    setNewTask((prevState) => ({ ...prevState, assignedTo: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Task Management
      </Typography>

      {error && (
        <Typography color="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Typography>
      )}

      <Box sx={{ marginBottom: '30px' }}>
        <Typography variant="h6">Create a New Task</Typography>
        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={newTask.assignedTo}
                onChange={handleAssignedToChange}
                name="assignedTo"
                renderValue={(selected) => selected}
              >
                {users.map((email) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Deadline"
              variant="outlined"
              fullWidth
              name="deadLine"
              value={newTask.deadLine}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              name="title"
              value={newTask.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={newTask.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={newTask.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="On Going">On Going</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          sx={{ marginTop: '20px' }}
          variant="contained"
          color="primary"
          onClick={handleCreateTask}
          startIcon={<AddIcon />}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        All Tasks
      </Typography>
      <TaskTable tasks={allTasks} loading={loading} />
    </Box>
  );
};

const TaskTable = ({ tasks, loading }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', margin: '20px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return <Typography>No tasks found.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Assigned By</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>{task.assignedBy}</TableCell>
              <TableCell>{task.deadLine || 'N/A'}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Task;
