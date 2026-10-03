import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  PhoneIncoming,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  UserCheck,
  Stethoscope,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const {
    callLogs,
    appointments,
    doctors,
    toggleDoctorStatus,
    setActiveScreen,
    startCallSimulation
  } = useApp();

  const totalCalls = 145 + callLogs.length;
  const answeredCalls = 142 + callLogs.length;
  const missedCalls = 3;
  const bookedAppointments = appointments.length;
  const cancelledAppointments = 1;

  // Chart data for Department Wise Bookings
  const deptBookings = [
    { dept: 'Cardiology', count: 42, percentage: 42, color: 'bg-blue-600' },
    { dept: 'Dentistry', count: 25, percentage: 25, color: 'bg-cyan-500' },
    { dept: 'Dermatology', count: 18, percentage: 18, color: 'bg-teal-500' },
    { dept: 'Neurology', count: 15, percentage: 15, color: 'bg-purple-600' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            Hospital Reception Desk Command
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Receptionist Dashboard (Screen 9)
          </h1>
          <p className="text-xs text-slate-500">
            Monitor incoming AI calls, live patient queue, doctor OPD statuses, and real-time appointment bookings.
          </p>
        </div>

        <button
          onClick={() => startCallSimulation()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all"
        >
          <PhoneIncoming className="w-4 h-4" />
          Test Inbound AI Call
        </button>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Calls</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCalls}</div>
          <div className="text-[10px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +12% today
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Answered Calls</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{answeredCalls}</div>
          <div className="text-[10px] font-semibold text-blue-600 mt-1">98.2% AI Handled</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Missed Calls</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{missedCalls}</div>
          <div className="text-[10px] font-semibold text-slate-400 mt-1">0.8% Queue Dropout</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Booked Appointments</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{bookedAppointments}</div>
          <div className="text-[10px] font-semibold text-emerald-600 mt-1">Confirmed</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Cancelled</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{cancelledAppointments}</div>
          <div className="text-[10px] font-semibold text-slate-400 mt-1">Rescheduled</div>
        </div>
      </div>

      {/* Analytics Charts & Doctor Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Visual Charts */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Chart 1: Calls & Appointments per day */}
            <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Daily Call & Booking Volume
                </h3>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">This Week</span>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2">
                {[
                  { day: 'Mon', calls: 80, apts: 60 },
                  { day: 'Tue', calls: 95, apts: 75 },
                  { day: 'Wed', calls: 110, apts: 90 },
                  { day: 'Thu', calls: 85, apts: 70 },
                  { day: 'Fri', calls: 120, apts: 100 },
                  { day: 'Sat', calls: 60, apts: 45 },
                  { day: 'Sun', calls: 40, apts: 30 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="w-full flex items-end justify-center gap-1 h-28">
                      <div
                        className="w-2.5 bg-blue-600 rounded-t-sm transition-all duration-300 group-hover:bg-blue-500"
                        style={{ height: `${item.calls}%` }}
                        title={`${item.day} Calls: ${item.calls}`}
                      />
                      <div
                        className="w-2.5 bg-cyan-400 rounded-t-sm transition-all duration-300 group-hover:bg-cyan-300"
                        style={{ height: `${item.apts}%` }}
                        title={`${item.day} Appointments: ${item.apts}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] font-semibold pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Calls Received
                </span>
                <span className="flex items-center gap-1.5 text-cyan-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Bookings
                </span>
              </div>
            </div>

            {/* Chart 2: Department Wise Bookings */}
            <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Department Wise Bookings
              </h3>

              <div className="space-y-3 pt-2">
                {deptBookings.map((dept, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-200">{dept.dept}</span>
                      <span className="text-slate-500">{dept.count} bookings ({dept.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dept.color}`}
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tables: Recent Appointments */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Reception Appointment Feed
              </h3>
              <button onClick={() => setActiveScreen('call-logs')} className="text-xs font-bold text-blue-600 hover:underline">
                View All Logs →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">APT ID</th>
                    <th className="py-3 px-2">Patient</th>
                    <th className="py-3 px-2">Doctor</th>
                    <th className="py-3 px-2">Department</th>
                    <th className="py-3 px-2">Time</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {appointments.slice(0, 4).map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-blue-600 dark:text-blue-400">{apt.id}</td>
                      <td className="py-3 px-2 font-bold text-slate-800 dark:text-slate-100">{apt.patientName}</td>
                      <td className="py-3 px-2 font-medium">{apt.doctorName}</td>
                      <td className="py-3 px-2 text-slate-500">{apt.department}</td>
                      <td className="py-3 px-2 font-mono font-semibold">{apt.time}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Doctor Availability Widget */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                Live OPD Doctor Status
              </h3>
              <span className="text-[10px] text-slate-400">Click to toggle</span>
            </div>

            <div className="space-y-3">
              {doctors.map(doc => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {doc.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {doc.specialization}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDoctorStatus(doc.id)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-extrabold transition-all ${
                      doc.available
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-600 border border-rose-500/30'
                    }`}
                  >
                    {doc.available ? 'Available' : 'Busy in OPD'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ReceptionistDashboard;
