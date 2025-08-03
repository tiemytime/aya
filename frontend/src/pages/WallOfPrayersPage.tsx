import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneratedPrayer } from '@/types/ai';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Badge, Avatar, AvatarFallback, Input, PrayerDetailDialog, Button } from '@/components/UI';
import { usePrayerHistory } from '@/hooks';

// Mock hook removed - now using the actual hook from usePrayerGeneration.ts

const WallOfPrayersPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleJoinPrayer = () => {
    alert('Joining global prayer meditation... 🙏✨ May peace be with you and all beings.');
  };

  const filters = ['Last event', 'Most trend', 'Environment', 'Religion', 'All'];

  // Helper function to render enhanced starry background
  const renderStarryBackground = () => {
    return (
      <div className="absolute inset-0">
        {Array.from({ length: 300 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              i % 3 === 0 ? 'w-2 h-2 bg-cosmic-starlight' : 
              i % 3 === 1 ? 'w-1 h-1 bg-cosmic-violet-mist' : 
              'w-0.5 h-0.5 bg-cosmic-silver-mist'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.9 + 0.1,
            }}
          />
        ))}
      </div>
    );
  };

  // Enhanced cosmic nebula effects
  const renderCosmicNebulae = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary nebula */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(79, 70, 229, 0.3) 25%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
            animationDuration: '8s'
          }}
        />
        {/* Secondary nebula */}
        <div 
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-25 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.2) 30%, transparent 60%)',
            animationDuration: '12s',
            animationDelay: '2s'
          }}
        />
        {/* Accent nebula */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.2) 25%, transparent 50%)',
            animationDuration: '10s',
            animationDelay: '4s'
          }}
        />
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
    <div className="relative w-screen min-h-screen bg-gradient-to-br from-cosmic-void via-cosmic-deep-space to-cosmic-void overflow-hidden">
      {/* Enhanced starry background */}
      <div className="absolute inset-0 opacity-60">
        {renderStarryBackground()}
      </div>

      {/* Cosmic nebulae effects */}
      {renderCosmicNebulae()}

      {/* Floating cosmic particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-cosmic-solar-gold rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content container with enhanced glassmorphism */}
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-transparent via-cosmic-void/10 to-transparent">
        {/* Enhanced Header */}
        <header className="backdrop-blur-cosmic bg-glass-bg-heavy/20 border-b border-glass-border-light/30 sticky top-0 z-20">
          <div className="flex items-center justify-between p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Logo section */}
            <div className="flex items-center space-x-6">
              {/* Back button */}
              <Button
                onClick={() => navigate('/')}
                variant="cosmic-ghost"
                size="sm"
                className="flex items-center space-x-2 hover:bg-cosmic-ethereal-purple/20 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back to Globe</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cosmic-solar-gold to-cosmic-stellar-gold rounded-full flex items-center justify-center shadow-glow-gold/50 animate-glow-pulse-slow">
                    <span className="text-cosmic-void text-xl font-bold">🕯️</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-cosmic-solar-gold/30 to-cosmic-stellar-gold/30 rounded-full blur animate-pulse"></div>
                </div>
                <div>
                  <div className="text-cosmic-starlight font-elegant text-2xl font-bold text-shadow-cosmic">AYA</div>
                  <div className="text-cosmic-silver-mist text-sm font-modern">Global Prayer Network</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="🔍 Search prayers, events, or keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-2xl bg-glass-bg-heavy/60 backdrop-blur-cosmic text-cosmic-starlight border-2 border-cosmic-ethereal-purple/40 focus:border-cosmic-ethereal-purple focus:ring-2 focus:ring-cosmic-ethereal-purple/50 focus:bg-glass-bg-heavy/80 transition-all duration-500 placeholder-cosmic-silver-mist text-lg shadow-float hover:shadow-glow-purple/20"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cosmic-ethereal-purple/20 to-cosmic-spirit-purple/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-cosmic-silver-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Page title */}
            <div className="text-cosmic-starlight font-elegant text-xl font-medium tracking-wide">
              Wall of Prayers
            </div>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            {/* Main title with enhanced styling */}
            <div className="space-y-6 mb-12">
              <h1 className="text-5xl lg:text-7xl font-elegant text-cosmic-starlight mb-6 text-shadow-cosmic">
                <span className="bg-gradient-to-r from-cosmic-starlight via-cosmic-violet-mist to-cosmic-starlight bg-clip-text text-transparent">
                  Wall of Prayers
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-cosmic-silver-mist font-modern max-w-4xl mx-auto leading-relaxed">
                Discover sacred intentions from hearts around the world. Each prayer is a 
                <span className="text-cosmic-solar-gold font-medium"> beacon of hope </span>
                in our shared cosmic journey.
              </p>
              
              {/* Stats section */}
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                <div className="bg-glass-bg-medium/40 backdrop-blur-cosmic px-6 py-4 rounded-2xl border border-cosmic-ethereal-purple/30 shadow-float">
                  <div className="text-2xl font-bold text-cosmic-starlight">
                    {prayersData?.data?.pagination.total || '∞'}
                  </div>
                  <div className="text-sm text-cosmic-silver-mist font-modern">Sacred Prayers</div>
                </div>
                <div className="bg-glass-bg-medium/40 backdrop-blur-cosmic px-6 py-4 rounded-2xl border border-cosmic-spirit-teal/30 shadow-float">
                  <div className="text-2xl font-bold text-cosmic-starlight">🌍</div>
                  <div className="text-sm text-cosmic-silver-mist font-modern">Global Unity</div>
                </div>
                <div className="bg-glass-bg-medium/40 backdrop-blur-cosmic px-6 py-4 rounded-2xl border border-cosmic-solar-gold/30 shadow-float">
                  <div className="text-2xl font-bold text-cosmic-starlight">✨</div>
                  <div className="text-sm text-cosmic-silver-mist font-modern">Divine Light</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Filters Section */}
        <section className="relative pb-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-glass-bg-heavy/60 backdrop-blur-cosmic rounded-3xl border border-glass-border-light/40 p-8 shadow-deep-space">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-elegant text-cosmic-starlight mb-3">
                  Filter Sacred Intentions
                </h2>
                <p className="text-cosmic-silver-mist font-modern">
                  Explore prayers by theme and purpose
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {filters.map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)} 
                    className={`px-8 py-4 rounded-2xl font-medium transition-all duration-500 transform hover:scale-105 ${
                      filter === f 
                        ? 'bg-gradient-to-r from-cosmic-solar-gold to-cosmic-stellar-gold text-cosmic-void shadow-glow-gold font-semibold border-2 border-cosmic-solar-gold/50 cosmic-pulse' 
                        : 'bg-glass-bg-medium/50 backdrop-blur-cosmic text-cosmic-starlight hover:bg-glass-bg-light/60 border-2 border-glass-border-light/40 hover:border-cosmic-ethereal-purple/60 hover:shadow-glow-purple/20'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        filter === f ? 'bg-cosmic-void' : 'bg-cosmic-ethereal-purple'
                      } animate-pulse`}></span>
                      <span>{f}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Loading and Error States */}
        {isLoading && (
          <section className="flex flex-col justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-cosmic-ethereal-purple/30 border-l-cosmic-ethereal-purple"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-cosmic-ethereal-purple rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-8 text-cosmic-silver-mist font-modern text-lg">
              Gathering sacred prayers from across the cosmos...
            </p>
            <div className="mt-4 flex space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cosmic-ethereal-purple rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </section>
        )}

        {error && (
          <section className="flex flex-col justify-center items-center py-32">
            <div className="bg-glass-bg-medium/60 backdrop-blur-cosmic p-8 rounded-2xl border border-red-500/30 max-w-md text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-elegant text-cosmic-starlight mb-2">Connection Lost</h3>
              <p className="text-red-400 font-modern mb-4">
                Unable to load prayers: {error.message}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-cosmic-ethereal-purple hover:bg-cosmic-spirit-purple rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* Enhanced Prayers Grid */}
        {!isLoading && !error && (
          <section className="relative pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              
              {/* Grid container with improved layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {prayersData?.data?.prayers.map((prayer: GeneratedPrayer, index: number) => (
                  <Card 
                    key={prayer._id}
                    className="group cursor-pointer bg-glass-bg-heavy/40 backdrop-blur-cosmic border-2 border-glass-border-light/40 hover:border-cosmic-ethereal-purple/80 hover:shadow-glow-ethereal/40 hover:bg-glass-bg-heavy/60 hover:scale-[1.03] transition-all duration-700 ease-out overflow-hidden rounded-2xl"
                    onClick={() => handlePrayerClick(prayer)}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cosmic-ethereal-purple/5 via-transparent to-cosmic-spirit-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardHeader className="relative pb-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-cosmic-ethereal-purple/40 group-hover:border-cosmic-ethereal-purple/80 transition-all duration-500 shadow-glow-purple/20">
                            <AvatarFallback className="bg-gradient-to-br from-cosmic-ethereal-purple/30 to-cosmic-spirit-purple/40 text-cosmic-starlight text-xl">
                              🕯️
                            </AvatarFallback>
                          </Avatar>
                          {/* Pulsing ring effect */}
                          <div className="absolute -inset-1 bg-gradient-to-br from-cosmic-ethereal-purple/20 to-cosmic-spirit-purple/20 rounded-full blur opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-elegant text-cosmic-starlight group-hover:text-cosmic-violet-mist transition-colors duration-500 truncate mb-1">
                            Sacred Light
                          </CardTitle>
                          <CardDescription className="text-sm text-cosmic-silver-mist font-modern flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-cosmic-secondary rounded-full animate-pulse"></span>
                            <span>{formatDate(prayer.createdAt)}</span>
                          </CardDescription>
                        </div>
                        
                        <Badge variant="cosmic-gold" className="text-xs font-medium animate-glow-pulse-slow px-3 py-1 shadow-glow-gold/30">
                          {getUserName(prayer.userId)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative space-y-6">
                      {/* Prayer Content Preview with enhanced styling */}
                      <div className="space-y-3">
                        <p className="text-sm text-cosmic-starlight leading-relaxed line-clamp-4 group-hover:text-cosmic-violet-mist transition-colors duration-500 font-modern italic">
                          "{prayer.generatedText.slice(0, 140)}..."
                        </p>
                      </div>
                      
                      {/* Enhanced Prayer Metadata */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="cosmic-purple" 
                            className="text-xs font-semibold px-3 py-1.5 shadow-glow-purple/20"
                          >
                            {prayer.theme || 'General'}
                          </Badge>
                          {prayer.audioGenerated && (
                            <Badge variant="cosmic-green" className="text-xs flex items-center space-x-2 px-3 py-1.5 shadow-glow-blue/20">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4.266-3.308a4.5 4.5 0 00-2.743-.962h-.168a3 3 0 01-3-3V8.5a3 3 0 013-3h.168a4.5 4.5 0 002.743-.962L8.383 1.23A1 1 0 019.383 3.076z" clipRule="evenodd" />
                              </svg>
                              <span>Audio</span>
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-cosmic-silver-mist font-modern bg-glass-bg-light/30 backdrop-blur-sm p-3 rounded-lg">
                          <p className="truncate flex items-center space-x-2">
                            <span className="text-cosmic-moonlight font-medium flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              <span>Intent:</span>
                            </span> 
                            <span className="text-cosmic-starlight truncate">{prayer.userIntent}</span>
                          </p>
                        </div>
                        
                        {/* Enhanced glowing indicator */}
                        <div className="pt-3 border-t border-glass-border-light/40">
                          <div className="relative h-2 w-full bg-gradient-to-r from-cosmic-ethereal-purple/20 via-cosmic-spirit-purple/40 to-cosmic-ethereal-purple/20 rounded-full group-hover:from-cosmic-ethereal-purple/60 group-hover:via-cosmic-spirit-purple/80 group-hover:to-cosmic-ethereal-purple/60 transition-all duration-700 overflow-hidden">
                            {/* Animated shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cosmic-starlight/30 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Total Count with floating effect */}
              <div className="text-center mt-16">
                <div className="inline-flex items-center space-x-4 bg-glass-bg-heavy/60 backdrop-blur-cosmic px-8 py-4 rounded-2xl border border-cosmic-ethereal-purple/40 shadow-float hover:shadow-glow-ethereal/30 transition-all duration-500">
                  <div className="w-3 h-3 bg-cosmic-ethereal-purple rounded-full animate-pulse"></div>
                  <Badge variant="cosmic" className="text-lg px-6 py-3 font-elegant">
                    {prayersData?.data?.pagination.total} Sacred Prayers Shared
                  </Badge>
                  <div className="w-3 h-3 bg-cosmic-solar-gold rounded-full animate-pulse"></div>
                </div>
                
                {/* Inspiring message */}
                <p className="mt-6 text-cosmic-silver-mist font-modern text-lg max-w-2xl mx-auto">
                  Every prayer is a thread in the tapestry of human connection. 
                  <span className="text-cosmic-solar-gold"> Thank you </span>
                  for being part of this sacred community.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Floating Action Button for New Prayer */}
      <div className="fixed bottom-8 right-8 z-30">
        <Button
          onClick={() => navigate('/submit-prayer')}
          variant="cosmic-gold"
          size="lg"
          className="w-16 h-16 rounded-full shadow-deep-space hover:shadow-glow-gold/60 cosmic-pulse group transition-all duration-500 hover:scale-110"
        >
          <div className="flex flex-col items-center justify-center">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-glass-bg-heavy/90 backdrop-blur-cosmic text-cosmic-starlight px-4 py-2 rounded-lg border border-cosmic-ethereal-purple/30 text-sm font-modern whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Light a new candle
        </div>
      </div>

      {/* Prayer Detail Dialog */}
      <PrayerDetailDialog
        prayer={selectedPrayer}
        isOpen={!!selectedPrayer}
        onClose={handleCloseModal}
        onShare={handleSharePrayer}
        onJoinPrayer={handleJoinPrayer}
        userName={selectedPrayer ? getUserName(selectedPrayer.userId) : undefined}
        userLocation="Global Prayer Network"
      />
    </div>
  );
};

export default WallOfPrayersPage;
