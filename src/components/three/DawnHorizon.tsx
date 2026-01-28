import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex Shader - Simple pass-through (no geometry distortion)
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader - Creates the golden dawn glow effect with aurora
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHoverIntensity;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Simplex noise function for organic glow
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Aurora curtain effect - vertical bands rising from curved horizon
  float auroraCurtain(vec2 uv, float time, float offset, vec2 mouse, float hoverIntensity, float curveOffset) {
    // Mouse-driven distortion
    float mouseDist = length(uv - mouse);
    float mouseEffect = smoothstep(0.5, 0.0, mouseDist) * hoverIntensity;

    // Distort x position based on mouse
    float distortedX = uv.x + (uv.x - mouse.x) * mouseEffect * 0.15;

    // Create multiple vertical curtain bands
    float curtainFreq = 12.0 + offset * 2.0;
    float curtainPhase = time * 0.2 + offset;

    // Wavy vertical bands - like hanging curtains
    float wave = sin(distortedX * curtainFreq + curtainPhase) * 0.5 + 0.5;
    wave += sin(distortedX * curtainFreq * 0.5 - time * 0.15 + offset * 1.5) * 0.3;
    wave += sin(distortedX * curtainFreq * 2.0 + time * 0.3 + offset * 0.7) * 0.2;
    wave = wave / 1.5;

    // Vertical streaks - strong curtain lines
    float streaks = sin(distortedX * 35.0 + time * 0.1 + offset) * 0.5 + 0.5;
    streaks = pow(streaks, 4.0);

    // Use curved horizon - aurora follows the curve
    float horizonY = 0.22;
    float curvedHorizon = horizonY + curveOffset;  // Apply the same curve as horizon
    float maxHeight = 0.40; // 40% above curved horizon

    // Adjust UV.y relative to curved horizon
    float adjustedY = uv.y + curveOffset;
    float heightNorm = (adjustedY - curvedHorizon) / maxHeight;

    // Curtain shape - starts bright at curved bottom, fades up with wavy top edge
    float topWave = sin(distortedX * 8.0 + time * 0.4) * 0.15 + sin(distortedX * 15.0 - time * 0.2) * 0.1;
    float curtainTop = maxHeight + topWave * 0.1;

    // Mask follows the curved horizon
    float curtainMask = smoothstep(curvedHorizon - 0.02, curvedHorizon + 0.05, adjustedY) *
                        smoothstep(curvedHorizon + curtainTop, curvedHorizon + curtainTop * 0.5, adjustedY);

    // Add vertical gradient - brighter at bottom (following curve)
    float verticalGradient = 1.0 - smoothstep(0.0, 1.0, max(0.0, heightNorm));
    verticalGradient = pow(verticalGradient, 0.5);

    // Combine for curtain effect
    float intensity = wave * curtainMask * verticalGradient;
    intensity *= (0.5 + streaks * 0.5);

    // Add noise for organic feel
    float noise = snoise(vec2(distortedX * 6.0 + time * 0.05, adjustedY * 8.0 + offset)) * 0.5 + 0.5;
    intensity *= (0.7 + noise * 0.3);

    // Mouse glow effect
    intensity += mouseEffect * 0.3 * curtainMask;

    return intensity;
  }

  // Hash function for random sparkle positions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Particle function - circular glowing dots
  float particle(vec2 uv, vec2 center, float size, float time, vec2 aspect) {
    vec2 d = (uv - center) * aspect;
    float dist = length(d);

    // Bright glowing core
    float core = exp(-dist * dist / (size * size * 0.08));

    // Soft outer glow
    float glow = exp(-dist * dist / (size * size * 0.4));

    // Combine
    float p = core * 1.2 + glow * 0.5;

    // Subtle twinkle
    float twinkle = sin(time * 0.6 + center.x * 50.0) * 0.15 + 0.85;

    return p * twinkle;
  }

  void main() {
    // Base colors for golden dawn glow
    vec3 darkPurple = vec3(0.08, 0.03, 0.08);
    vec3 warmBrown = vec3(0.15, 0.08, 0.05);
    vec3 goldenYellow = vec3(0.85, 0.65, 0.2);
    vec3 brightGold = vec3(1.0, 0.85, 0.4);

    // Calculate distance from horizon (bottom of screen)
    float horizonY = 0.22;

    // Create curved horizon effect (STATIC - not affected by mouse)
    // Stronger curve for more dramatic effect
    float curveOffset = pow(abs(vUv.x - 0.5) * 2.0, 2.0) * 0.12;
    float adjustedY = vUv.y + curveOffset;

    // Mouse influence for gradient distortion
    float distanceFromMouse = length(vUv - uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, distanceFromMouse) * uHoverIntensity;

    // Create distorted UV for gradient (only above horizon)
    float aboveHorizon = smoothstep(horizonY, horizonY + 0.3, adjustedY);
    vec2 gradientUv = vUv;

    // Add wave distortion to gradient based on mouse position
    float waveX = sin((vUv.y - uMouse.y) * 15.0 + uTime * 2.0) * 0.03 * mouseInfluence * aboveHorizon;
    float waveY = cos((vUv.x - uMouse.x) * 12.0 + uTime * 1.5) * 0.02 * mouseInfluence * aboveHorizon;
    gradientUv.x += waveX;
    gradientUv.y += waveY;

    // Push gradient away from mouse
    vec2 mouseDir = normalize(vUv - uMouse + 0.001);
    float pushStrength = mouseInfluence * 0.08 * aboveHorizon;
    gradientUv += mouseDir * pushStrength * (1.0 - distanceFromMouse);

    // Simplified noise - single call, reuse with offsets
    float baseNoise = snoise(vec2(gradientUv.x * 4.0 + uTime * 0.1, gradientUv.y * 3.0)) * 0.5 + 0.5;
    float noise1 = baseNoise;
    float noise2 = fract(baseNoise * 1.7 + 0.3);
    float noise3 = fract(baseNoise * 2.3 + 0.6);

    // Mouse glow effect
    float mouseGlow = smoothstep(0.4, 0.0, distanceFromMouse) * uHoverIntensity * 0.5;

    // Calculate alpha based on glow intensity
    float alpha = 0.0;

    // Color starts transparent
    vec3 color = vec3(0.0);

    // Distorted Y for gradient calculations (but horizon stays fixed)
    float gradientAdjustedY = gradientUv.y + curveOffset;

    // Add purple/brown atmosphere above horizon (MOVING with mouse)
    float atmosphereMix = smoothstep(0.5, 0.1, gradientAdjustedY) * (1.0 - smoothstep(0.0, 0.15, gradientAdjustedY - horizonY * 2.0));
    atmosphereMix *= 1.0 + mouseInfluence * 0.5; // Intensify on hover
    color = mix(color, darkPurple, atmosphereMix * 0.7 * (0.8 + noise2 * 0.4));
    color = mix(color, warmBrown, atmosphereMix * 0.3 * noise1 * (1.0 + mouseInfluence));
    alpha = max(alpha, atmosphereMix * 0.5);

    // Add golden glow near horizon (MOVING with mouse)
    float goldenMix = smoothstep(0.25, 0.0, gradientAdjustedY - horizonY * 0.5);
    goldenMix *= 1.0 + noise1 * 0.5 + mouseGlow * 2.0;
    color = mix(color, goldenYellow, goldenMix * 0.8);
    alpha = max(alpha, goldenMix * 0.9);

    // Add bright gold at the very edge (slightly moving)
    float brightMix = smoothstep(0.08, 0.0, mix(adjustedY, gradientAdjustedY, 0.3) - horizonY * 0.3);
    brightMix *= 0.8 + noise3 * 0.4;
    color = mix(color, brightGold, brightMix * 0.9);
    alpha = max(alpha, brightMix);

    // Add subtle pulsing to the glow
    float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
    color *= pulse;

    // Add mouse-reactive brightening and color shift
    vec3 hoverColor = mix(vec3(1.0, 0.9, 0.6), vec3(1.0, 0.7, 0.3), noise1);
    color += hoverColor * mouseGlow * 0.4;
    alpha += mouseGlow * 0.3;

    // Add edge glow to the horizon line (STATIC - uses original adjustedY)
    float edgeGlow = smoothstep(0.03, 0.0, abs(adjustedY - horizonY)) * 0.8;
    edgeGlow *= 0.8 + noise1 * 0.2;
    color += goldenYellow * edgeGlow * 0.5;
    alpha = max(alpha, edgeGlow * 0.8);

    // ===== AURORA CURTAIN EFFECT =====
    // Aurora colors - golden/yellow tones (bright and warm)
    vec3 auroraGold1 = vec3(1.0, 0.85, 0.3);      // Bright gold
    vec3 auroraGold2 = vec3(1.0, 0.7, 0.2);       // Warm orange-gold
    vec3 auroraGold3 = vec3(1.0, 0.95, 0.6);      // Light golden yellow
    vec3 auroraWhite = vec3(1.0, 0.98, 0.9);      // Warm white highlight

    // Mouse interaction for aurora
    float auroraMouseDist = length(vUv - uMouse);
    float auroraMouseEffect = smoothstep(0.5, 0.0, auroraMouseDist) * uHoverIntensity;

    // Create multiple curtain layers with different offsets - following curved horizon
    float curtain1 = auroraCurtain(vUv, uTime, 0.0, uMouse, uHoverIntensity, curveOffset);
    float curtain2 = auroraCurtain(vUv, uTime * 0.8, 2.5, uMouse, uHoverIntensity, curveOffset);
    float curtain3 = auroraCurtain(vUv, uTime * 1.2, 5.0, uMouse, uHoverIntensity, curveOffset);

    // Mix aurora colors - layered curtains
    vec3 auroraColor = vec3(0.0);
    auroraColor += auroraGold1 * curtain1 * 1.2;
    auroraColor += auroraGold2 * curtain2 * 0.9;
    auroraColor += auroraGold3 * curtain3 * 0.7;

    // Add bright highlights near mouse
    float mouseHighlight = auroraCurtain(vUv, uTime * 1.5, 7.0, uMouse, uHoverIntensity, curveOffset);
    auroraColor += auroraWhite * mouseHighlight * auroraMouseEffect * 1.0;

    // Extra glow around mouse position
    float mouseGlowAurora = exp(-auroraMouseDist * auroraMouseDist * 6.0) * uHoverIntensity;
    auroraColor += auroraGold1 * mouseGlowAurora * 0.5;

    // Intensify aurora on hover
    float auroraIntensity = 0.7 + auroraMouseEffect * 0.6;

    // Apply aurora - curtain effect already has built-in mask
    color += auroraColor * auroraIntensity;
    alpha = max(alpha, (curtain1 + curtain2 + curtain3) * 0.4 * auroraIntensity);

    // Add vertical shimmer along curtain bands - following curved horizon
    float verticalShimmer = sin(vUv.x * 40.0 + uTime * 1.5) * 0.5 + 0.5;
    verticalShimmer = pow(verticalShimmer, 3.0);
    float curvedHorizonY = horizonY + curveOffset;
    float shimmerMask = smoothstep(curvedHorizonY, curvedHorizonY + 0.1, adjustedY) * smoothstep(curvedHorizonY + 0.45, curvedHorizonY + 0.2, adjustedY);
    color += auroraGold3 * verticalShimmer * shimmerMask * 0.15 * (1.0 + auroraMouseEffect);

    // Dark ground at the bottom (STATIC)
    float groundMask = smoothstep(horizonY + 0.02, horizonY - 0.05, adjustedY);
    vec3 groundColor = vec3(0.02, 0.02, 0.03);
    color = mix(color, groundColor, groundMask);
    alpha = mix(alpha, 0.95, groundMask);

    // Galaxy particle effects
    vec3 particleColor = vec3(0.0);
    float particleAlpha = 0.0;

    // Only show particles in top 80%
    float particleMask = smoothstep(0.2, 0.28, vUv.y);

    // Aspect ratio for circular particles
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // Distance from mouse for interaction
    float mouseDist = length(vUv - uMouse);
    float mouseProximity = smoothstep(0.4, 0.0, mouseDist) * mouseInfluence;

    // Create dense galaxy particle field
    for (int i = 0; i < 250; i++) {
      float fi = float(i);
      float h1 = hash(vec2(fi, 1.23));
      float h2 = hash(vec2(2.34, fi));
      float h3 = hash(vec2(fi * 0.7, fi * 1.3));

      // Random position (top 80%)
      vec2 particlePos = vec2(h1, h2 * 0.8 + 0.2);

      // Strong mouse repulsion/attraction effect
      vec2 toMouse = particlePos - uMouse;
      float distToMouse = length(toMouse);
      vec2 mouseEffect = normalize(toMouse + 0.001) * mouseInfluence * 0.25 / (distToMouse + 0.3);
      particlePos += mouseEffect;

      // Swirl effect around mouse
      float swirlAngle = distToMouse * 8.0 + uTime * 0.5;
      vec2 swirl = vec2(cos(swirlAngle), sin(swirlAngle)) * mouseInfluence * 0.03 * smoothstep(0.5, 0.0, distToMouse);
      particlePos += swirl;

      // Floating movement
      particlePos.x += sin(uTime * 0.2 + fi * 1.1) * 0.01;
      particlePos.y += cos(uTime * 0.15 + fi * 0.9) * 0.008;

      // Varying sizes - mostly tiny, some bigger
      float sizeRand = h3;
      float size = 0.001 + sizeRand * sizeRand * sizeRand * 0.012;

      float p = particle(vUv, particlePos, size, uTime + fi, aspect);

      // Brightness - brighter near mouse
      float brightness = 0.6 + h2 * 0.4 + mouseProximity * 0.8;

      // Color variation - white, gold, blue, pink
      float colorType = h3;
      vec3 pColor;
      if (colorType < 0.5) {
        pColor = vec3(1.0, 1.0, 1.0); // white
      } else if (colorType < 0.7) {
        pColor = vec3(1.0, 0.85, 0.6); // warm gold
      } else if (colorType < 0.85) {
        pColor = vec3(0.7, 0.85, 1.0); // blue
      } else {
        pColor = vec3(1.0, 0.7, 0.9); // pink
      }

      // Intensify color near mouse
      pColor = mix(pColor, vec3(1.0, 0.95, 0.8), mouseProximity * 0.5);

      particleColor += pColor * p * brightness;
      particleAlpha = max(particleAlpha, p * brightness);
    }

    // Add particles with reduced visibility (15% more transparent)
    color += particleColor * particleMask * (1.0 + mouseInfluence * 0.85);
    alpha = max(alpha, particleAlpha * particleMask * 0.68);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Main shader mesh component
interface DawnMeshProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  isHovering: React.MutableRefObject<boolean>;
}

const DawnMesh: React.FC<DawnMeshProps> = ({ mousePosition, isHovering }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameCount = useRef(0);
  const { size, viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHoverIntensity: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) }
  }), [size]);

  useFrame((state) => {
    // Skip every other frame for performance (~30fps)
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth mouse tracking
      const targetX = mousePosition.current.x;
      const targetY = mousePosition.current.y;
      material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.08;
      material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.08;

      // Smooth hover intensity
      const targetIntensity = isHovering.current ? 1 : 0;
      material.uniforms.uHoverIntensity.value += (targetIntensity - material.uniforms.uHoverIntensity.value) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

// Main component
interface DawnHorizonProps {
  className?: string;
}

const DawnHorizon: React.FC<DawnHorizonProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const isHovering = useRef(false);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current.x = (event.clientX - rect.left) / rect.width;
      mousePosition.current.y = 1 - (event.clientY - rect.top) / rect.height;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'default'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={1}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      >
        <DawnMesh mousePosition={mousePosition} isHovering={isHovering} />
      </Canvas>
    </div>
  );
};

export default DawnHorizon;
