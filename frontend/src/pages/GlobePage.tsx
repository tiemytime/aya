import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewsEvents } from '@/hooks';
import { NewsEvent } from '@/types';
import { RealGlobe3D, getTimeAgo, getPriorityColor } from '@/utils';
import { Button, AudioPlayer } from '@/components/UI';

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
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<RealGlobe3D | null>(null);

  // Handle marker click events
  const handleMarkerClick = useCallback((event: NewsEvent) => {
    setSelectedEvent(event);
    setIsPanelExpanded(true);
  }, []);

  // Initialize Globe once when component mounts
  useEffect(() => {
    const initGlobe = async () => {
      if (globeContainerRef.current && !globeInstanceRef.current) {
        try {
          // Clear container first
          globeContainerRef.current.innerHTML = '';
          
          // Initialize with container element (exact same pattern as original Globe)
          const globeInstance = new RealGlobe3D(globeContainerRef.current);
          globeInstanceRef.current = globeInstance;
          
          // Add event listener for marker clicks
          globeInstance.addEventListener('markerClick', handleMarkerClick);
          
          console.log('Globe initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Globe3D:', error);
        }
      }
    };

    initGlobe();

    // Cleanup on unmount
    return () => {
      if (globeInstanceRef.current) {
        globeInstanceRef.current.removeEventListener('markerClick', handleMarkerClick);
        globeInstanceRef.current.dispose();
        globeInstanceRef.current = null;
      }
    };
  }, [handleMarkerClick]);

  // Update markers when news data changes
  useEffect(() => {
    if (newsData?.data?.events && globeInstanceRef.current) {
      // Clear existing markers
      globeInstanceRef.current.clearEventMarkers();
      
      // Add new markers
      newsData.data.events.forEach(event => {
        if (globeInstanceRef.current) {
          globeInstanceRef.current.addEventMarker(event);
        }
      });

      console.log(`Added ${newsData.data.events.length} markers to globe`);
    }
  }, [newsData]);

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
      {/* Globe Container - Full screen with exact original styling */}
      <div 
        ref={globeContainerRef} 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-black via-gray-900 to-black"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 35%, #0f0f23 100%)'
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading Globe...</p>
          </div>
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
