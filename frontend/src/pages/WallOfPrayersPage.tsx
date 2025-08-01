import React, { useState } from 'react';
import { GeneratedPrayer } from '@/types/ai';
import { Button } from '@/components/UI';
import { usePrayerHistory } from '@/hooks';

// Mock hook removed - now using the actual hook from usePrayerGeneration.ts

// Simple Modal component for prayer details
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const WallOfPrayersPage: React.FC = () => {
  const [selectedPrayer, setSelectedPrayer] = useState<GeneratedPrayer | null>(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: prayersData, isLoading, error } = usePrayerHistory(1, 20, filter === 'All' ? undefined : filter, searchQuery);

  const handlePrayerClick = (prayer: GeneratedPrayer) => {
    setSelectedPrayer(prayer);
  };

  const handleCloseModal = () => {
    setSelectedPrayer(null);
  };

  const handleSharePrayer = async () => {
    if (!selectedPrayer) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Prayer from AYA Wall of Prayers',
          text: `"${selectedPrayer.generatedText}" - From AYA's global prayer network`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(selectedPrayer.generatedText);
        alert('Prayer copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing prayer:', error);
      alert('Share functionality: Copy this prayer and share it with others to spread light and hope!');
    }
  };

  const filters = ['Last event', 'Most trend', 'Environment', 'Religion', 'All'];

  // Helper function to render starry background
  const renderStarryBackground = () => {
    return (
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
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

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get username from userId (mock implementation)
  const getUserName = (userId: string) => {
    const userNames: Record<string, string> = {
      user1: 'Sebastian',
      user2: 'Maria',
      user3: 'David',
      user4: 'Sarah',
    };
    return userNames[userId] || 'Anonymous';
  };

  return (
    <div className="relative w-screen min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden text-white">
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

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold text-xl">AYA</div>
            <div className="text-gray-400 text-sm">Global Prayer Network</div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <input 
              type="text" 
              placeholder="Search an event, write a keyword" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-800 bg-opacity-60 text-white border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-400"
            />
          </div>

          <div className="text-white font-medium tracking-wide">
            Wall of Prayers
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Wall of Prayers</h1>
          <p className="text-gray-400">Discover prayers from hearts around the world</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center space-x-4 mb-8">
          {filters.map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === f 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg' 
                  : 'bg-gray-800 bg-opacity-60 text-white hover:bg-gray-700 border border-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="ml-4 text-gray-400">Loading prayers...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-400">Error loading prayers: {error.message}</p>
          </div>
        )}

        {/* Prayers Grid */}
        {!isLoading && !error && (
          <div className="px-8 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {prayersData?.data?.prayers.map((prayer: GeneratedPrayer) => (
                <div 
                  key={prayer._id} 
                  className="bg-gray-800 bg-opacity-60 backdrop-blur-sm p-6 rounded-lg cursor-pointer hover:bg-gray-700 hover:bg-opacity-70 transition-all duration-200 transform hover:scale-105 border border-gray-600 hover:border-gray-500"
                  onClick={() => handlePrayerClick(prayer)}
                >
                  {/* Prayer Card Header */}
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-2">🕯️</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">Prayer Note</h3>
                      <p className="text-xs text-gray-400">{formatDate(prayer.createdAt)}</p>
                    </div>
                  </div>
                  
                  {/* Prayer Content Preview */}
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    "{prayer.generatedText.slice(0, 100)}..."
                  </p>
                  
                  {/* Prayer Details */}
                  <div className="space-y-1 text-xs text-gray-400">
                    <p><span className="text-gray-500">Intent:</span> {prayer.userIntent}</p>
                    <p><span className="text-gray-500">Theme:</span> {prayer.theme || 'General'}</p>
                    <p><span className="text-gray-500">By:</span> {getUserName(prayer.userId)}</p>
                  </div>

                  {/* Audio indicator */}
                  {prayer.audioGenerated && (
                    <div className="mt-3 flex items-center text-xs text-blue-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4.266-3.308a4.5 4.5 0 00-2.743-.962h-.168a3 3 0 01-3-3V8.5a3 3 0 013-3h.168a4.5 4.5 0 002.743-.962L8.383 1.23A1 1 0 019.383 3.076z" clipRule="evenodd" />
                      </svg>
                      Audio available
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Notes Count */}
            <div className="text-center mt-12">
              <p className="text-gray-400">
                {prayersData?.data?.pagination.total} Total prayer notes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Prayer Detail Modal */}
      <Modal 
        isOpen={!!selectedPrayer} 
        onClose={handleCloseModal} 
        title={selectedPrayer?.userIntent || "Prayer Details"}
      >
        {selectedPrayer && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Event/Prayer Info */}
            <div className="lg:w-1/2 space-y-6">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">🕯️</div>
                <div>
                  <h3 className="font-bold text-white text-lg">Prayer Details</h3>
                  <p className="text-gray-400 text-sm">From the global prayer network</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <p className="text-gray-400">
                  <span className="text-white font-medium">Intent:</span> {selectedPrayer.userIntent}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-medium">Theme:</span> {selectedPrayer.theme || 'General'}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-medium">Language:</span> {selectedPrayer.language}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-medium">Length:</span> {selectedPrayer.length}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-medium">Created:</span> {formatDate(selectedPrayer.createdAt)}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-medium">By:</span> {getUserName(selectedPrayer.userId)}
                </p>
              </div>

              <Button 
                onClick={() => alert('Join global prayer functionality coming soon!')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                🙏 Join the global prayer
              </Button>
            </div>
            
            {/* Right Side - Prayer Text */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-4">
                  {getUserName(selectedPrayer.userId)} left a prayer:
                </p>
                <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg border border-gray-600">
                  <p className="text-white text-lg italic leading-relaxed">
                    "{selectedPrayer.generatedText}"
                  </p>
                </div>
              </div>

              {/* Audio Player */}
              {selectedPrayer.audioGenerated && selectedPrayer.s3FileUrl && (
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🎧</div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">Audio Prayer</p>
                      <p className="text-gray-400 text-xs">Listen to this prayer</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      ▶ Play
                    </button>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSharePrayer}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-full font-medium"
              >
                📤 Share prayer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WallOfPrayersPage;
