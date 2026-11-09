import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import MathView from '../MathView';
import { Compass, Rotate3d, Layers } from 'lucide-react';

export default function Part2Geometry() {
  const containerRef = useRef(null);
  const [aPlane, setAPlane] = useState(1);
  const [bPlane, setBPlane] = useState(1);
  const [cPlane, setCPlane] = useState(1);
  const [dPlane, setDPlane] = useState(-3);
  const [sphereR, setSphereR] = useState(2.5);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c192c);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 10, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dir = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    // 3 Mũi tên trục không gian Oxyz
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 7.0, 0xf43f5e, 0.9, 0.45);
    scene.add(arrowX);

    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 7.0, 0x10b981, 0.9, 0.45);
    scene.add(arrowY);

    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 7.0, 0x38bdf8, 0.9, 0.45);
    scene.add(arrowZ);

    const sphereGeom = new THREE.SphereGeometry(sphereR, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.55,
      roughness: 0.2,
      metalness: 0.1,
    });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    scene.add(sphereMesh);

    const normal = new THREE.Vector3(aPlane, bPlane, cPlane).normalize();
    const planeGeom = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      roughness: 0.4
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMat);

    planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const len = Math.sqrt(aPlane * aPlane + bPlane * bPlane + cPlane * cPlane) || 1;
    const dist = -dPlane / len;
    planeMesh.position.copy(normal.clone().multiplyScalar(dist));
    scene.add(planeMesh);

    let isDragging = false;
    let prev = { x: 0, y: 0 };
    let rotX = 0.5;
    let rotY = 0.6;

    const onMouseDown = (e) => {
      isDragging = true;
      prev = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      rotY += (e.clientX - prev.x) * 0.008;
      rotX += (e.clientY - prev.y) * 0.008;
      prev = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) rotY += 0.005;

      const r = 20;
      camera.position.x = r * Math.cos(rotX) * Math.sin(rotY);
      camera.position.y = r * Math.sin(rotX);
      camera.position.z = r * Math.cos(rotX) * Math.cos(rotY);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [aPlane, bPlane, cPlane, dPlane, sphereR]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-emerald-50/60 border border-teal-200/80 rounded-2xl p-6 shadow-xs">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200 inline-block mb-3">
          CHUYÊN ĐỀ 3 • TOÁN 12 KNTT (CHƯƠNG V)
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Phương Pháp Tọa Độ Trong Không Gian Oxyz & Mô Hình Mặt Cầu
        </h2>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          Quan sát trực quan tương giao giữa Mặt phẳng <MathView math="(\alpha): Ax + By + Cz + D = 0" /> và Mặt cầu <MathView math="(S): x^2 + y^2 + z^2 = R^2" /> trong không gian 3 chiều tương tác xoay 360°.
        </p>
      </div>

      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 relative cursor-grab active:cursor-grabbing bg-[#0c192c]">
          <div ref={containerRef} className="w-full h-[400px]" />
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300">
            Trục Đỏ (Ox) • Xanh Lá (Oy) • Xanh Dương (Oz) • Mặt vàng: Mặt phẳng (α) • Khối cyan: Mặt cầu (S)
          </div>
        </div>

        <div className="p-5 border-t lg:border-t-0 lg:border-l border-sky-100 bg-sky-50/30 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-600" />
            Điều Chỉnh Tham Số Không Gian:
          </h4>

          {/* Sphere radius */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">Bán kính mặt cầu (R):</span>
              <span className="text-teal-700 font-bold">{sphereR}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4.5"
              step="0.1"
              value={sphereR}
              onChange={(e) => setSphereR(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          {/* Plane params */}
          <div className="space-y-3 pt-3 border-t border-sky-200">
            <span className="text-xs text-amber-700 font-bold block">
              Mặt phẳng: <MathView math={`${aPlane}x + ${bPlane}y + ${cPlane}z + (${dPlane}) = 0`} />
            </span>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Hệ số D (Vị trí):</span>
                <span className="text-amber-700 font-bold">{dPlane}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={dPlane}
                onChange={(e) => setDPlane(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-sky-200 text-xs text-slate-700 shadow-2xs">
            💡 <strong>Quy tắc tương giao:</strong> Khoảng cách từ tâm O đến mặt phẳng là{' '}
            <MathView math="d(O, \alpha) = \frac{|D|}{\sqrt{A^2+B^2+C^2}}" />. Nếu <MathView math="d < R" /> mặt phẳng cắt mặt cầu theo đường tròn thiết diện!
          </div>
        </div>
      </div>
    </div>
  );
}
