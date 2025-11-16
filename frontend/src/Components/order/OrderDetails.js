import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  Avatar,
  useTheme,
} from "@mui/material";
import { FiArrowLeft } from "react-icons/fi";
import { orderDetail as orderDetailAction, cancelOrderAction } from "../../actions/orderAction";
import Loader from "../Navbar/Loader";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const { orderDetail, loading } = useSelector((state) => state.orderState);
  const {
    shippingInfo = {},
    user = {},
    orderStatus = "Processing",
    orderItems = [],
    totalPrice = 0,
    paymentMethod,
    _id,
  } = orderDetail || {};

  useEffect(() => {
    dispatch(orderDetailAction(id));
  }, [dispatch, id]);

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrderAction(orderId));
    }
  };

  // Steps sequence
  const allSteps = ["Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

  // Determine which steps to show
  let stepsToShow = [];
  if (orderStatus === "Cancelled") {
    stepsToShow = ["Cancelled"];
  } else if (orderStatus === "Delivered") {
    stepsToShow = allSteps.slice(0, 5); // hide Cancelled
  } else {
    stepsToShow = allSteps.slice(0, allSteps.indexOf("Cancelled")); // normal orders
  }

  const currentStepIndex = stepsToShow.indexOf(orderStatus);

  if (loading) return <Loader />;

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
      {/* Back Button */}
      <Button
        startIcon={<FiArrowLeft />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          color: theme.palette.text.secondary,
          textTransform: "none",
          "&:hover": { color: theme.palette.primary.main },
        }}
      >
        Back to Orders
      </Button>

      <Box sx={{ bgcolor: "#fff", p: 4, borderRadius: 2, boxShadow: 3, mb: 6 }}>
        {/* Header */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Order Details
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Order ID: {_id}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Shipping Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Information
          </Typography>
          <Typography>Name: {user.firstname} {user.lastname}</Typography>
          <Typography>Phone: {shippingInfo.phoneNo}</Typography>
          <Typography>
            Address: {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.country}
          </Typography>
          <Typography>Total Amount: LKR {totalPrice.toLocaleString()}</Typography>
        </Box>

        {/* Payment Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          <Typography sx={{ color: "green", fontWeight: "bold" }}>{paymentMethod}</Typography>
        </Box>

        {/* Order Status Stepper */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order Status
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            {stepsToShow.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <Box key={step} sx={{ flex: 1, position: "relative", textAlign: "center" }}>
                  {/* Circle */}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: isCompleted
                        ? "success.main"
                        : isCurrent
                        ? "warning.main"
                        : "grey.300",
                      color: "#fff",
                      mx: "auto",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Label */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: isCompleted ? "success.main" : isCurrent ? "warning.main" : "text.disabled",
                    }}
                  >
                    {step}
                  </Typography>

                  {/* Connector */}
                  {index !== stepsToShow.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: "50%",
                        width: "100%",
                        height: 4,
                        bgcolor: isCompleted ? "success.main" : "grey.300",
                        zIndex: -1,
                        transform: "translateX(50%)",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Cancel Button: only show for Processing */}
        {orderStatus === "Processing" && (
          <Button
            variant="contained"
            color="error"
            sx={{ mb: 4 }}
            onClick={() => handleCancelOrder(_id)}
          >
            Cancel Order
          </Button>
        )}

        {/* Order Items */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Items in Your Order
          </Typography>
          <Stack spacing={2}>
            {orderItems.map((item, index) => (
              <Stack
                key={index}
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                sx={{ borderBottom: "1px solid #eee", pb: 2 }}
              >
                <Avatar
                  variant="square"
                  src={item.image}
                  alt={item.name}
                  sx={{ width: 80, height: 80 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    component={RouterLink}
                    to={`/product/${item.product}`}
                    sx={{ textDecoration: "none", color: theme.palette.primary.main, fontWeight: 500 }}
                  >
                    {item.name}
                  </Typography>
                  <Typography>Price: LKR {item.price.toLocaleString()}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderDetails;
