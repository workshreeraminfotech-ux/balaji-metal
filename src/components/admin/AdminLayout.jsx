import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, MessageSquareText, 
  FolderTree, Settings, LogOut, ExternalLink, 
  Menu, X, Shield, Bell, Search, UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { storageService } from '@/utils/storageService';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Unread inquiries count
  const inquiries = storageService.getInquiries();
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { 
      to: '/admin/inquiries', 
      label: 'Inquiries & Leads', 
      icon: MessageSquareText,
      badge: newInquiriesCount > 0 ? newInquiriesCount : null 
    },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      
      {/* ─────────────────────────────────────────────────────────
          1. SIDEBAR (Desktop & Mobile Drawer) - Clean White
      ───────────────────────────────────────────────────────── */}
      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xs
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-orange-500/20">
              B
            </div>
            <div>
              <h1 className="font-heading font-black text-base text-slate-900 tracking-tight leading-tight">
                Balaji Metal
              </h1>
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
                Admin Control Center
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 md:hidden cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-6 flex-1 overflow-y-auto space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Main Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/25' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={19} className="shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-orange-600 text-white shadow-xs animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-6">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Live Website
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:text-orange-600 hover:bg-orange-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={18} className="text-orange-600" />
                <span>View Public Site</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Live</span>
            </Link>
          </div>
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-xs shrink-0">
                <Shield size={16} />
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono truncate">
                  {user?.email || 'admin@balajimetal.com'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA
      ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 md:hidden cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping hidden sm:inline-block" />
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
                Production System Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/inquiries"
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="New Inquiries"
            >
              <Bell size={18} />
              {newInquiriesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-white">
                  {newInquiriesCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold transition-all"
            >
              <ExternalLink size={13} />
              <span>Live Website</span>
            </Link>
          </div>
        </header>

        {/* Page Dynamic Outlet */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
