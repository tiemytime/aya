import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Types - Matched to frontend NewsEvent interface
export interface NewsEvent {
  _id: string;
  title: string;
  description: string;
  country: string;
  latitude: number;
  longitude: number;
  priority: number; // 1-10
  published_at: string;
  source: string;
  url: string;
  category?: string;
  imageUrl?: string;
}

/**
 * Configuration object for easy customization - Exact port from original Globe
 */
const CONFIG = {
  CAMERA: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [0, 0, 3.5] as [number, number, number]
  },
  GLOBE: {
    radius: 1,
    detail: 80, // Reduced for better performance
    wireframeDetail: 8,
    rotationSpeed: 0.002
  },
  RENDERER: {
    antialias: true,
    alpha: false,
    powerPreference: "high-performance" as WebGLPowerPreference
  },
  LIGHTING: {
    ambientIntensity: 0.4,
    hemisphereIntensity: 2.5
  },
  STARS: {
    count: 10000, // Significantly increased for realistic galaxy density
    size: 0.15
  },
  MARKERS: {
    baseSize: 0.02,     // Much smaller and more elegant
    maxSize: 0.035,     // Smaller max size for better proportions
    highPriorityColor: 0xFFD700, // Pure golden yellow for high priority
    lowPriorityColor: 0xF4A460,  // Sandy golden for lower priority
    pulseSpeed: 1.5,    // Slightly slower pulse for elegance
    hoverScale: 2.0,    // More dramatic hover effect
    glowIntensity: 1.0, // Maximum glow for visibility
    blendOpacity: 1.0   // Full opacity for maximum visibility
  },
  API: {
    baseUrl: 'http://localhost:5000/api',
    refreshInterval: 30000 // 30 seconds
  }
};

/**
 * Starfield configuration for realistic galaxy appearance
 */
const STARFIELD_CONFIG = {
  RADIUS_MIN: 25,
  RADIUS_MAX: 60,
  // Star type distributions (percentages) - Enhanced for realistic galaxy
  BLUE_WHITE_PERCENTAGE: 0.75,  // 75% blue-white stars (increased)
  RED_PERCENTAGE: 0.22,          // 22% red stars (slightly decreased)
  YELLOW_PERCENTAGE: 0.03,       // 3% yellow stars (rare, like our sun)
  
  // Color definitions for realistic star types
  STAR_COLORS: {
    BLUE_WHITE: { hue: 0.6, saturation: 0.3, lightness: [0.7, 0.95] },
    RED: { hue: 0.0, saturation: 0.8, lightness: [0.4, 0.7] },
    YELLOW: { hue: 0.15, saturation: 0.7, lightness: [0.6, 0.8] }
  },
  
  // Size configuration
  SIZE_BASE: 0.12,
  SIZE_VARIATION: 0.08,
  SIZE_MIN: 0.08,
  SIZE_MAX: 0.2,
  
  // Clustering for realistic galaxy-like distribution
  CLUSTER_PROBABILITY: 0.4,     // Increased clustering for more realistic patterns
  CLUSTER_RADIUS: 8,
  CLUSTER_STARS: 5
};

/**
 * Globe3D - Clean and optimized 3D globe implementation
 * Exact port from original Globe with React integration
 */
export class RealGlobe3D {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private globeGroup!: THREE.Group;
  private goldenCore!: THREE.Mesh;
  private animationId: number | null = null;
  private containerElement!: HTMLElement;
  
  // Event markers system
  private eventMarkers: Map<string, THREE.Mesh> = new Map();
  private markerGroup!: THREE.Group;
  private hoveredMarker: THREE.Mesh | null = null;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  
  // Event system
  private eventCallbacks: { [key: string]: ((data: NewsEvent) => void)[] } = {
    markerClick: [],
    markerHover: [],
    markerLeave: []
  };
  
  // Data refresh
  private lastDataRefresh: number = 0;
  private refreshInterval: number | null = null;
  
  // Textures
  private textures: { [key: string]: THREE.Texture } = {};

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.init();
  }

  /**
   * Initialize the 3D scene - Exact port from original
   */
  private init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.loadTextures();
    this.createGlobe();
    this.createLighting();
    this.createStarfield();
    this.createMarkerGroup();
    this.setupEventListeners();
    this.animate();
  }

  /**
   * Create Three.js scene
   */
  private createScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * Create and configure camera
   */
  private createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.CAMERA.fov,
      this.containerElement.clientWidth / this.containerElement.clientHeight,
      CONFIG.CAMERA.near,
      CONFIG.CAMERA.far
    );
    this.camera.position.set(...CONFIG.CAMERA.position);
  }

  /**
   * Create optimized renderer
   */
  private createRenderer() {
    this.renderer = new THREE.WebGLRenderer(CONFIG.RENDERER);
    this.renderer.setSize(this.containerElement.clientWidth, this.containerElement.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio
    this.renderer.sortObjects = true;
    this.renderer.shadowMap.enabled = false;
    this.containerElement.appendChild(this.renderer.domElement);
  }

  /**
   * Create orbit controls
   */
  private createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 10;
    this.controls.minDistance = 2;
  }

  /**
   * Load textures efficiently
   */
  private loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    
    // Create circle texture for stars programmatically if needed
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const starCtx = starCanvas.getContext('2d')!;
    const gradient = starCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    starCtx.fillStyle = gradient;
    starCtx.fillRect(0, 0, 64, 64);
    
    this.textures = {
      starSprite: new THREE.CanvasTexture(starCanvas),
      earthColor: textureLoader.load('/textures/earth.jpg') // Use our copied texture
    };

    // Optimize texture settings
    Object.values(this.textures).forEach(texture => {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });
  }

  /**
   * Create globe without bumps for smooth performance - Exact port
   */
  private createGlobe() {
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    this.createWireframe();
    this.createSmoothSurface();
    this.createGoldenCore();
  }

  /**
   * Create wireframe structure
   */
  private createWireframe() {
    const geometry = new THREE.IcosahedronGeometry(CONFIG.GLOBE.radius, CONFIG.GLOBE.wireframeDetail);
    const material = new THREE.MeshBasicMaterial({
      color: 0x202020,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    const wireframe = new THREE.Mesh(geometry, material);
    this.globeGroup.add(wireframe);
  }

  /**
   * Create smooth surface without elevation mapping
   */
  private createSmoothSurface() {
    const geometry = new THREE.IcosahedronGeometry(CONFIG.GLOBE.radius, CONFIG.GLOBE.detail);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        size: { value: 4.0 },
        colorTexture: { value: this.textures.earthColor },
        alphaTexture: { value: this.textures.earthColor } // Use same texture for alpha
      },
      vertexShader: this.getOptimizedVertexShader(),
      fragmentShader: this.getOptimizedFragmentShader(),
      transparent: true
    });

    const points = new THREE.Points(geometry, material);
    this.globeGroup.add(points);
  }

  /**
   * Optimized vertex shader without elevation mapping - Exact port
   */
  private getOptimizedVertexShader(): string {
    return `
      uniform float size;
      varying vec2 vUv;
      varying float vVisible;

      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 vNormal = normalMatrix * normal;
        
        // Simple visibility calculation for back-face culling
        vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));
        
        gl_PointSize = size;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  /**
   * Enhanced fragment shader with dark center glow and dark continents - Exact port
   */
  private getOptimizedFragmentShader(): string {
    return `
      uniform sampler2D colorTexture;
      uniform sampler2D alphaTexture;
      varying vec2 vUv;
      varying float vVisible;

      void main() {
        // Discard back-facing points
        if (vVisible < 0.5) discard;
        
        float alpha = 1.0 - texture2D(alphaTexture, vUv).r;
        vec3 color = texture2D(colorTexture, vUv).rgb;
        
        // Create dark center glow from center
        vec2 center = vec2(0.5, 0.5);
        float distanceFromCenter = length(vUv - center);
        
        // Dark glow that spreads from center to edges
        float centerGlow = 1.0 - smoothstep(0.0, 0.8, distanceFromCenter);
        centerGlow = pow(centerGlow, 1.5); // Smoother falloff
        
        // Dark blue-green center color (#0A181B)
        vec3 centerColor = vec3(0.039, 0.094, 0.106); // Convert #0A181B to RGB
        
        // Make continents dark with white highlights
        // Use the green channel to detect land vs water
        float landMask = color.g;
        
        // Create dark continent base color
        vec3 darkContinentColor = vec3(0.15, 0.18, 0.22); // Dark blue-gray
        
        // Edge detection for continent borders
        vec2 texelSize = vec2(1.0) / vec2(1024.0); // Assuming 1k texture
        
        // Sample neighboring pixels for edge detection
        float landLeft = texture2D(colorTexture, vUv + vec2(-texelSize.x, 0.0)).g;
        float landRight = texture2D(colorTexture, vUv + vec2(texelSize.x, 0.0)).g;
        float landUp = texture2D(colorTexture, vUv + vec2(0.0, -texelSize.y)).g;
        float landDown = texture2D(colorTexture, vUv + vec2(0.0, texelSize.y)).g;
        
        // Calculate edge intensity
        float edgeIntensity = abs(landMask - landLeft) + abs(landMask - landRight) + 
                             abs(landMask - landUp) + abs(landMask - landDown);
        edgeIntensity = smoothstep(0.1, 0.3, edgeIntensity);
        
        // White border highlight
        vec3 borderHighlight = vec3(0.8, 0.85, 0.9) * edgeIntensity;
        
        // Mix dark continent color with border highlights
        vec3 continentColor = darkContinentColor + borderHighlight;
        
        // Use landMask to determine if we're on land or water
        color = mix(color * 0.3, continentColor, step(0.5, landMask)); // Darken oceans
        
        // Mix the dark center glow with the modified earth texture
        color = mix(color, centerColor, centerGlow * 0.6); // Increased influence
        
        // Add additional inner glow for more intensity and smooth blending
        float innerGlow = 1.0 - smoothstep(0.0, 0.5, distanceFromCenter);
        innerGlow = pow(innerGlow, 2.0); // Smoother falloff
        color += centerColor * innerGlow * 0.8;
        
        // Enhanced smooth edge fade to blend with dark background
        float edgeFade = smoothstep(0.5, 1.0, distanceFromCenter);
        edgeFade = pow(edgeFade, 1.5); // Smoother transition
        alpha *= (1.0 - edgeFade * 0.8);
        
        gl_FragColor = vec4(color, alpha);
      }
    `;
  }

  /**
   * Create efficient lighting setup
   */
  private createLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, CONFIG.LIGHTING.ambientIntensity);
    this.scene.add(ambientLight);

    // Hemisphere light for realistic lighting
    const hemisphereLight = new THREE.HemisphereLight(
      0xffffff, 
      0x080820, 
      CONFIG.LIGHTING.hemisphereIntensity
    );
    this.scene.add(hemisphereLight);
  }

  /**
   * Create optimized starfield - Port from getStarfield.js
   */
  private createStarfield() {
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
    for (let i = 0; i < CONFIG.STARS.count; i++) {
      // Determine if this star should be part of a cluster
      const useCluster = Math.random() < STARFIELD_CONFIG.CLUSTER_PROBABILITY;
      const clusterCenter = useCluster ? 
        clusterCenters[Math.floor(Math.random() * clusterCenters.length)] : null;
      
      const position = this.generateSpherePoint(
        STARFIELD_CONFIG.RADIUS_MIN, 
        STARFIELD_CONFIG.RADIUS_MAX,
        clusterCenter
      );
      
      // Generate realistic star type and color
      const starType = this.getStarType();
      const color = this.generateStarColor(starType);
      
      // Generate realistic star size
      let size = STARFIELD_CONFIG.SIZE_BASE;
      
      if (starType === 'blue_white') {
        size = STARFIELD_CONFIG.SIZE_BASE + Math.random() * STARFIELD_CONFIG.SIZE_VARIATION;
      } else if (starType === 'red') {
        size = STARFIELD_CONFIG.SIZE_MIN + Math.random() * (STARFIELD_CONFIG.SIZE_BASE - STARFIELD_CONFIG.SIZE_MIN);
      } else {
        size = STARFIELD_CONFIG.SIZE_BASE * 0.8 + Math.random() * STARFIELD_CONFIG.SIZE_VARIATION * 0.6;
      }
      
      size = Math.max(STARFIELD_CONFIG.SIZE_MIN, Math.min(STARFIELD_CONFIG.SIZE_MAX, size));

      positions.push(position.x, position.y, position.z);
      colors.push(color.r, color.g, color.b);
      sizes.push(size);
    }

    // Create optimized geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

    // Create optimized material
    const material = new THREE.PointsMaterial({
      size: STARFIELD_CONFIG.SIZE_BASE,
      vertexColors: true,
      map: this.textures.starSprite,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      alphaTest: 0.01,
      blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }

  /**
   * Generate random point on sphere surface with optional clustering
   */
  private generateSpherePoint(
    minRadius: number = STARFIELD_CONFIG.RADIUS_MIN, 
    maxRadius: number = STARFIELD_CONFIG.RADIUS_MAX,
    clusterCenter: THREE.Vector3 | null = null
  ): THREE.Vector3 {
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    
    let u: number, v: number;
    
    if (clusterCenter && Math.random() < 0.7) {
      const clusterInfluence = Math.random() * 0.5;
      u = Math.random();
      v = Math.random();
      
      const clusterU = (clusterCenter.x + 1) / 2;
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
   * Determine star type based on realistic distribution
   */
  private getStarType(): string {
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
   * Generate realistic star color based on stellar classification
   */
  private generateStarColor(starType: string): THREE.Color {
    const colorDef = STARFIELD_CONFIG.STAR_COLORS[starType.toUpperCase() as keyof typeof STARFIELD_CONFIG.STAR_COLORS];
    if (!colorDef) return new THREE.Color(1, 1, 1);
    
    const lightness = colorDef.lightness[0] + 
      Math.random() * (colorDef.lightness[1] - colorDef.lightness[0]);
    
    const hueVariation = (Math.random() - 0.5) * 0.05;
    const satVariation = (Math.random() - 0.5) * 0.1;
    
    return new THREE.Color().setHSL(
      colorDef.hue + hueVariation,
      Math.max(0, Math.min(1, colorDef.saturation + satVariation)),
      lightness
    );
  }

  /**
   * Create dark core glow inside Earth - Exact port
   */
  private createGoldenCore() {
    const coreGeometry = new THREE.SphereGeometry(CONFIG.GLOBE.radius * 0.85, 32, 32);
    
    const coreMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          float distanceFromCenter = length(vPosition);
          float glow = 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);
          glow = pow(glow, 1.5);
          
          float pulse = 0.7 + 0.3 * sin(time * 1.5);
          vec3 centerColor = vec3(0.039, 0.094, 0.106);
          
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDirection));
          rim = pow(rim, 1.5);
          
          float alpha = glow * pulse * 0.6 + rim * 0.3;
          
          gl_FragColor = vec4(centerColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    this.globeGroup.add(core);
    this.goldenCore = core;
  }

  /**
   * Create marker group for event markers
   */
  private createMarkerGroup() {
    this.markerGroup = new THREE.Group();
    this.globeGroup.add(this.markerGroup);
  }

  /**
   * Convert lat/lng to 3D coordinates on globe surface - Exact port
   */
  private latLngToVector3(lat: number, lng: number, radius: number = CONFIG.GLOBE.radius): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    
    return new THREE.Vector3(x, y, z);
  }

  /**
   * Create an event marker - Exact port from original
   */
  private createEventMarker(eventData: NewsEvent): THREE.Mesh | null {
    // Validate coordinates
    if (!eventData.latitude || !eventData.longitude || isNaN(eventData.latitude) || isNaN(eventData.longitude)) {
      console.warn(`Invalid coordinates for event ${eventData.title}:`, { lat: eventData.latitude, lng: eventData.longitude });
      return null;
    }
    
    // Place markers closer to globe surface for better integration
    const position = this.latLngToVector3(eventData.latitude, eventData.longitude, CONFIG.GLOBE.radius + 0.06);
    console.log(`Converting lat:${eventData.latitude}, lng:${eventData.longitude} to 3D position:`, position);
    
    // Create larger marker geometry for visibility
    const markerSize = Math.max(
      CONFIG.MARKERS.baseSize,
      CONFIG.MARKERS.baseSize + (eventData.priority / 10) * CONFIG.MARKERS.maxSize
    );
    
    // Use higher detail for smoother appearance
    const markerGeometry = new THREE.SphereGeometry(markerSize, 20, 20);
    
    // Determine color and intensity based on priority
    const isHighPriority = eventData.priority >= 7;
    const markerColor = isHighPriority ? CONFIG.MARKERS.highPriorityColor : CONFIG.MARKERS.lowPriorityColor;
    
    // Create simple, highly visible marker material
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: markerColor,
      transparent: false,
      fog: false
    });
    
    // Add emissive properties manually after creation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (markerMaterial as any).emissive = new THREE.Color(markerColor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (markerMaterial as any).emissiveIntensity = isHighPriority ? 1.0 : 0.8;
    
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position);
    
    // Ensure marker renders properly
    marker.renderOrder = 1000;
    marker.matrixAutoUpdate = true;
    
    // Store event data on the marker for click handling
    marker.userData = {
      eventData: eventData,
      originalScale: marker.scale.clone(),
      isHovered: false
    };
    
    console.log(`✓ Created LARGE ${isHighPriority ? 'BRIGHT' : 'DIM'} marker for ${eventData.title} at lat:${eventData.latitude}, lng:${eventData.longitude}, size:${markerSize.toFixed(3)}, 3D position:`, position);
    
    return marker;
  }

  /**
   * Setup event listeners - Exact port
   */
  private setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
  }

  /**
   * Handle window resize
   */
  private onWindowResize() {
    const width = this.containerElement.clientWidth;
    const height = this.containerElement.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Handle visibility change for performance
   */
  private onVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Handle mouse move for marker interaction - Exact port
   */
  private onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const markerObjects = Array.from(this.eventMarkers.values());
    const intersects = this.raycaster.intersectObjects(markerObjects);
    
    if (intersects.length > 0) {
      const intersectedMarker = intersects[0].object as THREE.Mesh;
      console.log('Marker intersection detected:', intersectedMarker.userData.eventData.title);
      
      if (this.hoveredMarker !== intersectedMarker) {
        if (this.hoveredMarker) {
          this.hoveredMarker.scale.copy(this.hoveredMarker.userData.originalScale);
          this.hoveredMarker.userData.isHovered = false;
          this.triggerEvent('markerLeave', this.hoveredMarker.userData.eventData);
        }
        
        this.hoveredMarker = intersectedMarker;
        this.hoveredMarker.scale.multiplyScalar(CONFIG.MARKERS.hoverScale);
        this.hoveredMarker.userData.isHovered = true;
        this.triggerEvent('markerHover', this.hoveredMarker.userData.eventData);
        
        this.containerElement.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredMarker) {
        this.hoveredMarker.scale.copy(this.hoveredMarker.userData.originalScale);
        this.hoveredMarker.userData.isHovered = false;
        this.triggerEvent('markerLeave', this.hoveredMarker.userData.eventData);
        this.hoveredMarker = null;
        this.containerElement.style.cursor = 'default';
      }
    }
  }

  /**
   * Handle mouse click for marker interaction
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onMouseClick(_event: MouseEvent) {
    console.log('Mouse click detected, hoveredMarker:', this.hoveredMarker);
    if (this.hoveredMarker) {
      console.log('Triggering markerClick event for:', this.hoveredMarker.userData.eventData.title);
      this.triggerEvent('markerClick', this.hoveredMarker.userData.eventData);
    }
  }

  /**
   * Handle mouse leave for resetting hover state
   */
  private onMouseLeave() {
    if (this.hoveredMarker) {
      this.hoveredMarker.scale.copy(this.hoveredMarker.userData.originalScale);
      this.hoveredMarker.userData.isHovered = false;
      this.triggerEvent('markerLeave', this.hoveredMarker.userData.eventData);
      this.hoveredMarker = null;
      this.containerElement.style.cursor = 'default';
    }
  }

  /**
   * Pause animation
   */
  private pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resume animation
   */
  private resume() {
    if (!this.animationId) {
      this.animate();
    }
  }

  /**
   * Main animation loop - Exact port
   */
  /**
   * Main animation loop - Exact port from original
   */
  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const currentTime = Date.now() * 0.001;
    
    // Smooth globe rotation
    if (this.globeGroup) {
      this.globeGroup.rotation.y += CONFIG.GLOBE.rotationSpeed;
    }
    
    // Update golden core animation
    if (this.goldenCore && this.goldenCore.material) {
      (this.goldenCore.material as THREE.ShaderMaterial).uniforms.time.value = currentTime;
    }
    
    // Update beautiful golden marker animations with subtle pulsing
    this.eventMarkers.forEach(markerGroup => {
      // Check if the marker has proper userData and material
      if (markerGroup.userData && markerGroup.material) {
        const { eventData } = markerGroup.userData;
        const pulseIntensity = 0.85 + 0.15 * Math.sin(currentTime * CONFIG.MARKERS.pulseSpeed + eventData._id.charCodeAt(0) * 0.1);
        const isHighPriority = eventData.priority >= 7;
        const baseIntensity = isHighPriority ? 1.0 : 0.8;
        
        // Apply pulsing effect to emissive intensity if available
        const material = markerGroup.material as THREE.MeshLambertMaterial;
        if ('emissiveIntensity' in material) {
          material.emissiveIntensity = baseIntensity * pulseIntensity;
        }
      }
    });
    
    // Update controls
    this.controls.update();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  // Public API methods
  public addEventMarker(eventData: NewsEvent): THREE.Mesh | null {
    const marker = this.createEventMarker(eventData);
    if (marker) {
      this.markerGroup.add(marker);
      this.eventMarkers.set(eventData._id, marker);
      console.log(`✓ Added marker for ${eventData.title} to globe. Total markers: ${this.eventMarkers.size}`);
      return marker;
    } else {
      console.warn(`✗ Failed to create marker for ${eventData.title}`);
      return null;
    }
  }

  public removeEventMarker(eventId: string) {
    const marker = this.eventMarkers.get(eventId);
    if (marker) {
      this.markerGroup.remove(marker);
      
      if (marker.geometry) {
        marker.geometry.dispose();
      }
      if (marker.material) {
        if (Array.isArray(marker.material)) {
          marker.material.forEach(material => material.dispose());
        } else {
          marker.material.dispose();
        }
      }
      
      this.eventMarkers.delete(eventId);
      console.log(`✓ Removed marker for event ${eventId}`);
    }
  }

  public clearEventMarkers() {
    console.log(`Clearing ${this.eventMarkers.size} existing markers...`);
    
    const eventIds = Array.from(this.eventMarkers.keys());
    eventIds.forEach(eventId => {
      this.removeEventMarker(eventId);
    });
    
    if (this.markerGroup.children.length > 0) {
      console.warn(`Warning: ${this.markerGroup.children.length} children still in marker group after clearing`);
      while (this.markerGroup.children.length > 0) {
        this.markerGroup.remove(this.markerGroup.children[0]);
      }
    }
    
    this.hoveredMarker = null;
    this.containerElement.style.cursor = 'default';
    
    console.log('✓ All markers cleared successfully');
  }

  public addEventListener(eventType: string, callback: (data: NewsEvent) => void) {
    if (this.eventCallbacks[eventType]) {
      this.eventCallbacks[eventType].push(callback);
    }
  }

  public removeEventListener(eventType: string, callback: (data: NewsEvent) => void) {
    if (this.eventCallbacks[eventType]) {
      const index = this.eventCallbacks[eventType].indexOf(callback);
      if (index > -1) {
        this.eventCallbacks[eventType].splice(index, 1);
      }
    }
  }

  private triggerEvent(eventType: string, data: NewsEvent) {
    if (this.eventCallbacks[eventType]) {
      this.eventCallbacks[eventType].forEach(callback => callback(data));
    }
  }

  /**
   * Load event data from API - Exact port from original
   */
  public async loadEventData() {
    try {
      console.log('Loading event data from API...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`${CONFIG.API.baseUrl}/news/globe?limit=100`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success && data.data.events) {
        console.log(`Received ${data.data.events.length} events from API`);
        
        // Clear existing markers
        this.clearEventMarkers();
        console.log('Cleared existing markers');
        
        // Add new markers
        data.data.events.forEach((eventData: NewsEvent, index: number) => {
          console.log(`Adding marker ${index + 1}:`, eventData.title, `at (${eventData.latitude}, ${eventData.longitude}) priority: ${eventData.priority}`);
          const marker = this.addEventMarker(eventData);
          if (marker) {
            console.log(`✓ Marker ${index + 1} created successfully at position:`, marker.position);
          } else {
            console.log(`✗ Failed to create marker ${index + 1}`);
          }
        });
        
        console.log(`Created ${this.eventMarkers.size} markers on globe`);
        console.log('Marker group children count:', this.markerGroup.children.length);
        
        // Debug: List all marker positions
        console.log('All marker positions:');
        this.eventMarkers.forEach((marker, eventId) => {
          if (marker && marker.position) {
            console.log(`  Event ${eventId}: position`, marker.position, 'visible:', marker.visible);
          }
        });
        
        // Debug marker visibility
        this.debugMarkerVisibility();
        
        this.lastDataRefresh = Date.now();
        
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: unknown) {
      let errorMessage = 'Connection failed';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout';
          console.error('Request timed out after 15 seconds');
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error - check backend';
          console.error('Network error: Backend may not be running on localhost:5000');
        } else if (error.message.includes('HTTP')) {
          errorMessage = `Server error: ${error.message}`;
          console.error('HTTP error:', error.message);
        } else {
          console.error('Failed to load event data:', error);
        }
      } else {
        console.error('Failed to load event data:', error);
      }
      
      console.error('Error loading event data:', errorMessage);
    }
  }

  /**
   * Ensure we have a minimum number of events by fetching fresh news if needed
   */
  public async ensureMinimumEvents(minEvents = 15): Promise<boolean> {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      // Check current event count
      const checkResponse = await fetch(`${CONFIG.API.baseUrl}/news/globe?limit=1`);
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.success && checkData.data.total >= minEvents) {
          console.log(`✓ We have ${checkData.data.total} events, which meets minimum of ${minEvents}`);
          return true;
        }
        
        console.log(`Only ${checkData.data.total} events available, fetching more news... (attempt ${attempts + 1})`);
        
        // Fetch more news with different categories
        const categories = ['world', 'general', 'business', 'technology'];
        const category = categories[attempts % categories.length];
        
        const globalResponse = await fetch(`${CONFIG.API.baseUrl}/news/global?limit=30&category=${category}`);
        if (!globalResponse.ok) {
          console.warn(`Failed to fetch ${category} news`);
        }
        
        // Wait a bit for database to process
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      attempts++;
    }
    
    console.log(`Could not reach minimum of ${minEvents} events after ${maxAttempts} attempts`);
    return false;
  }

  /**
   * Start auto-refresh of event data (disabled by default)
   */
  public startAutoRefresh(): void {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Set up auto-refresh
    this.refreshInterval = window.setInterval(() => {
      const timeSinceLastRefresh = Date.now() - this.lastDataRefresh;
      if (timeSinceLastRefresh >= CONFIG.API.refreshInterval) {
        console.log('Auto-refreshing event data...');
        this.loadEventData();
      }
    }, CONFIG.API.refreshInterval);
    
    console.log(`Auto-refresh started: every ${CONFIG.API.refreshInterval / 1000} seconds`);
  }

  /**
   * Stop auto-refresh
   */
  public stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Auto-refresh stopped');
    }
  }

  /**
   * Debug function to check marker visibility from camera perspective
   */
  public debugMarkerVisibility(): void {
    console.log('=== MARKER VISIBILITY DEBUG ===');
    console.log(`Total markers created: ${this.eventMarkers.size}`);
    console.log(`Marker group children: ${this.markerGroup.children.length}`);
    
    this.eventMarkers.forEach((marker) => {
      if (marker && marker.position) {
        // Calculate distance from camera
        const distance = this.camera.position.distanceTo(marker.position);
        
        // Check if marker is in front of the globe center from camera's perspective
        const globeCenter = new THREE.Vector3(0, 0, 0);
        const cameraToGlobe = globeCenter.clone().sub(this.camera.position).normalize();
        const cameraToMarker = marker.position.clone().sub(this.camera.position).normalize();
        const dot = cameraToGlobe.dot(cameraToMarker);
        
        const eventData = marker.userData?.eventData;
        console.log(`  ${eventData?.title || 'Unknown'}:`, {
          position: marker.position,
          distance: distance.toFixed(3),
          dotProduct: dot.toFixed(3),
          facingCamera: dot > 0,
          visible: marker.visible,
          lat: eventData?.latitude,
          lng: eventData?.longitude
        });
      }
    });
    console.log('==============================');
  }

  /**
   * Add a test marker for debugging visibility
   */
  public addVisibilityTestMarker(): void {
    // Add a test marker at an obvious location (North America)
    const testPosition = this.latLngToVector3(40, -100, CONFIG.GLOBE.radius + 0.1);
    
    const testGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const testMaterial = new THREE.MeshLambertMaterial({
      color: 0xFF6600, // Bright orange for visibility
      transparent: true,
      opacity: 0.9,
    });
    
    const testMarker = new THREE.Mesh(testGeometry, testMaterial);
    testMarker.position.copy(testPosition);
    
    this.markerGroup.add(testMarker);
    console.log('Added orange test marker for visibility check at:', testPosition);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public mount(_container: HTMLElement) {
    console.log('Globe mounted to container');
  }

  public dispose() {
    this.pause();
    this.clearEventMarkers();
    
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    this.scene.traverse((object) => {
      if ((object as THREE.Mesh).geometry) (object as THREE.Mesh).geometry.dispose();
      if ((object as THREE.Mesh).material) {
        const material = (object as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach(mat => mat.dispose());
        } else {
          material.dispose();
        }
      }
    });

    Object.values(this.textures).forEach(texture => texture.dispose());
    this.renderer.dispose();
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    document.removeEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
      this.renderer.domElement.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
      this.renderer.domElement.removeEventListener('click', this.onMouseClick.bind(this));
    }
    
    console.log('Globe disposed');
  }
}

export default RealGlobe3D;
