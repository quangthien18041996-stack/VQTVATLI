import React, { useState } from 'react';
import { QrCode, Smartphone, Sparkles, ExternalLink, X, Copy, Check, Camera } from 'lucide-react';

export default function ARQRCodeModal({ isOpen, onClose, onLaunchLocalAR, modelId = 'revolution_vase' }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Live URL with query param to auto-launch AR
  const liveUrl = `https://quangthien18041996-stack.github.io/VQTVATLI/?ar=true&model=${modelId}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(liveUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-400/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-400 text-slate-950">
                THỰC TẾ TĂNG CƯỜNG (AR)
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                Quét Mã QR Trải Nghiệm AR Trên Điện Thoại
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-sky-200 shadow-md relative group">
            <img
              src={qrCodeApiUrl}
              alt="Mã QR AR Toán 12"
              className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-blue-600/5 rounded-xl pointer-events-none" />
          </div>

          {/* Quick Instructions */}
          <div className="space-y-1.5 max-w-sm">
            <div className="flex items-center justify-center gap-2 text-slate-800 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Hướng Dẫn 2 Bước Đơn Giản:</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              1. Mở ứng dụng <strong>Camera</strong> hoặc <strong>Zalo</strong> trên điện thoại (iOS / Android).<br />
              2. Hướng camera vào mã QR ở trên để mở ngay mô hình 3D nổi trên bàn học!
            </p>
          </div>

          {/* Direct Link & Copy */}
          <div className="w-full pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={liveUrl}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Chép link'}</span>
            </button>
          </div>
        </div>

        {/* Footer: Or test directly on Laptop Webcam */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 text-center sm:text-left">
            Đang dùng máy tính có Webcam?
          </span>
          <button
            onClick={() => {
              onClose();
              if (onLaunchLocalAR) onLaunchLocalAR();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Mở Camera AR Trực Tiếp Ngay Tại Đây</span>
          </button>
        </div>

      </div>
    </div>
  );
}
