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
        const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 1000); // FOV 58
        camera.position.set(1, 8, 14); // Posición inicial más alejada
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance', // Optimización GPU
            stencil: false, // Deshabilitar si no lo usas
            depth: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar a 2x
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
        controls.maxPolarAngle = Math.PI / 1.5; // Limitar rotación vertical
        controls.minDistance = 2; // Limitar zoom
        controls.maxDistance = 10;
        controlsRef.current = controls;

        // --- 2. Carga del Modelo con DRACO ---
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        
        // CORRECCIÓN: Usar la RUTA DE LA CARPETA de los decodificadores (no la ruta completa del GLB)
        dracoLoader.setDecoderPath('/draco-gltf/'); 
        
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            '/model/modelo-3d-comprimido.glb',
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(1.15, 1.15, 1.15);
                scene.add(model);
                modelRef.current = model;

                // Ajustar cámara
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
            },
            undefined,
            (error) => {
                console.error('Error al cargar el modelo 3D:', error);
            }
        );

        // --- 3. Bucle de Animación Optimizado ---
        let lastTime = performance.now();
        const targetFPS = 60;
        const frameTime = 1000 / targetFPS;

        const animate = (currentTime) => {
            animationFrameIdRef.current = requestAnimationFrame(animate);

            // Limitar a 60 FPS para evitar sobrecarga
            const deltaTime = currentTime - lastTime;
            if (deltaTime < frameTime) return;

            lastTime = currentTime - (deltaTime % frameTime);

            // Solo renderizar si hay cambios
            if (controls.update()) {
                renderer.render(scene, camera);
            }
        };
        animate();

        // --- 4. Resize con Debounce (OPTIMIZACIÓN CLAVE) ---
        const handleResize = () => {
            // Cancelar timeout anterior
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            // Esperar 150ms después del último resize
            resizeTimeoutRef.current = setTimeout(() => {
                if (!containerRef.current) return;

                // Leer dimensiones una sola vez (evita forced reflow)
                const newWidth = containerRef.current.clientWidth;
                const newHeight = containerRef.current.clientHeight;

                // Actualizar solo si cambió significativamente
                if (Math.abs(camera.aspect - newWidth / newHeight) > 0.01) {
                    camera.aspect = newWidth / newHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(newWidth, newHeight, false); // false = no update style
                }
            }, 150);
        };
        window.addEventListener('resize', handleResize);

        // --- 5. FUNCIÓN DE LIMPIEZA (CLEANUP) COMPLETA ---
        return () => {
            // Detener animación
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }

            // Limpiar timeout de resize
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            // Remover event listener
            window.removeEventListener('resize', handleResize);

            // Limpiar Three.js
            if (sceneRef.current) {
                sceneRef.current.traverse(object => {
                    if (object.isMesh) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) {
                            const materials = Array.isArray(object.material) 
                                ? object.material 
                                : [object.material];
                            materials.forEach(material => {
                                if (material.map) material.map.dispose();
                                if (material.normalMap) material.normalMap.dispose();
                                if (material.roughnessMap) material.roughnessMap.dispose();
                                if (material.metalnessMap) material.metalnessMap.dispose();
                                material.dispose();
                            });
                        }
                    }
                });
            }

            // Disponer renderer
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            // Disponer controles
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }

            // Limpiar DOM
            if (containerRef.current && rendererRef.current?.domElement?.parentNode === containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
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