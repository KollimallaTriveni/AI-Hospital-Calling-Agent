import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_CALL_LOGS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  KNOWLEDGE_BASE_ITEMS
} from '../data/mockData';
import {
  doctorsService,
  patientsService,
  appointmentsService,
  callService,
  reportsService,
  authService
} from '../services';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state with localStorage persistence & system scheme detection
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('medpulse_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // User & Role State
  const [currentRole, setCurrentRole] = useState('Admin'); // Admin, Receptionist, Doctor, Patient, AI Voice Agent
  const [currentUser, setCurrentUser] = useState(authService.getProfileForRole('Admin'));

  // Navigation State
  const [activeScreen, setActiveScreen] = useState('call-center');

  // Core Data States
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [callLogs, setCallLogs] = useState(INITIAL_CALL_LOGS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [knowledgeBase, setKnowledgeBase] = useState(KNOWLEDGE_BASE_ITEMS);
  const [dashboardSummary, setDashboardSummary] = useState(null);

  // Active Live Call Simulator State
  const [activeCall, setActiveCall] = useState(null);

  // Latest Booked Appointment for Screen 7 (Confirmation)
  const [latestBookedAppointment, setLatestBookedAppointment] = useState(INITIAL_APPOINTMENTS[0]);

  // Global Toast message
  const [toast, setToast] = useState(null);

  // Backend API Data Hydration Effect
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        // Fetch Doctors
        const docRes = await doctorsService.getDoctors();
        if (isMounted && docRes?.items && docRes.items.length > 0) {
          const mappedDoctors = docRes.items.map(doc => ({
            id: doc.id,
            name: doc.name,
            specialization: doc.specialty?.name || doc.specialization || 'General Medicine',
            available: doc.status === 'active',
            status: doc.status === 'active' ? 'Available' : 'Busy in OPD',
            experience: `${doc.experience_years || 10} Yrs Exp`,
            rating: doc.rating || 4.8,
            room: doc.room_no || `Room ${300 + doc.id}`,
            nextSlot: '04:00 PM',
            consultationFee: `₹${doc.consultation_fee || 800}`,
            avatar: doc.avatar || INITIAL_DOCTORS[(doc.id - 1) % INITIAL_DOCTORS.length]?.avatar
          }));
          setDoctors(mappedDoctors);
        }
      } catch (err) {
        console.info('[Backend Integration] Doctor API offline or unseeded, using frontend fallback state.');
      }

      try {
        // Fetch Patients
        const patientRes = await patientsService.getPatients();
        if (isMounted && patientRes?.items && patientRes.items.length > 0) {
          setPatients(patientRes.items.map(p => ({
            id: p.id,
            name: p.name,
            phone: p.phone,
            age: p.age,
            gender: p.gender,
            bloodGroup: p.blood_group || 'O+',
            city: p.city || 'Bangalore',
            lastVisit: p.last_visit || '2026-09-20'
          })));
        }
      } catch (err) {
        console.info('[Backend Integration] Patient API offline or unseeded, using frontend fallback state.');
      }

      try {
        // Fetch Appointments
        const aptRes = await appointmentsService.getAppointments();
        if (isMounted && aptRes?.items && aptRes.items.length > 0) {
          const mappedApts = aptRes.items.map(a => ({
            id: `APT-${a.id}`,
            patientName: a.patient_name || a.patient?.name || 'Ramesh Kumar',
            patientPhone: a.patient_phone || a.patient?.phone || '+91 98765 43210',
            doctorName: a.doctor_name || a.doctor?.name || 'Dr. Sarah Jenkins',
            department: a.department || 'Cardiology',
            date: a.appointment_date || '2026-09-25',
            dateFormatted: a.appointment_date ? `Date: ${a.appointment_date}` : 'Today, 25 Sep 2026',
            time: a.start_time || '04:00 PM',
            status: a.status || 'Confirmed',
            room: a.room || 'Room 302',
            issue: a.reason || 'Routine Consultation',
            urgency: a.urgency || 'Medium',
            channel: a.channel || 'AI Voice Call'
          }));
          setAppointments(mappedApts);
          if (mappedApts.length > 0) {
            setLatestBookedAppointment(mappedApts[0]);
          }
        }
      } catch (err) {
        console.info('[Backend Integration] Appointment API offline or unseeded, using frontend fallback state.');
      }

      try {
        // Fetch Dashboard Summary Analytics
        const summary = await reportsService.getDashboardSummary();
        if (isMounted && summary) {
          setDashboardSummary(summary);
        }
      } catch (err) {
        console.info('[Backend Integration] Dashboard Summary API offline, using fallback state.');
      }
    }

    loadBackendData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      try { localStorage.setItem('medpulse_theme', 'dark'); } catch {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('medpulse_theme', 'light'); } catch {}
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', darkMode ? '#0F172A' : '#2563EB');
    }
  }, [darkMode]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      showToast(`Switched to ${next ? 'Dark' : 'Light'} Mode`, 'info');
      return next;
    });
  };

  const setThemeMode = (mode) => {
    if (mode === 'dark') {
      setDarkMode(true);
      showToast('Switched to Dark Mode', 'info');
    } else if (mode === 'light') {
      setDarkMode(false);
      showToast('Switched to Light Mode', 'info');
    }
  };

  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'Admin') {
      setCurrentUser({ name: 'System Admin', email: 'admin@medpulsecare.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });
      setActiveScreen('admin-dashboard');
    } else if (role === 'Receptionist') {
      setCurrentUser({ name: 'Clara Oswald', email: 'reception@medpulsecare.com', role: 'Receptionist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' });
      setActiveScreen('receptionist-dashboard');
    } else if (role === 'Doctor') {
      setCurrentUser({ name: 'Dr. Kumar', email: 'dr.kumar@medpulsecare.com', role: 'Doctor', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' });
      setActiveScreen('doctor-dashboard');
    } else if (role === 'Patient') {
      setCurrentUser({ name: 'Ramesh Kumar', email: 'ramesh.k@gmail.com', role: 'Patient', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' });
      setActiveScreen('call-center');
    } else {
      setCurrentUser({ name: 'MedPulse AI Agent v4.2', email: 'ai-agent@medpulsecare.com', role: 'AI Voice Agent', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' });
      setActiveScreen('call-center');
    }
    showToast(`Switched view to ${role} role mode`, 'success');
  };

  // Start a simulated incoming patient call
  const startCallSimulation = (patientData = null) => {
    const defaultCall = {
      callId: `CALL-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientData?.name || 'Ramesh Kumar',
      phone: patientData?.phone || '+91 98765 43210',
      age: patientData?.age || 45,
      gender: patientData?.gender || 'Male',
      issue: patientData?.issue || 'Chest pain and discomfort in left arm',
      department: 'Cardiology',
      urgency: 'High',
      confidenceScore: 94,
      status: 'incoming', // 'incoming' -> Patient calling hospital number
      stage: 'Incoming Call', // Inbound call states
      aiStatus: 'Ringing',
      durationSeconds: 0,
      audioActive: false,
      transcript: []
    };

    setActiveCall(defaultCall);
    setActiveScreen('call-center');
    showToast(`Incoming Patient Call from ${defaultCall.patientName} (${defaultCall.phone})`, 'info');
  };

  const answerCallSimulation = () => {
    if (!activeCall) return;

    const initialTranscript = [
      {
        speaker: 'Aura',
        text: "Welcome to MedPulse Hospital. I'm Aura, your AI Receptionist answering your call. How may I help you today?",
        time: '00:02'
      }
    ];

    setActiveCall(prev => ({
      ...prev,
      status: 'active',
      stage: 'Collecting Patient Details',
      aiStatus: 'Listening',
      audioActive: true,
      transcript: initialTranscript
    }));
    showToast('Call Answered by Aura (AI Receptionist)', 'success');
  };

  const endCallSimulation = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, status: 'ended', stage: 'Call Ended' } : null);
      setTimeout(() => setActiveCall(null), 1000);
    }
    showToast('Call session ended', 'info');
  };

  // Complete booking and propagate updates across the entire system
  const completeBooking = async (doctor, selectedDate, selectedSlot, patientName, patientPhone, issue, urgency = 'Medium') => {
    const newAptId = `APT-2026-${Math.floor(8000 + Math.random() * 1000)}`;
    const newCallId = activeCall ? activeCall.callId : `CALL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment = {
      id: newAptId,
      patientName: patientName || 'Ramesh Kumar',
      patientPhone: patientPhone || '+91 98765 43210',
      patientAge: activeCall?.age || 45,
      patientGender: activeCall?.gender || 'Male',
      doctorName: doctor.name,
      doctorId: doctor.id,
      department: doctor.specialization,
      date: selectedDate || '2026-09-23',
      dateFormatted: 'Today, 23 Sep 2026',
      time: selectedSlot || '04:00 PM',
      status: 'Confirmed',
      room: doctor.room || 'Room 302',
      issue: issue || 'Chest pain & discomfort',
      urgency: urgency,
      channel: 'AI Voice Call'
    };

    // Attempt to post to real backend API if reachable
    try {
      await appointmentsService.createAppointment({
        doctor_id: doctor.id || 1,
        patient_id: 1,
        appointment_date: selectedDate || '2026-09-25',
        start_time: selectedSlot ? selectedSlot.substring(0, 5) : '16:00',
        reason: issue || 'Chest pain & discomfort',
        channel: 'AI Voice Call'
      });
    } catch (err) {
      console.info('[Backend Integration] API Appointment booking handled locally:', err.message);
    }

    // Add appointment state
    setAppointments(prev => [newAppointment, ...prev]);
    setLatestBookedAppointment(newAppointment);

    // Add Call Log
    const newLog = {
      id: newCallId,
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      issue: newAppointment.issue,
      department: doctor.specialization,
      duration: '3m 12s',
      status: 'Completed',
      appointmentCreated: true,
      appointmentId: newAptId,
      confidence: '95%',
      urgency: urgency,
      timestamp: 'Just now',
      transcript: activeCall?.transcript || [
        { speaker: 'AI', text: 'Welcome to MedPulse AI Care.' },
        { speaker: 'Patient', text: issue },
        { speaker: 'AI', text: `Appointment booked with ${doctor.name} at ${selectedSlot}.` }
      ]
    };
    setCallLogs(prev => [newLog, ...prev]);

    // Dispatch Notifications to Patient, Doctor, Receptionist
    const notifTime = 'Just now';
    const newNotifs = [
      {
        id: `NOTIF-${Date.now()}-1`,
        recipient: `Patient: ${newAppointment.patientName}`,
        recipientType: 'Patient',
        channels: ['SMS', 'WhatsApp', 'Email'],
        title: `Appointment Confirmed - ${doctor.name}`,
        message: `Your booking ${newAptId} with ${doctor.name} (${doctor.specialization}) is locked for ${selectedSlot} in ${doctor.room}.`,
        timestamp: notifTime,
        status: 'Delivered'
      },
      {
        id: `NOTIF-${Date.now()}-2`,
        recipient: `Doctor: ${doctor.name}`,
        recipientType: 'Doctor',
        channels: ['Hospital App', 'WhatsApp'],
        title: 'New AI Voice Booking Added',
        message: `Patient ${newAppointment.patientName} (${urgency} priority) added to your OPD slot at ${selectedSlot}.`,
        timestamp: notifTime,
        status: 'Delivered'
      },
      {
        id: `NOTIF-${Date.now()}-3`,
        recipient: 'Receptionist Desk',
        recipientType: 'Receptionist',
        channels: ['Dashboard Live Stream'],
        title: 'Real-time Appointment Created',
        message: `SIP Call #${newCallId} converted to booking ${newAptId}.`,
        timestamp: notifTime,
        status: 'Delivered'
      }
    ];

    setNotifications(prev => [...newNotifs, ...prev]);

    // Reset active call state
    setActiveCall(null);

    // Transition to Screen 7 (Appointment Confirmation)
    setActiveScreen('appointment-confirmation');
    showToast(`Appointment ${newAptId} successfully booked! Dashboards & notifications updated in real-time.`, 'success');
  };

  const toggleDoctorStatus = (doctorId) => {
    setDoctors(prev =>
      prev.map(doc => {
        if (doc.id === doctorId) {
          const nextAvailable = !doc.available;
          return {
            ...doc,
            available: nextAvailable,
            status: nextAvailable ? 'Available' : 'Busy in OPD'
          };
        }
        return doc;
      })
    );
    showToast('Doctor availability status updated', 'info');
  };

  const addKnowledgeItem = (newItem) => {
    setKnowledgeBase(prev => [newItem, ...prev]);
    showToast('Document vectorized and added to AI RAG Knowledge Base', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleDarkMode,
        setThemeMode,
        currentRole,
        switchRole,
        currentUser,
        activeScreen,
        setActiveScreen,
        doctors,
        setDoctors,
        patients,
        setPatients,
        callLogs,
        setCallLogs,
        appointments,
        setAppointments,
        notifications,
        setNotifications,
        knowledgeBase,
        addKnowledgeItem,
        activeCall,
        setActiveCall,
        startCallSimulation,
        answerCallSimulation,
        endCallSimulation,
        completeBooking,
        latestBookedAppointment,
        setLatestBookedAppointment,
        toggleDoctorStatus,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
