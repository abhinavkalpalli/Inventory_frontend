import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  TextField,
  MenuItem,
  Box,
  Grid,
  TablePagination,
} from "@mui/material";
import {
  getCustomers,
  getProducts,
  getsalesReport,
  sendMail,
} from "../services/apiMethods";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const blueColor = "#2172d2";
const buttonColor = "#4CAF50"; // Button color

const SalesReportPage = () => {
  const [date, setDate] = useState(dayjs()); // Set default date as current date
  const [productId, setProductId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesReport, setSalesReport] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page for pagination

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchSalesReport();
  }, [date, productId, customerId, page, rowsPerPage]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (response.status === 200) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      if (response.status === 200) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const fetchSalesReport = async () => {
    try {
      const response = await getsalesReport({
        date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
        productId: productId || undefined,
        customerId: customerId || undefined,
        page: page + 1, // Adjust for server-side pagination
        limit: rowsPerPage, // Limit the number of rows fetched
      });
      setSalesReport(response.data.report);
    } catch (error) {
      console.error("Error fetching sales report", error);
    }
  };

  const exportToExcel = () => {
    const formattedReport = salesReport.map((report) => ({
      Date: dayjs(report.date).format("YYYY-MM-DD"),
      Product: report.productId.name,
      Customer: report.customerId.name,
      Quantity: report.quantity,
      TotalPrice: report.totalPrice,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedReport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesReport");
    XLSX.writeFile(workbook, "SalesReport.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 20, 10);
    doc.autoTable({
      head: [["Date", "Product", "Customer", "Quantity", "Total"]],
      body: salesReport.map((report) => [
        dayjs(report.date).format("YYYY-MM-DD"),
        report.productId.name,
        report.customerId.name,
        report.quantity,
        report.totalPrice,
      ]),
    });
    doc.save("SalesReport.pdf");
  };

  const sendEmailReport = async () => {
    try {
      const response = await sendMail({
        email: email,
        salesReport: salesReport,
      });
      if (response.status === 200) {
        alert("Email sent successfully!");
      }
    } catch (error) {
      console.error("Error sending email", error);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Sales Report</h2>

      {/* Date, Product, Customer Input and Action Buttons */}
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={10}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem", // Add spacing between items
              mb: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => (
                  <TextField {...params} size="small" sx={{ width: "20%" }} />
                )}
              />
            </LocalizationProvider>

            <TextField
              select
              label="Product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              size="small"
              sx={{ width: "20%" }}
            >
              <MenuItem value="">All Products</MenuItem>
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Customer"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              size="small"
              sx={{ width: "20%" }}
            >
              <MenuItem value="">All Customers</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Recipient Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ width: "20%" }}
            />

            {/* Buttons */}
            <Button
              variant="outlined"
              style={{ backgroundColor: buttonColor, color: "#fff" }}
              onClick={sendEmailReport}
              sx={{ width: "10%" }}
            >
              Send Email
            </Button>

            <Button
              variant="outlined"
              style={{ backgroundColor: buttonColor, color: "#fff" }}
              onClick={() => window.print()}
              sx={{ width: "10%" }}
            >
              Print
            </Button>

            <Button
              variant="outlined"
              style={{ backgroundColor: buttonColor, color: "#fff" }}
              onClick={exportToExcel}
              sx={{ width: "10%" }}
            >
              Export to Excel
            </Button>

            <Button
              variant="outlined"
              style={{ backgroundColor: buttonColor, color: "#fff" }}
              onClick={exportToPDF}
              sx={{ width: "10%" }}
            >
              Export to PDF
            </Button>
          </Box>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: blueColor, color: "#fff" }}>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Product</TableCell>
              <TableCell align="center">Customer</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesReport.length > 0 ? (
              salesReport
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow
                    key={report._id}
                    style={{
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell align="center">
                      {dayjs(report.date).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell align="center">
                      {report.productId.name}
                    </TableCell>
                    <TableCell align="center">
                      {report.customerId.name}
                    </TableCell>
                    <TableCell align="center">{report.quantity}</TableCell>
                    <TableCell align="center">{report.totalPrice}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <strong>No Data Available</strong>
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
        count={salesReport.length} // Adjust count based on your total data length
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </div>
  );
};

export default SalesReportPage;
