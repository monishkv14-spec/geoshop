import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GlobeMarker } from '../../types';
import {
  latLongToVector3,
  createArcCurve,
  hexToThreeColor,
  getCountryFlag,
  isWebGLAvailable,
  DEFAULT_MOCK_MARKERS,
} from '../../utils/globeUtils';
import { ShoppingBag, MapPin, Sparkles, TrendingDown, ArrowUpRight, Globe2, AlertCircle } from 'lucide-react';

interface WorldGlobeProps {
  markers?: GlobeMarker[];
  selectedLocation: GlobeMarker | null;
  onSelectLocation: (marker: GlobeMarker) => void;
  onDoubleClickLocation: (marker: GlobeMarker) => void;
  isSearching: boolean;
}

interface DealArcData {
  sourceMarker: GlobeMarker;
  targetMarker: GlobeMarker;
  savingsUsd: number;
  savingsPercent: number;
  curve: THREE.QuadraticBezierCurve3;
  apex: THREE.Vector3;
  curveLine: THREE.Line;
  pulseMesh: THREE.Mesh;
}

// Custom Atmospheric Glow Shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 uAtmosphereColor;
  uniform float uCoefficient;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float intensity = pow(uCoefficient - dot(viewDir, vNormal), uPower);
    gl_FragColor = vec4(uAtmosphereColor, clamp(intensity * 0.85, 0.0, 1.0));
  }
`;

export const WorldGlobe: React.FC<WorldGlobeProps> = ({
  markers: propMarkers,
  selectedLocation,
  onSelectLocation,
  onDoubleClickLocation,
  isSearching,
}) => {
  // Use mock markers if prop markers are empty so globe is immediately interactive
  const activeMarkers = useMemo(() => {
    return propMarkers && propMarkers.length > 0 ? propMarkers : DEFAULT_MOCK_MARKERS;
  }, [propMarkers]);

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [arcBadges, setArcBadges] = useState<
    Array<{
      id: string;
      x: number;
      y: number;
      visible: boolean;
      targetMarker: GlobeMarker;
      savingsPercent: number;
      savingsUsd: number;
    }>
  >([]);

  // Fly-to camera animation state
  const flyToState = useRef<{
    active: boolean;
    startTime: number;
    duration: number;
    startPos: THREE.Vector3;
    targetPos: THREE.Vector3;
  }>({
    active: false,
    startTime: 0,
    duration: 1200,
    startPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
  });

  // Interaction tracking for idle rotation (resumes after 4s)
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const isInteractingRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const clickTimerRef = useRef<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);

  // Active deal arcs references
  const dealArcsRef = useRef<DealArcData[]>([]);

  // Selected location reference for loop
  const selectedLocationRef = useRef<GlobeMarker | null>(selectedLocation);
  selectedLocationRef.current = selectedLocation;

  // Fly camera to a location's spherical coordinates
  const triggerFlyToLocation = useCallback((marker: GlobeMarker) => {
    if (!cameraRef.current) return;
    const earthRadius = 5;
    const markerLat = marker.latitude ?? marker.lat ?? 0;
    const markerLon = marker.longitude ?? marker.lon ?? 0;
    const pinPos = latLongToVector3(markerLat, markerLon, earthRadius);

    // Target camera looks at pin from 15.5 units distance
    const targetCamPos = pinPos.clone().normalize().multiplyScalar(15.5);

    flyToState.current = {
      active: true,
      startTime: performance.now(),
      duration: 1200,
      startPos: cameraRef.current.position.clone(),
      targetPos: targetCamPos,
    };
  }, []);

  // WebGL Support Check
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLSupported(false);
    }
  }, []);

  // Main Three.js Scene Setup & Animation Lifecycle
  useEffect(() => {
    if (!containerRef.current || !webGLSupported) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene – warm cream background to match Sage & Cream theme
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0ede6');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 17.5);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls with smooth inertia damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 8.5;
    controls.maxDistance = 32;
    controls.minPolarAngle = Math.PI * 0.08;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 5. Lighting: Ambient + warm Sunlight + subtle sage tinted rim
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8f0, 2.6);
    sunLight.position.set(20, 15, 20);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x8faa8a, 1.0);
    rimLight.position.set(-20, -12, -20);
    scene.add(rimLight);

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 7. Earth Mesh with High-Detail Offline Textures
    const earthRadius = 5;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    // Load bundled local offline textures
    const earthDayTexture = textureLoader.load('/textures/earth_day.jpg');
    earthDayTexture.colorSpace = THREE.SRGBColorSpace;

    const earthNormalTexture = textureLoader.load('/textures/earth_normal.jpg');
    const earthSpecularTexture = textureLoader.load('/textures/earth_specular.jpg');

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthDayTexture,
      normalMap: earthNormalTexture,
      normalScale: new THREE.Vector2(0.85, 0.85),
      specularMap: earthSpecularTexture,
      specular: new THREE.Color(0x445544),
      shininess: 14,
      emissive: new THREE.Color(0x0a120a),
      emissiveIntensity: 0.15,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 8. Atmospheric Glow Shader – soft sage-tinted halo
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.025, 64, 64);
    const sageAtmosphereColor = new THREE.Color('#8faa8a');

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uAtmosphereColor: { value: sageAtmosphereColor },
        uCoefficient: { value: 0.28 },
        uPower: { value: 3.8 },
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    atmosphereMaterialRef.current = atmosphereMaterial;

    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 9. Cloud Layer Sphere
    const cloudTexture = textureLoader.load('/textures/earth_clouds.png');
    const cloudsGeometry = new THREE.SphereGeometry(earthRadius * 1.018, 64, 64);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    globeGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 10. Subtle star scatter (dimmed for light theme)
    const starCount = 600;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 60 + Math.random() * 60;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      starPositions[i] = radius * sinPhi * Math.cos(theta);
      starPositions[i + 1] = radius * sinPhi * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);

      // Muted warm star tones for light theme
      starColors[i] = 0.75;
      starColors[i + 1] = 0.72;
      starColors[i + 2] = 0.65;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 11. Groups for Markers and Deal Arcs
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    // 12. Interaction Handlers: Pointer Events (Click, Drag, Double-Click, Hover)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getRaycastIntersects = (clientX: number, clientY: number) => {
      if (!containerRef.current || !cameraRef.current || !markersGroupRef.current) return [];
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      return raycaster.intersectObjects(markersGroupRef.current.children, true);
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = false;
      isInteractingRef.current = true;
      lastInteractionTimeRef.current = Date.now();
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };

      // Cancel any ongoing fly-to animation when user grabs the globe
      if (flyToState.current.active) {
        flyToState.current.active = false;
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      lastInteractionTimeRef.current = Date.now();
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);

      if (dx > 5 || dy > 5) {
        isDraggingRef.current = true;
      }

      // Raycast hover when not dragging
      if (!isDraggingRef.current) {
        const intersects = getRaycastIntersects(e.clientX, e.clientY);
        if (intersects.length > 0) {
          let topMesh: THREE.Object3D | null = intersects[0].object;
          while (topMesh && topMesh.parent && topMesh.parent !== markersGroupRef.current) {
            topMesh = topMesh.parent;
          }
          const markerData = (topMesh as any)?.userData?.marker as GlobeMarker;
          if (markerData) {
            setHoveredMarker(markerData);
            setTooltipPos({ x: e.clientX, y: e.clientY });
            document.body.style.cursor = 'pointer';
            return;
          }
        }
      }

      setHoveredMarker(null);
      document.body.style.cursor = 'default';
    };

    const handlePointerUp = (e: MouseEvent) => {
      isInteractingRef.current = false;
      lastInteractionTimeRef.current = Date.now();

      // If dragging occurred, do not trigger click
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        return;
      }

      const intersects = getRaycastIntersects(e.clientX, e.clientY);
      if (intersects.length > 0) {
        let topMesh: THREE.Object3D | null = intersects[0].object;
        while (topMesh && topMesh.parent && topMesh.parent !== markersGroupRef.current) {
          topMesh = topMesh.parent;
        }
        const markerData = (topMesh as any)?.userData?.marker as GlobeMarker;
        if (markerData) {
          // Double-click detector (250ms window)
          if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
            onDoubleClickLocation(markerData);
          } else {
            clickTimerRef.current = window.setTimeout(() => {
              clickTimerRef.current = null;
              onSelectLocation(markerData);
              triggerFlyToLocation(markerData);
            }, 250);
          }
        }
      }
    };

    // Touch Support with Double-Tap detection
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      isDraggingRef.current = false;
      isInteractingRef.current = true;
      lastInteractionTimeRef.current = Date.now();
      pointerDownPosRef.current = { x: touch.clientX, y: touch.clientY };

      if (flyToState.current.active) {
        flyToState.current.active = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      lastInteractionTimeRef.current = Date.now();
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(touch.clientY - pointerDownPosRef.current.y);
      if (dx > 8 || dy > 8) {
        isDraggingRef.current = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      isInteractingRef.current = false;
      lastInteractionTimeRef.current = Date.now();

      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) return;

      const intersects = getRaycastIntersects(touch.clientX, touch.clientY);
      if (intersects.length > 0) {
        let topMesh: THREE.Object3D | null = intersects[0].object;
        while (topMesh && topMesh.parent && topMesh.parent !== markersGroupRef.current) {
          topMesh = topMesh.parent;
        }
        const markerData = (topMesh as any)?.userData?.marker as GlobeMarker;
        if (markerData) {
          const now = Date.now();
          if (now - lastTapTimeRef.current < 300) {
            // Double-tap
            lastTapTimeRef.current = 0;
            onDoubleClickLocation(markerData);
          } else {
            // Single-tap
            lastTapTimeRef.current = now;
            onSelectLocation(markerData);
            triggerFlyToLocation(markerData);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    domElement.addEventListener('mousemove', handlePointerMove);
    domElement.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    domElement.addEventListener('touchend', handleTouchEnd);

    // 13. Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 14. Tab Visibility Handler (Pause rendering when tab hidden)
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 15. Animation Render Loop (60 FPS)
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const now = Date.now();
      const timeSec = now * 0.001;

      // Camera Fly-To Cubic Easing Animation
      if (flyToState.current.active) {
        const elapsed = performance.now() - flyToState.current.startTime;
        const progress = Math.min(1, elapsed / flyToState.current.duration);
        // Cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(
          flyToState.current.startPos,
          flyToState.current.targetPos,
          ease
        );
        controls.target.set(0, 0, 0);

        if (progress >= 1) {
          flyToState.current.active = false;
        }
      }

      // Idle Slow Auto-Rotate (Pauses on interaction and resumes after 4s)
      const isIdle = now - lastInteractionTimeRef.current > 4000;
      if (
        globeGroupRef.current &&
        !isInteractingRef.current &&
        !isDraggingRef.current &&
        !flyToState.current.active &&
        isIdle
      ) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      // Subtle independent cloud drift
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.00035;
      }

      // Update controls damping
      controls.update();

      // Animate pulsing Price Pulse rings on country pins
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((group) => {
          const pulseRing = group.getObjectByName('pulseRing');
          if (pulseRing) {
            const scale = 1 + Math.sin(timeSec * 4) * 0.22;
            pulseRing.scale.set(scale, scale, scale);
            const mat = (pulseRing as THREE.Mesh).material as THREE.MeshBasicMaterial;
            if (mat) {
              mat.opacity = 0.5 + Math.sin(timeSec * 4) * 0.3;
            }
          }
        });
      }

      // Animate flowing pulses along Deal Arcs
      if (dealArcsRef.current.length > 0) {
        dealArcsRef.current.forEach((arcData, idx) => {
          const t = (timeSec * 0.45 + idx * 0.25) % 1.0;
          const pointOnCurve = arcData.curve.getPoint(t);
          arcData.pulseMesh.position.copy(pointOnCurve);
        });

        // Project Deal Arc Apex to Screen Space for interactive badges
        if (containerRef.current && cameraRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const newBadges = dealArcsRef.current.map((arcData, i) => {
            // Apex point in world coordinates
            const worldApex = arcData.apex.clone().applyMatrix4(globeGroupRef.current!.matrixWorld);
            const projected = worldApex.clone().project(cameraRef.current!);

            // Only show badge if apex is on the front facing hemisphere
            const isFacing = worldApex.dot(cameraRef.current!.position) > 0;
            const inView = projected.z < 1 && isFacing;

            const screenX = (projected.x * 0.5 + 0.5) * rect.width;
            const screenY = (-projected.y * 0.5 + 0.5) * rect.height;

            return {
              id: `arc-badge-${i}`,
              x: screenX,
              y: screenY,
              visible: inView,
              targetMarker: arcData.targetMarker,
              savingsPercent: arcData.savingsPercent,
              savingsUsd: arcData.savingsUsd,
            };
          });

          setArcBadges(newBadges);
        }
      } else {
        setArcBadges([]);
      }

      // Smoothly transition Atmosphere Glow Shader tint per selected location
      if (atmosphereMaterialRef.current && selectedLocationRef.current) {
        const targetColor = hexToThreeColor(selectedLocationRef.current.atmosphereColor);
        atmosphereMaterialRef.current.uniforms.uAtmosphereColor.value.lerp(targetColor, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 16. Comprehensive Disposal & Teardown on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('mousemove', handlePointerMove);
      domElement.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);

      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      // Dispose all Three.js scene assets, geometries, and materials
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        if ((obj as THREE.Mesh).material) {
          const mat = (obj as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => m.dispose());
          } else {
            mat.dispose();
          }
        }
      });

      controls.dispose();
      renderer.dispose();

      if (domElement && domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
    };
  }, [webGLSupported, onDoubleClickLocation, onSelectLocation, triggerFlyToLocation]);

  // Re-build 3D Location Pins and Deal Arcs when markers or selected location change
  useEffect(() => {
    if (!markersGroupRef.current || !arcsGroupRef.current) return;

    // 1. Clear previous markers
    while (markersGroupRef.current.children.length > 0) {
      const child = markersGroupRef.current.children[0];
      markersGroupRef.current.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    // 2. Clear previous deal arcs
    while (arcsGroupRef.current.children.length > 0) {
      const child = arcsGroupRef.current.children[0];
      arcsGroupRef.current.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }
    dealArcsRef.current = [];

    const earthRadius = 5;

    // 3. Render Spherical Country Pins
    activeMarkers.forEach((marker) => {
      const markerLat = marker.latitude ?? marker.lat ?? 0;
      const markerLon = marker.longitude ?? marker.lon ?? 0;
      const pos = latLongToVector3(markerLat, markerLon, earthRadius * 1.01);
      const isSelected = selectedLocation?.code === marker.code;

      const markerGroup = new THREE.Group();
      markerGroup.position.copy(pos);

      // Align pin group orientation to surface normal
      const normal = pos.clone().normalize();
      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Price Pulse color (Green = cheapest, Amber = mid, Red = expensive)
      let pinColorHex = marker.pulseColor || '#5b7056';
      if (marker.priceTier === 'cheapest') pinColorHex = '#10b981';
      else if (marker.priceTier === 'mid') pinColorHex = '#f59e0b';
      else if (marker.priceTier === 'expensive') pinColorHex = '#ef4444';

      const pinColor = isSelected ? 0x3a4b37 : new THREE.Color(pinColorHex).getHex();

      // Pin core sphere
      const pinGeo = new THREE.SphereGeometry(isSelected ? 0.22 : 0.16, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      markerGroup.add(pinMesh);

      // Pulsing Price Pulse Ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.name = 'pulseRing';
      markerGroup.add(ringMesh);

      // Vertical Light Beam on Selected Pin
      if (isSelected) {
        const beamGeo = new THREE.CylinderGeometry(0.04, 0.18, 3.0, 16);
        const beamMat = new THREE.MeshBasicMaterial({
          color: hexToThreeColor(marker.atmosphereColor),
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        });
        const beamMesh = new THREE.Mesh(beamGeo, beamMat);
        beamMesh.position.y = 1.5;
        markerGroup.add(beamMesh);
      }

      // Attach data for Raycasting
      (markerGroup as any).userData = { marker };
      pinMesh.userData = { marker };

      markersGroupRef.current?.add(markerGroup);
    });

    // 4. Construct Animated Deal Arcs from Selected Country to Cheaper Countries
    if (selectedLocation) {
      const selectedLat = selectedLocation.latitude ?? selectedLocation.lat ?? 0;
      const selectedLon = selectedLocation.longitude ?? selectedLocation.lon ?? 0;
      const sourcePos = latLongToVector3(selectedLat, selectedLon, earthRadius * 1.01);
      const currentPriceUsd = selectedLocation.lowestUsdPrice || selectedLocation.minPrice || 0;

      // Find all countries that have a lower USD price than the selected country
      const cheaperMarkers = activeMarkers.filter((m) => {
        const mPrice = m.lowestUsdPrice || m.minPrice || 0;
        return m.code !== selectedLocation.code && mPrice < currentPriceUsd && mPrice > 0;
      });

      const newArcs: DealArcData[] = [];

      cheaperMarkers.forEach((cheaper) => {
        const tLat = cheaper.latitude ?? cheaper.lat ?? 0;
        const tLon = cheaper.longitude ?? cheaper.lon ?? 0;
        const targetPos = latLongToVector3(tLat, tLon, earthRadius * 1.01);

        const cheaperPrice = cheaper.lowestUsdPrice || cheaper.minPrice || 0;
        const savingsUsd = Math.round(currentPriceUsd - cheaperPrice);
        const savingsPercent = Math.round((savingsUsd / currentPriceUsd) * 100);

        const { curve, apex } = createArcCurve(sourcePos, targetPos, earthRadius);

        // Arc curve line geometry
        const arcPoints = curve.getPoints(50);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const arcMat = new THREE.LineBasicMaterial({
          color: 0x10b981, // Emerald Green
          transparent: true,
          opacity: 0.75,
          linewidth: 2,
        });
        const curveLine = new THREE.Line(arcGeo, arcMat);
        arcsGroupRef.current?.add(curveLine);

        // Traveling pulse particle along the arc
        const pulseGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        arcsGroupRef.current?.add(pulseMesh);

        newArcs.push({
          sourceMarker: selectedLocation,
          targetMarker: cheaper,
          savingsUsd,
          savingsPercent,
          curve,
          apex,
          curveLine,
          pulseMesh,
        });
      });

      dealArcsRef.current = newArcs;
    }
  }, [activeMarkers, selectedLocation]);

  // Is selected location currently the cheapest globally?
  const isSelectedCheapest = useMemo(() => {
    if (!selectedLocation || activeMarkers.length === 0) return false;
    const lowest = Math.min(...activeMarkers.map((m) => m.lowestUsdPrice || 999999));
    return (selectedLocation.lowestUsdPrice || 0) <= lowest;
  }, [selectedLocation, activeMarkers]);

  // WebGL Unsupported Fallback UI
  if (!webGLSupported) {
    return (
      <div className="w-full h-full min-h-[480px] bg-white rounded-2xl border border-[#e5dec4] p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
        <h3 className="text-xl font-bold text-[#191c19] mb-2">3D WebGL Acceleration Unavailable</h3>
        <p className="text-[#6b6856] text-sm max-w-md mb-6">
          Your browser does not currently support 3D WebGL hardware acceleration. You can still
          browse and compare all global locations using the country grid below.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
          {activeMarkers.map((marker) => (
            <button
              key={marker.code}
              onClick={() => {
                onSelectLocation(marker);
                onDoubleClickLocation(marker);
              }}
              className="p-3 bg-[#f7f4ee] border border-[#e5dec4] hover:border-[#3a4b37] rounded-xl text-left transition"
            >
              <div className="text-2xl mb-1">{marker.flag || getCountryFlag(marker.code)}</div>
              <div className="font-bold text-[#191c19] text-sm">{marker.country}</div>
              <div className="text-emerald-600 font-extrabold text-xs">
                ${marker.lowestUsdPrice} USD
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[540px] flex items-center justify-center select-none overflow-hidden rounded-2xl border border-[#e5dec4] bg-[#f0ede6]">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing focus:outline-none"
        tabIndex={0}
        aria-label="Interactive 3D Earth Globe: Click and drag to rotate, single-click pin to select, double-click to compare stores"
      />

      {/* Scanning status banner */}
      {isSearching && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full border border-[#3a4b37]/30 shadow-lg flex items-center gap-3 z-30">
          <div className="w-4 h-4 border-2 border-[#3a4b37] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#3a4b37] text-xs font-semibold tracking-wide">
            Scanning Global Store Platforms...
          </span>
        </div>
      )}

      {/* Best Global Price Celebration Pill */}
      {isSelectedCheapest && selectedLocation && (
        <div className="absolute top-4 left-4 bg-emerald-50 backdrop-blur-md border border-emerald-300 px-4 py-2 rounded-full text-emerald-700 text-xs font-bold shadow-md flex items-center gap-2 z-20">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>
            Global Best Price: {selectedLocation.country}{' '}
            {selectedLocation.flag || getCountryFlag(selectedLocation.code)} (${selectedLocation.lowestUsdPrice} USD)
          </span>
        </div>
      )}

      {/* Floating 3D Deal Arc Savings Badges */}
      {arcBadges.map(
        (badge) =>
          badge.visible && (
            <button
              key={badge.id}
              onClick={() => {
                onSelectLocation(badge.targetMarker);
                triggerFlyToLocation(badge.targetMarker);
              }}
              style={{
                left: `${badge.x}px`,
                top: `${badge.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 bg-emerald-50/95 hover:bg-emerald-100 border border-emerald-400 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto group animate-in fade-in duration-200"
              title={`Switch to ${badge.targetMarker.country}`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Save {badge.savingsPercent}% (${badge.savingsUsd}) in {badge.targetMarker.country}
              </span>
              <ArrowUpRight className="w-3 h-3 text-emerald-500 opacity-70 group-hover:opacity-100 transition" />
            </button>
          )
      )}

      {/* Hover Pin Tooltip */}
      {hoveredMarker && (
        <div
          style={{
            left: `${Math.min(window.innerWidth - 300, tooltipPos.x + 14)}px`,
            top: `${Math.min(window.innerHeight - 260, tooltipPos.y + 14)}px`,
          }}
          className="fixed pointer-events-none z-50 bg-white/95 backdrop-blur-2xl border-2 border-[#3a4b37]/40 p-4 rounded-2xl shadow-xl text-[#191c19] text-xs max-w-xs animate-in fade-in zoom-in-95 duration-150 space-y-2.5"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#e5dec4]">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {hoveredMarker.flag || getCountryFlag(hoveredMarker.code)}
              </span>
              <div>
                <div className="font-extrabold text-sm text-[#3a4b37] leading-tight">
                  {hoveredMarker.country}
                </div>
                <div className="text-[10px] text-[#6b6856] font-medium">{hoveredMarker.code}</div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                hoveredMarker.priceTier === 'cheapest'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : hoveredMarker.priceTier === 'mid'
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}
            >
              {hoveredMarker.priceTier === 'cheapest'
                ? 'Best Price'
                : hoveredMarker.priceTier === 'mid'
                ? 'Mid Tier'
                : 'Higher Price'}
            </span>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-[#6b6856] tracking-wider mb-1.5 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-[#3a4b37]" />
              <span>
                Stores ({hoveredMarker.storesCount ?? (hoveredMarker.websites || hoveredMarker.stores || []).length}):
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(hoveredMarker.websites || hoveredMarker.stores || []).map((site) => (
                <span
                  key={site}
                  className="px-2 py-0.5 rounded-md bg-[#f7f4ee] border border-[#e5dec4] text-[#3a4b37] font-bold text-[11px]"
                >
                  {site}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#f7f4ee] p-2 rounded-xl border border-[#e5dec4] text-[11px]">
            <div>
              <span className="text-[#6b6856] block text-[10px]">Lowest Price</span>
              <span className="text-emerald-600 font-extrabold text-sm">
                {hoveredMarker.currencySymbol || hoveredMarker.currency || '$'}
                {(hoveredMarker.minPrice ?? hoveredMarker.lowestPrice ?? 0).toLocaleString()}
              </span>
              <span className="text-[#8a8474] text-[10px] block">
                ≈ ${hoveredMarker.lowestUsdPrice} USD
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#6b6856] block text-[10px]">Platforms</span>
              <span className="text-[#191c19] font-bold">
                {hoveredMarker.storesCount ?? hoveredMarker.storeCount ?? 0} Stores
              </span>
            </div>
          </div>

          <div className="text-[10px] text-[#5b7056] font-medium italic pt-1 border-t border-[#e5dec4] text-center">
            Click to select • Double-click to compare
          </div>
        </div>
      )}

      {/* Always-Visible Price Pulse Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-[#e5dec4] p-3 rounded-xl text-xs text-[#6b6856] z-10 shadow-md space-y-1.5 max-w-xs pointer-events-auto">
        <div className="text-[11px] font-bold text-[#191c19] flex items-center gap-1.5 pb-1 border-b border-[#e5dec4]">
          <Globe2 className="w-3.5 h-3.5 text-[#3a4b37]" />
          <span>Price Pulse & Deal Legend</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-200 shrink-0" />
          <span className="text-[#6b6856]">Cheapest (Global Best Price)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-200 shrink-0" />
          <span className="text-[#6b6856]">Mid-tier regional price</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200 shrink-0" />
          <span className="text-[#6b6856]">Higher price / Import taxes</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] pt-0.5 text-emerald-600 font-medium">
          <span className="w-3.5 h-0.5 bg-emerald-400 rounded shrink-0" />
          <span>Deal Arcs: Routes to cheaper countries</span>
        </div>
      </div>

      {/* Keyboard-Accessible Country Quick-Jump Dock (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-auto">
        <div className="text-[10px] uppercase font-bold text-[#8a8474] tracking-wider">
          Quick Country Jump
        </div>
        <div className="flex flex-wrap justify-end gap-1 max-w-[320px]">
          {activeMarkers.map((marker) => {
            const isSelected = selectedLocation?.code === marker.code;
            return (
              <button
                key={marker.code}
                onClick={() => {
                  onSelectLocation(marker);
                  triggerFlyToLocation(marker);
                }}
                onDoubleClick={() => onDoubleClickLocation(marker)}
                title={`Select ${marker.country} (Double-click to compare stores)`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#3a4b37] text-white font-bold shadow-md scale-105'
                    : 'bg-white/90 text-[#3a4b37] hover:bg-[#3a4b37] hover:text-white border border-[#e5dec4]'
                }`}
              >
                <span>{marker.flag || getCountryFlag(marker.code)}</span>
                <span>{marker.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interaction Hint Guide (Bottom-Center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/85 backdrop-blur-md border border-[#e5dec4] px-4 py-1.5 rounded-full text-xs text-[#6b6856] hidden sm:flex items-center gap-3 z-10 pointer-events-none shadow-md">
        <span className="flex items-center gap-1.5 text-[#3a4b37] font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          Click & Drag to Rotate
        </span>
        <span className="text-[#c4bfa8]">•</span>
        <span>Single-Click: Fly & Select</span>
        <span className="text-[#c4bfa8]">•</span>
        <span className="text-[#191c19] font-bold">Double-Click: Compare Stores</span>
      </div>
    </div>
  );
};
