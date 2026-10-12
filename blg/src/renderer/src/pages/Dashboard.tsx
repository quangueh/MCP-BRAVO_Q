import { FileCode, Play, CheckCircle, Clock } from 'lucide-react';
import { useLayoutStore } from '../stores/layoutStore';

interface Props { onNavigate: (page: string) => void; }

export default function Dashboard({ onNavigate }: Props) {
  const { layouts, isConnected } = useLayoutStore();

  const stats = [
    { label: 'Total Layouts', value: layouts.length || '5,917', icon: FileCode, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Connected', value: isConnected ? 'Yes' : 'No', icon: CheckCircle, color: isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/30 text-gray-400' },
    { label: 'Generated', value: '0', icon: Play, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Uptime', value: 'Active', icon: Clock, color: 'bg-yellow-500/20 text-yellow-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={'w-12 h-12 rounded-xl flex items-center justify-center ' + s.color}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => onNavigate('layouts')} className="btn-primary text-left p-4">
            <p className="font-semibold">Browse Layouts</p>
            <p className="text-sm opacity-75">Explore 5,917 layouts</p>
          </button>
          <button onClick={() => onNavigate('generate')} className="btn-primary text-left p-4">
            <p className="font-semibold">Generate</p>
            <p className="text-sm opacity-75">Auto-generate SQL/XML</p>
          </button>
          <button onClick={() => onNavigate('settings')} className="btn-secondary text-left p-4">
            <p className="font-semibold">Settings</p>
            <p className="text-sm opacity-75">Configure connection</p>
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-400 text-sm">No recent activity. Start by connecting to a database and browsing layouts.</p>
      </div>
    </div>
  );
}
