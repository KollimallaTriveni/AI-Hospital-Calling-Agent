# 🏥 AI Hospital Calling Agent

> **Enterprise AI-Powered Hospital Receptionist & Voice Triage Platform**  
> An end-to-end AI calling agent capable of handling inbound patient calls, conducting clinical symptom triage, checking doctor availability in real-time, scheduling appointments, managing cancellations/reschedules, and detecting emergency situations with immediate human operator escalation.

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pytest](https://img.shields.io/badge/Tests-147%20Passed-brightgreen?logo=pytest&logoColor=white)](https://docs.pytest.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Project Overview

**AI Hospital Calling Agent** is a full-stack automated healthcare voice reception and appointment management solution designed for modern medical centers and hospital networks. 

When patients dial the hospital line, the voice bridge connects the inbound telephone call via **Exotel AgentStream WebSocket** to an AI Receptionist agent. The system performs real-time speech processing, symptom analysis, red-flag emergency screening, and database-validated appointment booking against the hospital's central database while providing a live operational dashboard for receptionists and hospital admins.

### 🌟 Key Highlights
- ⚡ **Real-Time Voice Processing**: Streaming audio bridge powered by **Exotel AgentStream**, **OpenRouter STT**, and **EdgeTTS**.
- 🚑 **Safety-First Clinical Triage**: Automatic screening for red-flag symptoms (e.g., chest pain, respiratory distress, stroke indicators) with zero-delay safety stops and human receptionist escalation.
- 📅 **Database-Validated Appointment Availability**: Appointment slots are directly validated against the database before being offered or booked to ensure calendar accuracy.
- 🌐 **Full-Stack Monitoring**: Modern React web application for monitoring live call logs, triage statuses, doctor schedules, and vector-search knowledge bases.

---

## ⚡ Key Features

- **📞 Inbound Voice Telephony**: Full bi-directional WebSocket audio bridge for handling incoming telephony streams.
- **🩺 Clinical Medical Routing**: Maps user-described symptoms to hospital clinical departments (Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, ENT, Gastroenterology, General Medicine).
- **🚨 Emergency Detection & Safety Protocol**: Automatically intercepts emergency scenarios, instructs the caller to seek immediate care (911/108), and triggers human operator call transfer.
- **📆 Appointment Lifecycle Management**: Supports end-to-end appointment booking, slot availability queries, cancellations, and rescheduling.
- **👤 Patient Lookup & Auto-Registration**: Looks up existing patient records by phone number or creates guest profiles seamlessly during the call.
- **🖥️ Enterprise Dashboard**: Real-time Receptionist Desk, Admin Command Center, Doctor Schedule Views, and Call Analytics.

---

## 🔄 How the AI Calling Agent Works

1. **Inbound Call Initiation**: Patient dials the hospital phone number; Exotel initiates an AgentStream WebSocket session to the FastAPI backend.
2. **Greeting & Intent Recognition**: The agent greets the caller as **MedPulse Hospital** and classifies caller intent (*BOOK_APPOINTMENT*, *CHECK_AVAILABILITY*, *CANCEL_APPOINTMENT*, *RESCHEDULE_APPOINTMENT*, *DOCTOR_INFORMATION*, *GENERAL_HOSPITAL_QUERY*, *HUMAN_AGENT*, *EMERGENCY*).
3. **Medical Safety Screening**: Patient symptoms are analyzed through the medical emergency rules engine.
   - If **Emergency**: Normal booking halts immediately; emergency guidance is spoken and call escalation is flagged.
   - If **Routine**: Symptoms are normalized and mapped to the appropriate medical specialty.
4. **Deterministic Slot Query**: The agent queries active doctor schedules in the database for valid open slots.
5. **Caller Confirmation & Database Commit**: The appointment is booked only after explicit patient agreement, creating a confirmed appointment record and updating dashboard logs.
6. **Text-To-Speech Response**: EdgeTTS synthesizes audio frames and streams spoken confirmation back to the telephone caller.

---

## 🏗️ System Architecture & Workflow

```mermaid
flowchart TD
    subgraph Caller ["👤 Inbound Patient Call"]
        P[Patient Phone Line]
    end

    subgraph Telephony ["📞 Telephony Gateway"]
        E[Exotel AgentStream WebSocket]
    end

    subgraph Backend ["⚡ FastAPI Backend Server"]
        B[Voice Bridge / Session Manager]
        STT[OpenRouter STT]
        LLM[OpenRouter LLM Engine]
        TRIAGE[Emergency & Medical Triage Engine]
        TTS[EdgeTTS Synthesizer]
        DB_API[Authoritative Booking & Doctor Services]
    end

    subgraph Database ["🗄️ Persistence Layer"]
        DB[(PostgreSQL / SQLite Database)]
    end

    subgraph Frontend ["🖥️ Hospital Command Center"]
        DASH[React Dashboard / Live Receptionist Desk]
    end

    P -->|SIP / Audio Stream| E
    E <-->|Inbound PCM / uLaw Audio| B
    B -->|Audio Chunk| STT
    STT -->|Transcribed Text| LLM
    LLM -->|Extract Symptoms| TRIAGE
    TRIAGE -->|Emergency Detected?| LLM
    LLM -->|Query / Book Slots| DB_API
    DB_API <-->|SQLAlchemy ORM| DB
    LLM -->|Response Text| TTS
    TTS -->|PCM Audio Frames| B
    B -->|Live Call State & Logs| DASH
```

---

## 🛠️ Tech Stack

| Category | Technologies / Frameworks |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Lucide React, Context API |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2, `pydantic-settings` |
| **Database & ORM** | PostgreSQL / SQLite, SQLAlchemy 2.0 (psycopg v3), Alembic |
| **AI & LLM Integration** | OpenRouter LLM (`google/gemini-2.5-flash`), OpenRouter Client |
| **Speech & Audio** | OpenRouter STT (Speech-To-Text), EdgeTTS (`edge-tts`), Audioop PCM Processor |
| **Telephony Gateway** | Exotel Inbound Telephony, AgentStream WebSockets |
| **Testing & Quality** | Pytest (147 passing tests), FastAPI TestClient, AnyIO |

---

## 📸 Screenshots

*(Add screenshot images to a `screenshots/` folder in your local repository)*

| Dashboard View | Live Call Simulation | Appointment Management |
| :---: | :---: | :---: |
| ![Dashboard](screenshots/dashboard.png) | ![Incoming Call](screenshots/incoming-call.png) | ![Appointment Booking](screenshots/appointment-booking.png) |

---

## 📂 Project Structure

```text
AI Calling agent/
├── index.html                   # Vite React HTML entry point
├── package.json                 # Frontend dependencies & scripts
├── vite.config.js               # Vite bundler configuration
├── .gitignore                   # Ignored files (secrets, node_modules, build artifacts)
├── .env.example                 # Root environment variable documentation template
├── README.md                    # Project documentation
│
├── src/                         # React Frontend Application
│   ├── main.jsx                 # Application entry point
│   ├── App.jsx                  # Main router & screen switcher
│   ├── components/
│   │   ├── common/              # Navbar, Sidebar, Toast, VoiceWave components
│   │   └── screens/             # Receptionist, Admin, Doctor, Call Center screens
│   ├── context/                 # AppContext (Global state & call simulation)
│   ├── data/                    # Mock datasets for UI visualization
│   └── services/                # API Client services (Appointments, Doctors, Patients)
│
└── backend/                     # FastAPI Backend Application
    ├── alembic/                 # Database migration scripts
    ├── alembic.ini              # Alembic configuration
    ├── requirements.txt         # Python package dependencies
    ├── .env.example             # Backend environment documentation template
    ├── app/                     # Main backend code package
    │   ├── main.py              # FastAPI application initialization & middleware
    │   ├── config.py            # Pydantic Settings configuration (loads .env)
    │   ├── agent/               # Agent state machine (graph, nodes, prompts, policies)
    │   ├── api/                 # REST API endpoints (doctors, patients, appointments)
    │   ├── data/                # Medical emergency rules & specialty mappings
    │   ├── db/                  # SQLAlchemy database session & Base models
    │   ├── models/              # Database ORM models (Doctor, Patient, Call, etc.)
    │   ├── schemas/             # Pydantic request & response schemas
    │   ├── services/            # Core business logic & triage services
    │   └── voice/               # Voice bridge, Exotel telephony, EdgeTTS, OpenRouter STT
    ├── scripts/                 # Seed data, database initialization & verification scripts
    └── tests/                   # 147 Unit & Integration test suites
```

---

## 🔐 Environment Variables

> ⚠️ **Security Note**: Never commit actual `.env` files containing private API keys or database passwords to Git. The `.env` file is strictly ignored via `.gitignore`. Use `.env.example` as a reference template.

To run the project, create a `.env` file inside the `backend/` folder (or root directory):

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hospital_receptionist
DATABASE_URL=postgresql+psycopg://postgres:your_postgres_password@localhost:5432/hospital_receptionist

# AI / Voice Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemini-2.5-flash

# Exotel Telephony Configuration
EXOTEL_ACCOUNT_SID=your_exotel_account_sid_here
EXOTEL_API_KEY=your_exotel_api_key_here
EXOTEL_API_TOKEN=your_exotel_api_token_here
EXOTEL_PHONE_NUMBER=your_exotel_phone_number_here
EXOTEL_AGENTSTREAM_WS_URL=wss://your-ngrok-subdomain.ngrok-free.app/api/v1/exotel/agentstream

# Public Server URL
PUBLIC_BASE_URL=http://localhost:5001
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js** (v18+ recommended) & `npm`
- **Python** (v3.11+ recommended) & `pip`
- **PostgreSQL** (Optional; fallback to SQLite database available)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/KollimallaTriveni/AI-Hospital-Calling-Agent.git
cd AI-Hospital-Calling-Agent
```

---

### 2️⃣ Backend Setup & Execution

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

5. Seed database with initial doctors, specialties, and schedules:
   ```bash
   python scripts/seed_data.py
   ```

6. Start the FastAPI backend server on port 5001:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 5001
   ```
   *The API will be live at `http://localhost:5001` with Swagger docs at `http://localhost:5001/docs`.*

---

### 3️⃣ Frontend Setup & Execution

1. Open a new terminal in the project root directory:
   ```bash
   cd "C:\Users\Dell\Desktop\AI Calling agent"
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

---

## 🧪 Testing

The backend includes a test suite with **147 passing unit and end-to-end integration tests** built using `pytest`.

To run the entire test suite:

```bash
cd backend
pytest
```

### Verified Test Coverage Includes:
- `tests/agent/`: End-to-end state machine transitions, intent classification, emergency handling, and cancellation/rescheduling flows.
- `tests/api/`: REST API endpoints for appointments, doctor availability, patient management, and health checks.
- `tests/medical/`: Red-flag emergency symptom detection, specialty normalization, and safety rules.
- `tests/voice/`: Audio processing, Exotel TwiML/XML generation, WebSocket lifecycle, and voice bridge streaming.

---

## 🔒 Security & Safety Notes

- **Clinical Boundary**: The system includes hardcoded clinical safety rules preventing the AI agent from prescribing medication or offering medical diagnoses.
- **Database Validation**: Open appointment slots are verified directly against database records before offering them to the patient.
- **Secret Management**: All secret tokens, API keys, and database passwords are managed exclusively through environment variables (`.env`) and parsed securely using `pydantic-settings`.

---

## 🔮 Future Improvements

- [ ] **Multi-Language Voice Models**: Native support for multilingual voice streams (Telugu, Hindi, English) via fine-tuned STT/TTS pipelines.
- [ ] **WhatsApp & SMS Automated Reminders**: Automated appointment confirmation and reminder dispatch via Exotel SMS / WhatsApp API.
- [ ] **EHR / EMR Integration**: Direct integration capabilities with HL7/FHIR compliant hospital record systems.

---

## 👩‍💻 Author

**Kollimalla Triveni**  
- **GitHub**: [@KollimallaTriveni](https://github.com/KollimallaTriveni)  
- **Repository**: [AI-Hospital-Calling-Agent](https://github.com/KollimallaTriveni/AI-Hospital-Calling-Agent)
