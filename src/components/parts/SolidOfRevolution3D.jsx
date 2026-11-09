import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import MathView from '../MathView';
import { RotateCw, Play, Pause, Layers, Tag, Disc, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

// Helper to create crisp, auto-sized 3D text billboards that NEVER clip text
function createAnnotationSprite(text, options = {}) {
  const canvas = document.createElement('canvas');
  const tempCtx = canvas.getContext('2d');
  
  const fontSize = options.fontSize || 26;
  const font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
  tempCtx.font = font;
  
  // Accurately measure text width to prevent ANY truncation or clipping
  const metrics = tempCtx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const paddingX = 40;
  const paddingY = 24;
  
  canvas.width = Math.max(200, textWidth + paddingX * 2);
  canvas.height = fontSize + paddingY * 2;
  const ctx = canvas.getContext('2d');

  const bg = options.bg || 'rgba(15, 23, 42, 0.94)';
  const border = options.border || '#38bdf8';
  const textColor = options.textColor || '#ffffff';

  // Draw rounded card background
  ctx.fillStyle = bg;
  ctx.strokeStyle = border;
  ctx.lineWidth = 4;
  const r = 12;
  const w = canvas.width - 8;
  const h = canvas.height - 8;
  
  if (ctx.roundRect) {
    ctx.roundRect(4, 4, w, h, r);
  } else {
    ctx.rect(4, 4, w, h);
  }
  ctx.fill();
  ctx.stroke();

  // Draw text
  ctx.font = font;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    depthTest: false 
  });
  const sprite = new THREE.Sprite(material);
  
  // Scale sprite proportionally in 3D space
  const worldHeight = options.worldHeight || 0.85;
  const worldWidth = (canvas.width / canvas.height) * worldHeight;
  sprite.scale.set(worldWidth, worldHeight, 1);
  return sprite;
}

export default function SolidOfRevolution3D() {
  const containerRef = useRef(null);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [boundA, setBoundA] = useState(PRESETS[0].defaultA);
  const [boundB, setBoundB] = useState(PRESETS[0].defaultB);
  const [sweepAngle, setSweepAngle] = useState(360);
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true); // Default false so user can inspect clearly

  // Educational States
  const [showLabels, setShowLabels] = useState(true);
  const [showSlice, setShowSlice] = useState(true);
  const [sliceX, setSliceX] = useState(7.5);

  // Zoom State
  const DEFAULT_ZOOM = 26;
  const [zoomRadius, setZoomRadius] = useState(DEFAULT_ZOOM);

  // Keep sliceX inside [boundA, boundB]
  useEffect(() => {
    if (sliceX < boundA) setSliceX(boundA);
    else if (sliceX > boundB) setSliceX(boundB);
  }, [boundA, boundB, sliceX]);

  const sliceRadius = Math.max(0.001, selectedPreset.fn(sliceX));
  const sliceArea = Math.PI * sliceRadius * sliceRadius;

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

  const handleZoomIn = () => {
    setZoomRadius((r) => Math.max(12, r - 3.5));
  };

  const handleZoomOut = () => {
    setZoomRadius((r) => Math.min(50, r + 3.5));
  };

  const handleResetZoom = () => {
    setZoomRadius(DEFAULT_ZOOM);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c192c);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const midX = (boundA + boundB) / 2;
    camera.position.set(midX, 10, zoomRadius);
    camera.lookAt(midX, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.2);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // 3. Coordinate Grid & Axes
    const gridHelper = new THREE.GridHelper(36, 36, 0x1e3a5f, 0x132338);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // X Axis line (Trục quay Ox)
    const maxXAxis = Math.max(boundB + 4, 18);
    const axisMatX = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2.5 });
    const axisGeomX = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(maxXAxis, 0, 0)
    ]);
    const axisLineX = new THREE.Line(axisGeomX, axisMatX);
    scene.add(axisLineX);

    // Y Axis line (Trục tung Oy)
    const maxYVal = Math.max(selectedPreset.fn(boundA), selectedPreset.fn(boundB), 5);
    const maxYAxis = Math.max(maxYVal + 3.5, 8);
    const axisMatY = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    const axisGeomY = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -3, 0),
      new THREE.Vector3(0, maxYAxis, 0)
    ]);
    const axisLineY = new THREE.Line(axisGeomY, axisMatY);
    scene.add(axisLineY);

    // Dấu mũi tên 3D trục Ox (đỏ)
    const arrowGeomX = new THREE.ConeGeometry(0.4, 1.2, 16);
    const arrowMatX = new THREE.MeshStandardMaterial({ 
      color: 0xf43f5e, 
      roughness: 0.25,
      emissive: 0x9f1239,
      emissiveIntensity: 0.35
    });
    const arrowMeshX = new THREE.Mesh(arrowGeomX, arrowMatX);
    arrowMeshX.position.set(maxXAxis + 0.6, 0, 0);
    arrowMeshX.rotation.z = -Math.PI / 2;
    scene.add(arrowMeshX);

    // Dấu mũi tên 3D trục Oy (xanh lá)
    const arrowGeomY = new THREE.ConeGeometry(0.4, 1.2, 16);
    const arrowMatY = new THREE.MeshStandardMaterial({ 
      color: 0x10b981, 
      roughness: 0.25,
      emissive: 0x065f46,
      emissiveIntensity: 0.35
    });
    const arrowMeshY = new THREE.Mesh(arrowGeomY, arrowMatY);
    arrowMeshY.position.set(0, maxYAxis + 0.6, 0);
    scene.add(arrowMeshY);

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
      emissiveIntensity: 0.18,
      metalness: 0.15,
      roughness: 0.25,
      clearcoat: 0.8,
      wireframe: isWireframe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Profile Curve: y = f(x)
    const curvePoints = [];
    let peakY = 0;
    let peakX = boundA;
    for (let i = 0; i <= 60; i++) {
      const x = xMin + (i / 60) * (xMax - xMin);
      const y = selectedPreset.fn(x);
      if (y > peakY) {
        peakY = y;
        peakX = x;
      }
      curvePoints.push(new THREE.Vector3(x, y, 0));
    }
    const curveGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 3.5 });
    const profileCurve = new THREE.Line(curveGeom, curveMat);
    scene.add(profileCurve);

    // Boundary Rings at x = a and x = b
    const createRing = (xVal, colorHex) => {
      const r = Math.max(0.001, selectedPreset.fn(xVal));
      const ringGeom = new THREE.BufferGeometry();
      const pts = [];
      const segs = 48;
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * maxPhi;
        pts.push(new THREE.Vector3(xVal, r * Math.cos(a), r * Math.sin(a)));
      }
      ringGeom.setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2.5 });
      return new THREE.Line(ringGeom, ringMat);
    };

    scene.add(createRing(boundA, 0x38bdf8));
    scene.add(createRing(boundB, 0x38bdf8));

    // 5. Dynamic Cross-Section Disc (Thiết diện S(x) = π·r²)
    if (showSlice && sliceX >= boundA && sliceX <= boundB) {
      const r = Math.max(0.001, selectedPreset.fn(sliceX));
      
      const discGeom = new THREE.CircleGeometry(r, 48, 0, maxPhi);
      const discMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      const discMesh = new THREE.Mesh(discGeom, discMat);
      discMesh.position.set(sliceX, 0, 0);
      discMesh.rotation.y = Math.PI / 2;
      scene.add(discMesh);

      // Rim
      const rimGeom = new THREE.BufferGeometry();
      const rimPts = [];
      for (let s = 0; s <= 48; s++) {
        const phi = (s / 48) * maxPhi;
        rimPts.push(new THREE.Vector3(sliceX, r * Math.cos(phi), r * Math.sin(phi)));
      }
      rimGeom.setFromPoints(rimPts);
      const rimMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 3 });
      scene.add(new THREE.Line(rimGeom, rimMat));

      // Radius line: r = f(x)
      const radiusGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sliceX, 0, 0),
        new THREE.Vector3(sliceX, r, 0)
      ]);
      const radiusMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3.5 });
      scene.add(new THREE.Line(radiusGeom, radiusMat));

      // Center dot & Rim dot
      const centerDotGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const centerDot = new THREE.Mesh(centerDotGeom, dotMat);
      centerDot.position.set(sliceX, 0, 0);
      scene.add(centerDot);

      const rimDot = new THREE.Mesh(centerDotGeom, dotMat);
      rimDot.position.set(sliceX, r, 0);
      scene.add(rimDot);
    }

    // 6. Educational 3D Annotation Labels & Symbols
    if (showLabels) {
      // Label: Trục quay Ox (Positioned right at the end of the solid's visible axis)
      const labelOx = createAnnotationSprite('Trục quay Ox ➜', {
        bg: 'rgba(225, 29, 72, 0.95)',
        border: '#fda4af',
        worldHeight: 0.8
      });
      labelOx.position.set(maxXAxis - 1, -0.9, 0);
      scene.add(labelOx);

      // Label: Trục Oy
      const labelOy = createAnnotationSprite('Trục Oy ⬆', {
        bg: 'rgba(5, 150, 105, 0.95)',
        border: '#6ee7b7',
        worldHeight: 0.8
      });
      labelOy.position.set(0, maxYAxis - 0.5, 0);
      scene.add(labelOy);

      // Label: Gốc O(0,0) (offset to avoid overlapping with Cận a)
      if (Math.abs(boundA) > 1.2) {
        const labelO = createAnnotationSprite('O(0,0)', {
          bg: 'rgba(30, 41, 59, 0.92)',
          border: '#94a3b8',
          worldHeight: 0.75
        });
        labelO.position.set(0, -1.2, 0);
        scene.add(labelO);
      }

      // Label: Cận a (Nếu a = 0 thì hiển thị rõ O ≡ a)
      const labelAText = boundA === 0 ? 'O ≡ Cận a (0)' : `Cận x = a (${boundA})`;
      const labelA = createAnnotationSprite(labelAText, {
        bg: 'rgba(2, 132, 199, 0.95)',
        border: '#7dd3fc',
        worldHeight: 0.8
      });
      labelA.position.set(boundA, -1.8, 0);
      scene.add(labelA);

      // Label: Cận b
      const labelB = createAnnotationSprite(`Cận x = b (${boundB})`, {
        bg: 'rgba(2, 132, 199, 0.95)',
        border: '#7dd3fc',
        worldHeight: 0.8
      });
      labelB.position.set(boundB, -1.8, 0);
      scene.add(labelB);

      // Label: Đường sinh y = f(x)
      const labelCurve = createAnnotationSprite('Đường sinh y = f(x)', {
        bg: 'rgba(217, 119, 6, 0.95)',
        border: '#fde047',
        worldHeight: 0.85
      });
      labelCurve.position.set(peakX, peakY + 1.2, 0);
      scene.add(labelCurve);

      // Label: Bán kính và Thiết diện lát cắt
      if (showSlice) {
        // Radius label (offset in Z so it pops in front clearly!)
        const labelRadius = createAnnotationSprite(`r = f(x) = ${sliceRadius.toFixed(2)}`, {
          bg: 'rgba(180, 83, 9, 0.95)',
          border: '#fbbf24',
          worldHeight: 0.78
        });
        labelRadius.position.set(sliceX, sliceRadius / 2, 1.2);
        scene.add(labelRadius);

        // Disc Area label (generous padding, placed clearly above the disc)
        const labelSlice = createAnnotationSprite(`Thiết diện S(x) = π·r² = ${sliceArea.toFixed(1)}`, {
          bg: 'rgba(6, 95, 70, 0.95)',
          border: '#34d399',
          worldHeight: 0.85
        });
        labelSlice.position.set(sliceX, sliceRadius + 1.5, 0);
        scene.add(labelSlice);
      }
    }

    // 7. Mouse Orbit & Wheel Zoom
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.35;
    let rotY = -0.55;

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

    // Scroll wheel zoom event on canvas!
    const onWheel = (e) => {
      e.preventDefault();
      setZoomRadius((curr) => {
        const delta = e.deltaY > 0 ? 1.8 : -1.8;
        return Math.min(50, Math.max(12, curr + delta));
      });
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('wheel', onWheel, { passive: false });
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
        rotY += 0.005;
      }
      
      // Update camera position with dynamic zoomRadius
      camera.position.x = midX + zoomRadius * Math.cos(rotX) * Math.sin(rotY);
      camera.position.y = zoomRadius * Math.sin(rotX);
      camera.position.z = zoomRadius * Math.cos(rotX) * Math.cos(rotY);
      camera.lookAt(midX, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [selectedPreset, boundA, boundB, sweepAngle, isWireframe, autoRotate, showLabels, showSlice, sliceX, zoomRadius]);

  const handleSelectPreset = (p) => {
    setSelectedPreset(p);
    setBoundA(p.defaultA);
    setBoundB(p.defaultB);
    setSliceX((p.defaultA + p.defaultB) / 2);
    setZoomRadius(DEFAULT_ZOOM);
  };

  // Zoom percentage display
  const zoomPercent = Math.round((DEFAULT_ZOOM / zoomRadius) * 100);

  return (
    <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-4 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-sky-50/70 to-blue-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h3 className="font-bold text-slate-800 text-base md:text-lg">
              Phòng Thí Nghiệm 3D: Khối Tròn Xoay Kèm Ký Hiệu & Phóng To/Thu Nhỏ
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Trực quan hóa công thức SGK:{' '}
            <MathView math="V = \pi \int_a^b [f(x)]^2 dx = \int_a^b S(x) dx" className="text-blue-700 font-mono font-semibold" />
          </p>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showLabels 
                ? 'bg-amber-500 text-white shadow-xs' 
                : 'bg-white border border-sky-200 text-slate-600 hover:bg-sky-50'
            }`}
            title="Bật/Tắt ký hiệu tọa độ, cận a, b, đường sinh và bán kính"
          >
            <Tag className="w-3.5 h-3.5" />
            {showLabels ? 'Ký Hiệu: Bật' : 'Ký Hiệu: Tắt'}
          </button>

          <button
            onClick={() => setShowSlice(!showSlice)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSlice 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-white border border-sky-200 text-slate-600 hover:bg-sky-50'
            }`}
            title="Bật/Tắt lát cắt thiết diện tròn S(x)"
          >
            <Disc className="w-3.5 h-3.5" />
            {showSlice ? 'Lát Cắt S(x): Bật' : 'Lát Cắt S(x): Tắt'}
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isWireframe ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isWireframe ? 'Khung lưới' : 'Mặt đặc'}
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
          <div ref={containerRef} className="w-full h-[500px]" />
          
          {/* Floating Zoom In / Zoom Out Toolbar on Top Right */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 flex items-center gap-1 shadow-xl">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Phóng to vật thể (hoặc cuộn chuột lên)"
            >
              <ZoomIn className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Phóng to</span>
            </button>

            <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 bg-slate-950/80 rounded-lg border border-slate-800">
              {zoomPercent}%
            </span>

            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Thu nhỏ vật thể (hoặc cuộn chuột xuống)"
            >
              <ZoomOut className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Thu nhỏ</span>
            </button>

            <button
              onClick={handleResetZoom}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đặt lại mức thu phóng mặc định"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Legend badge on bottom left */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex flex-wrap items-center gap-3 shadow-lg">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Trục quay Ox
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Thiết diện tròn S(x)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Bán kính r = f(x)
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-300 font-medium">Cuộn chuột hoặc bấm nút để phóng to/thu nhỏ</span>
          </div>
        </div>

        {/* Sidebar Controls & Calculation Results */}
        <div className="p-4 border-t lg:border-t-0 lg:border-l border-sky-100 bg-sky-50/30 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1">Hàm số đường sinh:</span>
              <div className="bg-white p-2.5 rounded-xl border border-sky-200 text-blue-700 text-center font-mono shadow-xs">
                <MathView math={selectedPreset.fnStr} block />
              </div>
            </div>

            {/* Slider: Vị trí lát cắt kiểm tra x */}
            {showSlice && (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-emerald-900 font-bold flex items-center gap-1">
                    <Disc className="w-3.5 h-3.5 text-emerald-600" />
                    Vị trí lát cắt x:
                  </span>
                  <span className="text-emerald-800 font-black font-mono bg-white px-2 py-0.5 rounded border border-emerald-200">
                    x = {sliceX.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={boundA}
                  max={boundB}
                  step="0.2"
                  value={sliceX}
                  onChange={(e) => setSliceX(parseFloat(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="text-[11px] text-emerald-800 flex justify-between pt-1">
                  <span>Bán kính: <strong>{sliceRadius.toFixed(2)}</strong></span>
                  <span>S(x): <strong>{sliceArea.toFixed(1)}</strong> đvdt</span>
                </div>
              </div>
            )}

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
            </div>
          </div>

          {/* Results Badge */}
          <div className="pt-3 border-t border-sky-200 space-y-2">
            <div className="bg-gradient-to-br from-blue-50 to-sky-100 p-3.5 rounded-xl border border-blue-200/80 shadow-xs">
              <span className="text-[11px] text-blue-700 uppercase tracking-wider font-bold block">
                Tổng Thể Tích Khối 3D (V):
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {volume} <span className="text-xs text-slate-500 font-normal">{selectedPreset.unit}³</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Tích phân toàn phần của các thiết diện <MathView math="S(x)dx" /> từ a đến b.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
