import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import AssetsTables from "./AssetsTable";
function AssetsTable() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const token = localStorage.getItem("token");
  const adminEmail = encodeURIComponent("ishan@subadmin.com");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/api/assets/all-assets?adminEmail=${adminEmail}`,
          {
            method: "GET",
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
            },
          }
        );
        
        const result = await response.json();
        if (response.ok) {
          setAssets(result.data);
        } else {
          console.error("Error fetching assets:", result.message);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    
    fetchAssets();
  }, [adminEmail]);

  const handleRowClick = (asset) => {
    setSelectedAsset(asset);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
  };

  const filteredAssets = assets.filter(asset =>
    asset.assetName.toLowerCase().includes(search.toLowerCase()) ||
    asset.email.toLowerCase().includes(search.toLowerCase()) ||
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ padding: 2, marginTop: 4 }}>
      <div className="flex  mb-8 flex-row justify-between items-center">

      <Typography variant="h6" textAlign="center" marginBottom={2}>
        Assets List
      </Typography>
      <div className="flex gap-5 flex-row items-center">

      <AssetsTables/>  
      <TextField
        label="Search Assets"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: "300px"}}
        />
        </div>
        </div>
      <TableContainer component={Paper}>  
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Issue date</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset, index) => (
              <TableRow key={asset.id} onClick={() => handleRowClick(asset)} style={{ cursor: "pointer" }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{asset.email}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.assetName}</TableCell>
                <TableCell>{asset.issuedDate}</TableCell>
                <TableCell>
                  {asset.note.split(" ").length > 4 ? asset.note.split(" ").slice(0, 4).join(" ") + "..." : asset.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {selectedAsset && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Asset Details</DialogTitle>
          <DialogContent>
            <Typography><b>Email:</b> {selectedAsset.email}</Typography>
            <Typography><b>Name:</b> {selectedAsset.name}</Typography>
            <Typography><b>Asset Name:</b> {selectedAsset.assetName}</Typography>
            <Typography><b>Asset Code:</b> {selectedAsset.assetsCode}</Typography>
            <Typography><b>Serial No:</b> {selectedAsset.serialNo}</Typography>
            <Typography><b>Working Status:</b> {selectedAsset.isWorking}</Typography>
            <Typography><b>Type:</b> {selectedAsset.type}</Typography>
            <Typography><b>Issued Date:</b> {selectedAsset.issuedDate}</Typography>
            <Typography><b>Full Note:</b> {selectedAsset.note}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary" variant="contained">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
}

export default AssetsTable;
