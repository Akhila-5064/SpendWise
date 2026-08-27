const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true, default: "" },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

TransactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
