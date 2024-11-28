"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls, Environment } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Button } from "@/components/ui/button";
import { Mesh } from "three";
import * as THREE from "three";

export default function DiceGame() {
  const [isRolling, setIsRolling] = useState(false);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Button
          disabled={isRolling}
          onClick={() => setIsRolling(true)}
          className="text-lg px-8 py-6"
        >
          {isRolling ? "Tirando..." : "Tirar Dado"}
        </Button>
      </div>
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 45 }}>
        <Environment preset="warehouse" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Physics gravity={[0, -9.8, 0]}>
          <Plane />
          <Dice isRolling={isRolling} setIsRolling={setIsRolling} />
        </Physics>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

function Plane() {
  const ref = useRef<Mesh>(null); // Especifica explícitamente el tipo Mesh
  usePlane(
    () => ({
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, -2, 0],
    }),
    ref
  );

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  );
}

interface DiceProps {
  isRolling: boolean;
  setIsRolling: (value: boolean) => void;
}

function Dice({ isRolling, setIsRolling }: DiceProps) {
  const [ref, api] = useBox<Mesh>(() => ({
    mass: 1, // El dado debe tener masa para reaccionar a las físicas
    position: [0, 2, 0], // Posición inicial del dado
    args: [2, 2, 2], // Tamaño del dado
    onCollide: () => setIsRolling(false), // Detener al colisionar
  }));

  // Reiniciar la posición y las velocidades cuando se tira el dado
  if (isRolling) {
    api.position.set(0, 2, 0); // Resetear la posición del dado
    api.velocity.set(
      (Math.random() - 0.5) * 2, // Velocidad en X
      Math.random() * 5 + 2, // Velocidad en Y
      (Math.random() - 0.5) * 2 // Velocidad en Z
    );
    api.angularVelocity.set(
      (Math.random() - 0.5) * 7, // Rotación en X
      (Math.random() - 0.5) * 5, // Rotación en Y
      (Math.random() - 0.5) * 5 // Rotación en Z
    );
  }

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
      {/* Caras del dado */}
      {["1", "2", "3", "4", "Play", "Stop"].map((face, index) => (
        <Face key={index} text={face} position={index} />
      ))}
    </mesh>
  );
}

function Face({ text, position }: { text: string; position: number }) {
  const positions = [
    {
      position: new THREE.Vector3(0, 0, 1.01),
      rotation: new THREE.Euler(0, 0, 0),
    },
    {
      position: new THREE.Vector3(0, 0, -1.01),
      rotation: new THREE.Euler(0, Math.PI, 0),
    },
    {
      position: new THREE.Vector3(0, 1.01, 0),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
    },
    {
      position: new THREE.Vector3(0, -1.01, 0),
      rotation: new THREE.Euler(Math.PI / 2, 0, 0),
    },
    {
      position: new THREE.Vector3(1.01, 0, 0),
      rotation: new THREE.Euler(0, Math.PI / 2, 0),
    },
    {
      position: new THREE.Vector3(-1.01, 0, 0),
      rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    },
  ];

  const { position: pos, rotation } = positions[position];

  return (
    <Text
      position={pos}
      rotation={rotation}
      fontSize={0.5}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

// "use client";

// import { useRef, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Text, OrbitControls, Environment } from "@react-three/drei";
// import { Button } from "@/components/ui/button";
// import * as THREE from "three";
// import { Mesh } from "three";

// export default function DiceGame() {
//   const [isRolling, setIsRolling] = useState<boolean>(false); // Tipado de `isRolling`

//   return (
//     <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800">
//       <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
//         <Button
//           disabled={isRolling}
//           onClick={() => setIsRolling(true)}
//           className="text-lg px-8 py-6"
//         >
//           {isRolling ? "Tirando..." : "Tirar Dado"}
//         </Button>
//       </div>
//       <Canvas shadows camera={{ position: [0, 5, 8], fov: 45 }}>
//         <Environment preset="warehouse" />
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
//         <Dice isRolling={isRolling} setIsRolling={setIsRolling} />
//         <OrbitControls enablePan={false} />
//         {/* Plano base */}
//         <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-2}>
//           <planeGeometry args={[10, 10]} />
//           <meshStandardMaterial color="#1a1a1a" />
//         </mesh>
//       </Canvas>
//     </div>
//   );
// }

// interface DiceProps {
//   isRolling: boolean;
//   setIsRolling: (value: boolean) => void;
// }

// function Dice({ isRolling, setIsRolling }: DiceProps) {
//   const meshRef = useRef<Mesh>(null); // Tipo específico de `Mesh`
//   const rotationRef = useRef(new THREE.Euler(0, 0, 0));
//   const speedRef = useRef(new THREE.Vector3(0, 0, 0));
//   const faces = ["1", "2", "3", "4", "Play", "Stop"];

//   useFrame((state, delta) => {
//     if (!meshRef.current) return;

//     if (isRolling) {
//       // Aumentar la velocidad inicial para un movimiento más evidente
//       speedRef.current.set(
//         THREE.MathUtils.lerp(speedRef.current.x, Math.random() * 20 - 10, 0.2),
//         THREE.MathUtils.lerp(speedRef.current.y, Math.random() * 20 - 10, 0.2),
//         THREE.MathUtils.lerp(speedRef.current.z, Math.random() * 20 - 10, 0.2)
//       );
//     } else {
//       // Reducir la velocidad gradualmente (más lentamente)
//       speedRef.current.multiplyScalar(0.98);
//     }

//     // Aplicar la rotación acumulada al dado
//     rotationRef.current.x += speedRef.current.x * delta;
//     rotationRef.current.y += speedRef.current.y * delta;
//     rotationRef.current.z += speedRef.current.z * delta;

//     meshRef.current.rotation.x = rotationRef.current.x;
//     meshRef.current.rotation.y = rotationRef.current.y;
//     meshRef.current.rotation.z = rotationRef.current.z;

//     // Detener el dado cuando la velocidad sea suficientemente baja
//     const speedMagnitude = speedRef.current.length();
//     if (isRolling && speedMagnitude < 0.1) {
//       setIsRolling(false);
//     }
//   });

//   return (
//     <mesh ref={meshRef} castShadow position={[0, 0, 0]}>
//       <boxGeometry args={[2, 2, 2]} />
//       <meshStandardMaterial color="white" />
//       {/* Caras del dado */}
//       {faces.map((face, index) => (
//         <Face key={index} text={face} position={index} />
//       ))}
//     </mesh>
//   );
// }

// function Face({ text, position }: { text: string; position: number }) {
//   const positions = [
//     {
//       position: new THREE.Vector3(0, 0, 1.01),
//       rotation: new THREE.Euler(0, 0, 0),
//     }, // frente
//     {
//       position: new THREE.Vector3(0, 0, -1.01),
//       rotation: new THREE.Euler(0, Math.PI, 0),
//     }, // atrás
//     {
//       position: new THREE.Vector3(0, 1.01, 0),
//       rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
//     }, // arriba
//     {
//       position: new THREE.Vector3(0, -1.01, 0),
//       rotation: new THREE.Euler(Math.PI / 2, 0, 0),
//     }, // abajo
//     {
//       position: new THREE.Vector3(1.01, 0, 0),
//       rotation: new THREE.Euler(0, Math.PI / 2, 0),
//     }, // derecha
//     {
//       position: new THREE.Vector3(-1.01, 0, 0),
//       rotation: new THREE.Euler(0, -Math.PI / 2, 0),
//     }, // izquierda
//   ];

//   const { position: pos, rotation } = positions[position];

//   return (
//     <Text
//       position={pos}
//       rotation={rotation}
//       fontSize={0.5}
//       color="black"
//       anchorX="center"
//       anchorY="middle"
//     >
//       {text}
//     </Text>
//   );
// }
