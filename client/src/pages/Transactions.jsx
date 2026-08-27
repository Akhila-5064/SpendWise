import React, { useEffect, useState } from "react";
import api from "../api/client";
import { formatCurrency } from "../utils/format";

const emptyForm = { type: "expense", category: "", amount: "", note: "", date: "" };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = filterType ? `?type=${filterType}` : "";
      const { data } = await api.get(`/transactions${params}`);
      setTransactions(data.transactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (tx) => {
    setEditingId(tx._id);
    setForm({
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      note: tx.note || "",
      date: tx.date ? tx.date.slice(0, 10) : "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>

      <div className="card">
        <h2 className="font-semibold mb-4">{editingId ? "Edit transaction" : "Add transaction"}</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            className="input"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            className="input"
            placeholder="Category (e.g. Groceries)"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="input"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Amount"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            className="input"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
            <button className="btn-primary">{editingId ? "Update" : "Add"}</button>
            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">History</h2>
          <select className="input w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-slate-400 text-sm py-10 text-center">No transactions yet. Add your first one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Note</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3 text-right">Amount</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-2 pr-3">{tx.category}</td>
                    <td className="py-2 pr-3 text-slate-500">{tx.note}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.type === "income" ? "bg-brand-100 text-brand-700" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-2 pr-3 text-right font-medium ${
                        tx.type === "income" ? "text-brand-600" : "text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-2 pr-3 text-right whitespace-nowrap">
                      <button className="text-slate-500 hover:text-brand-600 mr-2" onClick={() => handleEdit(tx)}>
                        Edit
                      </button>
                      <button className="text-slate-500 hover:text-red-600" onClick={() => handleDelete(tx._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
