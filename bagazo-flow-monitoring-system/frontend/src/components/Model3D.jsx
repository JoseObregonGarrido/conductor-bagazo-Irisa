import { useEffect, useRef } from 'react'; // FIX: Sintaxis de importación corregida
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'; 
import '../styles/Model3D.css';

export default function Model3D() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    
    // Almacenamos el ID del bucle de animación para poder cancelarlo.
    const animationFrameIdRef = useRef(null);
    
    // Almacenamos una referencia al modelo cargado para limpieza
    const modelRef = useRef(null); 

    useEffect(() => {
        if (!containerRef.current) return;

        // --- 1. Inicialización ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);
        sceneRef.current = scene;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 2, 3);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Luces y Controles
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controlsRef.current = controls;

        // --- 2. Carga del Modelo con DRACO ---
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        
        // CORRECCIÓN: Usar la RUTA DE LA CARPETA de los decodificadores (no la ruta completa del GLB)
        dracoLoader.setDecoderPath('/draco-gltf/'); 
        
        loader.setDRACOLoader(dracoLoader);

        loader.load('/model/modelo-3d-comprimido.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1.15, 1.15, 1.15);
            scene.add(model);
            modelRef.current = model; 
            
            // Ajustar cámara y target
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.12;

            camera.position.z = cameraZ;
            camera.position.x = center.x;
            camera.position.y = center.y + maxDim * 0.18;
            camera.lookAt(center);
            controls.target.copy(center);
            controls.update();
        });

        // --- 3. Bucle de Animación y Renderizado ---
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate); // Guarda el ID
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // --- 4. Manejo de Resize (El Event Listener de la fuga) ---
        const handleResize = () => {
            if (!containerRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // --- 5. FUNCIÓN DE LIMPIEZA (CLEANUP) COMPLETA ---
        return () => {
            // A. Detener el bucle de animación (Resuelve picos amarillos inactivos)
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            
            // B. Remover el Event Listener (Resuelve la fuga de EventListener)
            window.removeEventListener('resize', handleResize);

            // C. Limpiar recursos de Three.js (Resuelve fugas de (system)/Memory/GPU)
            scene.traverse(object => {
                if (object.isMesh) {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        const materials = Array.isArray(object.material) ? object.material : [object.material];
                        materials.forEach(material => {
                            if (material.map) material.map.dispose();
                            material.dispose();
                        });
                    }
                }
            });
            
            // D. Disponer del Renderer
            renderer.dispose();
            
            // E. Limpiar el DOM
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            
            // FIX: dracoLoader.dispose() ELIMINADO (Resuelve ReferenceError)
        };
    }, []);

    return (
        <div className="model3d-container">
            <div ref={containerRef} className="model3d-viewer" />
            <div className="model3d-info">
                <p>Usa el mouse para rotar o su pantalla táctil | Scroll para zoom o pellizcar para acercar/alejar</p>
            </div>
        </div>
    );
}