import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Clock,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Save,
  Bell,
  Activity,
  MapPin,
  Sparkles
} from 'lucide-react';

const DoctorDashboard = () => {
  const { doctors, appointments, toggleDoctorStatus, showToast } = useApp();
  const doctor = doctors[0]; // Dr. Kumar

  const [notes, setNotes] = useState('Patient presented with acute retrosternal chest pain. ECG shows sinus rhythm with mild ST depression. Prescribed Aspirin 75mg & Nitroglycerin. Scheduled echo evaluation.');
  const [selectedPatient, setSelectedPatient] = useState(appointments[0]);

  const handleSaveNotes = (e) => {
    e.preventDefault();
    showToast('Consultation notes saved to EMR record successfully', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Doctor Profile Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {doctor.title || doctor.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                CHIEF OF CARDIOLOGY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Stethoscope className="w-3.5 h-3.5 text-blue-500" /> {doctor.specialization}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {doctor.room}
              </span>
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              OPD Status
            </div>
            <div className={`text-[10px] font-bold ${doctor.available ? 'text-emerald-500' : 'text-rose-500'}`}>
              {doctor.available ? '● Available for AI Slots' : '● Busy in OPD / OT'}
            </div>
          </div>
          <button
            onClick={() => toggleDoctorStatus(doctor.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              doctor.available
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
            }`}
          >
            {doctor.available ? 'Set Busy' : 'Set Available'}
          </button>
        </div>
      </div>

      {/* Main Doctor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Today's Schedule & Patient Queue */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Today's OPD Consultation Schedule
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {appointments.length} Patients Scheduled
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => {
                const isSelected = selectedPatient?.id === apt.id;
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedPatient(apt)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-md'
                        : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/60 hover:border-blue-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {apt.time.split(' ')[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            {apt.patientName} ({apt.patientAge}M)
                          </h4>
                          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                            {apt.issue}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          apt.urgency === 'High' ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'
                        }`}>
                          {apt.urgency} Urgency
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          APT #{apt.id}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Patient Chart & Consultation Notes */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-500" />
              Active Patient EMR & Consultation Notes
            </h3>

            {selectedPatient ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedPatient.patientName} • {selectedPatient.patientAge} Yrs
                  </div>
                  <div className="text-xs text-slate-500">
                    Phone: {selectedPatient.patientPhone}
                  </div>
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                    Chief Complaint: {selectedPatient.issue}
                  </div>
                </div>

                <form onSubmit={handleSaveNotes} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Clinical Notes & Prescription
                  </label>
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono"
                  />

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save EMR Consultation Notes
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-8">
                Select a patient from the OPD schedule to view chart & write notes.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;
