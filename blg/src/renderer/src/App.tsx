import { useState } from 'react';
import { useLayoutStore } from './stores/layoutStore';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LayoutBrowser from './pages/LayoutBrowser';
import GenerateScreen from './pages/GenerateScreen';
import Settings from './pages/Settings';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const { isConnected } = useLayoutStore();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />;
      case 'layouts': return <LayoutBrowser />;
      case 'generate': return <GenerateScreen />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-gray-700/50 px-6 py-4 flex items-center justify-between bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-white">
            {activePage === 'dashboard' && 'Dashboard'}
            {activePage === 'layouts' && 'Layout Browser'}
            {activePage === 'generate' && 'Generate'}
            {activePage === 'settings' && 'Settings'}
          </h1>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/30 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </header>
        <div className="p-6">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;
