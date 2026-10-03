import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Sun,
  Moon,
  Bell,
  PhoneIncoming,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  Bot,
  User
} from 'lucide-react';

const Navbar = () => {
  const {
    darkMode,
    toggleDarkMode,
    setThemeMode,
    currentRole,
    switchRole,
    currentUser,
    notifications,
    startCallSimulation,
    activeCall,
    setActiveScreen
  } = useApp();

  const roles = [
    { id: 'Admin', label: 'Admin', icon: ShieldCheck, color: 'text-purple-400 bg-purple-500/10' },
    { id: 'Receptionist', label: 'Receptionist', icon: UserCheck, color: 'text-blue-400 bg-blue-500/10' },
    { id: 'Doctor', label: 'Doctor', icon: Stethoscope, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'Patient', label: 'Patient', icon: User, color: 'text-amber-400 bg-amber-500/10' },
    { id: 'AI Voice Agent', label: 'AI Agent', icon: Bot, color: 'text-cyan-400 bg-cyan-500/10' }
  ];

  const unreadNotifs = notifications.length;

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveScreen('call-center')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                MedPulse AI Care
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Enterprise v4.2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              AI Hospital Receptionist & Triage Platform
            </p>
          </div>
        </div>

        {/* User Role Switcher Pills */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          <span className="text-[10px] font-semibold uppercase text-slate-400 px-2 tracking-wider">
            Demo Role:
          </span>
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => switchRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Call Simulator Button */}
          <button
            onClick={() => startCallSimulation()}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
              activeCall
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 hover:scale-105'
            }`}
          >
            <PhoneIncoming className="w-4 h-4" />
            <span className="hidden sm:inline">
              {activeCall ? 'Live Call Active' : 'Simulate Incoming Call'}
            </span>
          </button>

          {/* Notifications button */}
          <button
            onClick={() => setActiveScreen('notification-center')}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                !darkMode
                  ? 'bg-white text-amber-600 shadow-sm border border-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Activate Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Light</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                darkMode
                  ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Activate Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Dark</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="text-left leading-tight">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {currentUser.role} Mode
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
