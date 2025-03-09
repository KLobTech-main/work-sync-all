import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Button,
  Typography,
  Menu,
  Snackbar,
  Alert,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState({ data: [] });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showAllInfoDialogOpen, setShowAllInfoDialogOpen] = useState(false);
  const [isSalaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [newSalary, setNewSalary] = useState("");

  const [payRunPeriod, setPayRunPeriod] = useState("");
  const [houseRentAllowance, setHouseRentAllowance] = useState("");
  const [conveyanceAllowance, setConveyanceAllowance] = useState("");
  const [specialAllowance, setSpecialAllowance] = useState("");
  const [medicalAllowance, setMedicalAllowance] = useState("");
  const [salaryOverviewDialogOpen, setSalaryOverviewDialogOpen] =
    useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        setSnackbarOpen(true); 
          const response = await fetch(
          "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/allUsers",
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {

          const data = await response.json();
          console.log("Fetched Employees:", data);
          setEmployees(data); // Ensure you're storing the entire response
       
          } else {
          console.error("Failed to fetch employees");
          throw new Error("Failed to fetch employees");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        ([]); // Reset employees state
      }  finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };
    
    fetchEmployees();
  }, []);
  console.log(employees)
  const handleClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    if (selectedEmployee) {
      if (action === "edit") {
        setEditEmployee(selectedEmployee);
        setEditDialogOpen(true);
      } else if (action === "showAllInfoedit") {
        setShowAllInfoDialogOpen(true);
      } else if (action === "salary") {
        setSalaryDialogOpen(true); // Open the salary popup
      } else if (action === "salaryDetails") {
        console.log("Opening salary overview dialog"); // Debugging log
        setSalaryOverviewDialogOpen(true); // Open the salary overview popup
      } else {
        navigate(`/subadmin/employee/${selectedEmployee.email}/${action}`, {
          state: { employee: selectedEmployee },
        });
      }
    }
    setAnchorEl(null);
  };

  const handleSalarySubmit = () => {
    const adminEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    // Debugging: Check values from localStorage
    console.log("Admin Email:", adminEmail);
    console.log("Token:", token);

    // Check if selectedEmployee is available
    console.log("Selected Employee:", selectedEmployee);

    if (!selectedEmployee || !selectedEmployee.email) {
      alert("No employee selected.");
      return;
    }

    axios
      .post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin/api/salary",
        {
          adminEmail,
          email: selectedEmployee.email,
          salary: newSalary,
        },
        {
          headers: {
            Authorization: token, // Add the token here
          },
        }
      )
      .then((response) => {
        console.log("Response:", response); // Log the response for debugging
        if (response) {
          alert("Salary updated successfully!");
        } else {
          alert("Failed to update salary: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating salary:", error);
        alert("An error occurred while updating salary: " + error.message);
        console.log(selectedEmployee.email);
        console.log(typeof newSalary);
        console.log(adminEmail);
      })
      .finally(() => {
        setSalaryDialogOpen(false); // Close the popup after submission
        setNewSalary(""); // Clear the input field
      });
  };

  const handleEditChange = (field, value) => {
    setEditEmployee({ ...editEmployee, [field]: value });
  };

  // const handleEditSave = () => {
  //   ((prevEmployees) =>
  //     prevEmployees.map((emp) =>
  //       emp.id === editEmployee.id ? editEmployee : emp
  //     )
  //   );
  //   setEditDialogOpen(false);
  // };
  const handleEditSave = async () => {
    try {
      // Get adminEmail and authorization token from localStorage
      const adminEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");

      // Prepare the API payload
      const payload = {
        subAdminEmail: adminEmail, // From localStorage
        usersCurrentEmail: editEmployee.email, // From employee data
        userName: editEmployee.name, // From form input
        // role: editEmployee.role, // From form input
        userMobileNo: editEmployee.mobile, // From form input
        // salary: editEmployee.salary ? [editEmployee.salary] : [], // From form input
        usersNewEmail: editEmployee.newEmail, // From form input
      };

      // Make the PUT request
      const response = await axios.put(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/user",
        payload,
        {
          headers: {
            Authorization: authToken, // Add token for authorization
            "Content-Type": "application/json",
          },
        }
      );

      // Handle response
      if (response.status === 200 || response.status === 204) {
        // Update local state if necessary
        ((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.email === editEmployee.email ? { ...editEmployee } : emp
          )
        );
        setEditDialogOpen(false); // Close the dialog
        alert("Employee updated successfully!");
        
        
        console.log(editEmployee.mobileNo);
      } else {
        alert("Failed to update employee. Please try again.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("An error occurred while updating the employee.");
    }
  };

  const handleCloseShowAllInfoDialog = () => {
    setShowAllInfoDialogOpen(false);
  };

  const filteredEmployees = (Array.isArray(employees.data) ? employees.data : []).filter((employee) =>
    employee.name?.toLowerCase().includes(search.toLowerCase())
  );
  
  console.log("Employees Data:", employees, typeof employees);

  const employeesPerPage = 10;
  const startIndex = (page - 1) * employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + employeesPerPage
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page * employeesPerPage < filteredEmployees.length) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSalaryOverviewSubmit = () => {
    const adminEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    const salaryDetails = {
      payRunPeriod,
      houseRentAllowance,
      conveyanceAllowance,
      specialAllowance,
      medicalAllowance,
    };

    axios
      .post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/admin/user/salary",
        {
          adminEmail,
          userEmail: selectedEmployee.email, // Use the selected employee's email
          salaryDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Add token here
          },
        }
      )
      .then((response) => {
        console.log("Response:", response);
        if (response) {
          alert("Salary overview submitted successfully!");
        } else {
          alert("Failed to submit salary overview: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting salary overview:", error);
        alert(
          "An error occurred while submitting salary overview: " + error.message
        );
      })
      .finally(() => {
        setSalaryOverviewDialogOpen(false); // Close the popup after submission
        setPayRunPeriod("");
        setHouseRentAllowance("");
        setConveyanceAllowance("");
        setSpecialAllowance("");
        setMedicalAllowance(""); // Clear input fields
      });
  };
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  if(loading){
    return(
      <>
    <Snackbar
      open={snackbarOpen}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
        Loading
      </Alert>
    </Snackbar>
      </>
    )
  }
  return (
   
        <>
          <div className="p-6 overflow-auto h-screen">

            <Box sx={{ display: "flex",alignItems:"center", justifyContent: "space-between", mb: 2 }}>
             <Typography variant="h4" gutterBottom>
             Employee Details
                    </Typography>
              <TextField
                label="Search by Name"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                sx={{ width: 400 }}
              />
            </Box>
            {filteredEmployees.length === 0 ? (
              <Typography
                variant="h6"
                color="error"
                align="center"
                sx={{ mt: 2 }}
              >
                No data found
              </Typography>
            ) : (
              <Paper className="mt-4">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                        <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Name
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Email
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Role
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Joining Date
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentEmployees.map((employee, index) => (
                        <TableRow key={employee.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>{employee.joiningDate}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(e) => handleClick(e, employee)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleActionSelect("showAllInfoedit")
                                }
                              >
                                Show All Info
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleActionSelect("edit")}
                              >
                                Edit Info
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleActionSelect("leave")}
                              >
                                Leave
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleActionSelect("task")}
                              >
                                Task
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleActionSelect("attendance")}
                              >
                                Attendance
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleActionSelect("salary")}
                              >
                                Edit Salary 
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleActionSelect("salaryDetails")
                                }
                              >
                                Edit Allowance
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={page * employeesPerPage >= filteredEmployees.length}
              >
                Next
              </Button>
            </Box>

            {/* Dialog to Edit Employee */}
            <Dialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
            >
              <DialogTitle>Edit Employee Information</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  value={editEmployee?.name || ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Role"
                  type="text"
                  fullWidth
                  value={editEmployee?.role || ""}
                  onChange={(e) => handleEditChange("role", e.target.value)}
                />

                <TextField
                  margin="dense"
                  label="Mobile Number"
                  type="text"
                  fullWidth
                  value={editEmployee?.mobileNo || ""}
                  onChange={(e) => handleEditChange("mobileNo", e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  value={editEmployee?.email || ""}
                  onChange={(e) => handleEditChange("email", e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleEditSave}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            {/* Dialog to Show All Employee Information */}
            <Dialog
              open={showAllInfoDialogOpen}
              onClose={handleCloseShowAllInfoDialog}
            >
              <DialogTitle>Employee Information</DialogTitle>
              <DialogContent>
                {selectedEmployee ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>ID</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.id || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Name</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.name || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Email</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.email || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Mobile</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.mobileNo || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Role</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.role || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Department</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.department || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>designation</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.designation || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>DOB</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.dob || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Current Address</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.addressDetails?.currentAddress ||
                              "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Permanent Address</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.addressDetails
                              ?.permanentAddress || "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Emergency Contacts</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.emergencyContactDetails?.length >
                            0
                              ? selectedEmployee.emergencyContactDetails.map(
                                  (contact, index) => (
                                    <div key={index}>
                                      {contact.relation}:{" "}
                                      {contact.emergencyContactName} (
                                      {contact.emergencyContactNo})
                                    </div>
                                  )
                                )
                              : "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableCell colSpan={2}>
                          <strong>Leave: </strong>
                        </TableCell>
                        <TableRow>
                          <TableCell>
                            <strong>Sick Leave</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.allLeaves?.leaveTypeBalance.Sick || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Casual Leave</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.allLeaves?.leaveTypeBalance.Casual || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Paternity Leave</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.allLeaves?.leaveTypeBalance.Paternity || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Optional Leave</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.allLeaves?.leaveTypeBalance.Optional || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>salary</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.salaryOverview[selectedEmployee.salaryOverview.length-1] || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Conveyance Allowance </strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.salaryDetails.conveyanceAllowance || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>House Rent Allowance </strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.salaryDetails.houseRentAllowance || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Medical Allowance </strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.salaryDetails.medicalAllowance || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Pay Run Period </strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.salaryDetails.payRunPeriod || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Special Allowance</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.salaryDetails.specialAllowance || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <strong>Bank Details: </strong>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell>
                            <strong>Account Holder Name</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.bankDetails?.accountHolderName ||
                              "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Account Type</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.bankDetails?.accountType ||
                              "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Account Number</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.bankDetails?.accountNumber ||
                              "Not Available"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>IFSC Code</strong>
                          </TableCell>
                          <TableCell>
                            {selectedEmployee.bankDetails?.ifscCode ||
                              "Not Available"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="error">
                    No employee data available.
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseShowAllInfoDialog}>Close</Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={isSalaryDialogOpen}
              onClose={() => setSalaryDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Update Employee Salary</DialogTitle>
              <DialogContent>
                <TextField
                  label="New Salary"
                  variant="outlined"
                  fullWidth
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSalarySubmit} color="primary">
                  Submit
                </Button>
                <Button
                  onClick={() => setSalaryDialogOpen(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            {salaryOverviewDialogOpen && (
              <Dialog
                open={salaryOverviewDialogOpen}
                onClose={() => setSalaryOverviewDialogOpen(false)}
              >
                <DialogTitle>Salary Overview</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Pay Run Period"
                    fullWidth
                    value={payRunPeriod}
                    onChange={(e) => setPayRunPeriod(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="House Rent Allowance"
                    fullWidth
                    value={houseRentAllowance}
                    onChange={(e) => setHouseRentAllowance(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Conveyance Allowance"
                    fullWidth
                    value={conveyanceAllowance}
                    onChange={(e) => setConveyanceAllowance(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Special Allowance"
                    fullWidth
                    value={specialAllowance}
                    onChange={(e) => setSpecialAllowance(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Medical Allowance"
                    fullWidth
                    value={medicalAllowance}
                    onChange={(e) => setMedicalAllowance(e.target.value)}
                    margin="normal"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleSalaryOverviewSubmit} color="primary">
                    Submit
                  </Button>
                  <Button
                    onClick={() => setSalaryOverviewDialogOpen(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </div>
        </>
     
  );
};

export default EmployeeDetails;
