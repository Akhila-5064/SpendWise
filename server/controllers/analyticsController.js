const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// GET /api/analytics/summary?month=&year=
exports.getSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const results = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: start, $lt: end } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const summary = { income: 0, expense: 0 };
    results.forEach((r) => {
      summary[r._id] = r.total;
    });
    summary.balance = summary.income - summary.expense;
    summary.savingsRate =
      summary.income > 0 ? Number((((summary.income - summary.expense) / summary.income) * 100).toFixed(1)) : 0;

    res.json({ month, year, ...summary });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/by-category?type=expense&month=&year=
exports.getByCategory = async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();
    const type = req.query.type === "income" ? "income" : "expense";

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const results = await Transaction.aggregate([
      { $match: { user: userId, type, date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    res.json(results.map((r) => ({ category: r._id, total: r.total })));
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/trend?months=6
exports.getTrend = async (req, res, next) => {
  try {
    const months = Number(req.query.months) || 6;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const results = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: start } } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Build a full month range so gaps show as zero
    const trend = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const income = results.find((r) => r._id.year === y && r._id.month === m && r._id.type === "income");
      const expense = results.find((r) => r._id.year === y && r._id.month === m && r._id.type === "expense");
      trend.push({
        label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        month: m,
        year: y,
        income: income ? income.total : 0,
        expense: expense ? expense.total : 0,
      });
    }

    res.json(trend);
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/budget-status?month=&year=
exports.getBudgetStatus = async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [budgets, spendByCategory] = await Promise.all([
      Budget.find({ user: req.user.id, month, year }),
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            type: "expense",
            date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
          },
        },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
      ]),
    ]);

    const spendMap = {};
    spendByCategory.forEach((s) => (spendMap[s._id] = s.total));

    const status = budgets.map((b) => {
      const spent = spendMap[b.category] || 0;
      return {
        _id: b._id,
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent,
        remaining: b.monthlyLimit - spent,
        percentUsed: b.monthlyLimit > 0 ? Number(((spent / b.monthlyLimit) * 100).toFixed(1)) : 0,
        overBudget: spent > b.monthlyLimit,
      };
    });

    res.json(status);
  } catch (err) {
    next(err);
  }
};
