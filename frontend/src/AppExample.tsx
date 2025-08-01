// Example usage of the new User Profile components
// This demonstrates how to integrate UserProfilePage and EditProfilePage into a React Router setup

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  LandingPage, 
  GlobePage, 
  SubmitPrayerPage, 
  WallOfPrayersPage,
  UserProfilePage,
  EditProfilePage,
  PrayerConfirmationPage 
} from './pages';

// Example protected route wrapper (you would implement proper auth logic)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Replace with actual auth check
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/globe" element={<GlobePage />} />
        <Route path="/wall-of-prayers" element={<WallOfPrayersPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/submit-prayer" 
          element={
            <ProtectedRoute>
              <SubmitPrayerPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/prayer-confirmation" 
          element={
            <ProtectedRoute>
              <PrayerConfirmationPage />
            </ProtectedRoute>
          } 
        />
        
        {/* NEW: User Profile routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

/*
KEY FEATURES IMPLEMENTED:

1. UserProfilePage (/profile):
   - Displays user information (name, email, bio, profile picture)
   - Shows user's prayer notes with pagination
   - Allows navigation to edit profile
   - Modal for viewing individual prayer note details
   - Responsive design with cosmic theme matching the app

2. EditProfilePage (/profile/edit):
   - Form to update user's name, bio, and profile picture URL
   - Real-time form validation
   - Success/error messaging
   - Preview of profile picture
   - Proper TypeScript typing
   - Navigation back to profile page

3. API Integration:
   - Custom hooks (useUserProfile, useUpdateProfile, useUserPrayerNotes)
   - API service methods for user operations
   - Proper error handling and loading states

4. Backend Endpoints Expected:
   - GET /api/auth/me - Get current user
   - PATCH /api/v1/users/updateMe - Update user profile  
   - GET /api/v1/users/me/notes - Get user's prayer notes

5. UI/UX Features:
   - Consistent design with existing app theme
   - Loading spinners and error states
   - Modal components for prayer note details
   - Responsive layout for mobile and desktop
   - Form validation and user feedback

USAGE:
- Add these routes to your main App component
- Ensure backend endpoints are implemented
- The components are fully typed with TypeScript
- All components follow the existing design patterns
*/
