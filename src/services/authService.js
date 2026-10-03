/**
 * Auth Service
 * Manages user sessions, role profiles, and authentication state.
 */

const ROLES = {
  Admin: {
    name: 'System Admin',
    email: 'admin@medpulsecare.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    defaultScreen: 'admin-dashboard'
  },
  Receptionist: {
    name: 'Clara Oswald',
    email: 'reception@medpulsecare.com',
    role: 'Receptionist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    defaultScreen: 'receptionist-dashboard'
  },
  Doctor: {
    name: 'Dr. Kumar',
    email: 'dr.kumar@medpulsecare.com',
    role: 'Doctor',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    defaultScreen: 'doctor-dashboard'
  },
  Patient: {
    name: 'Ramesh Kumar',
    email: 'ramesh.k@gmail.com',
    role: 'Patient',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    defaultScreen: 'call-center'
  },
  'AI Voice Agent': {
    name: 'MedPulse AI Agent v4.2',
    email: 'ai-agent@medpulsecare.com',
    role: 'AI Voice Agent',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    defaultScreen: 'call-center'
  }
};

export const authService = {
  getProfileForRole(role) {
    return ROLES[role] || ROLES.Admin;
  },

  async login(email, password) {
    // Standard auth endpoint integration ready
    return {
      user: ROLES.Admin,
      token: 'mock-jwt-token-medpulse-care'
    };
  }
};

export default authService;
