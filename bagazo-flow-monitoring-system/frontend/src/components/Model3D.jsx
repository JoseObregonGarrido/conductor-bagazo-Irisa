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

        const ambientLight = new AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controls.maxPolarAngle = Math.PI / 1.8;
        controls.minDistance = 3; 
        controls.maxDistance = 80; 
        controlsRef.current = controls;

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

                const box = new Box3().setFromObject(model);
                const center = box.getCenter(new Vector3());
                const size = box.getSize(new Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                
                // CAMBIO: Multiplicador aumentado a 4.5 para alejar la vista
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                cameraZ *= 4.5; 

                camera.position.z = cameraZ;
                camera.position.x = center.x;
                // CAMBIO: Elevación en Y aumentada para mejor perspectiva
                camera.position.y = center.y + maxDim * 0.8; 
                
                camera.lookAt(center);
                controls.target.copy(center);
                controls.update();
            },
            undefined,
            (error) => {
                console.error('Error al cargar el modelo 3D:', error);
            }
        );

        const animate = (currentTime) => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (controls.update()) {
                renderer.render(scene, camera);
            }
        };
        animate(performance.now());

        const handleResize = () => {
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(() => {
                if (!containerRef.current) return;
                const newWidth = containerRef.current.clientWidth;
                const newHeight = containerRef.current.clientHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight, false); 
            }, 150);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
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