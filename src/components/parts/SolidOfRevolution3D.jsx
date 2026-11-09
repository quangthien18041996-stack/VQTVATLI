import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import MathView from '../MathView';
import { RotateCw, Play, Pause, RefreshCw, Layers, Eye } from 'lucide-react';

const PRESETS = [
  {
    id: 'pottery',
    name: 'Bình gốm sứ Bát Tràng (Bài 4.35 SGK)',
    fnStr: 'f(x) = \\frac{1}{175}x^2 + \\frac{3}{35}x + 2',
    fn: (x) => (1 / 175) * x * x + (3 / 35) * x + 2,
    defaultA: 0,
    defaultB: 15,
    minA: 0,
    maxB: 20,
    unit: 'cm',
    desc: 'Mô phỏng mặt ngoài chiếc bình gốm tròn xoay được tạo thành khi quay đường cong quanh trục Ox.'
  },
  {
    id: 'sqrt',
    name: 'Khối tròn xoay Paraboloid (y = √x)',
    fnStr: 'f(x) = \\sqrt{x}',
    fn: (x) => Math.sqrt(Math.max(0, x)),
    defaultA: 0,
    defaultB: 4,
    minA: 0,
    maxB: 6,
    unit: 'đvđd',
    desc: 'Khối tròn xoay kinh điển trong đề thi THPT Quốc gia (Bài 13 - Ví dụ 7).'
  },
  {
    id: 'cone',
    name: 'Khối nón cụt / Hình nón (y = 0.5x)',
    fnStr: 'f(x) = 0.5x',
    fn: (x) => 0.5 * x,
    defaultA: 0,
    defaultB: 5,
    minA: 0,
    maxB: 6,
    unit: 'đvđd',
    desc: 'Khi quay đoạn thẳng qua Ox ta thu được khối nón tròn xoay.'
  },
  {
    id: 'wave',
    name: 'Lọ hoa gợn sóng (y = sin(x) + 2)',
    fnStr: 'f(x) = \\sin(x) + 2',
    fn: (x) => Math.sin(x) + 2,
    defaultA: 0,
    defaultB: 6.28,
    minA: 0,
    maxB: 6.28,
    unit: 'đvđd',
    desc: 'Đường cong tuần hoàn tạo thành lọ hoa trang trí nghệ thuật.'
  }
];

export default function SolidOfRevolution3D() {
  const containerRef = useRef(null);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [boundA, setBoundA] = useState(PRESETS[0].defaultA);
  const [boundB, setBoundB] = useState(PRESETS[0].defaultB);
  const [sweepAngle, setSweepAngle] = useState(360); // degrees
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Numerical approximation of Volume = pi * integral(f(x)^2, a, b)
  const volume = React.useMemo(() => {
    const steps = 200;
    const dx = (boundB - boundA) / steps;
    if (dx <= 0) return 0;
    let sum = 0;
    for (let i = 0; i < steps; i++) {
      const x = boundA + (i + 0.5) * dx;
      const y = selectedPreset.fn(x);
      sum += y * y * dx;
    }
    const fullVol = Math.PI * sum;
    return (fullVol * (sweepAngle / 360)).toFixed(2);
  }, [selectedPreset, boundA, boundB, sweepAngle]);

  // Numerical approximation of Area = integral(f(x), a, b)
  const area = React.useMemo(() => {
    const steps = 200;
    const dx = (boundB - boundA) / steps;
    if (dx <= 0) return 0;
    let sum = 0;
    for (let i = 0; i < steps; i++) {
      const x = boundA + (i + 0.5) * dx;
      sum += Math.abs(selectedPreset.fn(x)) * dx;
    }
    return sum.toFixed(2);
  }, [selectedPreset, boundA, boundB]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 440;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c192c); // Deep CAD slate blue

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 12, 18);
    camera.lookAt(6, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.2);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // 3. Grid & Coordinate Axes
    const gridHelper = new THREE.GridHelper(30, 30, 0x1e3a5f, 0x172554);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // X Axis line (axis of revolution)
    const axisGroup = new THREE.Group();
    const axisMat = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2 });
    const axisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4, 0, 0),
      new THREE.Vector3(25, 0, 0)
    ]);
    const axisLine = new THREE.Line(axisGeom, axisMat);
    axisGroup.add(axisLine);
    scene.add(axisGroup);

    // 4. Generate Solid of Revolution Mesh
    const xSteps = 45;
    const phiSteps = 40;
    const maxPhi = (sweepAngle * Math.PI) / 180;

    const vertices = [];
    const indices = [];

    const xMin = boundA;
    const xMax = boundB;
    const dx = (xMax - xMin) / xSteps;
    const dPhi = maxPhi / phiSteps;

    if (xMax > xMin && maxPhi > 0) {
      for (let i = 0; i <= xSteps; i++) {
        const x = xMin + i * dx;
        const r = Math.max(0.001, selectedPreset.fn(x));
        for (let j = 0; j <= phiSteps; j++) {
          const phi = j * dPhi;
          const y = r * Math.cos(phi);
          const z = r * Math.sin(phi);
          vertices.push(x, y, z);
        }
      }

      for (let i = 0; i < xSteps; i++) {
        for (let j = 0; j < phiSteps; j++) {
          const row1 = i * (phiSteps + 1);
          const row2 = (i + 1) * (phiSteps + 1);

          indices.push(row1 + j, row2 + j, row1 + j + 1);
          indices.push(row2 + j, row2 + j + 1, row1 + j + 1);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
      metalness: 0.15,
      roughness: 0.25,
      clearcoat: 0.8,
      wireframe: isWireframe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Profile curve
    const curvePoints = [];
    for (let i = 0; i <= 60; i++) {
      const x = xMin + (i / 60) * (xMax - xMin);
      const y = selectedPreset.fn(x);
      curvePoints.push(new THREE.Vector3(x, y, 0));
    }
    const curveGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 3 });
    const profileCurve = new THREE.Line(curveGeom, curveMat);
    scene.add(profileCurve);

    // Mouse Drag Interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.3;
    let rotY = -0.5;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      rotY += deltaX * 0.008;
      rotX += deltaY * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        rotY += 0.004;
      }
      const radius = 26;
      camera.position.x = 6 + radius * Math.cos(rotX) * Math.sin(rotY);
      camera.position.y = radius * Math.sin(rotX);
      camera.position.z = radius * Math.cos(rotX) * Math.cos(rotY);
      camera.lookAt(6, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [selectedPreset, boundA, boundB, sweepAngle, isWireframe, autoRotate]);

  const handleSelectPreset = (p) => {
    setSelectedPreset(p);
    setBoundA(p.defaultA);
    setBoundB(p.defaultB);
  };

  return (
    <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-4 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-sky-50/70 to-blue-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h3 className="font-bold text-slate-800 text-base md:text-lg">
              Phòng Thí Nghiệm 3D: Khối Tròn Xoay & Tích Phân Thực Nghiệm
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mô phỏng động quá trình quay hình phẳng quanh trục Ox theo công thức{' '}
            <MathView math="V = \pi \int_a^b [f(x)]^2 dx" className="text-blue-700 font-mono font-semibold" />
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isWireframe ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isWireframe ? 'Lưới Wireframe' : 'Mặt đặc Solid'}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              autoRotate ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
            }`}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoRotate ? 'Dừng xoay' : 'Tự xoay'}
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="p-3 bg-sky-50/40 border-b border-sky-100 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedPreset.id === p.id
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white border border-sky-200 text-slate-600 hover:text-blue-700 hover:bg-sky-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main interactive area: 3D Canvas + Live Math Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* 3D Canvas */}
        <div className="lg:col-span-3 relative cursor-grab active:cursor-grabbing bg-[#0c192c]">
          <div ref={containerRef} className="w-full h-[440px]" />
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kéo chuột để xoay 360° • Đường viền màu vàng là đường sinh <MathView math="y = f(x)" /></span>
          </div>
        </div>

        {/* Sidebar Controls & Calculation Results */}
        <div className="p-4 border-t lg:border-t-0 lg:border-l border-sky-100 bg-sky-50/30 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1">Hàm số đường sinh:</span>
              <div className="bg-white p-2.5 rounded-xl border border-sky-200 text-blue-700 text-center font-mono shadow-xs">
                <MathView math={selectedPreset.fnStr} block />
              </div>
            </div>

            {/* Cận a slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Cận dưới a:</span>
                <span className="text-blue-700 font-bold">{boundA}</span>
              </div>
              <input
                type="range"
                min={selectedPreset.minA}
                max={boundB - 0.5}
                step="0.5"
                value={boundA}
                onChange={(e) => setBoundA(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Cận b slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Cận trên b:</span>
                <span className="text-blue-700 font-bold">{boundB}</span>
              </div>
              <input
                type="range"
                min={boundA + 0.5}
                max={selectedPreset.maxB}
                step="0.5"
                value={boundB}
                onChange={(e) => setBoundB(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Sweep Angle */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Góc quét tròn xoay:</span>
                <span className="text-amber-600 font-bold">{sweepAngle}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="360"
                step="15"
                value={sweepAngle}
                onChange={(e) => setSweepAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Cắt lát 30°</span>
                <span>Nửa khối 180°</span>
                <span>Toàn phần 360°</span>
              </div>
            </div>
          </div>

          {/* Results Badge */}
          <div className="mt-4 pt-4 border-t border-sky-200 space-y-2">
            <div className="bg-gradient-to-br from-blue-50 to-sky-100 p-3.5 rounded-xl border border-blue-200/80 shadow-xs">
              <span className="text-[11px] text-blue-700 uppercase tracking-wider font-bold block">
                Thể tích khối 3D (V):
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {volume} <span className="text-xs text-slate-500 font-normal">{selectedPreset.unit}³</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Tính bằng tích phân thực nghiệm xấp xỉ liên tục.
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-sky-200 shadow-xs">
              <span className="text-[11px] text-slate-600 block">
                Diện tích hình phẳng 2D: <strong className="text-blue-700 font-mono">{area}</strong> đvdt
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
