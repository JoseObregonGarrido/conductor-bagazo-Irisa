import { useEffect, useRef } from 'react';
// =====================================================================================
// CAMBIO: Importaciones específicas para Tree Shaking (Reducción de tamaño 117KiB)
// =====================================================================================
import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    Box3,
    Vector3,
} from 'three'; 

// Loaders y Controls se importan por separado.
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
    const animationFrameIdRef = useRef(null);
    const modelRef = useRef(null);
    const resizeTimeoutRef = useRef(null); // Para debounce del resize

    useEffect(() => {
        if (!containerRef.current) return;

        // --- 1. Inicialización ---
        // Uso de clases importadas directamente: new Scene()
        const scene = new Scene();
        scene.background = new Color(0x0f172a);
        sceneRef.current = scene;

        // Lectura de dimensiones (debe ir ANTES de cualquier manipulación de DOM/Renderer)
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        // Uso de clases importadas directamente
        const camera = new PerspectiveCamera(60, width / height, 0.1, 1000); 
        camera.position.set(0, 6, 10); 
        cameraRef.current = camera;

        // Uso de clases importadas directamente
        const renderer = new WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance', 
            stencil: false, 
            depth: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Luces
        const ambientLight = new AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Controles
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controls.maxPolarAngle = Math.PI / 1.8;
        controls.minDistance = 3; 
        controls.maxDistance = 60;  // Aumentado para permitir más alejamiento manual
        controlsRef.current = controls;

        // --- 2. Carga del Modelo con DRACO ---
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco-gltf/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            '/model/modelo-3d-comprimido.glb',
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(0.8, 0.8, 0.8); 
                scene.add(model);
                modelRef.current = model;

                // Ajustar cámara (Uso de clases importadas directamente)
                const box = new Box3().setFromObject(model);
                const center = box.getCenter(new Vector3());
                const size = box.getSize(new Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                cameraZ *= 3.0;  // Aumentado de 2.5 a 3.0 para zoom más alejado y capturar todo el modelo

                camera.position.z = cameraZ;
                camera.position.x = center.x;
                camera.position.y = center.y + maxDim * 0.5; 
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

            const deltaTime = currentTime - lastTime;
            if (deltaTime < frameTime) return;

            lastTime = currentTime - (deltaTime % frameTime);

            if (controls.update()) {
                renderer.render(scene, camera);
            }
        };
        animate(performance.now());

        // --- 4. Resize con Debounce (OPTIMIZACIÓN CLAVE) ---
        const handleResize = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {
                if (!containerRef.current) return;

                const newWidth = containerRef.current.clientWidth;
                const newHeight = containerRef.current.clientHeight;

                if (Math.abs(camera.aspect - newWidth / newHeight) > 0.01) {
                    camera.aspect = newWidth / newHeight;
                    camera.updateProjectionMatrix();
                    // 'false' previene Forced Reflow
                    renderer.setSize(newWidth, newHeight, false); 
                }
            }, 150);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // --- 5. CLEANUP COMPLETO ---
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }

            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            window.removeEventListener('resize', handleResize);

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

            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            if (controlsRef.current) {
                controlsRef.current.dispose();
            }

            if (containerRef.current && rendererRef.current?.domElement?.parentNode === containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
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
