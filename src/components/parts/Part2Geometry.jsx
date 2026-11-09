import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import MathView from '../MathView';
import Part3ExerciseBank from './Part3ExerciseBank';
import { 
  Compass, 
  Rotate3d, 
  Layers, 
  Sliders, 
  Sparkles, 
  Eye, 
  Box, 
  Share2, 
  FileCheck, 
  BookOpen, 
  TrendingUp, 
  Maximize2,
  RefreshCw,
  Cpu,
  Calculator
} from 'lucide-react';

export default function Part2Geometry({ onOpenCasioModal }) {
  const [activeTab, setActiveTab] = useState('vectors'); // 'vectors' | 'plane-sphere' | 'exercises' | 'theory'

  /* -------------------------------------------------------------
     TAB 1 STATE: HỆ TỌA ĐỘ VECTƠ & TÍCH CÓ HƯỚNG 3D
     ------------------------------------------------------------- */
  const vectorContainerRef = useRef(null);
  const [vecU, setVecU] = useState({ x: 3, y: 1, z: 2 });
  const [vecV, setVecV] = useState({ x: 1, y: 3, z: 1 });
  const [showPlaneUv, setShowPlaneUv] = useState(true);

  // Math calculations for Vectors
  const lenU = Math.sqrt(vecU.x * vecU.x + vecU.y * vecU.y + vecU.z * vecU.z);
  const lenV = Math.sqrt(vecV.x * vecV.x + vecV.y * vecV.y + vecV.z * vecV.z);
  const dotUV = vecU.x * vecV.x + vecU.y * vecV.y + vecU.z * vecV.z;
  const cosAngle = lenU * lenV > 0.0001 ? Math.min(1, Math.max(-1, dotUV / (lenU * lenV))) : 0;
  const angleDeg = (Math.acos(cosAngle) * 180 / Math.PI).toFixed(1);

  // Cross product [u, v]
  const crossUV = {
    x: vecU.y * vecV.z - vecU.z * vecV.y,
    y: vecU.z * vecV.x - vecU.x * vecV.z,
    z: vecU.x * vecV.y - vecU.y * vecV.x
  };
  const lenCross = Math.sqrt(crossUV.x * crossUV.x + crossUV.y * crossUV.y + crossUV.z * crossUV.z);

  /* -------------------------------------------------------------
     TAB 2 STATE: MẶT PHẲNG & MẶT CẦU TƯƠNG GIAO
     ------------------------------------------------------------- */
  const sphereContainerRef = useRef(null);
  const [sphereCenter, setSphereCenter] = useState({ x: 0, y: 0, z: 0 });
  const [sphereR, setSphereR] = useState(3.0);
  const [planeA, setPlaneA] = useState(1);
  const [planeB, setPlaneB] = useState(2);
  const [planeC, setPlaneC] = useState(2);
  const [planeD, setPlaneD] = useState(-6);

  // Plane - Sphere Math
  const normLen = Math.sqrt(planeA * planeA + planeB * planeB + planeC * planeC) || 1;
  const distPlaneToSphere = Math.abs(
    planeA * sphereCenter.x + planeB * sphereCenter.y + planeC * sphereCenter.z + planeD
  ) / normLen;

  let intersectionType = 'no-cut'; // 'cut' | 'tangent' | 'no-cut'
  let circleR = 0;
  if (Math.abs(distPlaneToSphere - sphereR) < 0.05) {
    intersectionType = 'tangent';
  } else if (distPlaneToSphere < sphereR) {
    intersectionType = 'cut';
    circleR = Math.sqrt(Math.max(0, sphereR * sphereR - distPlaneToSphere * distPlaneToSphere));
  }

  /* -------------------------------------------------------------
     THREE.JS CANVAS 1: HỆ TRỤC TỌA ĐỘ & VECTƠ 3D
     ------------------------------------------------------------- */
  useEffect(() => {
    if (activeTab !== 'vectors' || !vectorContainerRef.current) return;
    const container = vectorContainerRef.current;
    const width = container.clientWidth;
    const height = 430;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x081325);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(10, 8, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // Coordinate Grid on XOZ
    const gridHelper = new THREE.GridHelper(12, 12, 0x1e3a8a, 0x0f224a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Coordinate Axes Oxyz with Labels
    const origin = new THREE.Vector3(0, 0, 0);
    // Ox: Red
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 6.5, 0xef4444, 0.6, 0.3);
    scene.add(arrowX);
    // Oy: Green
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, 6.5, 0x10b981, 0.6, 0.3);
    scene.add(arrowY);
    // Oz: Blue
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 6.5, 0x38bdf8, 0.6, 0.3);
    scene.add(arrowZ);

    // Vector u: Emerald / Cyan
    const dirU = new THREE.Vector3(vecU.x, vecU.y, vecU.z);
    if (lenU > 0.001) {
      const arrowU = new THREE.ArrowHelper(dirU.clone().normalize(), origin, lenU, 0x06b6d4, 0.5, 0.25);
      scene.add(arrowU);
    }

    // Vector v: Amber / Orange
    const dirV = new THREE.Vector3(vecV.x, vecV.y, vecV.z);
    if (lenV > 0.001) {
      const arrowV = new THREE.ArrowHelper(dirV.clone().normalize(), origin, lenV, 0xf59e0b, 0.5, 0.25);
      scene.add(arrowV);
    }

    // Vector [u, v]: Purple / Magenta (Square-orthogonal)
    const dirCross = new THREE.Vector3(crossUV.x, crossUV.y, crossUV.z);
    if (lenCross > 0.001) {
      const arrowCross = new THREE.ArrowHelper(dirCross.clone().normalize(), origin, Math.min(lenCross, 7.5), 0xd946ef, 0.6, 0.3);
      scene.add(arrowCross);
    }

    // Parallelogram formed by u and v
    if (showPlaneUv && lenU > 0.01 && lenV > 0.01 && lenCross > 0.01) {
      const geom = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        vecU.x, vecU.y, vecU.z,
        vecU.x + vecV.x, vecU.y + vecV.y, vecU.z + vecV.z,

        0, 0, 0,
        vecU.x + vecV.x, vecU.y + vecV.y, vecU.z + vecV.z,
        vecV.x, vecV.y, vecV.z
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();

      const mat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      // Parallelogram border wireframe
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(vecU.x, vecU.y, vecU.z),
        new THREE.Vector3(vecU.x + vecV.x, vecU.y + vecV.y, vecU.z + vecV.z),
        new THREE.Vector3(vecV.x, vecV.y, vecV.z),
        new THREE.Vector3(0, 0, 0)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x7dd3fc, linewidth: 2 });
      scene.add(new THREE.Line(lineGeom, lineMat));
    }

    // Drag Orbit interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.45;
    let rotY = 0.65;
    let distance = 16;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      rotY += (e.clientX - prevMouse.x) * 0.008;
      rotX += (e.clientY - prevMouse.y) * 0.008;
      rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotX));
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      distance = Math.max(7, Math.min(30, distance + e.deltaY * 0.015));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) rotY += 0.002;

      camera.position.x = distance * Math.cos(rotX) * Math.sin(rotY);
      camera.position.y = distance * Math.sin(rotX);
      camera.position.z = distance * Math.cos(rotX) * Math.cos(rotY);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [activeTab, vecU, vecV, showPlaneUv]);

  /* -------------------------------------------------------------
     THREE.JS CANVAS 2: MẶT PHẲNG & MẶT CẦU TƯƠNG GIAO
     ------------------------------------------------------------- */
  useEffect(() => {
    if (activeTab !== 'plane-sphere' || !sphereContainerRef.current) return;
    const container = sphereContainerRef.current;
    const width = container.clientWidth;
    const height = 430;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06111f);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 10, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight.position.set(10, 15, 10);
    scene.add(pointLight);

    // Axes
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 7.0, 0xef4444, 0.6, 0.3);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 7.0, 0x10b981, 0.6, 0.3);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 7.0, 0x38bdf8, 0.6, 0.3);
    scene.add(arrowX);
    scene.add(arrowY);
    scene.add(arrowZ);

    // Sphere (S)
    const sphereGeom = new THREE.SphereGeometry(sphereR, 40, 40);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.3
    });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    sphereMesh.position.set(sphereCenter.x, sphereCenter.y, sphereCenter.z);
    scene.add(sphereMesh);

    // Center point I
    const centerPointGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const centerPointMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const centerMesh = new THREE.Mesh(centerPointGeom, centerPointMat);
    centerMesh.position.copy(sphereMesh.position);
    scene.add(centerMesh);

    // Plane (alpha)
    const normal = new THREE.Vector3(planeA, planeB, planeC).normalize();
    const planeGeom = new THREE.PlaneGeometry(12, 12);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      roughness: 0.3
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMat);
    planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const distFromOrigin = -planeD / normLen;
    planeMesh.position.copy(normal.clone().multiplyScalar(distFromOrigin));
    scene.add(planeMesh);

    // Intersection Ring if cut
    if (intersectionType === 'cut' && circleR > 0.05) {
      const ringGeom = new THREE.RingGeometry(circleR - 0.05, circleR + 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.quaternion.copy(planeMesh.quaternion);

      // Center of intersection circle is projection of I on plane
      const projDist = (planeA * sphereCenter.x + planeB * sphereCenter.y + planeC * sphereCenter.z + planeD) / normLen;
      const projPoint = new THREE.Vector3(sphereCenter.x, sphereCenter.y, sphereCenter.z)
        .sub(normal.clone().multiplyScalar(projDist));
      ringMesh.position.copy(projPoint);
      scene.add(ringMesh);
    }

    // Drag Orbit interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.5;
    let rotY = 0.6;
    let distance = 18;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      rotY += (e.clientX - prevMouse.x) * 0.008;
      rotX += (e.clientY - prevMouse.y) * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      distance = Math.max(8, Math.min(35, distance + e.deltaY * 0.015));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) rotY += 0.002;

      camera.position.x = distance * Math.cos(rotX) * Math.sin(rotY);
      camera.position.y = distance * Math.sin(rotX);
      camera.position.z = distance * Math.cos(rotX) * Math.cos(rotY);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [activeTab, sphereCenter, sphereR, planeA, planeB, planeC, planeD, intersectionType, circleR]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 border border-teal-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-400/30 tracking-wide uppercase">
              CHUYÊN ĐỀ 3 • TOÁN 12 KNTT (CHƯƠNG V - TẬP 2)
            </span>
            <span className="text-slate-400 text-xs font-semibold">• GDPT 2018</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            Phương Pháp Tọa Độ Trong Không Gian (Oxyz)
          </h2>

          <p className="text-teal-100/80 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Khám phá trực quan hệ tọa độ không gian 3 chiều qua <strong>mô phỏng WebGL thời gian thực</strong>: Vectơ và tích có hướng, phương trình mặt phẳng, đường thẳng, mặt cầu và hệ thống luyện đề thi chuẩn cấu trúc 2025.
          </p>
        </div>

        {onOpenCasioModal && (
          <button
            onClick={onOpenCasioModal}
            className="relative z-10 self-start md:self-center px-4 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span>Mẹo Casio Chương V</span>
          </button>
        )}
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-sky-100 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('vectors')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'vectors'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          1. Hệ Tọa Độ & Tích Có Hướng 3D
        </button>

        <button
          onClick={() => setActiveTab('plane-sphere')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'plane-sphere'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          2. Mặt Phẳng & Mặt Cầu Tương Giao
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'exercises'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          3. Luyện Đề & Chấm Điểm
        </button>

        <button
          onClick={() => setActiveTab('theory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'theory'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          4. Sơ Đồ Tư Duy & Sổ Tay Công Thức
        </button>
      </div>

      {/* =======================================================
          TAB 1: HỆ TỌA ĐỘ VECTƠ & TÍCH CÓ HƯỚNG 3D
          ======================================================= */}
      {activeTab === 'vectors' && (
        <div className="space-y-6">
          <div className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-3">
            {/* 3D WebGL Canvas */}
            <div className="lg:col-span-2 relative cursor-grab active:cursor-grabbing bg-[#081325]">
              <div ref={vectorContainerRef} className="w-full h-[430px]" />
              
              {/* Color legend overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-[11px] text-slate-200 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Vectơ <MathView math="\vec{u}" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Vectơ <MathView math="\vec{v}" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400"></span> Tích có hướng <MathView math="[\vec{u}, \vec{v}]" />
                </span>
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300">
                Kéo chuột để xoay 360° • Lăn chuột để phóng to/thu nhỏ
              </div>
            </div>

            {/* Interactive Control Panel */}
            <div className="p-5 border-t lg:border-t-0 lg:border-l border-sky-100 bg-sky-50/20 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-600" />
                  Điều Chỉnh Tọa Độ Vectơ:
                </h4>

                {/* Vector u inputs */}
                <div className="p-3 bg-white rounded-xl border border-cyan-200 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                      Vectơ <MathView math={`\\vec{u} = (${vecU.x}; ${vecU.y}; ${vecU.z})`} />
                    </span>
                    <span className="text-[11px] font-mono text-cyan-700">|u| = {lenU.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">x: {vecU.x}</span>
                      <input
                        type="range" min="-4" max="4" step="0.5" value={vecU.x}
                        onChange={(e) => setVecU(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">y: {vecU.y}</span>
                      <input
                        type="range" min="-4" max="4" step="0.5" value={vecU.y}
                        onChange={(e) => setVecU(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">z: {vecU.z}</span>
                      <input
                        type="range" min="-4" max="4" step="0.5" value={vecU.z}
                        onChange={(e) => setVecU(prev => ({ ...prev, z: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Vector v inputs */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Vectơ <MathView math={`\\vec{v} = (${vecV.x}; ${vecV.y}; ${vecV.z})`} />
                    </span>
                    <span className="text-[11px] font-mono text-amber-700">|v| = {lenV.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">x: {vecV.x}</span>
                      <input
                        type="range" min="-4" max="4" step="0.5" value={vecV.x}
                        onChange={(e) => setVecV(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">y: {vecV.y}</span>
                      <input
                        type="range" min="-4" max="4" step="0.5" value={vecV.y}
                        onChange={(e) => setVecV(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">z: {vecV.z}</span>
                      <input
                        type="range" min="-4" max="4" step="0.5" value={vecV.z}
                        onChange={(e) => setVecV(prev => ({ ...prev, z: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Plane Toggle */}
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPlaneUv}
                    onChange={(e) => setShowPlaneUv(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span>Hiển thị mặt phẳng hình bình hành tạo bởi <MathView math="\vec{u}, \vec{v}" /></span>
                </label>
              </div>

              {/* Real-time Math Results */}
              <div className="p-3.5 bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl border border-fuchsia-200 text-xs space-y-2">
                <span className="font-extrabold text-fuchsia-900 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-600" /> Kết Quả Tính Toán Tức Thì:
                </span>
                <div className="space-y-1 text-slate-700">
                  <div>• Tích vô hướng: <MathView math={`\\vec{u} \\cdot \\vec{v} = ${dotUV.toFixed(2)}`} /></div>
                  <div>• Góc giữa 2 vectơ: <MathView math={`\\theta = ${angleDeg}^\\circ`} /></div>
                  <div>• Tích có hướng: <MathView math={`[\\vec{u}, \\vec{v}] = (${crossUV.x.toFixed(1)}; ${crossUV.y.toFixed(1)}; ${crossUV.z.toFixed(1)})`} /></div>
                  <div>• Diện tích hình bình hành: <MathView math={`S = |[\\vec{u}, \\vec{v}]| = ${lenCross.toFixed(2)}`} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Theoretical Note Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Bản Chất Tích Có Hướng</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tích có hướng <MathView math="[\vec{u}, \vec{v}]" /> là một <strong>vectơ vuông góc</strong> với cả hai vectơ <MathView math="\vec{u}" /> và <MathView math="\vec{v}" />, đóng vai trò là vectơ pháp tuyến cho mặt phẳng chứa 2 vectơ đó.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Ứng Dụng Tính Diện Tích Tam Giác</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Diện tích tam giác <MathView math="ABC" /> được tính trực tiếp thông qua độ dài tích có hướng: <MathView math="S_{\Delta ABC} = \frac{1}{2}|[\vec{AB}, \vec{AC}]|" />.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Thể Tích Khối Tứ Diện</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Thể tích tứ diện <MathView math="ABCD" /> bằng một phần sáu tích hỗn tạp: <MathView math="V_{ABCD} = \frac{1}{6}|[\vec{AB}, \vec{AC}] \cdot \vec{AD}|" />. Bốn điểm đồng phẳng khi và chỉ khi <MathView math="V = 0" />.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          TAB 2: MẶT PHẲNG & MẶT CẦU TƯƠNG GIAO 3D
          ======================================================= */}
      {activeTab === 'plane-sphere' && (
        <div className="space-y-6">
          <div className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-3">
            {/* 3D WebGL Canvas */}
            <div className="lg:col-span-2 relative cursor-grab active:cursor-grabbing bg-[#06111f]">
              <div ref={sphereContainerRef} className="w-full h-[430px]" />

              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-[11px] text-slate-200 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Mặt Cầu (S)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Mặt Phẳng (α)
                </span>
                {intersectionType === 'cut' && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-300"></span> Đường tròn giao tuyến
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300">
                Kéo chuột để xoay 360° • Lăn chuột để zoom
              </div>
            </div>

            {/* Parameter Adjustment */}
            <div className="p-5 border-t lg:border-t-0 lg:border-l border-sky-100 bg-sky-50/20 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-600" />
                  Điều Chỉnh Tham Số Hình Học:
                </h4>

                {/* Sphere Radius R */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Bán kính mặt cầu (R):</span>
                    <span className="text-teal-700 font-bold">{sphereR.toFixed(1)}</span>
                  </div>
                  <input
                    type="range" min="1.5" max="4.5" step="0.1" value={sphereR}
                    onChange={(e) => setSphereR(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>

                {/* Plane Parameters */}
                <div className="space-y-3 pt-3 border-t border-sky-200">
                  <span className="text-xs text-amber-800 font-bold block">
                    Mặt phẳng: <MathView math={`${planeA}x + ${planeB}y + ${planeC}z + (${planeD}) = 0`} />
                  </span>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 font-medium">Hệ số D (Khoảng cách):</span>
                      <span className="text-amber-700 font-bold">{planeD}</span>
                    </div>
                    <input
                      type="range" min="-12" max="12" step="0.5" value={planeD}
                      onChange={(e) => setPlaneD(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Position calculation */}
              <div className="p-3.5 bg-white rounded-2xl border border-sky-200 text-xs space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Khoảng cách d(I, α):</span>
                  <span className="font-bold text-slate-900 font-mono">{distPlaneToSphere.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">So sánh với R = {sphereR.toFixed(2)}:</span>
                  <span className={`font-bold ${
                    intersectionType === 'cut' ? 'text-emerald-600' :
                    intersectionType === 'tangent' ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {distPlaneToSphere < sphereR ? 'd < R (Cắt)' : distPlaneToSphere > sphereR ? 'd > R (Không cắt)' : 'd = R (Tiếp xúc)'}
                  </span>
                </div>

                {intersectionType === 'cut' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-emerald-800 font-bold">
                    <span>Bán kính đường tròn thiết diện (r):</span>
                    <span className="font-mono text-sm">{circleR.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          TAB 3: LUYỆN ĐỀ & CHẤM ĐIỂM
          ======================================================= */}
      {activeTab === 'exercises' && (
        <Part3ExerciseBank />
      )}

      {/* =======================================================
          TAB 4: SƠ ĐỒ TƯ DUY & SỔ TAY CÔNG THỨC OXYZ
          ======================================================= */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lesson 16 */}
            <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <span className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center text-xs">16</span>
                Bài 16: Tọa Độ Của Vectơ Trong Không Gian
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• <MathView math="\vec{u} = (x; y; z) \iff \vec{u} = x\vec{i} + y\vec{j} + z\vec{k}" />.</li>
                <li>• Độ dài: <MathView math="|\vec{u}| = \sqrt{x^2 + y^2 + z^2}" />.</li>
                <li>• Tích vô hướng: <MathView math="\vec{u} \cdot \vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2" />.</li>
                <li>• Tích có hướng: <MathView math="[\vec{u}, \vec{v}] = (y_1 z_2 - z_1 y_2;\; z_1 x_2 - x_1 z_2;\; x_1 y_2 - y_1 x_2)" />.</li>
                <li>• Diện tích tam giác: <MathView math="S_{ABC} = \frac{1}{2}|[\vec{AB}, \vec{AC}]|" />.</li>
              </ul>
            </div>

            {/* Lesson 17 */}
            <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <span className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center text-xs">17</span>
                Bài 17: Phương Trình Mặt Phẳng
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• Dạng tổng quát: <MathView math="Ax + By + Cz + D = 0" /> (<MathView math="A^2+B^2+C^2 > 0" />).</li>
                <li>• Qua <MathView math="M_0" /> có VTPT <MathView math="\vec{n}(A, B, C)" />: <MathView math="A(x-x_0) + B(y-y_0) + C(z-z_0) = 0" />.</li>
                <li>• Phương trình đoạn chắn: <MathView math="\frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1" />.</li>
                <li>• Khoảng cách từ điểm <MathView math="M_0" /> đến <MathView math="(\alpha)" />: <MathView math="d(M_0, \alpha) = \frac{|Ax_0 + By_0 + Cz_0 + D|}{\sqrt{A^2 + B^2 + C^2}}" />.</li>
              </ul>
            </div>

            {/* Lesson 18 */}
            <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <span className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center text-xs">18</span>
                Bài 18: Phương Trình Đường Thẳng
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• Phương trình tham số: <MathView math="\begin{cases} x = x_0 + at \\ y = y_0 + bt \\ z = z_0 + ct \end{cases}" /> (<MathView math="t \in \mathbb{R}" />).</li>
                <li>• Phương trình chính tắc: <MathView math="\frac{x-x_0}{a} = \frac{y-y_0}{b} = \frac{z-z_0}{c}" /> (<MathView math="a, b, c \neq 0" />).</li>
                <li>• Góc giữa 2 đường thẳng: <MathView math="\cos(d_1, d_2) = \frac{|\vec{u}_1 \cdot \vec{u}_2|}{|\vec{u}_1| \cdot |\vec{u}_2|}" />.</li>
              </ul>
            </div>

            {/* Lesson 19 */}
            <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <span className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center text-xs">19</span>
                Bài 19: Phương Trình Mặt Cầu
              </div>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• Dạng chính tắc tâm <MathView math="I(a, b, c)" />: <MathView math="(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2" />.</li>
                <li>• Dạng khai triển: <MathView math="x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0" /> (<MathView math="a^2+b^2+c^2-d > 0" />).</li>
                <li>• Tương giao với <MathView math="(\alpha)" />: Tính <MathView math="d = d(I, \alpha)" />. Nếu <MathView math="d < R" />, giao tuyến là đường tròn có bán kính <MathView math="r = \sqrt{R^2 - d^2}" />.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
