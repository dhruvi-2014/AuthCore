import React, { useState } from 'react';
import Background3D from './components/Background3D';
import AuthCard from './components/AuthCard';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  // 'landing', 'auth', or 'dashboard'
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden font-sans">
      {/* 3D Background layer - persistant across all views for seamless feel */}
      <Background3D />

      {/* Foreground Content layer */}
      <div className="relative z-10 w-full pointer-events-none">
        {currentView === 'landing' && (
          <LandingPage onViewChange={setCurrentView} />
        )}

        {currentView === 'auth' && (
          <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <button
              onClick={() => setCurrentView('landing')}
              className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors pointer-events-auto z-50"
            >
              ← Back to Home
            </button>
            <AuthCard onViewChange={setCurrentView} />
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <Dashboard onViewChange={setCurrentView} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
