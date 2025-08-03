import React, { useState } from 'react';
import { Button, PrayerDetailDialog } from '@/components/UI';
import { GeneratedPrayer } from '@/types/ai';

/**
 * Demo component to showcase the PrayerDetailDialog
 */
const PrayerDetailDialogDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock prayer data for demonstration
  const mockPrayer: GeneratedPrayer = {
    _id: '67890abcdef123456789',
    userId: 'user2',
    userIntent: 'Healing for those affected by natural disasters and peace for troubled regions',
    theme: 'Environment',
    keywords: ['healing', 'peace', 'nature', 'compassion', 'unity'],
    language: 'English',
    length: 'medium',
    generatedText: 'Divine Source of all creation, we humbly come before you with hearts full of concern for our world. We pray for healing light to shine upon those who suffer from natural disasters and conflicts. May your peace flow like a gentle river through troubled lands, bringing comfort to the afflicted and hope to the despairing. Guide us to be instruments of your love, spreading compassion and understanding wherever we go. Help us remember that we are all connected in the web of life, and what affects one affects us all. Bless our beautiful Earth and all its inhabitants with harmony, healing, and hope. Amen.',
    audioGenerated: true,
    s3FileUrl: 'https://example.com/prayer-audio.mp3',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Prayer from AYA',
          text: `"${mockPrayer.generatedText.slice(0, 100)}..." - Shared from AYA's global prayer network`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(mockPrayer.generatedText);
        alert('Prayer copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing prayer:', error);
      alert('Prayer copied to your heart! Share it with the world to spread love and hope.');
    }
  };

  const handleJoinPrayer = () => {
    alert('Joining global prayer meditation... 🙏✨ May peace be with you.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-elegant text-cosmic-starlight text-shadow-cosmic">
            Prayer Detail Dialog Demo
          </h1>
          <p className="text-cosmic-silver-mist font-modern max-w-2xl">
            Click the button below to view a detailed prayer in the cosmic-themed dialog
            with frosted glass effects and beautiful typography.
          </p>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          variant="cosmic-gold"
          size="lg"
          className="px-8 py-3 cosmic-pulse"
        >
          🕯️ View Prayer Details
        </Button>

        <PrayerDetailDialog
          prayer={mockPrayer}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onShare={handleShare}
          onJoinPrayer={handleJoinPrayer}
          userName="Maria Santos"
          userLocation="São Paulo, Brazil"
        />
      </div>
    </div>
  );
};

export default PrayerDetailDialogDemo;
