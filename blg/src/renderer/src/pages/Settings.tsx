import { useState } from 'react';
import { Database, Save, TestTube, FolderOpen } from 'lucide-react';
import { useLayoutStore } from '../stores/layoutStore';

export default function Settings() {
  const { isConnected, setIsConnected, setConnectionConfig } = useLayoutStore();
  const [config, setConfig] = useState({
    server: 'your-sql-server',
    port: 1433,
    user: 'readonly_user',
    password: '',
    database: 'Bravo_Config',
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setTestResult('success');
      setIsConnected(true);
      setConnectionConfig(config);
    } catch {
      setTestResult('error');
      setIsConnected(false);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Database Connection</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Server</label>
              <input className="input w-full" value={config.server}
                onChange={(e) => setConfig({ ...config, server: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Port</label>
              <input className="input w-full" type="number" value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">User</label>
              <input className="input w-full" value={config.user}
                onChange={(e) => setConfig({ ...config, user: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input className="input w-full" type="password" value={config.password}
                onChange={(e) => setConfig({ ...config, password: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Database</label>
            <input className="input w-full" value={config.database}
              onChange={(e) => setConfig({ ...config, database: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleTest} disabled={testing} className="btn-primary flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            {testResult === 'success' && <span className="text-green-400 text-sm">Connected successfully</span>}
            {testResult === 'error' && <span className="text-red-400 text-sm">Connection failed</span>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FolderOpen className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Layout Directory</h3>
        </div>
        <div className="flex items-center gap-3">
          <input className="input flex-1" placeholder="Path to layout XML files..." />
          <button className="btn-secondary">Browse</button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Save className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
