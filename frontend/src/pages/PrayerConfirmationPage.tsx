import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/UI';
import { NewsEvent } from '@/types';

interface GeneratedPrayer {
  id: string;
  content: string;
  userIntent: string;
  eventId?: string;
  createdAt: string;
}

const PrayerConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const generatedPrayer = location.state?.generatedPrayer as GeneratedPrayer;
  const selectedEvent = location.state?.selectedEvent as NewsEvent;

  const renderStarryBackground = () => {
    return (
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Starry background */}
      <div className="absolute inset-0 opacity-40">
        {renderStarryBackground()}
      </div>

      {/* Cosmic glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-96 h-96 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 25%, transparent 70%)',
            animationDuration: '4s'
          }}
        />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-white font-bold text-xl">AYA</div>
            <div className="text-gray-400 text-sm">
              <div>One prayer</div>
              <div>One world</div>
            </div>
          </div>
          
          {/* Wall of Prayers */}
          <div className="text-white font-medium tracking-wide">
            Wall of Prayers
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full pt-20 pb-10 px-6">
        <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl max-w-2xl w-full p-8 text-center">
          
          {/* Candle Icon */}
          <div className="mb-6">
            <div className="text-6xl mb-4">🕯️</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Candle Has Been Lit
            </h1>
            <p className="text-gray-300 text-lg">
              Your prayer has been added to the global wall of prayers
            </p>
          </div>

          {/* Prayer Content */}
          {generatedPrayer && (
            <div className="mb-8 p-6 bg-gray-800 bg-opacity-60 rounded-lg border border-gray-600">
              <h2 className="text-xl font-semibold text-white mb-4">Your Generated Prayer</h2>
              <p className="text-gray-300 leading-relaxed italic">
                "{generatedPrayer.content}"
              </p>
              
              {generatedPrayer.userIntent && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-sm text-gray-400">
                    Based on your intention: "{generatedPrayer.userIntent}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Event Context */}
          {selectedEvent && (
            <div className="mb-8 p-4 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-2">Prayer Context</h3>
              <p className="text-gray-300 text-sm">
                Your prayer is connected to: <span className="font-medium">{selectedEvent.title}</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Location: {selectedEvent.country}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/globe')}
              variant="secondary"
              className="px-6 py-3"
            >
              Return to Globe
            </Button>
            
            <Button
              onClick={() => navigate('/submit-prayer')}
              variant="gradient-gold"
              className="px-6 py-3"
            >
              Light Another Candle
            </Button>
          </div>

          {/* Share Options */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-gray-400 text-sm mb-4">
              Share your light with the world
            </p>
            <div className="flex justify-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors text-sm">
                📱 Share on Social
              </button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">
                📧 Email Prayer
              </button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerConfirmationPage;
