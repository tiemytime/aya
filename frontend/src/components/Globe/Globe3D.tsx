import React, { useEffect, useRef, useCallback } from 'react';
import { NewsEvent } from '@/types';
import { RealGlobe3D } from '@/utils';

interface Globe3DProps {
  newsEvents: NewsEvent[];
  onMarkerClick: (event: NewsEvent) => void;
  className?: string;
}

/**
 * Globe3D component - Handles the 3D Earth globe rendering
 * Separated from GlobePage for better code organization and lazy loading
 */
const Globe3D: React.FC<Globe3DProps> = ({ newsEvents, onMarkerClick, className = "" }) => {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<RealGlobe3D | null>(null);

  // Handle marker click events
  const handleMarkerClick = useCallback((event: NewsEvent) => {
    onMarkerClick(event);
  }, [onMarkerClick]);

  // Initialize Globe
  useEffect(() => {
    const initGlobe = async () => {
      if (globeContainerRef.current && !globeInstanceRef.current) {
        try {
          // Clear container first
          globeContainerRef.current.innerHTML = '';
          
          // Initialize with container element
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
        globeInstanceRef.current = null;
      }
    };
  }, [handleMarkerClick]);

  // Update markers when events change
  useEffect(() => {
    if (globeInstanceRef.current && newsEvents?.length > 0) {
      try {
        // Clear existing markers
        globeInstanceRef.current.clearEventMarkers();
        
        // Add new markers (pass entire event like in original implementation)
        newsEvents.forEach(event => {
          if (globeInstanceRef.current) {
            globeInstanceRef.current.addEventMarker(event);
          }
        });
        
        console.log(`Added ${newsEvents.length} markers to globe`);
      } catch (error) {
        console.error('Error updating globe markers:', error);
      }
    }
  }, [newsEvents]);

  return (
    <div 
      ref={globeContainerRef} 
      className={`globe-container w-full h-full ${className}`}
      style={{ 
        minHeight: '500px',
        background: 'radial-gradient(circle, rgba(30,41,59,0.3) 0%, rgba(0,0,0,0.8) 100%)'
      }}
    />
  );
};

export default Globe3D;
