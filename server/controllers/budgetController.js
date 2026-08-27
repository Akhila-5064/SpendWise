const Budget = require("../models/Budget");

exports.getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({ user: req.user.id, month, year }).sort({ category: 1 });
    res.json(budgets);
  } catch (err) {
    next(err);
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;
    if (!category || monthlyLimit === undefined || !month || !year) {
      return res.status(400).json({ message: "category, monthlyLimit, month and year are required" });
    }

    const existing = await Budget.findOne({ user: req.user.id, category, month, year });
    if (existing) {
      return res.status(409).json({ message: "A budget for this category and month already exists" });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      monthlyLimit,
      month,
      year,
    });

    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const { monthlyLimit } = req.body;
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    if (monthlyLimit !== undefined) budget.monthlyLimit = monthlyLimit;
    await budget.save();

    res.json(budget);
  } catch (err) {
    next(err);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
};
