import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  Activity,
  UserCheck,
  Calendar,
  CheckCircle,
  Bell,
  LayoutDashboard,
  Stethoscope,
  Shield,
  BookOpen,
  FileText,
  GitMerge,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { activeScreen, setActiveScreen, activeCall } = useApp();

  const menuGroups = [
    {
      title: 'AI VOICE WORKFLOW',
      items: [
        { id: 'call-center', label: '1. AI Call Center', icon: PhoneCall, badge: activeCall ? 'Active' : null },
        { id: 'issue-analysis', label: '2. Issue Analysis', icon: Activity },
        { id: 'doctor-recommendation', label: '3. Doctor Recommend', icon: UserCheck },
        { id: 'doctor-availability', label: '4. Doctor Availability', icon: Calendar },
        { id: 'appointment-confirmation', label: '5. Booking Confirmed', icon: CheckCircle }
      ]
    },
    {
      title: 'CLINICAL & RECEPTION',
      items: [
        { id: 'notification-center', label: '6. Notifications', icon: Bell },
        { id: 'receptionist-dashboard', label: '7. Receptionist Desk', icon: LayoutDashboard },
        { id: 'doctor-dashboard', label: '8. Doctor Dashboard', icon: Stethoscope }
      ]
    },
    {
      title: 'MANAGEMENT & DATA',
      items: [
        { id: 'admin-dashboard', label: '9. Admin Analytics', icon: Shield },
        { id: 'knowledge-base', label: '10. AI RAG Base', icon: BookOpen },
        { id: 'call-logs', label: '11. Call Logs', icon: FileText }
      ]
    },
    {
      title: 'SYSTEM OVERVIEW',
      items: [
        { id: 'system-architecture', label: '12. System Architecture', icon: GitMerge }
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 glass-card border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)] p-3 transition-colors">
      <div className="space-y-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                        : item.highlight
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-white/80" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status badge */}
      <div className="p-3 mt-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
          <span>AI Engine Status</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Online
          </span>
        </div>
        <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
          RAG Vector DB: 14.2k Chunks
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
