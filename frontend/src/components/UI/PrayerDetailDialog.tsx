import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  Label
} from '@/components/UI';
import { GeneratedPrayer } from '@/types/ai';

interface PrayerDetailDialogProps {
  prayer: GeneratedPrayer | null;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  onJoinPrayer?: () => void;
  userName?: string;
  userLocation?: string;
}

/**
 * PrayerDetailDialog - A detailed view of an individual prayer using shadcn Dialog
 * Features frosted glass background, cosmic theme, and clean typography presentation
 */
export const PrayerDetailDialog: React.FC<PrayerDetailDialogProps> = ({
  prayer,
  isOpen,
  onClose,
  onShare,
  onJoinPrayer,
  userName,
  userLocation
}) => {
  if (!prayer) return null;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get user display name
  const getDisplayName = () => {
    if (userName) return userName;
    // Extract name from userId or use default
    const userNames: Record<string, string> = {
      user1: 'Sebastian',
      user2: 'Maria',
      user3: 'David',
      user4: 'Sarah',
      user5: 'Elena'
    };
    return userNames[prayer.userId] || 'Anonymous';
  };

  // Get theme color variant
  const getThemeVariant = (theme?: string) => {
    switch (theme?.toLowerCase()) {
      case 'environment':
        return 'cosmic-green';
      case 'religion':
        return 'cosmic-purple';
      case 'health':
        return 'cosmic-gold';
      default:
        return 'cosmic';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full mx-4 max-h-[95vh] bg-glass-bg-heavy/85 backdrop-blur-ethereal border border-cosmic-ethereal-purple/50 shadow-deep-space-heavy hover:shadow-glow-ethereal/40 overflow-hidden rounded-2xl transition-all duration-500">
        {/* Starry overlay for extra depth */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-cosmic-starlight rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>
        {/* Header Section */}
        <DialogHeader className="relative z-10 pb-8 border-b border-glass-border-light/40 bg-gradient-to-r from-cosmic-void/20 to-cosmic-deep-space/30 -m-6 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-5">
              <Avatar className="h-14 w-14 border-2 border-cosmic-ethereal-purple/60 shadow-glow-purple/50 hover:shadow-glow-ethereal/70 transition-all duration-300">
                <AvatarFallback className="bg-gradient-to-br from-cosmic-ethereal-purple/40 to-cosmic-spirit-purple/50 text-cosmic-starlight text-2xl font-elegant">
                  🕯️
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-elegant text-cosmic-starlight mb-2 text-shadow-cosmic">
                  Prayer by {getDisplayName()}
                </DialogTitle>
                <DialogDescription className="text-cosmic-silver-mist font-modern flex items-center space-x-6 text-sm">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-cosmic-secondary rounded-full animate-pulse"></span>
                    <span>{formatDate(prayer.createdAt)}</span>
                  </span>
                  {userLocation && (
                    <span className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-cosmic-accent rounded-full animate-pulse"></span>
                      <span>{userLocation}</span>
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
            
            {/* Prayer metadata badges */}
            <div className="flex flex-col items-end space-y-3">
              <Badge 
                variant={getThemeVariant(prayer.theme)} 
                className="animate-glow-pulse-slow shadow-glow-purple/30 px-4 py-2 text-sm font-medium"
              >
                {prayer.theme || 'General'}
              </Badge>
              {prayer.audioGenerated && (
                <Badge variant="cosmic-green" className="text-xs flex items-center space-x-2 px-3 py-1.5 shadow-glow-blue/20">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4.266-3.308a4.5 4.5 0 00-2.743-.962h-.168a3 3 0 01-3-3V8.5a3 3 0 013-3h.168a4.5 4.5 0 002.743-.962L8.383 1.23A1 1 0 019.383 3.076z" clipRule="evenodd" />
                  </svg>
                  <span>Audio Available</span>
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 py-8 overflow-y-auto max-h-[60vh]">
          
          {/* Left Panel - Prayer Details */}
          <div className="lg:w-2/5 space-y-8">
            {/* Prayer Intent */}
            <div className="space-y-4">
              <Label className="text-cosmic-moonlight font-medium text-sm uppercase tracking-widest flex items-center space-x-2">
                <span className="w-3 h-3 bg-gradient-to-r from-cosmic-ethereal-purple to-cosmic-spirit-purple rounded-full"></span>
                <span>Prayer Intention</span>
              </Label>
              <div className="bg-gradient-to-br from-glass-bg-light/60 to-glass-bg-medium/40 backdrop-blur-cosmic p-6 rounded-xl border border-glass-border-light/50 shadow-float hover:shadow-glow-purple/20 transition-all duration-300">
                <p className="text-cosmic-starlight font-modern leading-relaxed text-base">
                  {prayer.userIntent}
                </p>
              </div>
            </div>

            {/* Prayer Metadata */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-cosmic-silver-mist text-xs uppercase tracking-widest font-medium">
                  Language
                </Label>
                <div className="bg-glass-bg-light/30 backdrop-blur-sm p-3 rounded-lg border border-glass-border-light/30">
                  <p className="text-cosmic-starlight font-modern text-sm font-medium">
                    {prayer.language}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-cosmic-silver-mist text-xs uppercase tracking-widest font-medium">
                  Length
                </Label>
                <div className="bg-glass-bg-light/30 backdrop-blur-sm p-3 rounded-lg border border-glass-border-light/30">
                  <p className="text-cosmic-starlight font-modern text-sm font-medium capitalize">
                    {prayer.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            {prayer.keywords && prayer.keywords.length > 0 && (
              <div className="space-y-4">
                <Label className="text-cosmic-silver-mist text-xs uppercase tracking-widest font-medium flex items-center space-x-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-cosmic-spirit-teal to-cosmic-ethereal-cyan rounded-full"></span>
                  <span>Keywords</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {prayer.keywords.map((keyword, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs px-3 py-1.5 hover:bg-cosmic-ethereal-purple/20 transition-colors duration-200"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Panel - Prayer Text */}
          <div className="lg:w-3/5 space-y-8">
            {/* Main Prayer Text */}
            <div className="space-y-6">
              <Label className="text-cosmic-moonlight font-medium text-sm uppercase tracking-widest flex items-center space-x-2">
                <span className="w-3 h-3 bg-gradient-to-r from-cosmic-solar-gold to-cosmic-stellar-gold rounded-full animate-pulse"></span>
                <span>Sacred Prayer Text</span>
              </Label>
              <div className="bg-gradient-to-br from-glass-bg-heavy/70 to-glass-bg-medium/50 backdrop-blur-ethereal p-10 rounded-2xl border-2 border-cosmic-ethereal-purple/40 shadow-deep-space hover:shadow-glow-ethereal/30 transition-all duration-500 relative overflow-hidden">
                {/* Subtle glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cosmic-ethereal-purple/10 via-transparent to-cosmic-spirit-purple/10 pointer-events-none"></div>
                
                <blockquote className="relative z-10 text-cosmic-starlight text-xl leading-relaxed font-modern italic text-center space-y-4">
                  <span className="text-cosmic-solar-gold text-3xl font-elegant">"</span>
                  <div className="px-4">
                    {prayer.generatedText}
                  </div>
                  <span className="text-cosmic-solar-gold text-3xl font-elegant">"</span>
                </blockquote>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cosmic-ethereal-purple/30"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cosmic-ethereal-purple/30"></div>
              </div>
            </div>

            {/* Audio Player Section */}
            {prayer.audioGenerated && prayer.s3FileUrl && (
              <div className="bg-gradient-to-r from-glass-bg-light/50 to-glass-bg-medium/40 backdrop-blur-cosmic p-8 rounded-xl border border-cosmic-spirit-teal/40 shadow-float hover:shadow-glow-blue/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-cosmic-spirit-teal/50">
                      <AvatarFallback className="bg-gradient-to-br from-cosmic-spirit-teal/40 to-cosmic-ethereal-cyan/30 text-cosmic-starlight text-xl">
                        🎧
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <Label className="text-cosmic-starlight font-medium text-lg">Divine Audio Prayer</Label>
                      <p className="text-cosmic-silver-mist text-sm font-modern">
                        Experience this prayer with ethereal voice guidance
                      </p>
                    </div>
                  </div>
                  <Button variant="cosmic-green" size="lg" className="flex items-center space-x-3 px-6 py-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Play Prayer</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-glass-border-light/50 bg-gradient-to-r from-cosmic-void/20 to-cosmic-deep-space/30 -m-6 p-6 mt-6 space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="text-center sm:text-left space-y-2">
            <p className="text-cosmic-silver-mist text-sm font-modern flex items-center space-x-2">
              <span className="w-2 h-2 bg-cosmic-ethereal-purple rounded-full animate-pulse"></span>
              <span>Prayer #{prayer._id.slice(-8)}</span>
            </p>
            <p className="text-cosmic-moonlight text-xs font-modern">
              Created with love • {formatDate(prayer.createdAt)}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {onJoinPrayer && (
              <Button 
                onClick={onJoinPrayer}
                variant="cosmic-gold" 
                size="lg"
                className="flex items-center space-x-3 px-8 py-3 cosmic-pulse shadow-glow-gold/30"
              >
                <span className="text-xl">🙏</span>
                <span className="font-medium">Join Global Prayer</span>
              </Button>
            )}
            
            {onShare && (
              <Button 
                onClick={onShare}
                variant="outline" 
                size="lg"
                className="flex items-center space-x-3 px-6 py-3 hover:bg-cosmic-ethereal-purple/20 hover:border-cosmic-ethereal-purple/60 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="font-medium">Share Prayer</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrayerDetailDialog;
