import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Download,
  Printer,
  Send,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Bell
} from 'lucide-react';

const ConfirmationScreen = () => {
  const { latestBookedAppointment, setActiveScreen, showToast } = useApp();

  const apt = latestBookedAppointment || {
    id: 'APT-2026-8942',
    patientName: 'Ramesh Kumar',
    patientPhone: '+91 98765 43210',
    doctorName: 'Dr. Kumar',
    department: 'Cardiology',
    dateFormatted: 'Today, 23 Sep 2026',
    time: '04:00 PM',
    status: 'Confirmed',
    room: 'Room 302, Cardiac Wing',
    issue: 'Chest pain & discomfort',
    urgency: 'High'
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
====================================================
         MEDPULSE AI CARE HOSPITAL APPOINTMENT
====================================================
Appointment ID: ${apt.id}
Status        : ${apt.status}
Patient Name  : ${apt.patientName}
Phone         : ${apt.patientPhone}
Doctor Name   : ${apt.doctorName}
Department    : ${apt.department}
Date & Time   : ${apt.dateFormatted} at ${apt.time}
Location      : ${apt.room}
Chief Issue   : ${apt.issue}
Urgency Level : ${apt.urgency}
====================================================
Issued by MedPulse AI Care Telephony System v4.2
Emergency Helpline: +91 1800-MEDPULSE-CARE
====================================================
    `;
    const element = document.createElement("a");
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${apt.id}_Confirmation.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Appointment receipt ${apt.id} downloaded successfully`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendNotification = () => {
    showToast(`Instant SMS, WhatsApp, & Email notifications dispatched for ${apt.id}`, 'success');
    setActiveScreen('notification-center');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      
      {/* Top Success Banner */}
      <div className="glass-card p-8 rounded-3xl border border-blue-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden bg-blue-500/10">
        
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
            STATUS: {apt.status}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-3">
            Appointment Booked Successfully!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            The MedPulse AI Voice Agent has verified doctor schedule availability and dispatched multi-channel booking receipts.
          </p>
        </div>

      </div>

      {/* Appointment Details Ticket Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-xl relative">
        
        {/* Ticket Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Appointment Ticket ID</span>
            <div className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {apt.id}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Booking Channel</span>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-1 justify-end">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              Automated AI Voice
            </div>
          </div>
        </div>

        {/* 2x3 Grid of Booking Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <User className="w-4 h-4 text-blue-500" />
              Patient Name
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              {apt.patientName}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              {apt.patientPhone}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              Assigned Doctor
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              {apt.doctorName}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              {apt.department}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-500" />
              Date & Time Slot
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              {apt.dateFormatted}
            </div>
            <div className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {apt.time}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <MapPin className="w-4 h-4 text-rose-500" />
              Hospital Location
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
              {apt.room || 'Room 302, Cardiac Wing'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              Chief Symptom & Priority
            </div>
            <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center justify-between">
              <span>{apt.issue || 'Chest Pain & Arm Discomfort'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/10 text-rose-600">
                {apt.urgency || 'High Priority'}
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Confirmation
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 text-xs font-bold transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Card
            </button>
          </div>

          <button
            onClick={handleSendNotification}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all"
          >
            <Bell className="w-4 h-4" />
            Send Multi-channel Notifications
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationScreen;
