/**
 * MÁY TÍNH VẬT LÍ & BỘ CHUYỂN ĐỔI ĐƠN VỊ THPT
 */

const CONSTANTS_DATA = [
  { name: "Tốc độ ánh sáng trong chân không", symbol: "c", value: "3.00 × 10⁸", unit: "m/s", desc: "Giới hạn tốc độ trong vũ trụ" },
  { name: "Hằng số Planck", symbol: "h", value: "6.626 × 10⁻³⁴", unit: "J·s", desc: "Lượng tử ánh sáng E = h·f" },
  { name: "Điện tích nguyên tố", symbol: "e", value: "1.602 × 10⁻¹⁹", unit: "C", desc: "Độ lớn điện tích electron & proton" },
  { name: "Khối lượng electron", symbol: "mₑ", value: "9.109 × 10⁻³¹", unit: "kg", desc: "Khối lượng nghỉ của electron" },
  { name: "Khối lượng proton", symbol: "mₚ", value: "1.673 × 10⁻²⁷", unit: "kg", desc: "≈ 1.007276 u" },
  { name: "Khối lượng neutron", symbol: "mₙ", value: "1.675 × 10⁻²⁷", unit: "kg", desc: "≈ 1.008665 u" },
  { name: "Hằng số khí lí tưởng", symbol: "R", value: "8.314", unit: "J/(mol·K)", desc: "Trong phương trình pV = nRT" },
  { name: "Số Avogadro", symbol: "N_A", value: "6.022 × 10²³", unit: "mol⁻¹", desc: "Số hạt trong 1 mol chất" },
  { name: "Hằng số hấp dẫn", symbol: "G", value: "6.674 × 10⁻¹¹", unit: "N·m²/kg²", desc: "Định luật vạn vật hấp dẫn" },
  { name: "Gia tốc trọng trường chuẩn", symbol: "g", value: "9.80665", unit: "m/s²", desc: "Thường lấy 9.8 hoặc 10 trong bài thi" }
];

const PhysicsCalculator = {
  // 1. Tính dao động con lắc lò xo
  calcSpring(m, k, A) {
    if (m <= 0 || k <= 0) return null;
    const omega = Math.sqrt(k / m);
    const T = (2 * Math.PI) / omega;
    const f = 1 / T;
    const W = 0.5 * k * Math.pow(A / 100, 2); // A đổi sang mét
    const vmax = omega * (A / 100);
    const amax = omega * omega * (A / 100);

    return {
      omega: omega.toFixed(2),
      T: T.toFixed(3),
      f: f.toFixed(2),
      W: W.toFixed(4),
      vmax: vmax.toFixed(3),
      amax: amax.toFixed(2)
    };
  },

  // 2. Tính rơi tự do
  calcFreeFall(h, g) {
    if (h < 0 || g <= 0) return null;
    const t = Math.sqrt((2 * h) / g);
    const v = Math.sqrt(2 * g * h);
    return {
      t: t.toFixed(2),
      v: v.toFixed(2)
    };
  },

  // 3. Tính phóng xạ
  calcRadioactive(m0, T, t) {
    if (m0 <= 0 || T <= 0 || t < 0) return null;
    const remaining = m0 * Math.pow(2, -t / T);
    const decayed = m0 - remaining;
    const percent = (remaining / m0) * 100;
    return {
      remaining: remaining.toFixed(3),
      decayed: decayed.toFixed(3),
      percent: percent.toFixed(1)
    };
  },

  // 4. Tính khí lí tưởng
  calcGasState(p1, V1, T1, p2, V2, T2, solveFor) {
    // p1*V1 / T1 = p2*V2 / T2
    // solveFor: 'p2', 'V2', 'T2'
    if (solveFor === 'p2') {
      if (V2 <= 0 || T1 <= 0) return null;
      const res = (p1 * V1 * T2) / (T1 * V2);
      return res.toFixed(2);
    } else if (solveFor === 'V2') {
      if (p2 <= 0 || T1 <= 0) return null;
      const res = (p1 * V1 * T2) / (p2 * T1);
      return res.toFixed(2);
    } else if (solveFor === 'T2') {
      if (p1 * V1 <= 0) return null;
      const res = (p2 * V2 * T1) / (p1 * V1);
      return res.toFixed(1);
    }
    return null;
  },

  // 5. Chuyển đổi đơn vị
  convertUnit(val, type, from, to) {
    val = parseFloat(val);
    if (isNaN(val)) return 0;

    if (type === 'speed') {
      // chuẩn là m/s
      let inMS = val;
      if (from === 'kmh') inMS = val / 3.6;
      if (to === 'ms') return inMS;
      if (to === 'kmh') return inMS * 3.6;
    }

    if (type === 'temp') {
      // chuẩn là K
      let inK = val;
      if (from === 'c') inK = val + 273.15;
      if (from === 'f') inK = (val - 32) * (5 / 9) + 273.15;

      if (to === 'c') return inK - 273.15;
      if (to === 'k') return inK;
      if (to === 'f') return (inK - 273.15) * (9 / 5) + 32;
    }

    if (type === 'energy') {
      // chuẩn là Joule (J)
      let inJ = val;
      if (from === 'kj') inJ = val * 1000;
      if (from === 'ev') inJ = val * 1.602e-19;
      if (from === 'mev') inJ = val * 1.602e-13;
      if (from === 'cal') inJ = val * 4.184;

      if (to === 'j') return inJ;
      if (to === 'kj') return inJ / 1000;
      if (to === 'ev') return inJ / 1.602e-19;
      if (to === 'mev') return inJ / 1.602e-13;
      if (to === 'cal') return inJ / 4.184;
    }

    if (type === 'pressure') {
      // chuẩn là Pa
      let inPa = val;
      if (from === 'atm') inPa = val * 101325;
      if (from === 'mmhg') inPa = val * 133.322;
      if (from === 'bar') inPa = val * 100000;

      if (to === 'pa') return inPa;
      if (to === 'atm') return inPa / 101325;
      if (to === 'mmhg') return inPa / 133.322;
      if (to === 'bar') return inPa / 100000;
    }

    return val;
  }
};

window.PhysicsCalculator = PhysicsCalculator;
window.CONSTANTS_DATA = CONSTANTS_DATA;
