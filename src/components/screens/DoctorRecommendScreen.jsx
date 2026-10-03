import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  UserCheck,
  Stethoscope,
  Filter,
  ArrowRight
} from 'lucide-react';

const DoctorRecommendScreen = () => {
  const { doctors, setActiveScreen, showToast } = useApp();
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  const filteredDoctors = selectedDeptFilter === 'All'
    ? doctors
    : doctors.filter(d => d.specialization.toLowerCase().includes(selectedDeptFilter.toLowerCase()));

  const handleSelectDoctor = (doctor) => {
    showToast(`Selected ${doctor.name} (${doctor.specialization})`, 'info');
    setActiveScreen('doctor-availability');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            AI Doctor Recommendation Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Recommended Doctors (Screen 5)
          </h1>
          <p className="text-xs text-slate-500">
            Ranked by clinical symptom match, patient ratings, experience, and real-time OPD slot availability.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
          {['All', 'Cardiology', 'Dentistry', 'Dermatology', 'ENT', 'Neurology'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDeptFilter === dept
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc, index) => {
          const isTopMatch = index === 0;
          return (
            <div
              key={doc.id}
              className={`glass-card rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isTopMatch
                  ? 'border-blue-500/80 shadow-xl shadow-blue-500/10 dark:border-blue-500/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40'
              }`}
            >
              {/* Top AI Match Badge */}
              {isTopMatch && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-2xl shadow-md">
                  ★ TOP AI MATCH (96%)
                </div>
              )}

              <div>
                {/* Doctor Avatar & Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {doc.title || doc.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mt-1">
                      <Stethoscope className="w-3 h-3" />
                      {doc.specialization}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {doc.experience}
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {doc.bio}
                </p>

                {/* Rating & Availability */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 text-xs mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Rating</span>
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {doc.rating} <span className="text-slate-400 font-normal">({doc.reviews})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">OPD Availability</span>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Available Today
                    </div>
                  </div>
                </div>

                {/* Room & Fee */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3 mb-4">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {doc.room}
                  </span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    Consultation: {doc.fee}
                  </span>
                </div>
              </div>

              {/* Select Doctor CTA */}
              <button
                onClick={() => handleSelectDoctor(doc)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
                  isTopMatch
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                    : 'bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 text-white shadow-slate-900/10'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Select Doctor & Check Availability
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default DoctorRecommendScreen;
