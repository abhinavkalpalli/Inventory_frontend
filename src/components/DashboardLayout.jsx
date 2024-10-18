import { Box, Grid, Button } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/reducers/userReducer";
import { useDispatch } from "react-redux";

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    try {
      dispatch(removeUser());
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <h1>StockFlow Dashboard</h1>
        </Grid>

        <Grid item>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/user/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/user/products")}
            >
              Products
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/user/customers")}
            >
              Customers
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#f57c00", color: "#fff" }}
              onClick={() => navigate("/user/salesReport")}
            >
              Sales
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "red", color: "#fff" }}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Grid>

        <Grid item sx={{ width: "100%", marginTop: "20px" }}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryDashboard;
