import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Toast from './components/common/Toast';

import CallCenterScreen from './components/screens/CallCenterScreen';
import IssueAnalysisScreen from './components/screens/IssueAnalysisScreen';
import DoctorRecommendScreen from './components/screens/DoctorRecommendScreen';
import DoctorAvailabilityScreen from './components/screens/DoctorAvailabilityScreen';
import ConfirmationScreen from './components/screens/ConfirmationScreen';
import NotificationCenterScreen from './components/screens/NotificationCenterScreen';
import ReceptionistDashboard from './components/screens/ReceptionistDashboard';
import DoctorDashboard from './components/screens/DoctorDashboard';
import AdminDashboard from './components/screens/AdminDashboard';
import KnowledgeBaseScreen from './components/screens/KnowledgeBaseScreen';
import CallLogsScreen from './components/screens/CallLogsScreen';
import ArchitectureScreen from './components/screens/ArchitectureScreen';

const MainContent = () => {
  const { activeScreen } = useApp();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'call-center':
        return <CallCenterScreen />;
      case 'issue-analysis':
        return <IssueAnalysisScreen />;
      case 'doctor-recommendation':
        return <DoctorRecommendScreen />;
      case 'doctor-availability':
        return <DoctorAvailabilityScreen />;
      case 'appointment-confirmation':
        return <ConfirmationScreen />;
      case 'notification-center':
        return <NotificationCenterScreen />;
      case 'receptionist-dashboard':
        return <ReceptionistDashboard />;
      case 'doctor-dashboard':
        return <DoctorDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'knowledge-base':
        return <KnowledgeBaseScreen />;
      case 'call-logs':
        return <CallLogsScreen />;
      case 'system-architecture':
        return <ArchitectureScreen />;
      default:
        return <CallCenterScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderScreen()}
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
