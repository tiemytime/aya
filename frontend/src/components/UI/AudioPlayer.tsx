import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  className?: string;
}

/**
 * AudioPlayer component for playing ambient prayer sounds
 * Used in the bottom left of the Globe page (as shown in page4.jpg)
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  title = "Global Prayer Ambient", 
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-4 bg-black bg-opacity-70 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700 ${className}`}>
      {/* Hidden audio element - would be replaced with actual audio URL */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center text-white shadow-lg"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {/* Track Info */}
      <div className="text-white min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-gray-400 truncate">
          {isPlaying ? 'Now playing...' : 'Ambient prayer soundtrack'}
        </div>
        
        {/* Progress Bar (shown only when audio is loaded) */}
        {duration > 0 && (
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4.266-3.308a4.5 4.5 0 00-2.743-.962h-.168a3 3 0 01-3-3V8.5a3 3 0 013-3h.168a4.5 4.5 0 002.743-.962L8.383 1.23A1 1 0 019.383 3.076zM15 8a2 2 0 012 2v0a2 2 0 01-2 2h-.5a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5H15z" clipRule="evenodd" />
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
