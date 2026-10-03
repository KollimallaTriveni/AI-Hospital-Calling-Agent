export const INITIAL_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Kumar',
    title: 'Dr. Ramesh Kumar',
    specialization: 'Cardiology',
    experience: '10 Years Experience',
    rating: 4.9,
    reviews: 142,
    availableToday: true,
    available: true,
    status: 'Available',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    room: 'Room 302, Cardiac Wing',
    fee: '$150',
    slots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'],
    bio: 'Senior Interventional Cardiologist specializing in acute chest pain, coronary care, and hypertension management.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Rao',
    title: 'Dr. Suresh Rao',
    specialization: 'Dentistry',
    experience: '8 Years Experience',
    rating: 4.8,
    reviews: 98,
    availableToday: true,
    available: true,
    status: 'Available',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    room: 'Room 104, Dental Care',
    fee: '$100',
    slots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
    bio: 'Cosmetic and restorative dentist with expertise in endodontics, root canal treatments, and pediatric dental hygiene.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Sharma',
    title: 'Dr. Meena Sharma',
    specialization: 'Dermatology',
    experience: '12 Years Experience',
    rating: 4.9,
    reviews: 185,
    availableToday: true,
    available: true,
    status: 'Available',
    photo: 'https://images.unsplash.com/photo-1594824813566-88855ce78960?w=300&auto=format&fit=crop&q=80',
    room: 'Room 205, Skin Clinic',
    fee: '$120',
    slots: ['10:30 AM', '12:00 PM', '02:30 PM', '04:30 PM'],
    bio: 'Lead Dermatologist specializing in laser therapy, severe allergic reactions, eczema, and skin cancer screenings.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya',
    title: 'Dr. Priya Nair',
    specialization: 'ENT (Ear, Nose & Throat)',
    experience: '9 Years Experience',
    rating: 4.7,
    reviews: 112,
    availableToday: true,
    available: false,
    status: 'Busy in OPD',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    room: 'Room 112, ENT Department',
    fee: '$110',
    slots: ['11:00 AM', '03:00 PM', '04:30 PM', '06:00 PM'],
    bio: 'ENT Specialist focusing on sinus disorders, audiometry hearing assessments, and pediatric otolaryngology.'
  },
  {
    id: 'doc-5',
    name: 'Dr. Reddy',
    title: 'Dr. K. V. Reddy',
    specialization: 'Neurology',
    experience: '15 Years Experience',
    rating: 5.0,
    reviews: 210,
    availableToday: true,
    available: true,
    status: 'Available',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    room: 'Room 401, Neuro Wing',
    fee: '$200',
    slots: ['10:00 AM', '01:30 PM', '03:30 PM', '05:00 PM'],
    bio: 'Consultant Neurologist specializing in neuro-critical care, migraine treatment, stroke rehabilitation, and epilepsy.'
  }
];

export const INITIAL_PATIENTS = [
  { id: 'pat-1', name: 'Ramesh Kumar', age: 45, gender: 'Male', phone: '+91 98765 43210', condition: 'Chest pain & shortness of breath', history: 'Hypertension', risk: 'High' },
  { id: 'pat-2', name: 'Sunita Sharma', age: 34, gender: 'Female', phone: '+91 98123 45678', condition: 'Throbbing molar toothache', history: 'None', risk: 'Medium' },
  { id: 'pat-3', name: 'Anita Patel', age: 29, gender: 'Female', phone: '+91 97654 32109', condition: 'Facial rash and severe itching', history: 'Dust allergy', risk: 'Low' },
  { id: 'pat-4', name: 'Vikram Singh', age: 52, gender: 'Male', phone: '+91 99887 76655', condition: 'Severe migraine & dizziness', history: 'Vertigo', risk: 'High' },
  { id: 'pat-5', name: 'Rajesh Verma', age: 60, gender: 'Male', phone: '+91 98321 65498', condition: 'Acute ear pain & congestion', history: 'Diabetes Type-2', risk: 'Medium' }
];

export const INITIAL_CALL_LOGS = [
  {
    id: 'CALL-9041',
    patientName: 'Ramesh Kumar',
    patientPhone: '+91 98765 43210',
    issue: 'Chest Pain & Left Arm Discomfort',
    department: 'Cardiology',
    duration: '2m 45s',
    status: 'Completed',
    appointmentCreated: true,
    appointmentId: 'APT-2026-8942',
    confidence: '94%',
    urgency: 'High',
    timestamp: '10:14 AM Today',
    transcript: [
      { speaker: 'AI', text: 'Welcome to MedPulse AI Care Reception. How may I assist you today?' },
      { speaker: 'Patient', text: 'I am experiencing sharp chest pain and discomfort in my left arm.' },
      { speaker: 'AI', text: 'I understand. May I please confirm your full name, age, and phone number for immediate medical triage?' },
      { speaker: 'Patient', text: 'My name is Ramesh Kumar, age 45, phone 9876543210.' },
      { speaker: 'AI', text: 'Thank you Ramesh. Based on your symptoms of acute chest pain, I am prioritizing your consultation with our Cardiology specialist Dr. Kumar.' },
      { speaker: 'Patient', text: 'Yes, please book the earliest slot today.' },
      { speaker: 'AI', text: 'Dr. Kumar is available at 04:00 PM today in Room 302. I have confirmed your booking and dispatched SMS confirmation details.' }
    ]
  },
  {
    id: 'CALL-9040',
    patientName: 'Sunita Sharma',
    patientPhone: '+91 98123 45678',
    issue: 'Throbbing Toothache & Cold Sensitivity',
    department: 'Dentistry',
    duration: '1m 50s',
    status: 'Completed',
    appointmentCreated: true,
    appointmentId: 'APT-2026-8941',
    confidence: '96%',
    urgency: 'Medium',
    timestamp: '09:45 AM Today',
    transcript: [
      { speaker: 'AI', text: 'Hello, MedPulse Care AI Receptionist here. How can I help you?' },
      { speaker: 'Patient', text: 'Hi, I have severe pain in my back tooth when drinking cold water.' },
      { speaker: 'AI', text: 'I can certainly help book a dental evaluation. May I know your name and age?' },
      { speaker: 'Patient', text: 'Sunita Sharma, 34 years old.' },
      { speaker: 'AI', text: 'I recommend Dr. Rao in Dentistry. We have a slot available at 02:00 PM today.' },
      { speaker: 'Patient', text: '02:00 PM works great for me.' },
      { speaker: 'AI', text: 'Perfect. Your appointment is confirmed with Dr. Rao.' }
    ]
  },
  {
    id: 'CALL-9039',
    patientName: 'Anita Patel',
    patientPhone: '+91 97654 32109',
    issue: 'Skin Rash & Allergic Itching',
    department: 'Dermatology',
    duration: '2m 10s',
    status: 'Completed',
    appointmentCreated: true,
    appointmentId: 'APT-2026-8940',
    confidence: '91%',
    urgency: 'Low',
    timestamp: '08:30 AM Today',
    transcript: [
      { speaker: 'AI', text: 'Good morning. Thank you for calling MedPulse AI Care.' },
      { speaker: 'Patient', text: 'I woke up with red itchy patches on my arm.' },
      { speaker: 'AI', text: 'I can schedule a consultation with our Chief Dermatologist Dr. Meena Sharma.' },
      { speaker: 'Patient', text: 'Sounds good, my name is Anita Patel.' },
      { speaker: 'AI', text: 'Appointment booked for tomorrow at 11:00 AM.' }
    ]
  },
  {
    id: 'CALL-9038',
    patientName: 'General Inquiry',
    patientPhone: '+91 98444 11223',
    issue: 'OPD Visiting Hours & Insurance Query',
    department: 'Hospital Admin',
    duration: '1m 15s',
    status: 'Inquiry Resolved',
    appointmentCreated: false,
    appointmentId: null,
    confidence: '98%',
    urgency: 'Low',
    timestamp: 'Yesterday 05:20 PM',
    transcript: [
      { speaker: 'AI', text: 'Welcome to MedPulse AI Care. How may I help?' },
      { speaker: 'Patient', text: 'What are the visitor hours for ICU and does MedPulse accept Star Health Insurance?' },
      { speaker: 'AI', text: 'ICU visiting hours are 4:00 PM to 6:00 PM daily. Yes, MedPulse Care is cashless empanelled with Star Health Insurance.' }
    ]
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-2026-8942',
    patientName: 'Ramesh Kumar',
    patientPhone: '+91 98765 43210',
    patientAge: 45,
    patientGender: 'Male',
    doctorName: 'Dr. Kumar',
    doctorId: 'doc-1',
    department: 'Cardiology',
    date: '2026-09-23',
    dateFormatted: 'Today, 23 Sep 2026',
    time: '04:00 PM',
    status: 'Confirmed',
    room: 'Room 302',
    issue: 'Chest pain & shortness of breath',
    urgency: 'High',
    channel: 'AI Voice Call'
  },
  {
    id: 'APT-2026-8941',
    patientName: 'Sunita Sharma',
    patientPhone: '+91 98123 45678',
    patientAge: 34,
    patientGender: 'Female',
    doctorName: 'Dr. Rao',
    doctorId: 'doc-2',
    department: 'Dentistry',
    date: '2026-09-23',
    dateFormatted: 'Today, 23 Sep 2026',
    time: '02:00 PM',
    status: 'Confirmed',
    room: 'Room 104',
    issue: 'Throbbing Toothache',
    urgency: 'Medium',
    channel: 'AI Voice Call'
  },
  {
    id: 'APT-2026-8940',
    patientName: 'Anita Patel',
    patientPhone: '+91 97654 32109',
    patientAge: 29,
    patientGender: 'Female',
    doctorName: 'Dr. Sharma',
    doctorId: 'doc-3',
    department: 'Dermatology',
    date: '2026-09-24',
    dateFormatted: 'Tomorrow, 24 Sep 2026',
    time: '11:00 AM',
    status: 'Confirmed',
    room: 'Room 205',
    issue: 'Skin rash and irritation',
    urgency: 'Low',
    channel: 'AI Voice Call'
  },
  {
    id: 'APT-2026-8939',
    patientName: 'Vikram Singh',
    patientPhone: '+91 99887 76655',
    patientAge: 52,
    patientGender: 'Male',
    doctorName: 'Dr. Reddy',
    doctorId: 'doc-5',
    department: 'Neurology',
    date: '2026-09-23',
    dateFormatted: 'Today, 23 Sep 2026',
    time: '05:00 PM',
    status: 'Confirmed',
    room: 'Room 401',
    issue: 'Chronic migraine & vertigo',
    urgency: 'High',
    channel: 'AI Voice Call'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-101',
    recipient: 'Patient: Ramesh Kumar',
    recipientType: 'Patient',
    channels: ['SMS', 'WhatsApp', 'Email'],
    title: 'Appointment Confirmed - Dr. Kumar (Cardiology)',
    message: 'Your appointment APT-2026-8942 is confirmed for Today at 04:00 PM in Room 302, Cardiac Wing.',
    timestamp: '10:15 AM Today',
    status: 'Delivered'
  },
  {
    id: 'NOTIF-102',
    recipient: 'Doctor: Dr. Kumar',
    recipientType: 'Doctor',
    channels: ['WhatsApp', 'Hospital App'],
    title: 'High Priority Patient Alert',
    message: 'AI Voice Agent scheduled high-urgency patient Ramesh Kumar (45M, Chest Pain) for 04:00 PM slot.',
    timestamp: '10:15 AM Today',
    status: 'Delivered'
  },
  {
    id: 'NOTIF-103',
    recipient: 'Receptionist Desk 1',
    recipientType: 'Receptionist',
    channels: ['Dashboard Queue'],
    title: 'New Booking Created by AI Agent',
    message: 'Appointment APT-2026-8942 created via inbound SIP voice trunk.',
    timestamp: '10:15 AM Today',
    status: 'Delivered'
  },
  {
    id: 'NOTIF-104',
    recipient: 'Patient: Sunita Sharma',
    recipientType: 'Patient',
    channels: ['SMS', 'WhatsApp'],
    title: 'Appointment Reminder - Dental Care',
    message: 'Reminder: Doctor appointment today at 02:00 PM with Dr. Rao.',
    timestamp: '09:46 AM Today',
    status: 'Delivered'
  }
];

export const KNOWLEDGE_BASE_ITEMS = [
  {
    id: 'kb-1',
    title: 'Cardiology Emergency Triage Protocol',
    category: 'Emergency Triage',
    department: 'Cardiology',
    updatedAt: '2026-09-20',
    chunks: 24,
    status: 'Indexed in Vector DB',
    content: 'Chest pain radiating to left arm or neck, dyspnea, and diaphoresis must be immediately tagged HIGH URGENCY and routed to Dr. Kumar or ER Duty Officer.'
  },
  {
    id: 'kb-2',
    title: 'Hospital Cashless Insurance Guidelines',
    category: 'Billing & Policies',
    department: 'Administration',
    updatedAt: '2026-09-18',
    chunks: 42,
    status: 'Indexed in Vector DB',
    content: 'MedPulse AI Care handles pre-authorization for Star Health, HDFC ERGO, Max Bupa, and ICICI Lombard with instant digital pre-check.'
  },
  {
    id: 'kb-3',
    title: 'OPD Doctor Consultation Hours & Fees',
    category: 'Schedules',
    department: 'All Departments',
    updatedAt: '2026-09-22',
    chunks: 18,
    status: 'Indexed in Vector DB',
    content: 'Dr. Kumar (Cardiology): 10 AM - 6 PM; Dr. Rao (Dentistry): 9 AM - 5 PM; Dr. Sharma (Dermatology): 10 AM - 5 PM; Dr. Reddy (Neurology): 10 AM - 5 PM.'
  },
  {
    id: 'kb-4',
    title: 'Patient Diagnostic Preparation Rules',
    category: 'Patient Instructions',
    department: 'Diagnostics',
    updatedAt: '2026-09-15',
    chunks: 35,
    status: 'Indexed in Vector DB',
    content: 'Fasting lipid profile requires 12-hour fasting. Abdominal USG requires 1 liter water intake 1 hour prior.'
  }
];

export const SYSTEM_ARCHITECTURE_STEPS = [
  {
    id: 1,
    name: 'Patient Call',
    icon: 'PhoneIncoming',
    color: 'bg-blue-600',
    tech: 'SIP / Twilio Voice WebRTC Gateway',
    desc: 'Inbound PSTN/VoIP call received from patient phone line.'
  },
  {
    id: 2,
    name: 'AI Voice Agent',
    icon: 'Bot',
    color: 'bg-blue-600',
    tech: 'MedPulse Neural Voice Pipeline',
    desc: 'Bilingual voice synthesis and ultra-low-latency duplex audio streaming.'
  },
  {
    id: 3,
    name: 'Speech To Text',
    icon: 'Mic',
    color: 'bg-blue-600',
    tech: 'Whisper-v3 Turbo Audio Engine',
    desc: 'Converts continuous voice stream into structured text with medical vocabulary mapping.'
  },
  {
    id: 4,
    name: 'LLM Engine',
    icon: 'Brain',
    color: 'bg-blue-600',
    tech: 'Gemini 1.5 Flash / GPT-4o Clinical Model',
    desc: 'Extracts patient entities (Name, Age, Symptoms, Urgency, Medical History).'
  },
  {
    id: 5,
    name: 'RAG Knowledge Base',
    icon: 'Database',
    color: 'bg-blue-600',
    tech: 'Pinecone Vector DB + Hybrid Search',
    desc: 'Retrieves hospital guidelines, doctor OPD schedules, insurance policies & triage rules.'
  },
  {
    id: 6,
    name: 'Issue Analysis',
    icon: 'Stethoscope',
    color: 'bg-blue-600',
    tech: 'AI Triage & Urgency Evaluator',
    desc: 'Classifies clinical severity (High / Medium / Low) and recommends medical department.'
  },
  {
    id: 7,
    name: 'Doctor Recommendation',
    icon: 'UserCheck',
    color: 'bg-blue-600',
    tech: 'Smart Doctor Match Engine',
    desc: 'Ranks specialists based on clinical fit, patient reviews, language, and expertise.'
  },
  {
    id: 8,
    name: 'Availability Engine',
    icon: 'Calendar',
    color: 'bg-blue-600',
    tech: 'HMIS Real-time Slot Sync',
    desc: 'Checks live doctor schedule, room availability, and open appointment slots.'
  },
  {
    id: 9,
    name: 'Appointment Booking',
    icon: 'CheckCircle2',
    color: 'bg-blue-600',
    tech: 'Core Hospital Database Transaction',
    desc: 'Locks chosen time slot, issues unique Appointment ID, and creates patient chart.'
  },
  {
    id: 10,
    name: 'Notification Service',
    icon: 'BellRing',
    color: 'bg-blue-600',
    tech: 'Twilio SMS + WhatsApp + SendGrid',
    desc: 'Dispatches instant appointment confirmations and calendar invites to patient & doctor.'
  },
  {
    id: 11,
    name: 'Hospital Dashboards',
    icon: 'LayoutDashboard',
    color: 'bg-blue-600',
    tech: 'WebSocket Real-Time Broadcast',
    desc: 'Instantly updates Receptionist live queue, Doctor schedule, and Admin analytics.'
  }
];
