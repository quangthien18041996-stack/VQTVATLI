import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Camera, 
  RotateCw, 
  Move, 
  Maximize2, 
  Sliders, 
  X, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Box,
  Compass
} from 'lucide-react';

/* ============================================================
   DANH SÁCH MÔ HÌNH TOÁN HỌC 3D ĐƯỢC HỖ TRỢ TRẢI NGHIỆM AR
   ============================================================ */
export const AR_MODELS = [
  {
    id: 'revolution_vase',
    name: 'Khối Tròn Xoay Lọ Hoa (Tích Phân Bài 13)',
    category: 'Nguyên Hàm & Tích Phân (Chương IV)',
    icon: Box,
    desc: 'Mặt tròn xoay sinh bởi đường cong f(x) = 0.45*sin(x) + 1.25 quay quanh trục Ox.',
    defaultScale: 1.0,
    color: '#0284c7'
  },
  {
    id: 'sphere_plane_cut',
    name: 'Mặt Cầu (S) & Mặt Phẳng Thiết Diện (Chương V)',
    category: 'Tọa Độ Không Gian Oxyz (Chương V)',
    icon: Compass,
    desc: 'Mô phỏng mặt cầu bán kính R cắt mặt phẳng (α) theo đường tròn thiết diện màu vàng phát sáng.',
    defaultScale: 1.0,
    color: '#0d9488'
  },
  {
    id: 'vector_orthogonal',
    name: 'Tam Diện Tọa Độ & Tích Có Hướng [u, v]',
    category: 'Tọa Độ Không Gian Oxyz (Chương V)',
    icon: Compass,
    desc: 'Hệ 3 trục Oxyz và cặp vectơ cùng vectơ trực giao tích có hướng [u, v].',
    defaultScale: 1.0,
    color: '#8b5cf6'
  }
];

export default function ARViewerModal({ isOpen, onClose, initialModelId = 'revolution_vase' }) {
  const [selectedModelId, setSelectedModelId] = useState(initialModelId);
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // null | true | false
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' (rear) | 'user'
  const [scale, setScale] = useState(1.0);
  const [rotY, setRotY] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const streamRef = useRef(null);

  // Sync initialModelId when modal opens
  useEffect(() => {
    if (initialModelId) setSelectedModelId(initialModelId);
  }, [initialModelId]);

  /* -------------------------------------------------------------
     1. KHỞI TẠO CAMERA THỰC TẾ (WEBCAM HOẶC CAMERA ĐIỆN THOẠI)
     ------------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    let currentStream = null;

    const startCamera = async () => {
      try {
        setCameraError('');
        // Stop existing tracks if any
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const constraints = {
          video: {
            facingMode: { ideal: cameraFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
          await videoRef.current.play();
        }

        setHasCameraPermission(true);
      } catch (err) {
        console.warn('Camera access error:', err);
        setHasCameraPermission(false);
        setCameraError(err.name === 'NotAllowedError' 
          ? 'Bạn chưa cấp quyền truy cập Camera trên thiết bị. Bạn vẫn có thể trải nghiệm xoay 3D với nền giả lập AR.'
          : 'Không thể truy cập camera: ' + (err.message || 'Lỗi thiết bị.'));
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, cameraFacing]);

  /* -------------------------------------------------------------
     2. DỰNG MÔ HÌNH TOÁN HỌC 3D VÀO THREE.JS SCENE
     ------------------------------------------------------------- */
  const buildModelMesh = (modelId) => {
    const group = new THREE.Group();

    if (modelId === 'revolution_vase') {
      // 1. Khối tròn xoay lọ hoa
      const points = [];
      for (let i = 0; i <= 36; i++) {
        const x = (i / 36) * 4.5;
        // Profile curve: r(x)
        const radius = 0.45 * Math.sin(x * 1.3) + 1.25 + 0.3 * Math.cos(x * 0.7);
        points.push(new THREE.Vector2(radius, x - 2.25));
      }
      const latheGeom = new THREE.LatheGeometry(points, 48);
      latheGeom.computeVertexNormals();

      const latheMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        metalness: 0.25,
        roughness: 0.15,
        transmission: 0.55,
        opacity: 0.85,
        transparent: true,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        wireframe: showWireframe
      });
      const latheMesh = new THREE.Mesh(latheGeom, latheMat);
      group.add(latheMesh);

      // Gold Accent Rings
      for (let y = -2; y <= 2; y += 1.3) {
        const ringGeom = new THREE.TorusGeometry(1.4, 0.04, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = y;
        group.add(ringMesh);
      }
    } else if (modelId === 'sphere_plane_cut') {
      // 2. Mặt cầu và mặt phẳng thiết diện
      const sphereGeom = new THREE.SphereGeometry(1.8, 36, 36);
      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.65,
        wireframe: showWireframe
      });
      const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
      group.add(sphereMesh);

      // Center point
      const pGeom = new THREE.SphereGeometry(0.08, 16, 16);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      group.add(new THREE.Mesh(pGeom, pMat));

      // Plane cutting through
      const planeGeom = new THREE.PlaneGeometry(4.2, 4.2);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        roughness: 0.3
      });
      const planeMesh = new THREE.Mesh(planeGeom, planeMat);
      planeMesh.rotation.x = Math.PI / 3;
      planeMesh.position.set(0, 0.7, 0.3);
      group.add(planeMesh);

      // Luminous Intersection circle ring
      const ringGeom = new THREE.RingGeometry(1.3, 1.36, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      ringMesh.position.set(0, 0.701, 0.3);
      group.add(ringMesh);
    } else {
      // 3. Hệ trục tọa độ và vectơ tích có hướng
      const origin = new THREE.Vector3(0, 0, 0);
      const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 2.5, 0xef4444, 0.35, 0.18);
      const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, 2.5, 0x10b981, 0.35, 0.18);
      const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 2.5, 0x38bdf8, 0.35, 0.18);
      group.add(arrowX);
      group.add(arrowY);
      group.add(arrowZ);

      // Vector u & v
      const arrowU = new THREE.ArrowHelper(new THREE.Vector3(1.6, 0.8, 1.2).normalize(), origin, 2.2, 0x06b6d4, 0.35, 0.18);
      const arrowV = new THREE.ArrowHelper(new THREE.Vector3(0.5, 1.8, 0.5).normalize(), origin, 2.0, 0xf59e0b, 0.35, 0.18);
      // Cross vector [u, v]
      const arrowCross = new THREE.ArrowHelper(new THREE.Vector3(-1.76, -0.2, 2.48).normalize(), origin, 2.7, 0xd946ef, 0.4, 0.2);
      group.add(arrowU);
      group.add(arrowV);
      group.add(arrowCross);

      // Parallelogram surface
      const geom = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        1.6, 0.8, 1.2,
        2.1, 2.6, 1.7,

        0, 0, 0,
        2.1, 2.6, 1.7,
        0.5, 1.8, 0.5
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();
      const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      group.add(new THREE.Mesh(geom, mat));
    }

    // Circular ground placement shadow plate
    const shadowGeom = new THREE.CircleGeometry(2.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = Math.PI / 2;
    shadowMesh.position.y = -2.3;
    group.add(shadowMesh);

    return group;
  };

  /* -------------------------------------------------------------
     3. RENDER THREE.JS CANVAS ĐÈ LÊN VIDEO CAMERA
     ------------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true, // Transparent background so video shows underneath
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    backLight.position.set(-5, -4, -4);
    scene.add(backLight);

    // Build Model
    const modelGroup = buildModelMesh(selectedModelId);
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Touch / Drag controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotationY = rotY;
    let rotationX = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX || (e.touches && e.touches[0].clientX) || 0, y: e.clientY || (e.touches && e.touches[0].clientY) || 0 };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - prevMouse.x;
      const deltaY = clientY - prevMouse.y;

      rotationY += deltaX * 0.01;
      rotationX += deltaY * 0.01;
      rotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotationX));

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.y = rotationY;
        modelGroupRef.current.rotation.x = rotationX;
      }
      prevMouse = { x: clientX, y: clientY };
    };

    const onPointerUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isOpen, selectedModelId, showWireframe, autoRotate]);

  // Update scale & position dynamically
  useEffect(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.scale.set(scale, scale, scale);
    }
  }, [scale]);

  if (!isOpen) return null;

  const currentModelMeta = AR_MODELS.find(m => m.id === selectedModelId) || AR_MODELS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[94vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-sky-500/30 flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-white z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 font-bold text-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Phòng Thí Nghiệm AR Không Gian Thực
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-cyan-400 text-slate-950">
                  WebXR Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Chiếu mô hình toán học 3D nổi lơ lửng trên mặt bàn thông qua camera thiết bị
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch Camera Button (Rear / Front) */}
            <button
              onClick={() => setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Đổi camera trước / sau"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đổi Camera</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main AR Display Viewport */}
        <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
          
          {/* 1. Real Camera Video Feed Underneath */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              hasCameraPermission ? 'opacity-100' : 'opacity-20'
            }`}
          />

          {/* Fallback Simulation Background if Camera is Off */}
          {!hasCameraPermission && (
            <div className="absolute inset-0 bg-radial from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">
                Chế Độ AR Giả Lập Bàn Học (Camera Sẵn Sàng)
              </h4>
              <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                {cameraError || 'Mô hình 3D đang hiển thị trên phông nền không gian ảo. Bấm "Cho phép" khi trình duyệt hỏi quyền Camera để thấy mặt bàn thực tế!'}
              </p>
            </div>
          )}

          {/* 2. Three.js Transparent Overlay Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
          />

          {/* AR Target Reticle on the table floor */}
          <div className="absolute bottom-16 sm:bottom-20 pointer-events-none z-10 flex flex-col items-center gap-1 opacity-60">
            <div className="w-36 h-16 border-2 border-dashed border-cyan-400/60 rounded-full animate-pulse" />
            <span className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase">
              Vị Trí Mặt Bàn
            </span>
          </div>

          {/* Floating Instructions Pill */}
          <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 text-xs text-slate-200 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Chạm & vuốt để xoay 360° quanh vật thể • Dùng thanh trượt chỉnh kích thước</span>
          </div>

          {/* Quick Controls Toolbar Floating at Bottom-Right */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all cursor-pointer ${
                autoRotate
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {autoRotate ? 'Đang tự xoay' : 'Dừng xoay'}
            </button>

            <button
              onClick={() => setShowWireframe(!showWireframe)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all cursor-pointer ${
                showWireframe
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Lưới đa giác
            </button>
          </div>
        </div>

        {/* Bottom Model Picker & Scale Slider */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
          {/* Model Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {AR_MODELS.map((model) => {
              const Icon = model.icon;
              const isSelected = selectedModelId === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{model.name.split('(')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Scale Slider Control */}
          <div className="flex items-center gap-3 w-full md:w-64 shrink-0">
            <span className="text-xs text-slate-400 font-medium shrink-0">Thu phóng:</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-xs font-mono font-bold text-cyan-400 w-9 text-right shrink-0">
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
