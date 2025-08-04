import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      {/* Enhanced Realistic Space Background with Visible Starfield */}
      <div className="absolute inset-0 z-0">
        {/* Deep space background with subtle blue tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-black"></div>
        
        {/* More visible blue gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/25 via-indigo-900/30 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-blue-600/15 to-indigo-900/25"></div>
        
        {/* Enhanced visible starfield */}
        <div className="absolute inset-0">
          {/* Large bright stars */}
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={`large-star-${i}`}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.6, // Much more visible
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 3}s`,
                boxShadow: `0 0 ${Math.random() * 12 + 4}px rgba(255,255,255,${Math.random() * 0.7 + 0.5})`,
              }}
            />
          ))}
          
          {/* Medium blue-tinted stars */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={`medium-star-${i}`}
              className="absolute bg-blue-100 rounded-full animate-twinkle"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.4, // More visible
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
          
          {/* Small background stars */}
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={`small-star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 1 + 0.5}px`,
                height: `${Math.random() * 1 + 0.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3, // More visible
              }}
            />
          ))}
          
          {/* Very bright focal stars */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`bright-star-${i}`}
              className="absolute bg-white rounded-full animate-glow-pulse"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                boxShadow: `
                  0 0 ${Math.random() * 30 + 15}px rgba(255,255,255,0.9),
                  0 0 ${Math.random() * 50 + 25}px rgba(147,197,253,0.6),
                  0 0 ${Math.random() * 70 + 35}px rgba(59,130,246,0.4)
                `,
              }}
            />
          ))}
          
          {/* More visible constellation lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <linearGradient id="constellationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={`constellation-${i}`}
                d={`M${Math.random() * 100} ${Math.random() * 100} L${Math.random() * 100} ${Math.random() * 100} L${Math.random() * 100} ${Math.random() * 100}`}
                stroke="url(#constellationGrad)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </svg>
        </div>

        {/* More prominent cosmic nebulae */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-400/40 via-purple-600/25 via-indigo-800/20 to-transparent rounded-full blur-3xl animate-breathe"></div>
        
        {/* Visible secondary nebula clouds */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-radial from-purple-500/35 via-blue-600/20 via-indigo-700/15 to-transparent rounded-full blur-3xl animate-drift"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-radial from-blue-600/30 via-cyan-500/15 to-transparent rounded-full blur-3xl animate-float"></div>
        
        {/* Enhanced cosmic dust overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/15 via-transparent to-purple-900/20 animate-breathe"></div>
      </div>

      {/* Enhanced AYA Logo - Top Left */}
      <div className="absolute top-8 left-8 z-30">
        <div className="flex items-center space-x-4 group">
          {/* Circular logo with the actual logo image */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-500/30 to-pink-400/20 backdrop-blur-sm border border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] transition-all duration-500 hover:scale-110 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="AYA Logo" 
                className="w-12 h-12 rounded-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  // Fallback to geometric design if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback geometric logo */}
              <div className="hidden w-12 h-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full"></div>
                <div className="absolute inset-1 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-white font-bold text-lg">A</div>
                </div>
              </div>
            </div>
            {/* Rotating border effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 animate-spin-slow opacity-30"></div>
          </div>
          <span className="text-2xl font-extralight text-white tracking-[0.25em] hover:text-blue-200 transition-colors duration-500 font-mono">AYA</span>
        </div>
      </div>

      {/* Main Content - Enhanced centered layout */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Enhanced Main Text with Beautiful Typography */}
        <div className={`text-center mb-20 transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="leading-tight tracking-wide">
            <div className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 text-white hover:text-blue-100 transition-colors duration-500 ${textVisible ? 'animate-glow-text' : ''}`}
                 style={{ 
                   fontFamily: "'Playfair Display', 'Georgia', serif",
                   fontWeight: 300,
                   letterSpacing: '0.02em',
                   textShadow: '0 0 30px rgba(147,197,253,0.5), 0 0 60px rgba(59,130,246,0.3)'
                 }}>
              One prayer
            </div>
            <div className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white hover:text-blue-100 transition-colors duration-500 ${textVisible ? 'animate-glow-text-delayed' : ''}`}
                 style={{ 
                   fontFamily: "'Playfair Display', 'Georgia', serif",
                   fontWeight: 300,
                   letterSpacing: '0.02em',
                   textShadow: '0 0 30px rgba(147,197,253,0.5), 0 0 60px rgba(59,130,246,0.3)'
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
              className="group relative px-10 py-4 text-white text-sm font-light tracking-[0.15em] border border-white/30 bg-transparent hover:bg-white/5 hover:border-white/60 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
            >
              <span className="relative z-10">Enter Sacred Space</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
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
