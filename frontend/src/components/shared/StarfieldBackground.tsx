import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StarfieldBackgroundProps {
  numStars?: number;
  className?: string;
  enableAnimation?: boolean;
}

/**
 * Starfield configuration for dark aesthetic galaxy appearance
 */
const STARFIELD_CONFIG = {
  RADIUS_MIN: 30,
  RADIUS_MAX: 80,
  // Star type distributions (percentages) - Enhanced for dark aesthetic
  BLUE_WHITE_PERCENTAGE: 0.60,  // 60% blue-white stars (softer)
  RED_PERCENTAGE: 0.35,          // 35% red stars (more prominent)
  YELLOW_PERCENTAGE: 0.05,       // 5% yellow stars (rare highlights)
  
  // Color definitions for dark aesthetic star types
  STAR_COLORS: {
    BLUE_WHITE: { hue: 0.6, saturation: 0.4, lightness: [0.3, 0.6] },
    RED: { hue: 0.0, saturation: 0.6, lightness: [0.2, 0.5] },
    YELLOW: { hue: 0.15, saturation: 0.5, lightness: [0.4, 0.7] }
  },
  
  // Size configuration for subtle appearance
  SIZE_BASE: 0.08,
  SIZE_VARIATION: 0.04,
  SIZE_MIN: 0.05,
  SIZE_MAX: 0.12,
  
  // Reduced clustering for cleaner look
  CLUSTER_PROBABILITY: 0.2,
  CLUSTER_RADIUS: 6,
  CLUSTER_STARS: 3
};

/**
 * Generate random point on sphere surface with optional clustering
 */
function generateSpherePoint(
  minRadius = STARFIELD_CONFIG.RADIUS_MIN, 
  maxRadius = STARFIELD_CONFIG.RADIUS_MAX,
  clusterCenter: THREE.Vector3 | null = null
): THREE.Vector3 {
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  
  let u, v;
  
  if (clusterCenter && Math.random() < 0.7) {
    // Create clustered distribution for galaxy-like appearance
    const clusterInfluence = Math.random() * 0.5; // How much clustering affects position
    u = Math.random();
    v = Math.random();
    
    // Bias towards cluster center
    const clusterU = (clusterCenter.x + 1) / 2; // Normalize to 0-1
    const clusterV = (clusterCenter.y + 1) / 2;
    
    u = u * (1 - clusterInfluence) + clusterU * clusterInfluence;
    v = v * (1 - clusterInfluence) + clusterV * clusterInfluence;
  } else {
    u = Math.random();
    v = Math.random();
  }
  
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
}

/**
 * Generate realistic star color based on stellar classification
 */
function generateStarColor(starType: string): THREE.Color {
  const starColors = {
    BLUE_WHITE: { hue: 0.6, saturation: 0.3, lightness: [0.7, 0.95] as [number, number] },
    RED: { hue: 0.0, saturation: 0.8, lightness: [0.4, 0.7] as [number, number] },
    YELLOW: { hue: 0.15, saturation: 0.7, lightness: [0.6, 0.8] as [number, number] }
  };
  
  const colorDef = starColors[starType.toUpperCase() as keyof typeof starColors];
  if (!colorDef) return new THREE.Color(1, 1, 1);
  
  const lightness = colorDef.lightness[0] + 
    Math.random() * (colorDef.lightness[1] - colorDef.lightness[0]);
  
  // Add subtle variation
  const hueVariation = (Math.random() - 0.5) * 0.05;
  const satVariation = (Math.random() - 0.5) * 0.1;
  
  return new THREE.Color().setHSL(
    colorDef.hue + hueVariation,
    Math.max(0, Math.min(1, colorDef.saturation + satVariation)),
    lightness
  );
}

/**
 * Determine star type based on realistic distribution
 */
function getStarType(): string {
  const rand = Math.random();
  
  if (rand < STARFIELD_CONFIG.BLUE_WHITE_PERCENTAGE) {
    return 'blue_white';
  } else if (rand < STARFIELD_CONFIG.BLUE_WHITE_PERCENTAGE + STARFIELD_CONFIG.RED_PERCENTAGE) {
    return 'red';
  } else {
    return 'yellow';
  }
}

/**
 * Create optimized starfield with realistic galaxy appearance
 */
function createStarfield(numStars = 1000): THREE.Points {
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];

  // Create cluster centers for realistic galaxy distribution
  const clusterCenters: THREE.Vector3[] = [];
  const numClusters = 6;
  for (let i = 0; i < numClusters; i++) {
    clusterCenters.push(new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize());
  }

  // Generate stars with realistic distribution
  for (let i = 0; i < numStars; i++) {
    // Determine if this star should be part of a cluster
    const useCluster = Math.random() < STARFIELD_CONFIG.CLUSTER_PROBABILITY;
    const clusterCenter = useCluster ? 
      clusterCenters[Math.floor(Math.random() * clusterCenters.length)] : null;
    
    const position = generateSpherePoint(
      STARFIELD_CONFIG.RADIUS_MIN, 
      STARFIELD_CONFIG.RADIUS_MAX,
      clusterCenter
    );
    
    // Generate realistic star type and color
    const starType = getStarType();
    const color = generateStarColor(starType);
    
    // Generate realistic star size (smaller stars are more common)
    let size = STARFIELD_CONFIG.SIZE_BASE;
    
    // Blue-white stars tend to be larger and brighter
    if (starType === 'blue_white') {
      size = STARFIELD_CONFIG.SIZE_BASE + Math.random() * STARFIELD_CONFIG.SIZE_VARIATION;
    } 
    // Red stars are typically smaller
    else if (starType === 'red') {
      size = STARFIELD_CONFIG.SIZE_MIN + Math.random() * (STARFIELD_CONFIG.SIZE_BASE - STARFIELD_CONFIG.SIZE_MIN);
    }
    // Yellow stars are medium-sized
    else {
      size = STARFIELD_CONFIG.SIZE_BASE * 0.8 + Math.random() * STARFIELD_CONFIG.SIZE_VARIATION * 0.6;
    }
    
    // Ensure size constraints
    size = Math.max(STARFIELD_CONFIG.SIZE_MIN, Math.min(STARFIELD_CONFIG.SIZE_MAX, size));

    // Add to arrays
    positions.push(position.x, position.y, position.z);
    colors.push(color.r, color.g, color.b);
    sizes.push(size);
  }

  // Create optimized geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  // Create optimized material for dark aesthetic
  const material = new THREE.PointsMaterial({
    size: STARFIELD_CONFIG.SIZE_BASE,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    alphaTest: 0.01,
    blending: THREE.AdditiveBlending
  });

  return new THREE.Points(geometry, material);
}

/**
 * StarfieldBackground Component
 * Renders a realistic 3D starfield background using Three.js
 */
const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  numStars = 150,
  className = '',
  enableAnimation = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const starfieldRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current; // Store mount ref for cleanup

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Create starfield
    const starfield = createStarfield(numStars);
    scene.add(starfield);

    // Position camera
    camera.position.z = 1;

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    starfieldRef.current = starfield;

    // Animation loop
    const animate = () => {
      if (enableAnimation && starfieldRef.current) {
        starfieldRef.current.rotation.y += 0.0002;
        starfieldRef.current.rotation.x += 0.0001;
      }
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      
      if (starfield) {
        starfield.geometry.dispose();
        if (starfield.material instanceof THREE.Material) {
          starfield.material.dispose();
        }
      }
    };
  }, [numStars, enableAnimation]);

  return (
    <div 
      ref={mountRef} 
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ 
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #000000 0%, #050510 15%, #0a0a15 30%, #0f0f20 50%, #141428 70%, #1a1a30 85%, #1f1f35 100%)'
      }}
    />
  );
};

export default StarfieldBackground;
