import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const API_URL = "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/todos";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('low');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: token },
      });
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const Email = localStorage.getItem("email");
  
  const addTask = async () => {
    if (newTask.trim() === '') return;

    const token = localStorage.getItem("jwtToken");
    const newTaskObj = {
      userEmail: Email,
      description: newTask,
      date: new Date().toISOString().split("T")[0],
      priority,
    };
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newTaskObj),
      });
      if (!response.ok) throw new Error("Failed to add todo");
      fetchTodos();
      setNewTask('');
      setPriority('low');
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const removeTask = async (id) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!response.ok) throw new Error("Failed to delete todo");
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPriority ? task.priority === filterPriority : true)
  );

  return (
    <div className="w-full p-3 mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Advanced To-Do List</h2>
      
      <div className="flex gap-4 mb-4">
        <TextField
          label="Search Task"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Filter by Priority</InputLabel>
          <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
      </div>
      
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
        Add Todo
      </Button>
      
      <TableContainer className="mb-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  <IconButton onClick={() => removeTask(task.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField label="Task" fullWidth value={newTask} onChange={(e) => setNewTask(e.target.value)} margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={addTask} color="primary">Add Task</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TodoList;
