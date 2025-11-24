import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import '../styles/Model3D.css';

export default function Model3D({ onPuntoClick }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    // Crear cámara
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 3);
    cameraRef.current = camera;

    // Crear renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Agregar luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controlsRef.current = controls;

    // Cargar modelo 3D
    const loader = new GLTFLoader();
    // Cargar el modelo nuevo proporcionado en /public/model
    loader.load('/model/modelo-3d.glb', (gltf) => {
      const model = gltf.scene;
      // Aumentar ligeramente la escala por defecto para mejor visibilidad
      model.scale.set(1.15, 1.15, 1.15);
      scene.add(model);

      // Ajustar cámara al modelo de forma más cercana (mejor encuadre)
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      // Calcular distancia de cámara basada en tamaño del modelo
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      // Reducir el multiplicador para acercar la cámara y mostrar el modelo más grande
      cameraZ *= 1.12;

      camera.position.z = cameraZ;
      camera.position.x = center.x;
      // Ajuste vertical algo menor para centrar mejor el objeto
      camera.position.y = center.y + maxDim * 0.18;
      camera.lookAt(center);
      controls.target.copy(center);
      controls.update();
    });

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Manejar resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="model3d-container">
      <div ref={containerRef} className="model3d-viewer" />
      <div className="model3d-info">
        <p>Usa el mouse para rotar | Scroll para zoom</p>
      </div>
    </div>
  );
}