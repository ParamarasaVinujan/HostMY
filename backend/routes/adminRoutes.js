const express = require("express");
const { getAdminStats,getMonthlyRevenue,getCategorySales  } = require("../controllers/adminController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authonticate");

const router = express.Router();

// GET /api/admin/stats
router.get(
  "/stats",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminStats
);
router.get(
  "/monthly-revenue",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getMonthlyRevenue
);
router.get("/category-sales", getCategorySales);
module.exports = router;
