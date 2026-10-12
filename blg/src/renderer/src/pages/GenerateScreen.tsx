import { useState } from 'react';
import { Play, Download, Copy, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useLayoutStore } from '../stores/layoutStore';

export default function GenerateScreen() {
  const { metadata, schemas, outputs, isGenerating, options, setOptions, setIsGenerating, setOutputs } = useLayoutStore();
  const [activeTab, setActiveTab] = useState('createTable');
  const [copied, setCopied] = useState(false);

  const outputTabs = [
    { id: 'createTable', label: 'CREATE TABLE' },
    { id: 'foreignKeys', label: 'Foreign Keys' },
    { id: 'indexes', label: 'Indexes' },
    { id: 'storedProcedures', label: 'Stored Procedures' },
    { id: 'selectQueries', label: 'SELECT Queries' },
    { id: 'insertScripts', label: 'INSERT Scripts' },
    { id: 'dataSourceXml', label: 'DataSource XML' },
    { id: 'layoutXml', label: 'Layout XML' },
    { id: 'metadataJson', label: 'Metadata' },
  ];

  const handleGenerate = async () => {
    if (!metadata || schemas.length === 0) return;
    setIsGenerating(true);
    try {
      const nl = String.fromCharCode(10);
      const mockOutputs = {
        createTable: schemas.map((s) => {
          const cols = s.columns.map((c) => {
            const nullable = c.nullable ? 'NULL' : 'NOT NULL';
            const identity = c.isIdentity ? ' IDENTITY(1,1)' : '';
            return '  [' + c.name + '] ' + c.dataType.toUpperCase() + identity + ' ' + nullable;
          }).join(nl);
          return 'CREATE TABLE [' + s.tableName + '] (' + nl + cols + nl + ');';
        }).join(nl + 'GO' + nl + nl),
        foreignKeys: schemas.flatMap((s) =>
          s.foreignKeys.map((fk) =>
            'ALTER TABLE [' + s.tableName + '] ADD CONSTRAINT [' + fk.name + '] FOREIGN KEY ([' + fk.columns.join('], [') + ']) REFERENCES [' + fk.targetTable + '];'
          )
        ).join(nl),
        indexes: '-- Index generation',
        insertScripts: '-- INSERT scripts',
        updateScripts: '-- UPDATE scripts',
        deleteScripts: '-- DELETE scripts',
        selectQueries: '-- SELECT queries',
        storedProcedures: '-- Stored procedures',
        views: '',
        triggers: '',
        dataSourceXml: '<DataSource><!-- Generated --></DataSource>',
        layoutXml: '<root><!-- Generated --></root>',
        metadataJson: JSON.stringify(metadata, null, 2),
      };
      setOutputs(mockOutputs);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputs) return;
    navigator.clipboard.writeText(outputs[activeTab as keyof typeof outputs] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Generate Output</h2>
          <p className="text-sm text-gray-400">
            {metadata ? 'Layout: ' + metadata.layoutName : 'No layout selected'}
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !metadata}
          className="btn-primary flex items-center gap-2"
        >
          {isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Generate
        </button>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold mb-3">Options</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'includeAuditColumns', label: 'Audit Columns' },
            { key: 'includeSeedData', label: 'Seed Data' },
            { key: 'includeViews', label: 'Views' },
            { key: 'includeTriggers', label: 'Triggers' },
            { key: 'includeIndexes', label: 'Indexes' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(options as any)[key]}
                onChange={(e) => setOptions({ [key]: e.target.checked })}
                className="rounded border-gray-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {outputs && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1 overflow-x-auto">
              {outputTabs.filter((t) => (outputs as any)[t.id]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={"px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors " +
                    (activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-surface-hover')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button onClick={copyToClipboard} className="btn-ghost flex items-center gap-1 text-xs">
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="bg-surface rounded-lg p-4 overflow-auto max-h-[400px] text-sm text-gray-300 font-mono">
            {(outputs as any)[activeTab] || 'No output'}
          </pre>
        </div>
      )}

      {!outputs && !isGenerating && (
        <div className="card text-center py-12 text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a layout and click Generate to start.</p>
        </div>
      )}
    </div>
  );
}
