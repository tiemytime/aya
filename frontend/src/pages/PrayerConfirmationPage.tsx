import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GeneratedPrayer } from '../types/ai';
import { NewsEvent } from '../types';
import { PrayerAudioPlayer } from '../components/Audio';
import { Button } from '../components/UI';
import { Light, PrayerNoteWithLight } from '@/services';

interface GeneratedPrayerState {
  generatedPrayer: GeneratedPrayer;
  selectedEvent?: NewsEvent;
}

interface LightWithPrayerState {
  light: Light;
  prayerNote: PrayerNoteWithLight;
  selectedEvent?: NewsEvent;
}

const PrayerConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as (GeneratedPrayerState | LightWithPrayerState) | null;
  
  // Handle both old prayer generation flow and new light creation flow
  const generatedPrayer = (state as GeneratedPrayerState)?.generatedPrayer;
  const light = (state as LightWithPrayerState)?.light;
  const prayerNote = (state as LightWithPrayerState)?.prayerNote;
  const selectedEvent = state?.selectedEvent;

  // Determine which flow we're using and extract prayer content
  const prayerContent = generatedPrayer?.generatedText || prayerNote?.content;
  const isLightFlow = !!light && !!prayerNote;

  if (!prayerContent) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Prayer Found</h2>
          <p className="text-gray-400 mb-6">Please create a prayer first.</p>
          <Button
            onClick={() => navigate('/submit-prayer')}
            variant="gradient-gold"
            className="px-6 py-3"
          >
            Create Prayer
          </Button>
        </div>
      </div>
    );
  }

  const handleGoToWall = () => {
    navigate('/wall-of-prayers');
  };

  const handleSharePrayer = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Prayer from AYA',
          text: `"${prayerContent}" - ${isLightFlow ? 'My light is now shining on' : 'Generated through'} AYA's global prayer network`,
          url: window.location.origin + '/globe',
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(prayerContent);
        alert('Prayer copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing prayer:', error);
      // Fallback alert
      alert('Share functionality: Copy this prayer and share it with others to spread light and hope!');
    }
  };

  // Helper function to render starry background
  const renderStarryBackground = () => {
    return (
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => (
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
            <div className="text-gray-400 text-sm">Global Prayer Network</div>
          </div>
          
          {/* Wall of Prayers */}
          <div className="text-white font-medium tracking-wide">
            Wall of Prayers
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full pt-20 pb-10 px-6">
        <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl max-w-6xl w-full flex overflow-hidden">
          
          {/* Left Side - Prayer Content */}
          <div className="w-1/2 p-8">
            {/* Candle Icon and Header */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">🕯️</div>
                <h3 className="text-white font-bold text-xl">Your Candle Has Been Lit</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Your prayer has been added to the global wall of prayers
              </p>
            </div>

            {/* Generated Prayer Text */}
            <div className="mb-6 p-6 bg-gray-800 bg-opacity-60 rounded-lg border border-gray-600">
              <h4 className="text-yellow-400 font-semibold mb-3">
                {isLightFlow ? 'Your Prayer Light' : 'Generated Prayer'}
              </h4>
              <p className="text-white text-lg italic leading-relaxed">
                "{prayerContent}"
              </p>
              
              {/* Prayer Details */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  {generatedPrayer && (
                    <>
                      <p><strong>Intent:</strong> {generatedPrayer.userIntent}</p>
                      {generatedPrayer.theme && (
                        <p><strong>Theme:</strong> {generatedPrayer.theme}</p>
                      )}
                      <p><strong>Language:</strong> {generatedPrayer.language}</p>
                      <p><strong>Length:</strong> {generatedPrayer.length}</p>
                    </>
                  )}
                  {light && (
                    <>
                      <p><strong>Location:</strong> {light.location}</p>
                      <p><strong>Light ID:</strong> {light._id}</p>
                      <p><strong>Status:</strong> {light.status}</p>
                      <p><strong>Created:</strong> {new Date(light.createdAt).toLocaleString()}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Event Context */}
            {selectedEvent && (
              <div className="mb-6 p-4 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-600">
                <h4 className="text-blue-400 font-semibold mb-2">Related Event</h4>
                <p className="text-white text-sm">{selectedEvent.title}</p>
                <p className="text-gray-400 text-xs mt-1">{selectedEvent.country}</p>
              </div>
            )}

            {/* Thank You Message */}
            <p className="text-gray-300 text-sm mb-6">
              <strong>Thank you for spreading your light.</strong><br/>
              {isLightFlow 
                ? 'Your prayer light is now shining on the global map, bringing hope to the world.'
                : 'Your little candle can light up a room full of darkness.'
              }
            </p>

            {/* Action Button */}
            <Button
              onClick={handleGoToWall}
              variant="gradient-gold"
              className="w-full py-3 text-lg font-semibold"
            >
              Go to Wall of Prayers
            </Button>
          </div>

          {/* Right Side - Audio Player and Share */}
          <div className="w-1/2 p-8 flex flex-col items-center justify-center bg-gray-900 bg-opacity-30">
            {/* Audio Player Section */}
            <div className="w-full max-w-sm mb-8">
              {generatedPrayer?.audioGenerated && generatedPrayer?.s3FileUrl ? (
                <PrayerAudioPlayer 
                  audioUrl={generatedPrayer.s3FileUrl} 
                  title="Your Generated Prayer"
                  className="w-full"
                />
              ) : (
                <div className="text-center p-6 bg-gray-800 bg-opacity-60 rounded-lg border border-gray-600">
                  <div className="text-4xl mb-3">🕯️</div>
                  <p className="text-white font-semibold mb-2">
                    {isLightFlow ? 'Your Light is Shining' : 'Audio Not Generated'}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    {isLightFlow 
                      ? 'Your prayer light has been placed on the global map and is visible to others'
                      : 'Audio generation was not enabled for this prayer'
                    }
                  </p>
                  {!isLightFlow && (
                    <Button
                      onClick={() => {
                        // Could implement re-generation with audio
                        alert('Audio generation feature coming soon!');
                      }}
                      variant="secondary"
                      className="text-sm px-4 py-2"
                    >
                      Generate Audio
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleSharePrayer}
              className="w-32 h-32 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <div className="text-2xl mb-1">📤</div>
              <span>Share</span>
              <span>Prayer</span>
            </button>

            {/* Share Info */}
            <p className="text-gray-400 text-xs text-center mt-4 max-w-xs">
              Share your light with the world and inspire others to pray
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerConfirmationPage;
