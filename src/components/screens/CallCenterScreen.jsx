import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import VoiceWave from '../common/VoiceWave';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  CheckCircle2,
  User,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Bot,
  Calendar,
  Clock,
  Stethoscope,
  Activity,
  FileText
} from 'lucide-react';

const CallCenterScreen = () => {
  const {
    activeCall,
    setActiveCall,
    startCallSimulation,
    answerCallSimulation,
    endCallSimulation,
    completeBooking,
    setActiveScreen,
    callLogs,
    appointments,
    doctors
  } = useApp();

  const [aiStatus, setAiStatus] = useState('Listening'); // Listening, Processing, Responding
  const [simTurnStep, setSimTurnStep] = useState(1); 
  // 1: Details & Symptoms, 2: Doctor & Availability, 3: Slot Selection, 4: Verbal Confirmation

  const totalCallsToday = callLogs.length + (activeCall ? 1 : 0) + 142;
  const activeCallsCount = activeCall?.status === 'active' ? 1 : 0;
  const missedCalls = 3;
  const bookedAppointmentsCount = appointments.length;

  const mockCallQueue = [
    { id: 'Q-101', name: 'Ramesh Kumar', phone: '+91 98765 43210', status: 'Incoming Call', duration: '00:05', priority: 'High' },
    { id: 'Q-102', name: 'Priya Sharma', phone: '+91 98222 33445', status: 'Waiting in AI Queue', duration: '00:15', priority: 'Medium' },
    { id: 'Q-103', name: 'Amitabh Sen', phone: '+91 97111 88990', status: 'Checking Availability', duration: '00:08', priority: 'Low' }
  ];

  // Advance conversation turn in the simulator through distinct inbound stages
  const handleNextTurn = (turnType) => {
    if (!activeCall) return;

    if (turnType === 'patient_details_and_symptoms') {
      const turnMsg = {
        speaker: 'Patient',
        text: 'My name is Ramesh Kumar (+91 98765 43210). I have severe chest pain and discomfort radiating down my left arm.',
        time: '00:06'
      };
      const auraReply = {
        speaker: 'Aura',
        text: 'Thank you Mr. Ramesh Kumar. I have registered your details. Let me evaluate your symptoms with our clinical system to find the right specialist.',
        time: '00:10'
      };
      setActiveCall(prev => ({
        ...prev,
        stage: 'Understanding Symptoms',
        aiStatus: 'Processing',
        issue: 'Chest pain and discomfort in left arm',
        transcript: [...(prev.transcript || []), turnMsg, auraReply]
      }));
      setSimTurnStep(2);
    } else if (turnType === 'find_doctor_and_check_availability') {
      const turnMsg = {
        speaker: 'Patient',
        text: 'How soon can I see a doctor?',
        time: '00:14'
      };
      const auraReply = {
        speaker: 'Aura',
        text: 'Based on your symptoms of acute chest pain, I am routing you to Cardiology. I checked Dr. Kumar\'s real-time schedule: available slots today are 03:00 PM, 04:00 PM, and 05:30 PM. Which slot do you prefer?',
        time: '00:18'
      };
      setActiveCall(prev => ({
        ...prev,
        stage: 'Offering Slots',
        aiStatus: 'Responding',
        department: 'Cardiology',
        transcript: [...(prev.transcript || []), turnMsg, auraReply]
      }));
      setSimTurnStep(3);
    } else if (turnType === 'patient_select_slot') {
      const turnMsg = {
        speaker: 'Patient',
        text: 'I would like the 04:00 PM slot today with Dr. Kumar.',
        time: '00:22'
      };
      const auraReply = {
        speaker: 'Aura',
        text: 'Understood. I can book an appointment for Ramesh Kumar with Dr. Kumar (Cardiology) today at 04:00 PM in Room 302. Shall I confirm this booking now?',
        time: '00:26'
      };
      setActiveCall(prev => ({
        ...prev,
        stage: 'Confirming Appointment',
        aiStatus: 'Processing',
        transcript: [...(prev.transcript || []), turnMsg, auraReply]
      }));
      setSimTurnStep(4);
    } else if (turnType === 'patient_confirm') {
      const turnMsg = {
        speaker: 'Patient',
        text: 'Yes, please confirm the booking.',
        time: '00:30'
      };
      const auraReply = {
        speaker: 'Aura',
        text: 'Your appointment is confirmed! Booking ID #APT-2026-8941 is locked in the system. Real-time call log and dashboard have been updated. Thank you for calling MedPulse Hospital.',
        time: '00:34'
      };
      setActiveCall(prev => ({
        ...prev,
        stage: 'Appointment Booked',
        aiStatus: 'Responding',
        transcript: [...(prev.transcript || []), turnMsg, auraReply]
      }));

      // Execute booking workflow to create appointment, call log, and real-time dashboard update
      const cardDoc = doctors.find(d => d.specialization === 'Cardiology') || doctors[0];
      completeBooking(
        cardDoc,
        '2026-09-25',
        '04:00 PM',
        activeCall.patientName,
        activeCall.phone,
        activeCall.issue || 'Chest pain and discomfort',
        'High'
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Flow Header Banner: Patient -> Calls Hospital -> Exotel AgentStream -> Aura */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Inbound AI Receptionist (Aura)
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live inbound call handling, patient triage, schedule availability lookup, and automated booking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!activeCall ? (
              <button
                onClick={() => {
                  setSimTurnStep(1);
                  startCallSimulation();
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all"
              >
                <PhoneIncoming className="w-4 h-4 animate-bounce" />
                Simulate Incoming Patient Call
              </button>
            ) : (
              <button
                onClick={endCallSimulation}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white font-extrabold text-sm shadow-lg shadow-rose-500/30 hover:bg-rose-700 transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                Disconnect Session
              </button>
            )}
          </div>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Inbound Call Triage Architecture
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-blue-400 text-lg mb-1">📱</div>
              <div className="text-slate-200">1. PATIENT</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Calls Hospital Line</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-emerald-400 text-lg mb-1">📞</div>
              <div className="text-slate-200">2. EXOPHONE NUMBER</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Dedicated Inbound</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-purple-400 text-lg mb-1">⚡</div>
              <div className="text-slate-200">3. EXOTEL AGENTSTREAM</div>
              <div className="text-[10px] text-slate-400 mt-0.5">WebSocket Bridge</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/40">
              <div className="text-cyan-400 text-lg mb-1">🤖</div>
              <div className="text-blue-200 font-extrabold">4. AURA AI</div>
              <div className="text-[10px] text-cyan-300 mt-0.5">Answers & Books</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Incoming Calls</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">{totalCallsToday}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10">+14.2%</span>
            <span>Inbound volume</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Inbound Session</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <PhoneIncoming className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-3">{activeCallsCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500">
            <span>Aura AI Receptionist</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Missed Calls</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-3">{missedCalls}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500">
            <span>0.8% dropout rate</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Booked Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3">{bookedAppointmentsCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10">100% Inbound</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Active Call Triage & Simulator */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeCall?.status === 'active' ? 'Call Active (Aura AI Answering Inbound Call)' : activeCall?.status === 'incoming' ? 'Incoming Patient Call Ringing...' : 'Inbound Telephony Gateway Ready'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeCall ? `Call ID: ${activeCall.callId} • Stage: ${activeCall.stage || 'Incoming Call'}` : 'Waiting for patient to dial hospital line...'}
                  </p>
                </div>
              </div>

              {activeCall && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 animate-pulse">
                  {activeCall.stage || (activeCall.status === 'incoming' ? 'INCOMING CALL' : 'CALL ACTIVE')}
                </span>
              )}
            </div>

            {activeCall ? (
              <div className="space-y-6">
                
                {/* Patient Information Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Caller (Patient)</span>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                      <User className="w-4 h-4 text-blue-500" />
                      {activeCall.patientName}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Caller Number</span>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {activeCall.phone}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Call Stage</span>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {activeCall.stage || 'Active'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">AI Receptionist</span>
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5 flex items-center gap-1">
                      <Bot className="w-4 h-4" />
                      Aura
                    </div>
                  </div>
                </div>

                {/* State: Incoming Call Ringing */}
                {activeCall.status === 'incoming' && (
                  <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center animate-bounce">
                      <PhoneIncoming className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        Incoming Call from {activeCall.patientName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Patient dialing hospital phone line: {activeCall.phone}
                      </p>
                    </div>
                    <button
                      onClick={answerCallSimulation}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 mx-auto"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Answer Incoming Call (Aura AI)
                    </button>
                  </div>
                )}

                {/* State: Call Active */}
                {activeCall.status === 'active' && (
                  <div className="space-y-4">
                    <VoiceWave isLive={true} status={aiStatus} active={true} />

                    {/* Simulated Live Transcript */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 max-h-80 overflow-y-auto font-sans">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                        <span>Live Transcript: Patient → Hospital Line → Aura</span>
                        <span className="text-cyan-400">{activeCall.stage}</span>
                      </div>

                      {activeCall.transcript && activeCall.transcript.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl text-xs ${
                            msg.speaker === 'Aura'
                              ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 ml-4'
                              : 'bg-slate-800 border border-slate-700 text-slate-200 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase opacity-70 mb-1">
                            <span>{msg.speaker === 'Aura' ? '🤖 Aura (AI Receptionist)' : `👤 Patient (${activeCall.patientName})`}</span>
                            <span className="font-mono text-slate-400">{msg.time}</span>
                          </div>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Inbound Workflow Step-by-Step Simulator */}
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        Inbound Call Triage Progression:
                      </div>

                      {simTurnStep === 1 && (
                        <button
                          onClick={() => handleNextTurn('patient_details_and_symptoms')}
                          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-between transition-all"
                        >
                          <span>Step 1: Patient provides Name, Phone & Symptoms ("Chest pain & arm discomfort")</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {simTurnStep === 2 && (
                        <button
                          onClick={() => handleNextTurn('find_doctor_and_check_availability')}
                          className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-between transition-all"
                        >
                          <span>Step 2: Aura routes to Cardiology & checks doctor availability</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {simTurnStep === 3 && (
                        <button
                          onClick={() => handleNextTurn('patient_select_slot')}
                          className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-between transition-all"
                        >
                          <span>Step 3: Patient selects slot ("04:00 PM today with Dr. Kumar")</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {simTurnStep === 4 && (
                        <button
                          onClick={() => handleNextTurn('patient_confirm')}
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between transition-all shadow-lg shadow-emerald-500/25"
                        >
                          <span>Step 4: Confirm Booking & Save Real-Time Call Log</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
                  <PhoneIncoming className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  Inbound Telephony Gateway Ready
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the button below to test a simulated incoming call from a patient calling MedPulse Hospital AI. Aura will answer and triage the patient.
                </p>
                <button
                  onClick={() => {
                    setSimTurnStep(1);
                    startCallSimulation();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Simulate Incoming Patient Call
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Live Inbound Call Queue */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Inbound Call Queue
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {mockCallQueue.length} Waiting
              </span>
            </div>

            <div className="space-y-3">
              {mockCallQueue.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-2 hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priority === 'High' ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.phone}</span>
                    <span className="font-mono text-slate-400">{item.duration}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                      {item.status}
                    </span>
                    <button
                      onClick={() => setActiveScreen('issue-analysis')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      Analyze Issue <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CallCenterScreen;
