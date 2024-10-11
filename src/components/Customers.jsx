import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  TablePagination,
} from "@mui/material";

import toast from "react-hot-toast";
import { addCustomer, getCustomers } from "../services/apiMethods";
const blueColor = "#2172d2";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    address: "",
    mobile: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      if (response.status === 200) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message);
    }
  };

  const handleAddCustomer = async () => {
    try {
      const response = await addCustomer(newCustomer);
      if (response.status === 200) {
        setCustomers((prevCustomers) => [
          ...prevCustomers,
          response.data.customer,
        ]);
        setOpen(false);
        setNewCustomer({ name: "", address: "", mobile: "" });
        toast.success("New Customer Added");
      }
    } catch (error) {
      toast.error(error?.response?.message || error?.message);
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginBottom={2}
      >
        <h1>Customers</h1>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <TextField
            label="Search Products"
            variant="outlined"
            size="small" // Make the search bar smaller
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "300px" }} // Adjust width as needed
          />
        </Box>
        {/* Add Customer Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ marginBottom: "20px" }}
        >
          Add Customer
        </Button>

        {/* Search Bar */}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: blueColor, color: "#fff" }}>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Mobile Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow
                    key={customer.id}
                    style={{
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell align="center">{customer.name}</TableCell>
                    <TableCell align="center">{customer.address}</TableCell>
                    <TableCell align="center">{customer.mobile}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="h6">No Data Available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add Customer Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <TextField
              label="Name"
              variant="outlined"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Address"
              variant="outlined"
              value={newCustomer.address}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, address: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Mobile"
              variant="outlined"
              value={newCustomer.mobile}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, mobile: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddCustomer} color="primary">
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomersPage;
