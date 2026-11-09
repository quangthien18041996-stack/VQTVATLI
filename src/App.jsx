import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeroBanner from './components/HeroBanner';
import Part2DerivativeAnalysis from './components/parts/Part2DerivativeAnalysis';
import Part1Calculus from './components/parts/Part1Calculus';
import Part2Geometry from './components/parts/Part2Geometry';
import Part4Probability from './components/parts/Part4Probability';
import Footer from './components/Footer';
import DeploymentGuideModal from './components/DeploymentGuideModal';
import CasioGuideModal from './components/CasioGuideModal';
import ARViewerModal from './components/ARViewerModal';
import ARQRCodeModal from './components/ARQRCodeModal';

export default function App() {
  const [activeModule, setActiveModule] = useState('part1');
  const [calculusSubTab, setCalculusSubTab] = useState('3d-solid');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isCasioModalOpen, setIsCasioModalOpen] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isARQRModalOpen, setIsARQRModalOpen] = useState(false);
  const [currentARModelId, setCurrentARModelId] = useState('revolution_vase');

  // Handle URL query parameters for direct AR launch on mobile scan: ?ar=true&model=xyz
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ar') === 'true') {
      const model = params.get('model') || 'revolution_vase';
      setCurrentARModelId(model);
      setIsARModalOpen(true);
    }
  }, []);

  const handleSelectModule = (modId) => {
    setActiveModule(modId);
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCalculusSubTab = (subId) => {
    setActiveModule('part2');
    setCalculusSubTab(subId);
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchAR = (modelId = 'revolution_vase') => {
    setCurrentARModelId(modelId);
    // If on mobile device with touch, launch AR directly. If on desktop, show QR code modal with option to launch webcam.
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      setIsARModalOpen(true);
    } else {
      setIsARQRModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-800 flex selection:bg-blue-500 selection:text-white">
      {/* Left Sidebar Menu */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        calculusSubTab={calculusSubTab}
        onSelectCalculusSubTab={handleSelectCalculusSubTab}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenCasioModal={() => setIsCasioModalOpen(true)}
        onOpenAR={() => handleLaunchAR('revolution_vase')}
      />

      {/* Main Content Area on the right */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-72 pt-16 lg:pt-0">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Top Hero Banner & Quick Cards */}
          <HeroBanner 
            onSelectModule={handleSelectModule} 
            onOpenCasioModal={() => setIsCasioModalOpen(true)}
            onOpenAR={() => handleLaunchAR('revolution_vase')}
          />

          {/* Dynamic Module Content View */}
          <section id="module-content" className="scroll-mt-20">
            {activeModule === 'part1' && (
              <Part2DerivativeAnalysis 
                onOpenCasioModal={() => setIsCasioModalOpen(true)}
                onOpenAR={() => handleLaunchAR('revolution_vase')}
              />
            )}
            {activeModule === 'part2' && (
              <Part1Calculus 
                activeSubTab={calculusSubTab} 
                onSelectSubTab={setCalculusSubTab} 
                onOpenCasioModal={() => setIsCasioModalOpen(true)}
                onOpenAR={() => handleLaunchAR('revolution_vase')}
              />
            )}
            {activeModule === 'part3' && (
              <Part2Geometry 
                onOpenCasioModal={() => setIsCasioModalOpen(true)}
                onOpenAR={() => handleLaunchAR('sphere_plane_cut')}
              />
            )}
            {activeModule === 'part4' && (
              <Part4Probability 
                onOpenCasioModal={() => setIsCasioModalOpen(true)}
                onOpenAR={() => handleLaunchAR('vector_orthogonal')}
              />
            )}
          </section>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Deployment guide modal */}
      <DeploymentGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Casio fx-580VNX & fx-880BTG Guide Modal */}
      <CasioGuideModal
        isOpen={isCasioModalOpen}
        onClose={() => setIsCasioModalOpen(false)}
      />

      {/* AR Camera WebXR Live Modal */}
      <ARViewerModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        initialModelId={currentARModelId}
      />

      {/* AR QR Code Modal for Phone Scanner */}
      <ARQRCodeModal
        isOpen={isARQRModalOpen}
        onClose={() => setIsARQRModalOpen(false)}
        onLaunchLocalAR={() => setIsARModalOpen(true)}
        modelId={currentARModelId}
      />
    </div>
  );
}
