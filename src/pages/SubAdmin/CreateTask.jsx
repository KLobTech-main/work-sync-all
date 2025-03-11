import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from "@mui/material";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    assignedTo: "",
    title: "",
    description: "",
    deadLine: "",
    status: "Pending",
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/allUsers",
          { headers: { Authorization: token } }
        );
        setEmployees(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleCreateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const subAdminEmail = localStorage.getItem("email");
      const response = await axios.post(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/api/tasks/create-task?subAdminEmail=${subAdminEmail}`,
        { ...newTask, assignedBy: subAdminEmail },
        { headers: { Authorization: token } }
      );
      setTasks([...tasks, response.data]);
      setCreateDialogOpen(false);
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  return (
    <div className="p-5">
      <Button variant="contained" color="primary" onClick={() => setCreateDialogOpen(true)}>
        Create Task
      </Button>
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            margin="dense"
          />
          <TextField
            select
            fullWidth
            label="Assign To"
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            margin="dense"
          >
            {employees.map((emp) => (
              <MenuItem key={emp.email} value={emp.email}>{emp.email}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            multiline
            label="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            type="date"
            label="Deadline"
            value={newTask.deadLine}
            onChange={(e) => setNewTask({ ...newTask, deadLine: e.target.value })}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateTask}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Task;
