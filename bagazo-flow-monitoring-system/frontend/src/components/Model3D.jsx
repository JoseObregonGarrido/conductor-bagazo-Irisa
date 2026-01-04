import { useEffect, useRef } from 'react';
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
    const resizeTimeoutRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- 1. ESCENA Y RENDERER ---
        const scene = new Scene();
        scene.background = new Color(0x0f172a);
        sceneRef.current = scene;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        const camera = new PerspectiveCamera(60, width / height, 0.1, 1000); 
        cameraRef.current = camera;

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

        // --- 2. ILUMINACIÓN ---
        const ambientLight = new AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // --- 3. CONTROLES CON LÍMITES PRO ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5; // Un poco más suave
        
        // Bloqueo de rotación vertical (Para que no vean el modelo por debajo)
        controls.maxPolarAngle = Math.PI / 2.1; 
        controls.minPolarAngle = Math.PI / 6;

        // Bloqueo de Zoom (Para que no atraviesen las paredes ni se vayan al infinito)
        controls.minDistance = 5; 
        controls.maxDistance = 60; 
        
        controlsRef.current = controls;

        // --- 4. CARGA DE MODELO ---
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco-gltf/'); // Asegúrate de que esta carpeta esté en /public
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            '/model/modelo-3d-comprimido.glb',
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(0.8, 0.8, 0.8); 
                scene.add(model);
                modelRef.current = model;

                // Centrado automático y cálculo de cámara
                const box = new Box3().setFromObject(model);
                const center = box.getCenter(new Vector3());
                const size = box.getSize(new Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                
                // MULTIPLICADOR 4.5: Aleja el modelo para que encaje en el nuevo alto
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                cameraZ *= 4.5; 

                camera.position.set(center.x, center.y + maxDim * 0.8, cameraZ);
                camera.lookAt(center);
                
                controls.target.copy(center);
                controls.update();
            },
            undefined,
            (error) => console.error('Error al cargar el modelo:', error)
        );

        // --- 5. BUCLE DE ANIMACIÓN ---
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (controlsRef.current) controlsRef.current.update();
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        // --- 6. DEBOUNCE RESIZE (NIVEL SENIOR) ---
        const handleResize = () => {
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
            
            resizeTimeoutRef.current = setTimeout(() => {
                if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

                const newWidth = containerRef.current.clientWidth;
                const newHeight = containerRef.current.clientHeight;

                // Solo actualiza si la proporción cambió significativamente
                if (Math.abs(cameraRef.current.aspect - newWidth / newHeight) > 0.01) {
                    cameraRef.current.aspect = newWidth / newHeight;
                    cameraRef.current.updateProjectionMatrix();
                    rendererRef.current.setSize(newWidth, newHeight, false);
                    console.log("📏 UI Actualizada y Debounced");
                }
            }, 150);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // --- 7. CLEANUP (Para evitar fugas de memoria en Docker) ---
        return () => {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
            window.removeEventListener('resize', handleResize);
            
            if (sceneRef.current) {
                sceneRef.current.traverse(obj => {
                    if (obj.isMesh) {
                        if (obj.geometry) obj.geometry.dispose();
                        if (obj.material) {
                            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                            mats.forEach(m => m.dispose());
                        }
                    }
                });
            }
            if (rendererRef.current) rendererRef.current.dispose();
            if (controlsRef.current) controlsRef.current.dispose();
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