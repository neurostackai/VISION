import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "./vertexShader";
import fragmentShader from "./fragmentShader";
import { OrbitControls } from "@react-three/drei";

export const AudioVisualizer = ({
  audioData,
}: {
  audioData: Uint8Array | null;
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  const hover = useRef(false);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0.3 },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;

    if (mesh.current) {
      mesh.current.rotation.x += 0.005;
      mesh.current.rotation.y += 0.005;
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();

      let targetIntensity = hover.current ? 1 : 0.15;

      if (audioData) {
        const frequencies = Array.from(audioData);
        const bassFrequencies = frequencies.slice(0, 8);
        const midFrequencies = frequencies.slice(8, 24);
        const highFrequencies = frequencies.slice(24, 32);

        const bassAverage =
          bassFrequencies.reduce((a, b) => a + b, 0) / bassFrequencies.length;
        const midAverage =
          midFrequencies.reduce((a, b) => a + b, 0) / midFrequencies.length;
        const highAverage =
          highFrequencies.reduce((a, b) => a + b, 0) / highFrequencies.length;

        targetIntensity +=
          (bassAverage / 255) * 2.5 +
          (midAverage / 255) * 1.2 +
          (highAverage / 255) * 0.8;
      }

      material.uniforms.u_intensity.value = THREE.MathUtils.lerp(
        material.uniforms.u_intensity.value,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      <mesh
        ref={mesh}
        scale={1.7}
        position={[0, 0, 0]}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
      >
        <icosahedronGeometry args={[2, 20]} />
        <shaderMaterial
          wireframe={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
};
