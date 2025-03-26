import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as JobDeskIcon,
  EventAvailable as LeaveIcon,
  CalendarToday as AttendanceIcon,
  BeachAccess as HolidayIcon,
  ExpandLess,
  ExpandMore,
  FiberManualRecord as BulletIcon,
  MeetingRoom as MeetingIcon, 
  ConfirmationNumber as TicketIcon, 
  Task as TaskIcon, 
} from '@mui/icons-material';

const Sidebar = () => {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const handleLeaveClick = () => {
    setLeaveOpen(!leaveOpen);
  };

  const handleAttendanceClick = () => {
    setAttendanceOpen(!attendanceOpen);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#0D1B2A', 
          color: '#E0F2F1', 
          overflowY: 'auto',
          scrollbarWidth: 'none', 
          '&::-webkit-scrollbar': {
            display: 'none', 
          },
        },
      }}
    >
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#1E3A8A', 
          }}
        >
          Work Sync
        </Typography>
      </div>
      <List>
        <NavLink to="/" className="nav-link">
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon sx={{ color: '#1E3A8A' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: '#E0F2F1' }} />
          </ListItem>
        </NavLink>
        <NavLink to="/jobdesk" className="nav-link">
          <ListItem button>
            <ListItemIcon>
              <JobDeskIcon sx={{ color: '#1E3A8A' }} />
            </ListItemIcon>
            <ListItemText primary="Job Desk" sx={{ color: '#E0F2F1' }} />
          </ListItem>
        </NavLink>

        <ListItem button onClick={handleLeaveClick}>
          <ListItemIcon>
            <LeaveIcon sx={{ color: '#1E3A8A' }} />
          </ListItemIcon>
          <ListItemText primary="Leave" sx={{ cursor:'pointer', color: '#E0F2F1' }} />
          {leaveOpen ? (
            <ExpandLess sx={{ color: '#3B82F6' }} />
          ) : (
            <ExpandMore sx={{ color: '#3B82F6' }} />
          )}
        </ListItem>
        <Collapse in={leaveOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink to="/leave/request" className="nav-link">
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BulletIcon sx={{ color: '#1E3A8A', fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary="Leave Request" sx={{ color: '#E0F2F1' }} />
              </ListItem>
            </NavLink>
            <NavLink to="/leave/leave-request-cancel" className="nav-link">
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BulletIcon sx={{ color: '#1E3A8A', fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary="Leave Request Cancel" sx={{ color: '#E0F2F1' }} />
              </ListItem>
            </NavLink>
            <NavLink to="/leave/holidays" className="nav-link">
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BulletIcon sx={{ color: '#1E3A8A', fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary="Holidays" sx={{ color: '#E0F2F1' }} />
              </ListItem>
            </NavLink>
            <NavLink to="/leave/summary" className="nav-link">
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BulletIcon sx={{ color: '#1E3A8A', fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary="Summary" sx={{ color: '#E0F2F1' }} />
              </ListItem>
            </NavLink>
          </List>
        </Collapse>

        <ListItem button onClick={handleAttendanceClick}>
          <ListItemIcon>
            <AttendanceIcon sx={{  color: '#1E3A8A' }} />
          </ListItemIcon>
          <ListItemText primary="Attendance" sx={{cursor:'pointer', color: '#E0F2F1' }} />
          {attendanceOpen ? (
            <ExpandLess sx={{ color: '#3B82F6' }} />
          ) : (
            <ExpandMore sx={{ color: '#3B82F6' }} />
          )}
        </ListItem>
        <Collapse in={attendanceOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink to="/attendance/daily-log" className="nav-link">
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BulletIcon sx={{ color: '#1E3A8A', fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary="Daily Log" sx={{ color: '#E0F2F1' }} />
              </ListItem>
            </NavLink>
            <NavLink to="/attendance/request" className="nav-link">
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BulletIcon sx={{ color: '#1E3A8A', fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary="Attendance Request" sx={{ color: '#E0F2F1' }} />
              </ListItem>
            </NavLink>
           
            <NavLink to="/attendance/summary" className="nav-link">
              <ListItem button sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BulletIcon sx={{ color: '#1E3A8A', fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary="Summary" sx={{ color: '#E0F2F1' }} />
              </ListItem>
            </NavLink>
          </List>
        </Collapse>

        <NavLink to="/meeting" className="nav-link">
          <ListItem button>
            <ListItemIcon>
              <MeetingIcon sx={{ color: '#1E3A8A' }} />
            </ListItemIcon>
            <ListItemText primary="Meeting" sx={{ color: '#E0F2F1' }} />
          </ListItem>
        </NavLink>

        
        <NavLink to="/ticket" className="nav-link">
          <ListItem button>
            <ListItemIcon>
              <TicketIcon sx={{ color: '#1E3A8A' }} />
            </ListItemIcon>
            <ListItemText primary="Ticket" sx={{ color: '#E0F2F1' }} />
          </ListItem>
        </NavLink>

       
        <NavLink to="/task" className="nav-link">
          <ListItem button>
            <ListItemIcon>
              <TaskIcon sx={{ color: '#1E3A8A' }} />
            </ListItemIcon>
            <ListItemText primary="Task" sx={{ color: '#E0F2F1' }} />
          </ListItem>
        </NavLink>
        <NavLink to="/about-project" className="nav-link">
          <ListItem button>
            <ListItemIcon>
              <JobDeskIcon sx={{ color: '#1E3A8A' }} />
            </ListItemIcon>
            <ListItemText primary="Project" sx={{ color: '#E0F2F1' }} />
          </ListItem>
        </NavLink>
        <NavLink to="/todo-list" className="nav-link">
          <ListItem button>
            <ListItemIcon>
              <JobDeskIcon sx={{ color: '#1E3A8A' }} />
            </ListItemIcon>
            <ListItemText primary="Todo" sx={{ color: '#E0F2F1' }} />
          </ListItem>
        </NavLink>
      </List>
    </Drawer>
  );
};

export default Sidebar;
