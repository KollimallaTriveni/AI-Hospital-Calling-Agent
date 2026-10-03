import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  PhoneCall,
  Calendar,
  TrendingUp,
  Activity,
  UserCheck,
  Search,
  Plus,
  Trash2,
  Edit3,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { doctors, patients, appointments, callLogs, setActiveScreen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('doctors'); // doctors, patients, receptionists, appointments, call-logs
  const [searchTerm, setSearchTerm] = useState('');

  const totalPatients = patients.length + 1840;
  const totalDoctors = doctors.length;
  const totalCalls = callLogs.length + 3420;
  const totalAppointments = appointments.length + 2980;

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            System Administration & Analytics
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Enterprise Admin Dashboard (Screen 11)
          </h1>
          <p className="text-xs text-slate-500">
            System-wide operational metrics, doctor staff roster, patient EMR directory, and telephony analytics.
          </p>
        </div>

        <button
          onClick={() => showToast('Generated full system CSV audit report', 'success')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition-all"
        >
          <BarChart3 className="w-4 h-4" />
          Export Audit Analytics
        </button>
      </div>

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Patients</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalPatients}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">+184 this month</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Doctors</span>
            <Stethoscope className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalDoctors}</div>
          <div className="text-xs text-blue-600 font-semibold mt-1">5 OPD Specialties</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Telephony Calls</span>
            <PhoneCall className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalCalls}</div>
          <div className="text-xs text-cyan-600 font-semibold mt-1">98.4% AI Handled</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Appointments</span>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalAppointments}</div>
          <div className="text-xs text-purple-600 font-semibold mt-1">94% Conversion</div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Telephony Call Analytics</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Average Call Duration:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">2m 14s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Speech-to-Text Latency:</span>
              <span className="font-bold text-emerald-600">140ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">LLM Triage Accuracy:</span>
              <span className="font-bold text-blue-600">99.4%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Appointment Analytics</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Completion Rate:</span>
              <span className="font-bold text-emerald-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">No-show Cancellation Rate:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">1.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Peak Call Window:</span>
              <span className="font-bold text-purple-600">10 AM - 12 PM</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Doctor Utilization</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Cardiology OPD Fill:</span>
              <span className="font-bold text-blue-600">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dentistry OPD Fill:</span>
              <span className="font-bold text-cyan-600">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Neurology OPD Fill:</span>
              <span className="font-bold text-purple-600">98%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Management Panels Tabs */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'doctors', label: 'Doctors Roster' },
              { id: 'patients', label: 'Patients Directory' },
              { id: 'receptionists', label: 'Receptionists' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'call-logs', label: 'Call Logs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search record..."
              className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Doctors Management Table */}
        {activeTab === 'doctors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Doctor Name</th>
                  <th className="py-3 px-2">Specialization</th>
                  <th className="py-3 px-2">Experience</th>
                  <th className="py-3 px-2">Rating</th>
                  <th className="py-3 px-2">Room</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {doctors.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src={doc.photo} alt={doc.name} className="w-7 h-7 rounded-lg object-cover" />
                      {doc.name}
                    </td>
                    <td className="py-3 px-2 text-blue-600 font-semibold">{doc.specialization}</td>
                    <td className="py-3 px-2">{doc.experience}</td>
                    <td className="py-3 px-2 font-bold text-amber-500">★ {doc.rating}</td>
                    <td className="py-3 px-2 font-mono">{doc.room}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.available ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Patients Table */}
        {activeTab === 'patients' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Patient ID</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Age & Gender</th>
                  <th className="py-3 px-2">Phone</th>
                  <th className="py-3 px-2">Known Condition</th>
                  <th className="py-3 px-2">Triage Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-2 font-mono font-bold text-purple-600">{p.id}</td>
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{p.name}</td>
                    <td className="py-3 px-2">{p.age} Yrs | {p.gender}</td>
                    <td className="py-3 px-2 font-mono">{p.phone}</td>
                    <td className="py-3 px-2 text-rose-600 font-semibold">{p.condition}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.risk === 'High' ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {p.risk} Risk
                      </span>
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
};

export default AdminDashboard;
