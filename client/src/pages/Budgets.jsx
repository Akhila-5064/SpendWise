import React, { useEffect, useState } from "react";
import api from "../api/client";
import { formatCurrency, MONTH_NAMES } from "../utils/format";

export default function Budgets() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "", monthlyLimit: "" });
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/analytics/budget-status?month=${month}&year=${year}`);
      setStatus(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/budgets", {
        category: form.category,
        monthlyLimit: Number(form.monthlyLimit),
        month,
        year,
      });
      setForm({ category: "", monthlyLimit: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this budget?")) return;
    await api.delete(`/budgets/${id}`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <div className="flex items-center gap-2">
          <select className="input w-auto" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select className="input w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Set a budget for {MONTH_NAMES[month - 1]} {year}</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input
            className="input flex-1 min-w-[160px]"
            placeholder="Category (e.g. Dining)"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="input flex-1 min-w-[160px]"
            type="number"
            step="0.01"
            min="1"
            placeholder="Monthly limit"
            required
            value={form.monthlyLimit}
            onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
          />
          <button className="btn-primary">Add budget</button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : status.length === 0 ? (
          <p className="text-slate-400 text-sm">No budgets set for this month yet.</p>
        ) : (
          status.map((b) => (
            <div key={b._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{b.category}</p>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(b.spent)} of {formatCurrency(b.monthlyLimit)}
                  </p>
                </div>
                <button className="text-sm text-slate-400 hover:text-red-600" onClick={() => handleDelete(b._id)}>
                  Remove
                </button>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3">
                <div
                  className={`h-2.5 rounded-full ${b.overBudget ? "bg-red-500" : "bg-brand-500"}`}
                  style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${b.overBudget ? "text-red-500" : "text-slate-500"}`}>
                {b.percentUsed}% used
                {b.overBudget && ` · over by ${formatCurrency(Math.abs(b.remaining))}`}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
