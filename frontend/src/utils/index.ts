// Utility functions exports
export { cn } from './cn';
export { RealGlobe3D, type NewsEvent } from './realGlobe3d';

// Globe initialization function for compatibility
export async function initializeGlobe(containerElement: HTMLElement) {
  const { RealGlobe3D } = await import('./realGlobe3d');
  return new RealGlobe3D(containerElement);
}

// Type alias for Globe instance
export type Globe3DInstance = import('./realGlobe3d').RealGlobe3D;

// Utility functions for the Globe page
export function getTimeAgo(date: string): string {
  const now = new Date();
  const eventDate = new Date(date);
  const diffInMs = now.getTime() - eventDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
}

export function getPriorityColor(priority: number): string {
  if (priority >= 8) return '#ff0000'; // Critical - red
  if (priority >= 6) return '#ff6600'; // High - orange
  if (priority >= 4) return '#ffff00'; // Medium - yellow
  return '#00ff00'; // Low - green
}
