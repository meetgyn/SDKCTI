
import React, { useState, useRef } from 'react';
import { 
  Key, ShieldAlert, Lock, Search, Filter, Download, 
  ExternalLink, Activity, Upload, Trash2, CheckCircle, 
  Eye, X, Loader2, ShieldCheck, AlertCircle, Shield, Globe
} from 'lucide-react';

interface LeakEntry {
  id: string;
  date: string;
  targetUrl: string;
  username: string;
  password: string;
  leakSource: string;
  complexity: 'High' | 'Medium' | 'Low';
  status: 'Critical' | 'Pending' | 'Validated' | 'Mitigated';
}

const initialLeaks: LeakEntry[] = [
  { 
    id: '1', 
    date: '2024-05-24 14:12', 
    targetUrl: 'https://painel.empresa-cliente.com.br/admin', 
    username: 'admin_master', 
    password: 'Password123!', 
    leakSource: 'Redline Stealer', 
    complexity: 'Medium', 
    status: 'Validated' 
  },
  { 
    id: '2', 
    date: '2024-05-23 09:45', 
    targetUrl: 'https://outlook.office365.com/mail', 
    username: 'm.ferreira@corp.com', 
    password: '123456', 
    leakSource: 'Vidar Logs', 
    complexity: 'Low', 
    status: 'Pending' 
  },
  { 
    id: '3', 
    date: '2024-05-22 18:22', 
    targetUrl: 'https://aws.amazon.com/console', 
    username: 'cloud_architect_dev', 
    password: 'Admin@2024!Complex', 
    leakSource: 'Raccoon v2', 
    complexity: 'High', 
    status: 'Critical' 
  },
  { 
    id: '4', 
    date: '2024-05-20 11:30', 
    targetUrl: 'https://vpn.empresa-cliente.com.br', 
    username: 'diretor_comercial', 
    password: 'summer2023', 
    leakSource: 'Lumni Stealer', 
    complexity: 'Medium', 
    status: 'Validated' 
  },
];

export const PasswordLeaksView: React.FC = () => {
  const [leaks, setLeaks] = useState<LeakEntry[]>(initialLeaks);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLeak, setSelectedLeak] = useState<LeakEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulação de parsing de arquivo tático (CSV/TXT)
    setTimeout(() => {
      const newLeak: LeakEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        targetUrl: 'https://captured-target.com/login',
        username: 'parsed_user',
        password: 'SecretPassword***',
        leakSource: 'Manual Upload (' + file.name + ')',
        complexity: 'High',
        status: 'Pending'
      };
      setLeaks([newLeak, ...leaks]);
      setIsUploading(false);
    }, 1500);
  };

  const handleResolve = (id: string) => {
    setLeaks(leaks.map(l => l.id === id ? { ...l, status: 'Mitigated' } : l));
  };

  const handleDelete = (id: string) => {
    setLeaks(leaks.filter(l => l.id !== id));
  };

  const filteredLeaks = leaks.filter(l => 
    l.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.leakSource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Lock className="text-soc-primary" /> StackPass™ Leak Intel
          </h1>
          <p className="text-sm text-gray-500">Monitoramento de exposição de credenciais corporativas capturadas por Infostealers.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".csv,.txt"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-soc-primary text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-soc-primary/80 transition-all shadow-lg shadow-soc-primary/20 disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {isUploading ? 'Parsing Logs...' : 'Upload Infostealer Logs'}
          </button>
          <button className="px-4 py-2 bg-soc-danger/10 text-soc-danger border border-soc-danger/20 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-soc-danger/20 transition-all">
            <ShieldAlert size={18} /> High Risk URLs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-soc-card border border-soc-border p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-soc-danger/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
            <ShieldAlert size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-soc-primary/10 rounded-lg text-soc-primary"><Key size={20} /></div>
            <h3 className="font-bold text-gray-100 uppercase text-xs tracking-widest">Exposed Credentials</h3>
          </div>
          <p className="text-4xl font-black text-white">{leaks.length}</p>
          <div className="mt-2 flex items-center gap-1 text-soc-danger text-xs font-bold bg-soc-danger/10 w-fit px-2 py-0.5 rounded">
            <Activity size={12} /> Live Exposure
          </div>
        </div>
        <div className="bg-soc-card border border-soc-border p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-soc-warning/10 rounded-lg text-soc-warning"><Globe size={20} /></div>
            <h3 className="font-bold text-gray-100 uppercase text-xs tracking-widest">Target Domains</h3>
          </div>
          <p className="text-4xl font-black text-white">{new Set(leaks.map(l => new URL(l.targetUrl).hostname)).size}</p>
          <p className="text-xs text-gray-500 mt-2 font-mono">Top: microsoft.com, aws.com</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-soc-success/10 rounded-lg text-soc-success"><ShieldCheck size={20} /></div>
            <h3 className="font-bold text-gray-100 uppercase text-xs tracking-widest">Remediated</h3>
          </div>
          <p className="text-4xl font-black text-white">{leaks.filter(l => l.status === 'Mitigated').length}</p>
          <p className="text-xs text-gray-500 mt-2">Compliance: 88% Recovery</p>
        </div>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-soc-border bg-gray-900/30 flex items-center justify-between">
           <h3 className="font-bold text-white flex items-center gap-2">
             <Activity size={18} className="text-soc-primary" /> Infostealer Intelligence Feed
           </h3>
           <div className="flex gap-2">
             <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-soc-primary" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by URL, user or source..." 
                  className="bg-soc-bg border border-soc-border rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-soc-primary w-64 text-white transition-all" 
                />
             </div>
             <button className="p-2 bg-gray-900 border border-soc-border rounded-xl text-gray-400 hover:text-white transition-all"><Filter size={16} /></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-soc-border">
                <th className="px-6 py-5">Detection Date</th>
                <th className="px-6 py-5">Target URL</th>
                <th className="px-6 py-5">Username</th>
                <th className="px-6 py-5">Password</th>
                <th className="px-6 py-5">Leak Source</th>
                <th className="px-6 py-5">Strength</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-border">
              {filteredLeaks.map((leak) => (
                <tr key={leak.id} className="hover:bg-gray-800/10 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{leak.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-800 rounded-lg text-soc-primary group-hover:text-white transition-colors">
                        <Globe size={14} />
                      </div>
                      <span className="text-xs font-mono text-gray-300 max-w-[180px] truncate" title={leak.targetUrl}>
                        {leak.targetUrl}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-100">{leak.username}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[11px] bg-black/40 px-2 py-1 rounded text-soc-accent font-mono border border-soc-accent/20 group-hover:bg-soc-accent/5">
                      {leak.password}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400 bg-soc-bg px-2 py-1 rounded-lg border border-soc-border font-bold">
                      {leak.leakSource}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`w-3 h-1.5 rounded-full transition-all duration-500 ${
                            leak.complexity === 'High' ? 'bg-soc-success' :
                            leak.complexity === 'Medium' ? (i <= 2 ? 'bg-soc-warning' : 'bg-gray-800') :
                            (i === 1 ? 'bg-soc-danger' : 'bg-gray-800')
                          }`}></div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                      leak.status === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      leak.status === 'Mitigated' ? 'bg-soc-success/10 text-soc-success border-soc-success/20' :
                      leak.status === 'Validated' ? 'bg-soc-primary/10 text-soc-primary border-soc-primary/20' :
                      'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                      {leak.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button 
                        onClick={() => setSelectedLeak(leak)}
                        className="p-2 bg-gray-900 border border-soc-border text-gray-400 hover:text-white hover:border-soc-primary rounded-xl transition-all"
                        title="View Intelligence Detail"
                      >
                        <Eye size={16} />
                      </button>
                      {leak.status !== 'Mitigated' && (
                        <button 
                          onClick={() => handleResolve(leak.id)}
                          className="p-2 bg-gray-900 border border-soc-border text-gray-400 hover:text-soc-success hover:border-soc-success rounded-xl transition-all"
                          title="Mark as Resolved"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(leak.id)}
                        className="p-2 bg-gray-900 border border-soc-border text-gray-400 hover:text-soc-danger hover:border-soc-danger rounded-xl transition-all"
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeaks.length === 0 && (
            <div className="py-20 text-center text-gray-500 italic">
               No intelligence found matching the criteria.
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedLeak && (
        <div className="fixed inset-0 z-[110] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-soc-card border border-soc-border rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
             <div className="p-6 border-b border-soc-border flex justify-between items-center bg-gray-900/40">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-soc-primary/10 rounded-2xl text-soc-primary border border-soc-primary/20">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Infostealer Dossiê</h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">ID: {selectedLeak.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLeak(null)} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-all">
                  <X size={24} />
                </button>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="bg-soc-bg border border-soc-border rounded-2xl p-5 space-y-4">
                   <div className="flex flex-col gap-1 pb-3 border-b border-soc-border">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Target URL / Host</span>
                      <span className="text-sm font-mono text-white break-all">{selectedLeak.targetUrl}</span>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-soc-border">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Username</span>
                      <span className="text-sm font-bold text-white">{selectedLeak.username}</span>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-soc-border">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Password</span>
                      <span className="text-sm font-mono text-soc-accent bg-soc-accent/10 px-2 py-0.5 rounded border border-soc-accent/20">
                        {selectedLeak.password}
                      </span>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-soc-border">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Malware Source</span>
                      <span className="text-sm text-gray-300 font-bold">{selectedLeak.leakSource}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Detection Date</span>
                      <span className="text-xs text-gray-400 font-mono">{selectedLeak.date}</span>
                   </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                     <AlertCircle size={14} className="text-soc-warning" /> Tactical Remediation
                   </h4>
                   <div className="bg-soc-primary/5 border border-soc-primary/20 rounded-xl p-4 text-sm text-gray-400 leading-relaxed italic">
                     "Revogar sessões ativas para o usuário {selectedLeak.username}. Forçar reset de senha em {new URL(selectedLeak.targetUrl).hostname}. Iniciar varredura de malware no endpoint de origem se identificado."
                   </div>
                </div>
             </div>

             <div className="p-6 bg-gray-900/30 border-t border-soc-border flex gap-3">
                <button 
                  onClick={() => { handleResolve(selectedLeak.id); setSelectedLeak(null); }}
                  className="flex-1 bg-soc-success text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-soc-success/20 hover:scale-[1.02] transition-all"
                >
                  <ShieldCheck size={18} /> Resolve & Revoke
                </button>
                <button 
                  onClick={() => setSelectedLeak(null)}
                  className="px-8 py-3 bg-gray-800 text-gray-400 rounded-2xl font-bold hover:bg-gray-700 transition-all"
                >
                  Dismiss
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
