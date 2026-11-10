import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import MathView from '../MathView';
import { 
  RotateCw, 
  Play, 
  Pause, 
  Layers, 
  Tag, 
  Disc, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Edit3, 
  PenTool, 
  Check, 
  AlertCircle, 
  Sparkles,
  Sliders,
  RefreshCw,
  Info
} from 'lucide-react';

/* ============================================================
   DANH SÁCH HÀM MẪU CÓ SẴN (PRESETS)
   ============================================================ */
const PRESETS = [
  {
    id: 'pottery',
    name: 'Bình gốm Bát Tràng',
    fnStr: 'f(x) = \\frac{1}{175}x^2 + \\frac{3}{35}x + 2',
    fn: (x) => (1 / 175) * x * x + (3 / 35) * x + 2,
    defaultA: 0,
    defaultB: 15,
    minA: 0,
    maxB: 20,
    unit: 'cm',
    defaultZoom: 26,
    desc: 'Mô phỏng mặt ngoài chiếc bình gốm tròn xoay được tạo thành khi quay đường cong quanh trục Ox.'
  },
  {
    id: 'sqrt',
    name: 'Paraboloid (y = √x)',
    fnStr: 'f(x) = \\sqrt{x}',
    fn: (x) => Math.sqrt(Math.max(0, x)),
    defaultA: 0,
    defaultB: 4,
    minA: 0,
    maxB: 6,
    unit: 'đvđd',
    defaultZoom: 16,
    desc: 'Khối tròn xoay kinh điển trong đề thi THPT Quốc gia (Bài 13 - Ví dụ 7).'
  },
  {
    id: 'cone',
    name: 'Hình nón (y = 0.5x)',
    fnStr: 'f(x) = 0.5x',
    fn: (x) => 0.5 * x,
    defaultA: 0,
    defaultB: 5,
    minA: 0,
    maxB: 6,
    unit: 'đvđd',
    defaultZoom: 18,
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
    defaultZoom: 18,
    desc: 'Đường cong tuần hoàn tạo thành lọ hoa trang trí nghệ thuật.'
  }
];

/* Gợi ý hàm số tùy chọn thường gặp */
const MATH_SUGGESTIONS = [
  { label: 'Cầu Parabol', expr: 'sqrt(4 - x^2)', a: -2, b: 2, desc: 'Nửa đường tròn quay quanh Ox tạo thành mặt cầu bán kính R=2' },
  { label: 'Cốc Thủy Tinh', expr: '1.5 + 0.1*x^2', a: 0, b: 4, desc: 'Thân cốc đáy hẹp loe dần lên miệng' },
  { label: 'Thắt Eo Đồng Hồ Cát', expr: '2 - sin(x)', a: 0, b: 3.14, desc: 'Dạng thon ở giữa, mở rộng hai đầu' },
  { label: 'Tháp Eiffel', expr: '3 * exp(-0.3*x)', a: 0, b: 6, desc: 'Đường cong hàm mũ thuôn nhỏ dần lên đỉnh' }
];

/* Các điểm nút mẫu cho chế độ "Nặn gốm bằng chuột" */
const DEFAULT_SPLINE_POINTS = [
  { x: 0, y: 1.6 },
  { x: 2.5, y: 2.8 },
  { x: 5.5, y: 1.4 },
  { x: 8.5, y: 2.9 },
  { x: 12, y: 2.2 }
];

// Parser an toàn cho chuỗi hàm số
function parseMathExpression(str) {
  try {
    let clean = str.trim()
      .replace(/f\s*\(\s*x\s*\)\s*=/gi, '')
      .replace(/y\s*=/gi, '')
      .replace(/\s+/g, '')
      .replace(/\^/g, '**')
      .replace(/sin\(/gi, 'Math.sin(')
      .replace(/cos\(/gi, 'Math.cos(')
      .replace(/tan\(/gi, 'Math.tan(')
      .replace(/sqrt\(/gi, 'Math.sqrt(')
      .replace(/exp\(/gi, 'Math.exp(')
      .replace(/ln\(/gi, 'Math.log(')
      .replace(/log\(/gi, 'Math.log10(')
      .replace(/abs\(/gi, 'Math.abs(')
      .replace(/pi/gi, 'Math.PI')
      .replace(/e(?![a-zA-Z])/g, 'Math.E')
      .replace(/(\d+)([a-zA-Z\(])/g, '$1*$2')
      .replace(/\)([\d\(])/g, ')*$1');

    const fn = new Function('x', `
      try {
        const val = ${clean};
        if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return 0;
        return Math.max(0, val);
      } catch(e) {
        return 0;
      }
    `);

    // Test run
    const testVal = fn(1);
    if (isNaN(testVal)) throw new Error('Biểu thức không hợp lệ');

    return { fn, error: null };
  } catch (err) {
    return { fn: null, error: err.message || 'Hàm số không hợp lệ' };
  }
}

// Nội suy Catmull-Rom Spline mượt mà qua các điểm nút
function interpolateSpline(points, x) {
  if (!points || points.length === 0) return 1;
  if (x <= points[0].x) return Math.max(0.1, points[0].y);
  if (x >= points[points.length - 1].x) return Math.max(0.1, points[points.length - 1].y);

  let i = 0;
  while (i < points.length - 1 && points[i + 1].x < x) i++;

  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(points.length - 1, i + 2)];

  const t = (x - p1.x) / (p2.x - p1.x);
  const t2 = t * t;
  const t3 = t2 * t;

  const y = 0.5 * (
    (2 * p1.y) +
    (-p0.y + p2.y) * t +
    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
  );

  return Math.max(0.05, y);
}

// Helper to create crisp, auto-sized 3D text billboards
function createAnnotationSprite(text, options = {}) {
  const canvas = document.createElement('canvas');
  const tempCtx = canvas.getContext('2d');
  
  const fontSize = options.fontSize || 26;
  const font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
  tempCtx.font = font;
  
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
  
  const worldHeight = options.worldHeight || 0.85;
  const worldWidth = (canvas.width / canvas.height) * worldHeight;
  sprite.scale.set(worldWidth, worldHeight, 1);
  return sprite;
}

export default function SolidOfRevolution3D() {
  const containerRef = useRef(null);
  const splineCanvasRef = useRef(null);

  // Creative Mode: 'preset' | 'custom_math' | 'draw_spline'
  const [creativeMode, setCreativeMode] = useState('preset');

  // Selected Preset
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);

  // Custom Math Formula state
  const [customMathInput, setCustomMathInput] = useState('2 + cos(x)');
  const [customMathError, setCustomMathError] = useState('');
  const [customFnObj, setCustomFnObj] = useState(() => parseMathExpression('2 + cos(x)'));

  // Custom Spline Draw state
  const [splinePoints, setSplinePoints] = useState(DEFAULT_SPLINE_POINTS);
  const [draggingPointIdx, setDraggingPointIdx] = useState(null);

  // Bounds & Angles
  const [boundA, setBoundA] = useState(PRESETS[0].defaultA);
  const [boundB, setBoundB] = useState(PRESETS[0].defaultB);
  const [sweepAngle, setSweepAngle] = useState(360);
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Educational States
  const [showLabels, setShowLabels] = useState(true);
  const [showSlice, setShowSlice] = useState(true);
  const [sliceX, setSliceX] = useState(7.5);

  // Zoom State
  const DEFAULT_ZOOM = selectedPreset.defaultZoom || 24;
  const [zoomRadius, setZoomRadius] = useState(DEFAULT_ZOOM);

  // Active Function based on creative mode
  const activeFn = useMemo(() => {
    if (creativeMode === 'preset') {
      return selectedPreset.fn;
    }
    if (creativeMode === 'custom_math') {
      return customFnObj.fn || selectedPreset.fn;
    }
    // 'draw_spline'
    return (x) => interpolateSpline(splinePoints, x);
  }, [creativeMode, selectedPreset, customFnObj, splinePoints]);

  const activeFnStr = useMemo(() => {
    if (creativeMode === 'preset') return selectedPreset.fnStr;
    if (creativeMode === 'custom_math') return `f(x) = ${customMathInput}`;
    return 'f(x) = \\text{Đường viền nặn tự do (Catmull-Rom Spline)}';
  }, [creativeMode, selectedPreset, customMathInput]);

  // Keep sliceX inside [boundA, boundB]
  useEffect(() => {
    if (sliceX < boundA) setSliceX(boundA);
    else if (sliceX > boundB) setSliceX(boundB);
  }, [boundA, boundB, sliceX]);

  const sliceRadius = Math.max(0.001, activeFn(sliceX));
  const sliceArea = Math.PI * sliceRadius * sliceRadius;

  // Numerical approximation of Volume = pi * integral(f(x)^2, a, b)
  const volume = useMemo(() => {
    const steps = 200;
    const dx = (boundB - boundA) / steps;
    if (dx <= 0) return '0.00';
    let sum = 0;
    for (let i = 0; i < steps; i++) {
      const x = boundA + (i + 0.5) * dx;
      const y = activeFn(x);
      sum += y * y * dx;
    }
    const fullVol = Math.PI * sum;
    return (fullVol * (sweepAngle / 360)).toFixed(2);
  }, [activeFn, boundA, boundB, sweepAngle]);

  const handleZoomIn = () => setZoomRadius((r) => Math.max(12, r - 3.5));
  const handleZoomOut = () => setZoomRadius((r) => Math.min(50, r + 3.5));
  const handleResetZoom = () => setZoomRadius(selectedPreset.defaultZoom || 24);

  // Apply Custom Math input
  const handleApplyCustomMath = (exprToApply, optA, optB) => {
    const expr = exprToApply !== undefined ? exprToApply : customMathInput;
    const res = parseMathExpression(expr);
    if (res.error) {
      setCustomMathError(res.error);
    } else {
      setCustomMathError('');
      setCustomFnObj(res);
      setCreativeMode('custom_math');
      if (optA !== undefined) setBoundA(optA);
      if (optB !== undefined) setBoundB(optB);
      else {
        setBoundA(0);
        setBoundB(6);
      }
    }
  };

  /* -------------------------------------------------------------
     VẼ 2D PROFILE TRÊN CANVAS ĐỂ KÉO THẢ NẶN GỐM
     ------------------------------------------------------------- */
  useEffect(() => {
    if (creativeMode !== 'draw_spline' || !splineCanvasRef.current) return;
    const canvas = splineCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padLeft = 40;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 30;

    const minX = 0;
    const maxX = 12;
    const minY = 0;
    const maxY = 4.5;

    const toPxX = (x) => padLeft + ((x - minX) / (maxX - minX)) * (width - padLeft - padRight);
    const toPxY = (y) => height - padBottom - ((y - minY) / (maxY - minY)) * (height - padTop - padBottom);
    const fromPxX = (px) => minX + ((px - padLeft) / (width - padLeft - padRight)) * (maxX - minX);
    const fromPxY = (py) => minY + ((height - padBottom - py) / (height - padTop - padBottom)) * (maxY - minY);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= maxX; x += 2) {
      ctx.beginPath();
      ctx.moveTo(toPxX(x), padTop);
      ctx.lineTo(toPxX(x), height - padBottom);
      ctx.stroke();
    }
    for (let y = 0; y <= maxY; y += 1) {
      ctx.beginPath();
      ctx.moveTo(padLeft, toPxY(y));
      ctx.lineTo(width - padRight, toPxY(y));
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    // Ox
    ctx.beginPath();
    ctx.moveTo(padLeft - 10, toPxY(0));
    ctx.lineTo(width - 10, toPxY(0));
    ctx.stroke();
    // Oy
    ctx.beginPath();
    ctx.moveTo(toPxX(0), height - padBottom + 10);
    ctx.lineTo(toPxX(0), 10);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('x (cm)', width - 35, toPxY(0) + 18);
    ctx.fillText('y = r(x)', toPxX(0) - 5, 20);

    // Draw Smooth Spline curve
    ctx.beginPath();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    const step = 0.1;
    for (let x = minX; x <= maxX; x += step) {
      const y = interpolateSpline(splinePoints, x);
      const px = toPxX(x);
      const py = toPxY(y);
      if (x === minX) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(toPxX(maxX), toPxY(0));
    ctx.lineTo(toPxX(minX), toPxY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
    ctx.fill();

    // Draw Control Points
    splinePoints.forEach((pt, idx) => {
      const px = toPxX(pt.x);
      const py = toPxY(pt.y);

      // Outer glow
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.fillStyle = draggingPointIdx === idx ? 'rgba(245, 158, 11, 0.35)' : 'rgba(2, 132, 199, 0.2)';
      ctx.fill();

      // Core point
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = draggingPointIdx === idx ? '#f59e0b' : '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label coordinate
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(`P${idx + 1}(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`, px - 25, py - 14);
    });

    // Mouse handlers for dragging points
    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      splinePoints.forEach((pt, idx) => {
        const px = toPxX(pt.x);
        const py = toPxY(pt.y);
        const dist = Math.hypot(mouseX - px, mouseY - py);
        if (dist < 18) found = idx;
      });

      if (found !== null) setDraggingPointIdx(found);
    };

    const handleMouseMove = (e) => {
      if (draggingPointIdx === null) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newY = Math.min(4.2, Math.max(0.1, fromPxY(mouseY)));
      // Point 0 and Point 4 keep fixed X for smooth cylinder base/top
      const newX = (draggingPointIdx === 0 || draggingPointIdx === splinePoints.length - 1)
        ? splinePoints[draggingPointIdx].x
        : Math.min(maxX - 0.5, Math.max(0.5, fromPxX(mouseX)));

      setSplinePoints((prev) => {
        const updated = [...prev];
        updated[draggingPointIdx] = { x: +newX.toFixed(2), y: +newY.toFixed(2) };
        return updated.sort((a, b) => a.x - b.x);
      });
    };

    const handleMouseUp = () => setDraggingPointIdx(null);

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [creativeMode, splinePoints, draggingPointIdx]);

  /* -------------------------------------------------------------
     THREE.JS 3D RENDER CHÍNH
     ------------------------------------------------------------- */
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

    // 3. Shape Dimensions & Proportional Axes
    const xMin = boundA;
    const xMax = boundB;
    const shapeLength = Math.max(0.1, xMax - xMin);

    // Profile curve points & peak radius
    const curvePoints = [];
    let peakY = 0.001;
    let peakX = boundA;
    for (let i = 0; i <= 60; i++) {
      const x = xMin + (i / 60) * shapeLength;
      const y = Math.max(0, activeFn(x));
      if (y > peakY) {
        peakY = y;
        peakX = x;
      }
      curvePoints.push(new THREE.Vector3(x, y, 0));
    }

    // Dynamic axis boundaries strictly proportional to the 3D shape
    const minXAxis = boundA <= 0 
      ? -Math.max(0.8, Math.min(2.0, 0.12 * shapeLength)) 
      : Math.min(-0.8, boundA - Math.max(0.8, 0.12 * shapeLength));
    const maxXAxis = boundB + Math.max(1.0, Math.min(2.5, 0.15 * shapeLength));

    const minYAxis = -Math.max(0.8, Math.min(1.8, 0.2 * peakY));
    const maxYAxis = peakY + Math.max(0.8, Math.min(2.0, 0.25 * peakY));

    // Dynamic scaling for arrowheads and annotations
    const baseScale = Math.min(Math.max(shapeLength / 9, 0.65), 1.25);
    const arrowConeRadius = 0.3 * baseScale;
    const arrowConeHeight = 0.9 * baseScale;

    // Floor Grid Helper
    const floorY = -Math.max(peakY + 1.2, 3.2);
    const gridSize = Math.max(24, Math.ceil((maxXAxis - minXAxis) * 2.2));
    const gridHelper = new THREE.GridHelper(gridSize, Math.min(36, gridSize), 0x1e3a5f, 0x132338);
    gridHelper.position.y = floorY;
    scene.add(gridHelper);

    // X Axis line (Trục quay Ox)
    const xAxisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(minXAxis, 0, 0),
      new THREE.Vector3(maxXAxis, 0, 0)
    ]);
    const xAxisMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 });
    const xAxisLine = new THREE.Line(xAxisGeom, xAxisMat);
    scene.add(xAxisLine);

    // X Arrowhead
    const xConeGeom = new THREE.ConeGeometry(arrowConeRadius, arrowConeHeight, 16);
    const xConeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const xCone = new THREE.Mesh(xConeGeom, xConeMat);
    xCone.position.set(maxXAxis + arrowConeHeight / 2, 0, 0);
    xCone.rotation.z = -Math.PI / 2;
    scene.add(xCone);

    // Y Axis line (Oy)
    const yAxisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, minYAxis, 0),
      new THREE.Vector3(0, maxYAxis, 0)
    ]);
    const yAxisMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    const yAxisLine = new THREE.Line(yAxisGeom, yAxisMat);
    scene.add(yAxisLine);

    // Y Arrowhead
    const yConeGeom = new THREE.ConeGeometry(arrowConeRadius, arrowConeHeight, 16);
    const yConeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const yCone = new THREE.Mesh(yConeGeom, yConeMat);
    yCone.position.set(0, maxYAxis + arrowConeHeight / 2, 0);
    scene.add(yCone);

    // Annotations
    if (showLabels) {
      const oxSprite = createAnnotationSprite('Trục quay (Ox)', { border: '#ef4444', textColor: '#fca5a5' });
      oxSprite.position.set(maxXAxis + 1.2 * baseScale, 0, 0);
      scene.add(oxSprite);

      const oySprite = createAnnotationSprite('Trục Oy', { border: '#10b981', textColor: '#86efac' });
      oySprite.position.set(0, maxYAxis + 1.1 * baseScale, 0);
      scene.add(oySprite);

      const curveFormulaSprite = createAnnotationSprite(
        creativeMode === 'preset' ? selectedPreset.name : creativeMode === 'custom_math' ? `f(x) = ${customMathInput}` : 'Đường nặn tự do',
        { border: '#fbbf24', textColor: '#fde68a' }
      );
      curveFormulaSprite.position.set(peakX, peakY + 0.9 * baseScale, 0);
      scene.add(curveFormulaSprite);

      const boundASprite = createAnnotationSprite(`Cận a = ${boundA}`, { border: '#94a3b8', textColor: '#e2e8f0', worldHeight: 0.65 });
      boundASprite.position.set(boundA, -0.9 * baseScale, 0);
      scene.add(boundASprite);

      const boundBSprite = createAnnotationSprite(`Cận b = ${boundB}`, { border: '#94a3b8', textColor: '#e2e8f0', worldHeight: 0.65 });
      boundBSprite.position.set(boundB, -0.9 * baseScale, 0);
      scene.add(boundBSprite);
    }

    // Generator curve y = f(x)
    const curveGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 3.5 });
    const curveLine = new THREE.Line(curveGeom, curveMat);
    scene.add(curveLine);

    // Solid of Revolution Geometry (Lathe with X alignment)
    const points2D = [];
    const numPoints = 80;
    for (let i = 0; i <= numPoints; i++) {
      const x = boundA + (i / numPoints) * shapeLength;
      const y = Math.max(0.001, activeFn(x));
      points2D.push(new THREE.Vector2(y, x));
    }

    const phiLength = (sweepAngle / 360) * Math.PI * 2;
    const latheGeom = new THREE.LatheGeometry(points2D, 64, 0, phiLength);
    latheGeom.computeVertexNormals();

    const latheMat = new THREE.MeshPhysicalMaterial({
      color: creativeMode === 'draw_spline' ? 0x06b6d4 : 0x0284c7,
      transparent: true,
      opacity: isWireframe ? 0.35 : 0.85,
      roughness: 0.2,
      metalness: 0.25,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      transmission: 0.5,
      ior: 1.35,
      wireframe: isWireframe,
      side: THREE.DoubleSide
    });

    const latheMesh = new THREE.Mesh(latheGeom, latheMat);
    latheMesh.rotation.z = -Math.PI / 2;
    scene.add(latheMesh);

    // Dynamic Slicing Disk S(x)
    let sliceGroup = new THREE.Group();
    if (showSlice && sliceX >= boundA && sliceX <= boundB) {
      const currentRadius = Math.max(0.001, activeFn(sliceX));
      const diskGeom = new THREE.CircleGeometry(currentRadius, 48);
      const diskMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const diskMesh = new THREE.Mesh(diskGeom, diskMat);
      diskMesh.rotation.y = Math.PI / 2;
      diskMesh.position.set(sliceX, 0, 0);
      sliceGroup.add(diskMesh);

      const ringGeom = new THREE.RingGeometry(Math.max(0.001, currentRadius - 0.05), currentRadius + 0.05, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.y = Math.PI / 2;
      ringMesh.position.set(sliceX, 0, 0);
      sliceGroup.add(ringMesh);

      const radiusPoints = [
        new THREE.Vector3(sliceX, 0, 0),
        new THREE.Vector3(sliceX, currentRadius, 0)
      ];
      const radiusGeom = new THREE.BufferGeometry().setFromPoints(radiusPoints);
      const radiusMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3.5 });
      const radiusLine = new THREE.Line(radiusGeom, radiusMat);
      sliceGroup.add(radiusLine);

      if (showLabels) {
        const sxSprite = createAnnotationSprite(`S(x) = π·[f(x)]² = ${(Math.PI * currentRadius * currentRadius).toFixed(1)}`, {
          border: '#10b981',
          textColor: '#6ee7b7',
          worldHeight: 0.7
        });
        sxSprite.position.set(sliceX, -currentRadius - 0.8 * baseScale, 0);
        sliceGroup.add(sxSprite);

        const rSprite = createAnnotationSprite(`r = ${currentRadius.toFixed(2)}`, {
          border: '#f59e0b',
          textColor: '#fde68a',
          worldHeight: 0.6
        });
        rSprite.position.set(sliceX, currentRadius / 2, 0.4 * baseScale);
        sliceGroup.add(rSprite);
      }
    }
    scene.add(sliceGroup);

    // Orbit Controls (Mouse Drag & Rotation)
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.35;
    let rotY = 0.45;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      rotY += (e.clientX - prevMouse.x) * 0.008;
      rotX += (e.clientY - prevMouse.y) * 0.008;
      rotX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, rotX));
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e) => {
      e.preventDefault();
      setZoomRadius((r) => Math.max(12, Math.min(50, r + e.deltaY * 0.02)));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        rotY += 0.004;
      }

      const r = zoomRadius;
      camera.position.x = midX + r * Math.cos(rotX) * Math.sin(rotY);
      camera.position.y = r * Math.sin(rotX);
      camera.position.z = r * Math.cos(rotX) * Math.cos(rotY);
      camera.lookAt(midX, 0, 0);

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
  }, [selectedPreset, boundA, boundB, sweepAngle, isWireframe, autoRotate, showLabels, showSlice, sliceX, zoomRadius, activeFn, creativeMode]);

  const zoomPercent = Math.round((DEFAULT_ZOOM / zoomRadius) * 100);

  return (
    <div className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-sm">
      {/* Top Banner Toolbar */}
      <div className="p-4 sm:p-5 border-b border-sky-100 bg-gradient-to-r from-sky-50 via-blue-50/50 to-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white">
              Phòng Thí Nghiệm 3D
            </span>
            <span className="text-xs text-blue-700 font-bold">• Khối Tròn Xoay & Tích Phân Riemann</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            Mô Phỏng Trực Quan Sự Hình Thành Khối Tròn Xoay Quanh Trục Ox
          </h3>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showLabels ? 'bg-sky-600 text-white shadow-xs' : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            {showLabels ? 'Nhãn: Bật' : 'Nhãn: Tắt'}
          </button>

          <button
            onClick={() => setShowSlice(!showSlice)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSlice ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
            }`}
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

      {/* Mode Selector Bar: Presets vs Custom Math vs Draw Spline */}
      <div className="p-3 bg-slate-50 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setCreativeMode('preset')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              creativeMode === 'preset'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            1. Hàm Mẫu SGK
          </button>

          <button
            onClick={() => setCreativeMode('custom_math')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              creativeMode === 'custom_math'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            2. Tự Nhập Hàm Số
          </button>

          <button
            onClick={() => {
              setCreativeMode('draw_spline');
              setBoundA(0);
              setBoundB(12);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              creativeMode === 'draw_spline'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            3. Nặn Gốm Bằng Chuột (Vẽ Tự Do)
          </button>
        </div>

        {/* Status Mode Badge */}
        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
          {creativeMode === 'preset' && '4 hàm số kinh điển SGK KNTT'}
          {creativeMode === 'custom_math' && 'Nhập biểu thức toán học bất kỳ f(x)'}
          {creativeMode === 'draw_spline' && 'Kéo các điểm nút P1 - P5 để tạo dáng chiếc bình'}
        </span>
      </div>

      {/* Sub-bar for Creative Mode 1: Presets */}
      {creativeMode === 'preset' && (
        <div className="p-3 bg-sky-50/30 border-b border-sky-100 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPreset(p);
                setBoundA(p.defaultA);
                setBoundB(p.defaultB);
                setZoomRadius(p.defaultZoom || 24);
              }}
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
      )}

      {/* Sub-bar for Creative Mode 2: Custom Math */}
      {creativeMode === 'custom_math' && (
        <div className="p-4 bg-gradient-to-r from-blue-50/70 via-sky-50/50 to-indigo-50/50 border-b border-sky-100 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="text-xs font-bold text-slate-700 shrink-0">Nhập hàm số:</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-blue-600">f(x) =</span>
              <input
                type="text"
                value={customMathInput}
                onChange={(e) => setCustomMathInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCustomMath(); }}
                placeholder="2 + cos(x), sqrt(4 - x^2), 1.5 + 0.1*x^2..."
                className="w-full pl-16 pr-3 py-2 bg-white rounded-xl border border-sky-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
            <button
              onClick={() => handleApplyCustomMath()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tạo Khối 3D</span>
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="text-slate-500 font-medium">Gợi ý mẫu:</span>
            {MATH_SUGGESTIONS.map((s, sIdx) => (
              <button
                key={sIdx}
                onClick={() => {
                  setCustomMathInput(s.expr);
                  handleApplyCustomMath(s.expr, s.a, s.b);
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-100 border border-sky-200 text-slate-700 font-mono transition-colors cursor-pointer"
              >
                {s.label} ({s.expr})
              </button>
            ))}
          </div>

          {customMathError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{customMathError}. Vui lòng thử lại với các phép tính như: sin, cos, sqrt, exp, ^.</span>
            </div>
          )}
        </div>
      )}

      {/* Sub-bar for Creative Mode 3: Draw Spline */}
      {creativeMode === 'draw_spline' && (
        <div className="p-4 bg-gradient-to-r from-sky-50 via-cyan-50/50 to-white border-b border-sky-100 space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
              <span><strong>Kéo thả các chấm tròn P1 - P5 trên mặt phẳng 2D</strong> để nặn dáng bình hoa theo ý bạn! Khối 3D bên dưới sẽ xoay theo thời gian thực.</span>
            </div>
            <button
              onClick={() => setSplinePoints(DEFAULT_SPLINE_POINTS)}
              className="px-3 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-cyan-700 bg-white border border-slate-200 hover:bg-cyan-50 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại dáng bình</span>
            </button>
          </div>

          {/* Interactive 2D Profile Canvas */}
          <div className="bg-white rounded-2xl border border-sky-200 p-2 shadow-2xs overflow-hidden flex justify-center">
            <canvas
              ref={splineCanvasRef}
              width={640}
              height={180}
              className="w-full max-w-2xl h-[180px] cursor-crosshair select-none"
            />
          </div>
        </div>
      )}

      {/* Main interactive area: 3D Canvas + Live Math Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* 3D Canvas */}
        <div className="lg:col-span-3 relative cursor-grab active:cursor-grabbing bg-[#0c192c]">
          <div ref={containerRef} className="w-full h-[500px]" />
          
          {/* Floating Zoom Toolbar on Top Right */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 flex items-center gap-1 shadow-xl">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Phóng to vật thể"
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
              title="Thu nhỏ vật thể"
            >
              <ZoomOut className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Thu nhỏ</span>
            </button>

            <button
              onClick={handleResetZoom}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đặt lại zoom mặc định"
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
            <span className="text-cyan-300 font-medium">Kéo chuột xoay 360° • Cuộn chuột để zoom</span>
          </div>
        </div>

        {/* Sidebar Controls & Calculation Results */}
        <div className="p-4 border-t lg:border-t-0 lg:border-l border-sky-100 bg-sky-50/30 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1">Đường sinh quay quanh Ox:</span>
              <div className="bg-white p-2.5 rounded-xl border border-sky-200 text-blue-700 text-center font-mono shadow-xs overflow-x-auto scrollbar-none">
                <MathView math={activeFnStr} block />
              </div>
            </div>

            {/* Slider: Vị trí lát cắt kiểm tra x */}
            {showSlice && (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-emerald-900 font-bold flex items-center gap-1">
                    <Disc className="w-3.5 h-3.5 text-emerald-600" />
                    Lát cắt tại x:
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
                min={creativeMode === 'preset' ? selectedPreset.minA : -5}
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
                max={creativeMode === 'preset' ? selectedPreset.maxB : 20}
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
                {volume} <span className="text-xs text-slate-500 font-normal">{selectedPreset.unit || 'đvtt'}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Công thức: <MathView math="V = \pi \int_a^b [f(x)]^2 dx" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
