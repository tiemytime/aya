import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage, GlobePage, SubmitPrayerPage, WallOfPrayersPage, NotFoundPage } from '@/pages';
import PrayerConfirmationPage from '@/pages/PrayerConfirmationPage';
import { ButtonDemo } from '@/components/UI';
import './App.css';

// Create a client instance outside of the component
const queryClient = new QueryClient();

/**
 * Main App component with routing
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
          {/* Catch-all route for 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
