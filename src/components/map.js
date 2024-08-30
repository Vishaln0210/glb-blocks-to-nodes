import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './Map.css';

function Map() {
  const { scene } = useGLTF('/Test-3D.glb'); 
  const modelRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (scene) {
      modelRef.current = scene; 
    }
  }, [scene]);

  const handleNodeClick = (nodeName) => {
    if (modelRef.current) {
      const node = modelRef.current.getObjectByName(nodeName); 
      if (node) {
        console.log(`Selected Node: ${nodeName}`);
        setSelectedNode(nodeName);

        
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.material.color.set('white'); // Reset color to white
          }
        });

        // Highlight the selected node
        node.traverse((child) => {
          if (child.isMesh) {
            child.material.color.set('yellow'); 
          }
        });
      } else {
        console.error(`Node ${nodeName} not found`);
      }
    }
  };

  return (
    <div className="map-container">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 200, 500], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <primitive object={scene} />
          <OrbitControls />
        </Canvas>
      </div>
      <div className="node-info">
        {selectedNode && <p>Selected Node: {selectedNode}</p>}

        <button onClick={() => handleNodeClick('foodcourt')}>Select Foodcourt</button>
        <button onClick={() => handleNodeClick('restroom')}>Select Restroom</button>
      </div>
    </div>
  );
}

export default Map;
