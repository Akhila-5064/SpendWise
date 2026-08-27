const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getSummary,
  getByCategory,
  getTrend,
  getBudgetStatus,
} = require("../controllers/analyticsController");

router.use(auth);

router.get("/summary", getSummary);
router.get("/by-category", getByCategory);
router.get("/trend", getTrend);
router.get("/budget-status", getBudgetStatus);

module.exports = router;
