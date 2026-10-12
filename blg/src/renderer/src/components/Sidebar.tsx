import { LayoutDashboard, FileCode, Play, Settings, Database } from 'lucide-react';

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'layouts', label: 'Layouts', icon: FileCode },
  { id: 'generate', label: 'Generate', icon: Play },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }: Props) {
  return (
    <aside className="w-64 bg-surface border-r border-gray-700/50 flex flex-col">
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">BLG</h2>
            <p className="text-xs text-gray-400">Layout Generator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-500 text-center">v0.1.0</p>
      </div>
    </aside>
  );
}
