import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewsEvents } from '@/hooks';
import { NewsEvent } from '@/types';
import { getTimeAgo, getPriorityColor } from '@/utils';
import { Button, AudioPlayer, LoadingSpinner } from '@/components/UI';

// Lazy load the Globe3D component for better initial page load performance
const LazyGlobe3D = lazy(() => import('@/components/Globe/Globe3D'));

/**
 * GlobePage component - Interactive 3D globe with news events
 * Based on the original Globe design with React integration
 * Features cosmic starry background with centered Earth globe and interactive event markers
 */
const GlobePage: React.FC = () => {
  const { data: newsData, isLoading, error, refetch } = useNewsEvents();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<NewsEvent | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // Handle marker click events
  const handleMarkerClick = useCallback((event: NewsEvent) => {
    setSelectedEvent(event);
    setIsPanelExpanded(true);
  }, []);

  const handleJoinPrayer = () => {
    if (selectedEvent) {
      navigate('/submit-prayer', { 
        state: { selectedEvent } 
      });
    }
  };

  const handleShareEvent = () => {
    if (selectedEvent) {
      if (navigator.share) {
        navigator.share({
          title: selectedEvent.title,
          text: selectedEvent.description,
          url: selectedEvent.url
        });
      } else {
        navigator.clipboard.writeText(selectedEvent.url);
      }
    }
  };

  const filteredEvents = newsData?.data?.events || [];

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Globe</h1>
          <p className="text-gray-400 mb-4">Failed to load news events</p>
          <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Lazy-loaded Globe3D Component */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <LoadingSpinner 
            message="Loading Interactive Globe..." 
            className="text-white" 
          />
        </div>
      }>
        <LazyGlobe3D 
          newsEvents={filteredEvents}
          onMarkerClick={handleMarkerClick}
          className="absolute inset-0 w-full h-full"
        />
      </Suspense>

      {/* Loading overlay for news data */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <LoadingSpinner message="Loading News Events..." className="text-white" />
        </div>
      )}

      {/* Event Details Panel */}
      <div className={`
        absolute top-0 left-0 h-full w-96 bg-gray-900 bg-opacity-95 backdrop-blur-md
        transform transition-transform duration-300 ease-in-out z-20
        ${isPanelExpanded ? 'translate-x-0' : '-translate-x-full'}
        border-r border-gray-700
      `}>
        {selectedEvent && (
          <div className="p-6 h-full overflow-y-auto">
            <button
              onClick={() => setIsPanelExpanded(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-8">
              <div className="flex items-center mb-4">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getPriorityColor(selectedEvent.priority) }}
                />
                <span className="text-sm text-gray-400 uppercase tracking-wider">
                  {selectedEvent.country}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-4 leading-tight">
                {selectedEvent.title}
              </h2>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getTimeAgo(selectedEvent.published_at)}
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  {selectedEvent.source}
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Priority: {selectedEvent.priority}/10
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleJoinPrayer}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                >
                  🙏 Join Prayer Circle
                </Button>

                <Button
                  onClick={handleShareEvent}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
                >
                  📤 Share Event
                </Button>

                {selectedEvent.url && (
                  <a
                    href={selectedEvent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    📰 Read Full Article
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event List Toggle */}
      {!isPanelExpanded && filteredEvents.length > 0 && (
        <button
          onClick={() => {
            if (filteredEvents.length > 0) {
              setSelectedEvent(filteredEvents[0]);
              setIsPanelExpanded(true);
            }
          }}
          className="absolute bottom-6 right-6 bg-gray-900 bg-opacity-90 backdrop-blur-md text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all duration-200 z-20"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {filteredEvents.length} Events
            </span>
          </div>
        </button>
      )}

      {/* Audio Player */}
      <div className="absolute top-6 right-6 z-20">
        <AudioPlayer />
      </div>

      {/* Status indicator */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : error ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span className="text-sm">
              {isLoading ? 'Loading...' : error ? 'Connection Error' : 'Live Data'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobePage;
