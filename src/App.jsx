import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeroBanner from './components/HeroBanner';
import Part1Calculus from './components/parts/Part1Calculus';
import Part2Geometry from './components/parts/Part2Geometry';
import Part3Derivative from './components/parts/Part3Derivative';
import Part4Probability from './components/parts/Part4Probability';
import Footer from './components/Footer';
import DeploymentGuideModal from './components/DeploymentGuideModal';

export default function App() {
  const [activeModule, setActiveModule] = useState('part1');
  const [part1SubTab, setPart1SubTab] = useState('3d-solid');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const handleSelectModule = (modId) => {
    setActiveModule(modId);
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPart1SubTab = (subId) => {
    setActiveModule('part1');
    setPart1SubTab(subId);
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-800 flex selection:bg-blue-500 selection:text-white">
      {/* Left Sidebar Menu */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        part1SubTab={part1SubTab}
        onSelectPart1SubTab={handleSelectPart1SubTab}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Content Area on the right */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-72 pt-16 lg:pt-0">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Top Hero Banner & Quick Cards */}
          <HeroBanner onSelectModule={handleSelectModule} />

          {/* Dynamic Module Content View */}
          <section id="module-content" className="scroll-mt-20">
            {activeModule === 'part1' && (
              <Part1Calculus 
                activeSubTab={part1SubTab} 
                onSelectSubTab={setPart1SubTab} 
              />
            )}
            {activeModule === 'part2' && <Part2Geometry />}
            {activeModule === 'part3' && <Part3Derivative />}
            {activeModule === 'part4' && <Part4Probability />}
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
    </div>
  );
}
