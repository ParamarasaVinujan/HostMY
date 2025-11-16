import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Chip,
  Avatar,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { userOrders as userOrdersAction } from "../../actions/orderAction";

const UserOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { userOrders = [] } = useSelector((state) => state.orderState);
  const [searchText, setSearchText] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    dispatch(userOrdersAction);
  }, [dispatch]);

  useEffect(() => {
    if (!userOrders) return setFilteredOrders([]);
    const filtered = userOrders.filter((order) => {
      const search = searchText.toLowerCase();
      const numOfItems = Array.isArray(order.orderItems)
        ? order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

      return (
        order._id.toLowerCase().includes(search) ||
        String(order.totalPrice).toLowerCase().includes(search) ||
        String(numOfItems).toLowerCase().includes(search) ||
        order.orderStatus.toLowerCase().includes(search)
      );
    });
    setFilteredOrders(filtered);
  }, [userOrders, searchText]);

  // Helper to assign Chip colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
      case "Packed":
      case "Shipped":
      case "Out for Delivery":
        return "warning";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Helper to control which status to display
  const getVisibleStatus = (status) => {
    if (status === "Delivered") return "Delivered"; // Hide Cancelled automatically
    if (status === "Cancelled") return "Cancelled"; // Show only Cancelled
    return status; // Default: show current status
  };

  const totalOrders = userOrders.length;
  const delivered = userOrders.filter((o) => o.orderStatus === "Delivered").length;
  const cancelled = userOrders.filter((o) => o.orderStatus === "Cancelled").length;

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 8 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Back
        </Button>
      </Box>

      {/* Page Header */}
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your purchases, manage returns, and view order details
        </Typography>
      </Box>

      {/* Order Summary */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            p: 2,
            borderRadius: 2,
            width: 160,
            textAlign: "center",
          }}
        >
          <LocalMallIcon fontSize="large" />
          <Typography variant="h6">{totalOrders}</Typography>
          <Typography variant="body2">Total Orders</Typography>
        </Box>

        <Box
          sx={{
            bgcolor: theme.palette.success.light,
            color: theme.palette.success.contrastText,
            p: 2,
            borderRadius: 2,
            width: 160,
            textAlign: "center",
          }}
        >
          <DoneIcon fontSize="large" />
          <Typography variant="h6">{delivered}</Typography>
          <Typography variant="body2">Delivered</Typography>
        </Box>

        <Box
          sx={{
            bgcolor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            p: 2,
            borderRadius: 2,
            width: 160,
            textAlign: "center",
          }}
        >
          <CancelIcon fontSize="large" />
          <Typography variant="h6">{cancelled}</Typography>
          <Typography variant="body2">Cancelled</Typography>
        </Box>
      </Stack>

      {/* Search */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Search by ID / Status / Amount"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: { xs: "100%", sm: 350 } }}
        />
      </Box>

      {/* Orders Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {filteredOrders.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ gridColumn: "1/-1", textAlign: "center", mt: 4 }}
          >
            No matching orders found.
          </Typography>
        ) : (
          filteredOrders.map((order) => {
            const numOfItems = Array.isArray(order.orderItems)
              ? order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
              : 0;
            const productThumb =
              order.orderItems?.[0]?.image ||
              "https://via.placeholder.com/300x200?text=Product";

            return (
              <Card
                key={order._id}
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 5 },
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: 140,
                    backgroundColor: "#f8f8f8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Avatar
                    variant="square"
                    src={productThumb}
                    alt="Product"
                    sx={{ width: 100, height: 100, borderRadius: 2 }}
                  />
                </Box>

                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order ID
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {order._id}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Items: {numOfItems}
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary">
                    Total: <b>LKR {order.totalPrice?.toLocaleString()}</b>
                  </Typography>

                  {/* Conditional Status Chip */}
                  <Chip
                    label={getVisibleStatus(order.orderStatus)}
                    color={getStatusColor(order.orderStatus)}
                    size="small"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  />
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: "space-between", p: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            );
          })
        )}
      </Box>
    </Container>
  );
};

export default UserOrders;
