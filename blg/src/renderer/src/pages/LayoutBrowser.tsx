import { useState } from 'react';
import { Search, Filter, FileCode, ArrowRight } from 'lucide-react';
import { useLayoutStore } from '../stores/layoutStore';

export default function LayoutBrowser() {
  const { layouts, searchQuery, setSearchQuery, filterType, setFilterType, selectLayout } = useLayoutStore();
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = layouts.filter((l: any) => {
    const matchesSearch = !searchQuery || l.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || l.layoutType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input w-full pl-10"
            placeholder="Search layouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="input w-48"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Explorer">Explorer</option>
          <option value="Editor">Editor</option>
          <option value="Report">Report</option>
        </select>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Layouts ({filtered.length})</h3>
          {selected && (
            <button
              onClick={() => selectLayout(filtered.find((l: any) => l.fileName === selected))}
              className="btn-primary flex items-center gap-2"
            >
              Select <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No layouts found. Connect to a database and load layouts.</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[500px] overflow-auto">
            {filtered.map((layout: any) => (
              <div
                key={layout.fileName}
                onClick={() => setSelected(layout.fileName)}
                className={
                  'p-3 rounded-lg cursor-pointer transition-colors ' +
                  (selected === layout.fileName
                    ? 'bg-primary/20 border border-primary/50'
                    : 'hover:bg-surface-hover')
                }
              >
                <div className="flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{layout.displayName}</p>
                    <p className="text-xs text-gray-400">{layout.fileName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
