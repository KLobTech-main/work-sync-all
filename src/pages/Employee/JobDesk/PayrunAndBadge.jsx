import React from "react";
import InnerSidbar from "../../../components/Layout/EmployeeLayout/InnerSidbar";
import Profile from "../../../components/Layout/EmployeeLayout/Profile";
import { Box, Typography, Divider } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function PayrunAndBadge() {
  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />
        <div className="flex-1 p-8 bg-gray-100">
          <Box className="bg-white shadow-md rounded-lg p-8">
            <Typography variant="h5" className="font-semibold mb-6">
              Payrun And Badge
            </Typography>

            {/* Payrun Period */}
            <Box className="flex items-start mb-8">
              <div className="mr-4">
                <AttachMoneyIcon className="text-blue-500 text-3xl" />
              </div>
              <Box>
                <Typography variant="h6" className="font-medium">
                  Payrun Period
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  Monthly
                  <br />
                  Consider type - None
                </Typography>
              </Box>
            </Box>

            <Divider className="mb-8" />

            {/* Allowance */}
            <Box className="flex items-start mb-8">
              <div className="mr-4">
                <AddIcon className="text-green-500 text-3xl" />
              </div>
              <Box>
                <Typography variant="h6" className="font-medium">
                  Allowance
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  House Rent Allowance - <span className="font-bold">38%</span>
                  <br />
                  Conveyance Allowances - <span className="font-bold">6.4%</span>
                  <br />
                  Medical Allowances - <span className="font-bold">5%</span>
                  <br />
                  Special Allowances - <span className="font-bold">50.6%</span>
                </Typography>
              </Box>
            </Box>

            <Divider className="mb-8" />

            {/* Deduction */}
            <Box className="flex items-start">
              <div className="mr-4">
                <RemoveIcon className="text-red-500 text-3xl" />
              </div>
              <Box>
                <Typography variant="h6" className="font-medium">
                  Deduction
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  (No deductions available)
                </Typography>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

export default PayrunAndBadge;
