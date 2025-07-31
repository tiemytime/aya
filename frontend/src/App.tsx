import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages';
import GlobePage from '@/pages/GlobePage';
import SubmitPrayerPage from '@/pages/SubmitPrayerPage';
import PrayerConfirmationPage from '@/pages/PrayerConfirmationPage';
import WallOfPrayersPage from '@/pages/WallOfPrayersPage';
import { ButtonDemo } from '@/components/UI';
import './App.css';

/**
 * Main App component with routing
 */
function App() {
  return (
    <Router>
      <div className="App w-full h-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/globe" element={<GlobePage />} />
          <Route path="/submit-prayer" element={<SubmitPrayerPage />} />
          <Route path="/prayer-confirmation" element={<PrayerConfirmationPage />} />
          <Route path="/wall-of-prayers" element={<WallOfPrayersPage />} />
          <Route path="/components" element={
            <div className="min-h-screen bg-[#f9fafb]">
              <div className="container mx-auto py-8">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-[#111827] mb-4">
                    Aya Frontend Components
                  </h1>
                  <p className="text-lg text-[#4b5563]">
                    Beautiful, accessible UI components built with React and Tailwind CSS
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <ButtonDemo />
                </div>
              </div>
            </div>
          } />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
