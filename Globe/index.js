import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";

/**
 * Configuration object for easy customization
 */
const CONFIG = {
  CAMERA: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [0, 0, 3.5]
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
    powerPreference: "high-performance"
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
 * Globe3D - Clean and optimized 3D globe implementation
 */
class Globe3D {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.globeGroup = null;
    this.goldenCore = null;
    this.animationId = null;
    
    // Event markers system
    this.eventMarkers = new Map();
    this.markerGroup = null;
    this.hoveredMarker = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Event system
    this.eventCallbacks = {
      markerClick: [],
      markerHover: [],
      markerLeave: []
    };
    
    // Data refresh
    this.lastDataRefresh = 0;
    this.refreshInterval = null;
    
    this.init();
  }

  /**
   * Initialize the 3D scene
   */
  init() {
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
    // this.addVisibilityTestMarker(); // Test marker removed - no default markers
    // Removed auto-fetching - data loading is now manual only
    this.animate();
  }

  /**
   * Create Three.js scene
   */
  createScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * Create and configure camera
   */
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.CAMERA.fov,
      window.innerWidth / window.innerHeight,
      CONFIG.CAMERA.near,
      CONFIG.CAMERA.far
    );
    this.camera.position.set(...CONFIG.CAMERA.position);
  }

  /**
   * Create optimized renderer
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer(CONFIG.RENDERER);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio
    
    // Enable sorting for better transparency handling
    this.renderer.sortObjects = true;
    
    // Improve depth testing for better blending
    this.renderer.shadowMap.enabled = false; // Disable shadows for better performance
    
    document.body.appendChild(this.renderer.domElement);
  }

  /**
   * Create orbit controls
   */
  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 10;
    this.controls.minDistance = 2;
  }

  /**
   * Load textures efficiently
   */
  loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    
    // Load only essential textures for better performance
    this.textures = {
      starSprite: textureLoader.load("./src/circle.png"),
      earthColor: textureLoader.load("./src/00_earthmap1k.jpg"), // Realistic Earth texture
      earthAlpha: textureLoader.load("./src/02_earthspec1k.jpg")
    };

    // Optimize texture settings
    Object.values(this.textures).forEach(texture => {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });
  }

  /**
   * Create globe without bumps for smooth performance
   */
  createGlobe() {
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    this.createWireframe();
    this.createSmoothSurface();
    this.createGoldenCore();
  }

  /**
   * Create wireframe structure
   */
  createWireframe() {
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
  createSmoothSurface() {
    const geometry = new THREE.IcosahedronGeometry(CONFIG.GLOBE.radius, CONFIG.GLOBE.detail);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        size: { value: 4.0 },
        colorTexture: { value: this.textures.earthColor },
        alphaTexture: { value: this.textures.earthAlpha }
      },
      vertexShader: this.getOptimizedVertexShader(),
      fragmentShader: this.getOptimizedFragmentShader(),
      transparent: true
    });

    const points = new THREE.Points(geometry, material);
    this.globeGroup.add(points);
  }

  /**
   * Optimized vertex shader without elevation mapping
   */
  getOptimizedVertexShader() {
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
   * Enhanced fragment shader with dark center glow and dark continents
   */
  getOptimizedFragmentShader() {
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
  createLighting() {
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
   * Create optimized starfield
   */
  createStarfield() {
    const stars = getStarfield({
      numStars: CONFIG.STARS.count,
      sprite: this.textures.starSprite
    });
    this.scene.add(stars);
  }

  /**
   * Create dark core glow inside Earth
   */
  createGoldenCore() {
    // Create inner sphere for the dark center core
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
          // Distance from center
          float distanceFromCenter = length(vPosition);
          
          // Create radial dark center glow
          float glow = 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);
          glow = pow(glow, 1.5);
          
          // Pulsing effect for smooth breathing
          float pulse = 0.7 + 0.3 * sin(time * 1.5);
          
          // Dark blue-green color matching center (#0A181B)
          vec3 centerColor = vec3(0.039, 0.094, 0.106);
          
          // View angle for rim lighting with smoother falloff
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDirection));
          rim = pow(rim, 1.5); // Smoother rim
          
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
    
    // Store reference for animation
    this.goldenCore = core;
  }

  /**
   * Create marker group for event markers
   */
  createMarkerGroup() {
    this.markerGroup = new THREE.Group();
    // Add marker group to the globe group so markers rotate with the globe
    this.globeGroup.add(this.markerGroup);
  }

  /**
   * Convert lat/lng to 3D coordinates on globe surface
   */
  latLngToVector3(lat, lng, radius = CONFIG.GLOBE.radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    
    return new THREE.Vector3(x, y, z);
  }

  /**
   * Create an event marker
   */
  createEventMarker(eventData) {
    // Validate coordinates
    if (!eventData.lat || !eventData.lng || isNaN(eventData.lat) || isNaN(eventData.lng)) {
      console.warn(`Invalid coordinates for event ${eventData.title}:`, { lat: eventData.lat, lng: eventData.lng });
      return null;
    }
    
    // Place markers closer to globe surface for better integration
    const position = this.latLngToVector3(eventData.lat, eventData.lng, CONFIG.GLOBE.radius + 0.06);
    console.log(`Converting lat:${eventData.lat}, lng:${eventData.lng} to 3D position:`, position);
    
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
      transparent: false, // Make solid for maximum visibility
      emissive: new THREE.Color(markerColor),
      emissiveIntensity: isHighPriority ? 1.0 : 0.8,
      fog: false
    });
    
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
    
    console.log(`✓ Created LARGE ${isHighPriority ? 'BRIGHT' : 'DIM'} marker for ${eventData.title} at lat:${eventData.lat}, lng:${eventData.lng}, size:${markerSize.toFixed(3)}, 3D position:`, position);
    console.log(`  Marker distance from origin: ${position.length().toFixed(3)}, Globe radius: ${CONFIG.GLOBE.radius}, Height above surface: ${(position.length() - CONFIG.GLOBE.radius).toFixed(3)}`);
    
    return marker;
  }

  /**
   * Add event marker to the globe
   */
  addEventMarker(eventData) {
    const marker = this.createEventMarker(eventData);
    if (marker) {
      this.markerGroup.add(marker);
      this.eventMarkers.set(eventData.id, marker);
      console.log(`✓ Added marker for ${eventData.title} to globe. Total markers: ${this.eventMarkers.size}`);
      return marker;
    } else {
      console.warn(`✗ Failed to create marker for ${eventData.title}`);
      return null;
    }
  }

  /**
   * Remove event marker from the globe
   */
  removeEventMarker(eventId) {
    const marker = this.eventMarkers.get(eventId);
    if (marker) {
      // Remove from scene
      this.markerGroup.remove(marker);
      
      // Dispose of geometry and material
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
      
      // Remove from tracking
      this.eventMarkers.delete(eventId);
      console.log(`✓ Removed marker for event ${eventId}`);
    }
  }

  /**
   * Clear all event markers
   */
  clearEventMarkers() {
    console.log(`Clearing ${this.eventMarkers.size} existing markers...`);
    
    // Create a copy of the keys to avoid modification during iteration
    const eventIds = Array.from(this.eventMarkers.keys());
    eventIds.forEach(eventId => {
      this.removeEventMarker(eventId);
    });
    
    // Double-check that the marker group is empty
    if (this.markerGroup.children.length > 0) {
      console.warn(`Warning: ${this.markerGroup.children.length} children still in marker group after clearing`);
      // Force clear any remaining children
      while (this.markerGroup.children.length > 0) {
        this.markerGroup.remove(this.markerGroup.children[0]);
      }
    }
    
    // Reset hover state
    this.hoveredMarker = null;
    document.body.style.cursor = 'default';
    
    console.log('✓ All markers cleared successfully');
  }

  /**
   * Load event data from backend API
   */
  async loadEventData() {
    try {
      // Update status
      if (window.updateStatus) {
        window.updateStatus('🔄 Loading events...', 'status-offline');
      }
      if (window.updateBackendStatus) {
        window.updateBackendStatus('Fetching fresh news...', false);
      }
      
      console.log('Step 1: Ensuring we have enough events...');
      
      // Ensure we have at least 15 events
      await this.ensureMinimumEvents(15);
      
      if (window.updateBackendStatus) {
        window.updateBackendStatus('Loading events for globe...', false);
      }
      
      console.log('Step 2: Fetching events for globe visualization...');
      console.log('Fetching events from:', `${CONFIG.API.baseUrl}/news/globe?limit=20&minPriority=1&hours=168`);
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      // Then fetch events for globe with extended time range and lower priority threshold
      const response = await fetch(`${CONFIG.API.baseUrl}/news/globe?limit=20&minPriority=1&hours=168`, {
        signal: controller.signal
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
        data.data.events.forEach((eventData, index) => {
          console.log(`Adding marker ${index + 1}:`, eventData.title, `at (${eventData.lat}, ${eventData.lng}) priority: ${eventData.priority}`);
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
        
        // Update UI
        if (window.updateEventCount) {
          window.updateEventCount(data.data.events.length);
        }
        if (window.updateStatus) {
          window.updateStatus('🟢 Connected - Live Data', 'status-online');
        }
        if (window.updateBackendStatus) {
          window.updateBackendStatus(`${data.data.events.length} events loaded`, true);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      let errorMessage = 'Connection failed';
      
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
      
      // Update status to show specific error
      if (window.updateStatus) {
        window.updateStatus('🔴 Connection Failed', 'status-offline');
      }
      if (window.updateBackendStatus) {
        window.updateBackendStatus(errorMessage, false);
      }
    }
  }

  /**
   * Ensure we have a minimum number of events by fetching fresh news if needed
   */
  async ensureMinimumEvents(minEvents = 15) {
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
  startAutoRefresh() {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Set up auto-refresh
    this.refreshInterval = setInterval(() => {
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
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Auto-refresh stopped');
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    
    // Add visibility change listener to pause/resume animation
    document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    
    // Mouse move listener for marker interaction
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Handle visibility change for performance
   */
  onVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Pause animation
   */
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resume animation
   */
  resume() {
    if (!this.animationId) {
      this.animate();
    }
  }

  /**
   * Handle mouse move for marker interaction
   */
  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with markers - simple mesh approach
    const markerObjects = Array.from(this.eventMarkers.values());
    
    const intersects = this.raycaster.intersectObjects(markerObjects);
    
    if (intersects.length > 0) {
      const intersectedMarker = intersects[0].object;
      console.log('Marker intersection detected:', intersectedMarker.userData.eventData.title);
      
      // Handle hover state
      if (this.hoveredMarker !== intersectedMarker) {
        // Reset previous hovered marker
        if (this.hoveredMarker) {
          this.hoveredMarker.scale.copy(this.hoveredMarker.userData.originalScale);
          this.hoveredMarker.userData.isHovered = false;
          this.triggerEvent('markerLeave', this.hoveredMarker.userData.eventData);
        }
        
        // Set new hovered marker
        this.hoveredMarker = intersectedMarker;
        this.hoveredMarker.scale.multiplyScalar(CONFIG.MARKERS.hoverScale);
        this.hoveredMarker.userData.isHovered = true;
        this.triggerEvent('markerHover', this.hoveredMarker.userData.eventData);
        
        // Change cursor
        document.body.style.cursor = 'pointer';
      }
    } else {
      // No intersection, reset hover state
      if (this.hoveredMarker) {
        this.hoveredMarker.scale.copy(this.hoveredMarker.userData.originalScale);
        this.hoveredMarker.userData.isHovered = false;
        this.triggerEvent('markerLeave', this.hoveredMarker.userData.eventData);
        this.hoveredMarker = null;
        document.body.style.cursor = 'default';
      }
    }
  }

  /**
   * Handle mouse click for marker interaction
   */
  onMouseClick(event) {
    console.log('Mouse click detected, hoveredMarker:', this.hoveredMarker);
    if (this.hoveredMarker) {
      console.log('Triggering markerClick event for:', this.hoveredMarker.userData.eventData.title);
      this.triggerEvent('markerClick', this.hoveredMarker.userData.eventData);
    } else {
      console.log('No marker currently hovered');
    }
  }

  /**
   * Handle mouse leave for resetting hover state
   */
  onMouseLeave() {
    if (this.hoveredMarker) {
      this.hoveredMarker.scale.copy(this.hoveredMarker.userData.originalScale);
      this.hoveredMarker.userData.isHovered = false;
      this.triggerEvent('markerLeave', this.hoveredMarker.userData.eventData);
      this.hoveredMarker = null;
      document.body.style.cursor = 'default';
    }
  }

  /**
   * Add event listener for marker interactions
   */
  addEventListener(eventType, callback) {
    if (this.eventCallbacks[eventType]) {
      this.eventCallbacks[eventType].push(callback);
    }
  }

  /**
   * Remove event listener
   */
  removeEventListener(eventType, callback) {
    if (this.eventCallbacks[eventType]) {
      const index = this.eventCallbacks[eventType].indexOf(callback);
      if (index > -1) {
        this.eventCallbacks[eventType].splice(index, 1);
      }
    }
  }

  /**
   * Trigger event callbacks
   */
  triggerEvent(eventType, data) {
    if (this.eventCallbacks[eventType]) {
      this.eventCallbacks[eventType].forEach(callback => callback(data));
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const currentTime = Date.now() * 0.001;
    
    // Smooth globe rotation
    if (this.globeGroup) {
      this.globeGroup.rotation.y += CONFIG.GLOBE.rotationSpeed;
    }
    
    // Update golden core animation
    if (this.goldenCore) {
      this.goldenCore.material.uniforms.time.value = currentTime;
    }
    
    // Update beautiful golden marker animations with subtle pulsing
    this.eventMarkers.forEach(markerGroup => {
      if (markerGroup.userData && markerGroup.userData.mainMarker && markerGroup.userData.glowLayers) {
        const { mainMarker, glowLayers, eventData, originalOpacities } = markerGroup.userData;
        
        // Create very subtle pulsing effect
        const pulseIntensity = 0.85 + 0.15 * Math.sin(currentTime * CONFIG.MARKERS.pulseSpeed + eventData.id * 0.1);
        const glowPulse = 0.7 + 0.3 * Math.sin(currentTime * CONFIG.MARKERS.pulseSpeed * 0.8 + eventData.id * 0.2);
        
        // Apply gentle pulsing to emissive intensity and opacity
        const isHighPriority = eventData.priority >= 7;
        const baseIntensity = isHighPriority ? 0.7 : 0.4;
        
        // Pulse the main marker
        mainMarker.material.emissiveIntensity = baseIntensity * pulseIntensity;
        mainMarker.material.opacity = originalOpacities.main * pulseIntensity;
        
        // Pulse the glow layers with different phases for depth
        glowLayers.forEach((glow, index) => {
          const phaseOffset = index * 0.3;
          const layerPulse = 0.6 + 0.4 * Math.sin(currentTime * CONFIG.MARKERS.pulseSpeed * 0.6 + eventData.id * 0.15 + phaseOffset);
          
          if (index === 0) { // Inner glow
            glow.material.opacity = originalOpacities.innerGlow * layerPulse;
          } else { // Outer glow
            glow.material.opacity = originalOpacities.outerGlow * layerPulse * 0.8;
          }
        });
      }
    });
    
    // Update controls
    this.controls.update();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Debug function to check marker visibility from camera perspective
   */
  debugMarkerVisibility() {
    console.log('=== MARKER VISIBILITY DEBUG ===');
    console.log(`Total markers created: ${this.eventMarkers.size}`);
    console.log(`Marker group children: ${this.markerGroup.children.length}`);
    
    this.eventMarkers.forEach((marker, eventId) => {
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
          lat: eventData?.lat,
          lng: eventData?.lng
        });
      }
    });
    console.log('==============================');
  }

  /**
   * Cleanup method for proper disposal
   */
  dispose() {
    this.pause();
    
    // Clear event markers
    this.clearEventMarkers();
    
    // Dispose geometries and materials
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    // Dispose textures
    Object.values(this.textures).forEach(texture => texture.dispose());
    
    // Dispose renderer
    this.renderer.dispose();
    
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    document.removeEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.renderer.domElement.removeEventListener('click', this.onMouseClick.bind(this));
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    this.stopAutoRefresh();
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    this.clearEventMarkers();
    
    console.log('Globe3D destroyed');
  }

  /**
   * Add a test marker for debugging visibility
   */
  addVisibilityTestMarker() {
    // Add a test marker at an obvious location (North America)
    const testPosition = this.latLngToVector3(40, -100, CONFIG.GLOBE.radius + 0.1);
    
    const testGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const testMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF6600, // Bright orange for visibility
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color(0xFF6600),
      emissiveIntensity: 1.0
    });
    
    const testMarker = new THREE.Mesh(testGeometry, testMaterial);
    testMarker.position.copy(testPosition);
    
    this.markerGroup.add(testMarker);
    console.log('Added orange test marker for visibility check at:', testPosition);
  }

}

// Initialize the globe
const globe = new Globe3D();

// Make globe available globally for controls
window.globe = globe;

// Make debug function available globally
window.debugMarkers = () => globe.debugMarkerVisibility();

// Example event handlers for marker interactions
globe.addEventListener('markerClick', (eventData) => {
  console.log('Marker clicked:', eventData);
  
  // Create and show event details modal
  showEventModal(eventData);
});

globe.addEventListener('markerHover', (eventData) => {
  console.log('Marker hovered:', eventData);
  
  // Show tooltip with event info
  showEventTooltip(eventData);
});

globe.addEventListener('markerLeave', (eventData) => {
  // Hide tooltip
  hideEventTooltip();
});

/**
 * Show event details in a modal
 */
function showEventModal(eventData) {
  // Create modal HTML with enhanced features
  const modalHTML = `
    <div id="eventModal" style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(10, 24, 27, 0.95);
      border: 2px solid #FFD700;
      border-radius: 15px;
      padding: 25px;
      max-width: 550px;
      width: 90%;
      z-index: 1000;
      color: white;
      font-family: Arial, sans-serif;
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(255,215,0,0.3);
    ">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div style="flex: 1; margin-right: 10px;">
          <h3 style="margin: 0 0 5px 0; color: #FFD700; font-size: 18px; line-height: 1.3;">${eventData.title}</h3>
          <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
            ${new Date(eventData.publishedAt).toLocaleDateString()} • ${eventData.country}
          </div>
        </div>
        <button onclick="closeEventModal()" style="
          background: none;
          border: none;
          color: #FFD700;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
          line-height: 1;
          border-radius: 50%;
          transition: background-color 0.2s;
        " onmouseover="this.style.backgroundColor='rgba(255,215,0,0.1)'" onmouseout="this.style.backgroundColor='transparent'">&times;</button>
      </div>
      
      <!-- Priority indicator -->
      <div style="margin-bottom: 15px;">
        <div style="display: inline-block; background: ${getPriorityColor(eventData.priority)}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
          Priority ${eventData.priority}/10
        </div>
      </div>
      
      <!-- Content -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 0 0 15px 0; line-height: 1.5; color: #e0e0e0;">${eventData.description}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 12px; color: #bbb; padding: 10px 0; border-top: 1px solid rgba(255,215,0,0.2);">
          <span><strong>📍 Location:</strong> ${eventData.country}</span>
          <span><strong>📰 Source:</strong> ${eventData.source}</span>
          <span><strong>🕒 Published:</strong> ${getTimeAgo(eventData.publishedAt)}</span>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button onclick="generatePrayerForEvent('${eventData.id}', '${eventData.title.replace(/'/g, "\\'")}', '${eventData.country}')" style="
          flex: 1;
          min-width: 120px;
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(76,175,80,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          🙏 Generate Prayer
        </button>
        <a href="${eventData.url}" target="_blank" style="
          flex: 1;
          min-width: 120px;
          display: inline-block;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #000;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: bold;
          transition: all 0.3s;
          text-align: center;
          font-size: 14px;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(255,215,0,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          📖 Read Article
        </a>
      </div>
    </div>
    
    <div id="eventModalBackdrop" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;
      backdrop-filter: blur(3px);
    " onclick="closeEventModal()"></div>
  `;
  
  // Remove existing modal if any
  closeEventModal();
  
  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Close event details modal
 */
function closeEventModal() {
  const modal = document.getElementById('eventModal');
  const backdrop = document.getElementById('eventModalBackdrop');
  
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
}

/**
 * Show event tooltip
 */
function showEventTooltip(eventData) {
  // Remove existing tooltip
  hideEventTooltip();
  
  const tooltip = document.createElement('div');
  tooltip.id = 'eventTooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(10, 24, 27, 0.95);
    border: 2px solid #FFD700;
    border-radius: 10px;
    padding: 12px;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 12px;
    z-index: 1000;
    pointer-events: none;
    max-width: 280px;
    backdrop-filter: blur(8px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  `;
  
  tooltip.innerHTML = `
    <div style="color: #FFD700; font-weight: bold; margin-bottom: 8px; font-size: 13px;">${eventData.title}</div>
    <div style="margin-bottom: 8px; color: #e0e0e0; line-height: 1.4;">${eventData.description.substring(0, 100)}${eventData.description.length > 100 ? '...' : ''}</div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px;">
      <span style="color: #ccc;">📍 ${eventData.country}</span>
      <span style="color: ${getPriorityColor(eventData.priority)}; font-weight: bold;">Priority: ${eventData.priority}/10</span>
    </div>
    <div style="font-size: 10px; color: #888; text-align: center; padding-top: 6px; border-top: 1px solid rgba(255,215,0,0.2);">
      🕒 ${getTimeAgo(eventData.publishedAt)} • Click for details
    </div>
  `;
  
  document.body.appendChild(tooltip);
  
  // Position tooltip near mouse
  document.addEventListener('mousemove', updateTooltipPosition);
}

/**
 * Hide event tooltip
 */
function hideEventTooltip() {
  const tooltip = document.getElementById('eventTooltip');
  if (tooltip) {
    tooltip.remove();
    document.removeEventListener('mousemove', updateTooltipPosition);
  }
}

/**
 * Update tooltip position
 */
function updateTooltipPosition(event) {
  const tooltip = document.getElementById('eventTooltip');
  if (tooltip) {
    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY - 10) + 'px';
  }
}

/**
 * Get priority color based on priority level
 */
function getPriorityColor(priority) {
  if (priority >= 8) return '#ff4444'; // High priority - red
  if (priority >= 6) return '#ffaa00'; // Medium priority - orange  
  if (priority >= 4) return '#ffdd00'; // Medium-low priority - yellow
  return '#44aa44'; // Low priority - green
}

/**
 * Get human-readable time ago
 */
function getTimeAgo(dateString) {
  const now = new Date();
  const published = new Date(dateString);
  const diffInMinutes = Math.floor((now - published) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

/**
 * Generate prayer for selected event
 */
function generatePrayerForEvent(eventId, eventTitle, country) {
  console.log(`Generating prayer for event: ${eventTitle} in ${country}`);
  
  // Close the modal first
  closeEventModal();
  
  // Create prayer generation popup
  const prayerHTML = `
    <div id="prayerModal" style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(10, 24, 27, 0.95);
      border: 2px solid #4CAF50;
      border-radius: 15px;
      padding: 25px;
      max-width: 500px;
      width: 90%;
      z-index: 1000;
      color: white;
      font-family: Arial, sans-serif;
      backdrop-filter: blur(10px);
      text-align: center;
    ">
      <div style="margin-bottom: 20px;">
        <div style="font-size: 48px; margin-bottom: 10px;">🙏</div>
        <h3 style="margin: 0 0 10px 0; color: #4CAF50;">Prayer Generation</h3>
        <p style="margin: 0; color: #ccc; font-size: 14px;">Generating a personalized prayer for this event...</p>
      </div>
      
      <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
        <strong style="color: #FFD700;">Event:</strong> ${eventTitle}<br>
        <strong style="color: #FFD700;">Location:</strong> ${country}
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid #4CAF50; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      </div>
      
      <button onclick="closePrayerModal()" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
      ">Close</button>
    </div>
    
    <div id="prayerModalBackdrop" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;
    " onclick="closePrayerModal()"></div>
    
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.insertAdjacentHTML('beforeend', prayerHTML);
  
  // Simulate prayer generation (replace with actual API call)
  setTimeout(() => {
    document.getElementById('prayerModal').innerHTML = `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
        <h3 style="margin: 0 0 15px 0; color: #4CAF50;">Prayer Generated</h3>
      </div>
      
      <div style="margin-bottom: 20px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; text-align: left;">
        <p style="margin: 0; line-height: 1.6; color: #e0e0e0; font-style: italic;">
          "Heavenly Father, we come before you with heavy hearts as we lift up the situation in ${country}. 
          We pray for peace, healing, and comfort for all those affected by these events. 
          Grant wisdom to leaders, strength to the suffering, and hope to communities in need. 
          May your love and grace shine through these difficult times. Amen."
        </p>
      </div>
      
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button onclick="copyPrayer()" style="
          background: #FFD700;
          color: #000;
          border: none;
          padding: 10px 15px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        ">📋 Copy Prayer</button>
        <button onclick="closePrayerModal()" style="
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        ">Close</button>
      </div>
    `;
  }, 2000);
}

/**
 * Close prayer modal
 */
function closePrayerModal() {
  const modal = document.getElementById('prayerModal');
  const backdrop = document.getElementById('prayerModalBackdrop');
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
}

/**
 * Copy prayer to clipboard
 */
function copyPrayer() {
  const prayerText = document.querySelector('#prayerModal p').textContent;
  navigator.clipboard.writeText(prayerText).then(() => {
    // Show success feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '#FFD700';
      button.style.color = '#000';
    }, 2000);
  });
}

// Export for external use
window.Globe3D = Globe3D;
window.globe = globe;

// Add modal functions to window for onclick handlers
window.closeEventModal = closeEventModal;
window.closePrayerModal = closePrayerModal;
window.copyPrayer = copyPrayer;
window.generatePrayerForEvent = generatePrayerForEvent;