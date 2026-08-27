const Transaction = require("../models/Transaction");

// GET /api/transactions?type=&category=&month=&year=&page=&limit=
exports.getTransactions = async (req, res, next) => {
  try {
    const { type, category, month, year, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user.id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: start, $lt: end };
    } else if (year) {
      const start = new Date(Number(year), 0, 1);
      const end = new Date(Number(year) + 1, 0, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json(tx);
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, note, date } = req.body;

    if (!type || !category || amount === undefined) {
      return res.status(400).json({ message: "type, category and amount are required" });
    }
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "type must be 'income' or 'expense'" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "amount must be greater than 0" });
    }

    const tx = await Transaction.create({
      user: req.user.id,
      type,
      category,
      amount,
      note,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    if (type) tx.type = type;
    if (category) tx.category = category;
    if (amount !== undefined) tx.amount = amount;
    if (note !== undefined) tx.note = note;
    if (date) tx.date = new Date(date);

    await tx.save();
    res.json(tx);
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};
