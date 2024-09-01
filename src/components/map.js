import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './Map.css';

function Map() {
  const { scene } = useGLTF('/Test-3D.glb');  
  const modelRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNodes, setFilteredNodes] = useState([]);

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
            child.material.color.set('white');
          }
        });

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (modelRef.current) {
      const nodes = [];
      modelRef.current.traverse((child) => {
        if (child.name.toLowerCase().includes(value.toLowerCase())) {
          nodes.push(child.name);
        }
      });
      setFilteredNodes(nodes);
    }
  };

  return (
    <div className="map-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <ul className="dropdown">
            {filteredNodes.map((node, index) => (
              <li key={index} onClick={() => handleNodeClick(node)}>
                {node}
              </li>
            ))}
          </ul>
        )}
      </div>
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
      </div>
    </div>
  );
}

export default Map;
