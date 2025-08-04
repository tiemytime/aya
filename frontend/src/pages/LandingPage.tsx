import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarfieldBackground from '@/components/shared/StarfieldBackground';

interface LandingPageProps {
  onNavigateToGlobe?: () => void;
}

/**
 * Enhanced Landing Page - Exact match to reference image with improvements
 */
const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToGlobe }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Text appears first
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 500);

    // Loading finishes, button appears
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowEnterButton(true);
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleEnter = () => {
    if (onNavigateToGlobe) {
      onNavigateToGlobe();
    } else {
      navigate('/globe');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Globe-based Realistic Starfield Background */}
      <StarfieldBackground numStars={10000} enableAnimation={true} />
      
      {/* Additional cosmic atmosphere overlay */}
      <div className="absolute inset-0 z-10">
        {/* Subtle dark gradient overlays for enhanced depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/15 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 via-blue-950/8 to-indigo-950/15"></div>
        
        {/* Central subtle nebula */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/10 via-purple-600/6 via-indigo-800/4 to-transparent rounded-full blur-3xl animate-breathe"></div>
        
        {/* Subtle ambient clouds */}
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-gradient-radial from-purple-600/8 via-blue-700/4 to-transparent rounded-full blur-3xl animate-drift"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-radial from-indigo-600/6 via-cyan-600/3 to-transparent rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Enhanced Logo - Top Left (moved significantly inward) */}
      <div className="absolute z-40" style={{ top: '44px', left: '44px' }}>
        <div className="flex items-center space-x-4 group">
          {/* Simple logo without border or glow */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-16 h-16 rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  // Fallback to geometric design if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback geometric logo */}
              <div className="hidden w-16 h-16 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full opacity-80"></div>
                <div className="absolute inset-1 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-white font-bold text-lg">A</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Enhanced centered layout */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Enhanced Main Text with Beautiful Typography */}
        <div className={`text-center mb-20 transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="leading-tight tracking-wide">
            <div className={`mb-8 text-white hover:text-blue-50 transition-colors duration-700 ${textVisible ? 'animate-glow-text' : ''}`}
                 style={{ 
                   fontFamily: "'Playfair Display', 'Georgia', serif",
                   fontWeight: 200,
                   letterSpacing: '0.03em',
                   textShadow: '0 0 40px rgba(147,197,253,0.3), 0 0 80px rgba(59,130,246,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                   fontSize: 'clamp(2.5rem, 8vw, 6rem)'
                 }}>
              One prayer
            </div>
            <div className={`text-white hover:text-blue-50 transition-colors duration-700 ${textVisible ? 'animate-glow-text-delayed' : ''}`}
                 style={{ 
                   fontFamily: "'Playfair Display', 'Georgia', serif",
                   fontWeight: 200,
                   letterSpacing: '0.03em',
                   textShadow: '0 0 40px rgba(147,197,253,0.3), 0 0 80px rgba(59,130,246,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                   fontSize: 'clamp(2.5rem, 8vw, 6rem)'
                 }}>
              One world
            </div>
          </h1>
        </div>

        {/* Enhanced Loading with elegant animation */}
        {isLoading && (
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full animate-pulse-wave"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <div className="text-white text-sm tracking-[0.2em] font-light opacity-80 animate-breathe">
              Loading
            </div>
          </div>
        )}

        {/* Enhanced Enter Button */}
        {showEnterButton && (
          <div className="text-center animate-fade-in-up">
            <button
              onClick={handleEnter}
              className="group relative px-12 py-5 text-white text-sm font-light tracking-[0.2em] border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-white/5 hover:border-white/40 transition-all duration-700 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 rounded-lg"
            >
              <span className="relative z-10 uppercase">Enter Sacred Space</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-lg"></div>
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Inline Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes drift {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(10px) translateY(-5px); }
          66% { transform: translateX(-5px) translateY(10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 5px rgba(255,255,255,0.5); }
          50% { box-shadow: 0 0 20px rgba(255,255,255,0.8); }
        }
        
        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.3); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.6); }
        }
        
        @keyframes glow-text-delayed {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.3); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.6); }
        }
        
        @keyframes pulse-wave {
          0%, 80%, 100% { opacity: 0.4; transform: scale(1); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        
        .animate-drift {
          animation: drift 8s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .animate-glow-text {
          animation: glow-text 4s ease-in-out infinite;
        }
        
        .animate-glow-text-delayed {
          animation: glow-text-delayed 4s ease-in-out infinite 0.5s;
        }
        
        .animate-pulse-wave {
          animation: pulse-wave 1.5s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        /* Ensure all background elements are visible */
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600&family=Inter:wght@200;300;400;500&display=swap');
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        `
      }} />
    </div>
  );
};

export default LandingPage;
