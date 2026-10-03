import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  User,
  Stethoscope,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const DoctorAvailabilityScreen = () => {
  const { doctors, activeCall, completeBooking, setActiveScreen } = useApp();

  const selectedDoctor = doctors[0]; // Dr. Kumar as default active selection
  const [selectedDate, setSelectedDate] = useState('2026-09-23');
  const [selectedSlot, setSelectedSlot] = useState('04:00 PM');

  const availableSlots = [
    { time: '10:00 AM', status: 'Available' },
    { time: '11:00 AM', status: 'Booked' },
    { time: '02:00 PM', status: 'Available' },
    { time: '04:00 PM', status: 'Available', recommended: true },
    { time: '05:00 PM', status: 'Available' },
    { time: '06:30 PM', status: 'Available' }
  ];

  const datesList = [
    { label: 'Today', date: '2026-09-23', active: true },
    { label: 'Tomorrow', date: '2026-09-24', active: false },
    { label: 'Thu, 25 Sep', date: '2026-09-25', active: false },
    { label: 'Fri, 26 Sep', date: '2026-09-26', active: false }
  ];

  const handleConfirmBooking = () => {
    completeBooking(
      selectedDoctor,
      selectedDate,
      selectedSlot,
      activeCall?.patientName || 'Ramesh Kumar',
      activeCall?.phone || '+91 98765 43210',
      activeCall?.issue || 'Chest pain & discomfort',
      activeCall?.urgency || 'High'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            Real-time Slot Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Doctor Availability & Booking (Screen 6)
          </h1>
          <p className="text-xs text-slate-500">
            Select preferred date and OPD consultation slot for patient {activeCall?.patientName || 'Ramesh Kumar'}.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('doctor-recommendation')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white underline"
        >
          Change Doctor Selection
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Selected Doctor Summary */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <img
                src={selectedDoctor.photo}
                alt={selectedDoctor.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
              />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedDoctor.title || selectedDoctor.name}
                </h3>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  {selectedDoctor.specialization}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedDoctor.room}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900">
                <span className="text-slate-400">Patient Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {activeCall?.patientName || 'Ramesh Kumar'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900">
                <span className="text-slate-400">Chief Symptom:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {activeCall?.issue || 'Chest Pain'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900">
                <span className="text-slate-400">Consultation Fee:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {selectedDoctor.fee}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Calendar & Time Slots */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            
            {/* Date Picker Bar */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                1. Select Consultation Date:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {datesList.map(d => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedDate === d.date
                        ? 'border-blue-600 bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:border-blue-500/40'
                    }`}
                  >
                    <div className="text-xs font-bold">{d.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{d.date}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                2. Select OPD Time Slot:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map(slot => {
                  const isSelected = selectedSlot === slot.time;
                  const isBooked = slot.status === 'Booked';

                  return (
                    <button
                      key={slot.time}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`p-3.5 rounded-2xl border text-center transition-all relative ${
                        isBooked
                          ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-800'
                          : isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/20 scale-105'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:border-emerald-500/40'
                      }`}
                    >
                      {slot.recommended && !isSelected && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                          ★ Recommended
                        </span>
                      )}
                      <div className="flex items-center justify-center gap-1.5 text-sm font-bold">
                        <Clock className="w-4 h-4" />
                        {slot.time}
                      </div>
                      <div className="text-[10px] mt-1 opacity-80">
                        {isBooked ? 'Slot Filled' : 'Available'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Slot Highlight Card */}
            {selectedSlot && (
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">Chosen Appointment Slot</span>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    Today (23 Sep) at {selectedSlot}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            )}

            {/* Book Appointment CTA */}
            <button
              onClick={handleConfirmBooking}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5" />
              Confirm & Book Appointment
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};

export default DoctorAvailabilityScreen;
