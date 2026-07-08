import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import ECUManager from './pages/ECUManager';
import FaultCodes from './pages/FaultCodes';
import LiveData from './pages/LiveData';
import Reports from './pages/Reports';
import { Menu, X } from 'lucide-react';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'vehicles': return <Vehicles />;
      case 'ecu': return <ECUManager />;
      case 'faults': return <FaultCodes />;
      case 'livedata': return <LiveData />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const mainMarginLeft = isDesktop ? (collapsed ? 72 : 260) : 0;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-secondary border-b border-border z-40 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">⚡</span>
          </div>
          <span className="font-semibold text-sm text-text-primary">OBD-2 Diagnostic</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden fixed left-0 top-0 h-screen z-50"
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              collapsed={false}
              setCollapsed={setCollapsed}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Main Content */}
      <div
        className="min-h-screen pt-14 lg:pt-0 transition-[margin-left] duration-300 ease-in-out"
        style={{ marginLeft: mainMarginLeft }}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
