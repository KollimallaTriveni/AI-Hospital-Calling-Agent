import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Download,
  Filter,
  PhoneCall,
  Play,
  Volume2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Bot,
  User
} from 'lucide-react';

const CallLogsScreen = () => {
  const { callLogs, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCall, setSelectedCall] = useState(null);

  const filteredLogs = callLogs.filter(log => {
    const matchesSearch = log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const csvRows = [
      ['Call ID', 'Patient Name', 'Phone', 'Issue', 'Department', 'Duration', 'Status', 'Appointment ID'],
      ...callLogs.map(c => [c.id, c.patientName, c.patientPhone, c.issue, c.department, c.duration, c.status, c.appointmentId || 'None'])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MedPulse_Call_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported call logs CSV report', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            Telephony Call Log Audit Vault
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Call Logs Management (Screen 13)
          </h1>
          <p className="text-xs text-slate-500">
            Search, filter, inspect full voice transcripts, and replay recorded AI phone sessions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV Call Logs
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Call ID, Patient Name, or Symptom..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['All', 'Completed', 'Inquiry Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Call Logs Data Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-3">Call ID</th>
                <th className="py-3.5 px-3">Patient Name</th>
                <th className="py-3.5 px-3">Phone Number</th>
                <th className="py-3.5 px-3">Detected Issue</th>
                <th className="py-3.5 px-3">Department</th>
                <th className="py-3.5 px-3">Duration</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Booking Status</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                    {log.patientName}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">
                    {log.patientPhone}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-rose-600 dark:text-rose-400">
                    {log.issue}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                    {log.department}
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    {log.duration}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {log.appointmentCreated ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-600">
                        {log.appointmentId}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">No Booking</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedCall(log)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all"
                    >
                      View Transcript
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-700 shadow-2xl relative max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Call Recording & Transcript: {selectedCall.id}
                </h3>
                <p className="text-xs text-slate-400">
                  Caller: {selectedCall.patientName} ({selectedCall.patientPhone})
                </p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audio Player Simulator */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => showToast('Playing recorded voice session audio...', 'info')}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play className="w-5 h-5 fill-white" />
                </button>
                <div>
                  <div className="text-xs font-bold">Recorded AI Call Session Audio</div>
                  <div className="text-[10px] text-slate-400 font-mono">24kHz Stereo Wav • 2.4 MB</div>
                </div>
              </div>
              <Volume2 className="w-5 h-5 text-cyan-400" />
            </div>

            {/* Transcript Flow */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              {selectedCall.transcript ? (
                selectedCall.transcript.map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-xl text-xs ${item.speaker === 'AI' ? 'bg-blue-600/10 text-blue-800 dark:text-blue-200' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100'}`}>
                    <span className="font-extrabold block text-[10px] uppercase opacity-70 mb-0.5">{item.speaker}</span>
                    {item.text}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 text-center py-4">No transcript available.</div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CallLogsScreen;
