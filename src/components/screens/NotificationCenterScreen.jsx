import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCw,
  Send,
  Filter,
  User,
  Stethoscope,
  UserCheck
} from 'lucide-react';

const NotificationCenterScreen = () => {
  const { notifications, showToast } = useApp();
  const [filterRecipient, setFilterRecipient] = useState('All');

  const filteredNotifs = filterRecipient === 'All'
    ? notifications
    : notifications.filter(n => n.recipientType.toLowerCase() === filterRecipient.toLowerCase());

  const getRecipientIcon = (type) => {
    switch (type) {
      case 'Doctor': return <Stethoscope className="w-4 h-4 text-emerald-500" />;
      case 'Receptionist': return <UserCheck className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1"><Clock className="w-3 h-3 animate-spin" /> Pending</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Failed</span>;
    }
  };

  const handleResend = (notif) => {
    showToast(`Resent notification to ${notif.recipient} via SMS & WhatsApp API`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            Multi-Channel Dispatch Hub
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Notification Center (Screen 8)
          </h1>
          <p className="text-xs text-slate-500">
            Real-time delivery status for SMS, WhatsApp, & Email notifications sent to Patients, Doctors, and Receptionists.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {['All', 'Patient', 'Doctor', 'Receptionist'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRecipient(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRecipient === role
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">SMS Gateway (Twilio)</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">99.8%</div>
            <div className="text-[11px] text-emerald-600 font-medium">1,420 Sent Today</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">WhatsApp Business API</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">99.2%</div>
            <div className="text-[11px] text-emerald-600 font-medium">1,180 Delivered</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Email (SendGrid)</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">98.5%</div>
            <div className="text-[11px] text-emerald-600 font-medium">950 Opened</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Notifications Timeline & Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Notification Dispatch Timeline
        </h3>

        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                  {getRecipientIcon(notif.recipientType)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {notif.recipient}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {notif.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                    "{notif.message}"
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400">Channels:</span>
                    {notif.channels.map(ch => (
                      <span key={ch} className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {getStatusBadge(notif.status)}
                
                <button
                  onClick={() => handleResend(notif)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                  title="Resend Notification"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default NotificationCenterScreen;
