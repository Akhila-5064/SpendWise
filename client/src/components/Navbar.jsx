import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
    isActive ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-semibold text-lg">SpendWise</span>
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={linkClass}>
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={linkClass}>
            Budgets
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-slate-500">Hi, {user.name.split(" ")[0]}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="btn-secondary text-sm py-1.5"
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="flex sm:hidden justify-around border-t border-slate-100 px-2 py-1">
        <NavLink to="/" className={linkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={linkClass}>
          Transactions
        </NavLink>
        <NavLink to="/budgets" className={linkClass}>
          Budgets
        </NavLink>
      </nav>
    </header>
  );
}
