import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const CreateTask = ({ onTaskCreate }) => {
  const [open, setOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    assignedBy: "",
    assignedTo: "",
    title: "",
    description: "",
    deadline: "",
    status: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onTaskCreate(taskData);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" sx={{width:'150px',height:'55px'}} color="primary" onClick={handleOpen}>
        Create Task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Assigned By"
            name="assignedBy"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Assigned To"
            name="assignedTo"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Deadline"
            name="deadline"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            label="Status"
            name="status"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateTask;
