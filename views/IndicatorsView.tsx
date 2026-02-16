
import React, { useState, useMemo } from 'react';
import { 
  Target, Search, Filter, Download, Plus, Trash2, Shield, Globe, 
  Terminal, FileCode, Mail, X, Activity, CheckCircle2, ExternalLink, 
  Zap, BarChart3, ShieldAlert, Loader2, Save, Globe2, ShieldCheck
} from 'lucide-react';
import { IOCType, Severity } from '../types';

interface IOCEntry {
  id: string;
  value: string;
  type: IOCType;
  confidence: number;
  status: 'Active' | 'Revoked' | 'Inactive';
  lastSeen: string;
  tags: string[];
  reputationScore?: number;
  associatedActor?: string;
  location?: string;
  description?: string;
}

const initialIOCs: IOCEntry[] = [
  { 
    id: '1', 
    value: '185.220.101.45', 
    type: IOCType.IP, 
    confidence: 98, 
    status: 'Active', 
    lastSeen: '2024-05-24 10:22', 
    tags: ['APT28', 'VPN'],
    reputationScore: 94,
    associatedActor: 'Fancy Bear',
    location: 'Russia, Moscow',
    description: 'Known C2 server for X-Agent implant communications.'
  },
  { 
    id: '2', 
    value: 'update-service-win.org', 
    type: IOCType.DOMAIN, 
    confidence: 85, 
    status: 'Active', 
    lastSeen: '2024-05-23 15:45', 
    tags: ['Phishing', 'Malware'],
    reputationScore: 82,
    associatedActor: 'Lazarus Group',
    location: 'Hosted on Cloudflare',
    description: 'Malicious domain used for credential harvesting targeting financial sector.'
  },
  { 
    id: '3', 
    value: 'a90e4f3a90c238b1d4e5f...', 
    type: IOCType.HASH, 
    confidence: 100, 
    status: 'Active', 
    lastSeen: '2024-05-22 09:12', 
    tags: ['LockBit', 'Ransomware'],
    reputationScore: 100,
    associatedActor: 'Wizard Spider',
    description: 'SHA-256 hash of a Ryuk ransomware variant detected in the wild.'
  },
  { 
    id: '4', 
    value: 'attacker@proton.me', 
    type: IOCType.EMAIL, 
    confidence: 75, 
    status: 'Revoked', 
    lastSeen: '2024-04-15 12:00', 
    tags: ['Contact'],
    reputationScore: 45,
    description: 'Email used in spear-phishing campaigns in late 2024.'
  },
  { 
    id: '5', 
    value: 'https://cdn-files-cdn.ru/sh.exe', 
    type: IOCType.URL, 
    confidence: 92, 
    status: 'Active', 
    lastSeen: '2024-05-24 11:30', 
    tags: ['Payload', 'C2'],
    reputationScore: 88,
    location: 'St. Petersburg, RU',
    description: 'Stage 2 payload delivery URL.'
  },
];

const TypeIcon = ({ type }: { type: IOCType }) => {
  switch (type) {
    case IOCType.IP: return <Globe2 size={16} />;
    case IOCType.DOMAIN: return <Shield size={16} />;
    case IOCType.HASH: return <Terminal size={16} />;
    case IOCType.URL: return <FileCode size={16} />;
    case IOCType.EMAIL: return <Mail size={16} />;
    default: return <Target size={16} />;
  }
};

export const IndicatorsView: React.FC = () => {
  const [iocs, setIocs] = useState<IOCEntry[]>(initialIOCs);
  const [filter, setFilter] = useState('');
  const [selectedIOC, setSelectedIOC] = useState<IOCEntry | null>(null);
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  
  // Form State
  const [newIOC, setNewIOC] = useState<Partial<IOCEntry>>({
    type: IOCType.IP,
    status: 'Active',
    confidence: 80,
    tags: []
  });

  const filteredIOCs = useMemo(() => {
    return iocs.filter(ioc => 
      ioc.value.toLowerCase().includes(filter.toLowerCase()) ||
      ioc.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [filter, iocs]);

  const handleExportCSV = () => {
    setIsExporting(true);
    const headers = ['Value', 'Type', 'Confidence', 'Status', 'LastSeen', 'Tags'];
    const csvRows = [
      headers.join(','),
      ...iocs.map(ioc => `"${ioc.value}","${ioc.type}",${ioc.confidence},"${ioc.status}","${ioc.lastSeen}","${ioc.tags.join(';')}"`)
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sentinel_iocs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsExporting(false), 800);
  };

  const handleAddIOC = () => {
    if (!newIOC.value) return;
    const entry: IOCEntry = {
      id: Date.now().toString(),
      value: newIOC.value,
      type: newIOC.type as IOCType,
      confidence: newIOC.confidence || 50,
      status: newIOC.status as any || 'Active',
      lastSeen: new Date().toISOString().replace('T', ' ').split('.')[0],
      tags: newIOC.tags || [],
      reputationScore: 0,
      description: newIOC.description || 'Manually added via console.'
    };
    setIocs([entry, ...iocs]);
    setIsAddingModalOpen(false);
    setNewIOC({ type: IOCType.IP, status: 'Active', confidence: 80 });
  };

  const handleVTScan = (value: string, type: IOCType) => {
    let url = `https://www.virustotal.com/gui/search/${encodeURIComponent(value)}`;
    if (type === IOCType.IP) url = `https://www.virustotal.com/gui/ip-address/${value}`;
    if (type === IOCType.DOMAIN) url = `https://www.virustotal.com/gui/domain/${value}`;
    if (type === IOCType.HASH) url = `https://www.virustotal.com/gui/file/${value}`;
    window.open(url, '_blank');
  };

  const handleWhois = (value: string) => {
    const url = `https://www.whois.com/whois/${encodeURIComponent(value)}`;
    window.open(url, '_blank');
  };

  const handleFeedSource = (value: string) => {
    const url = `https://otx.alienvault.com/indicator/${selectedIOC?.type.toLowerCase()}/${encodeURIComponent(value)}`;
    window.open(url, '_blank');
  };

  const handleValidateIOC = async () => {
    setIsValidating(true);
    setValidationSuccess(false);
    
    // Simulação de checagem contra motores de reputação internos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsValidating(false);
    setValidationSuccess(true);
    
    // Auto-dismiss feedback
    setTimeout(() => setValidationSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="text-soc-primary" /> Indicator Management (IOCs)
          </h1>
          <p className="text-sm text-gray-500">Manage, validate and enrich indicators of compromise across the ecosystem.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-bold transition-all border border-soc-border disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button 
            onClick={() => setIsAddingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-soc-primary hover:bg-soc-primary/80 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-soc-primary/20"
          >
            <Plus size={18} /> New Indicator
          </button>
        </div>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-xl shadow-xl">
        <div className="p-4 border-b border-soc-border flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by value, tag, or type..." 
              className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-soc-primary text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none">
              <option>All Types</option>
              <option>IP</option>
              <option>Domain</option>
              <option>Hash</option>
            </select>
            <button className="px-3 py-2 bg-gray-800 border border-soc-border rounded-lg hover:bg-gray-700 transition-colors">
              <Filter size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-soc-border">
                <th className="px-6 py-5">Indicator</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Confidence</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Tags</th>
                <th className="px-6 py-5">Last Seen</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-border">
              {filteredIOCs.map((ioc) => (
                <tr 
                  key={ioc.id} 
                  onClick={() => setSelectedIOC(ioc)}
                  className="hover:bg-gray-800/20 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded bg-soc-bg border border-soc-border transition-colors group-hover:border-soc-primary/30 ${ioc.status === 'Revoked' ? 'opacity-50' : ''}`}>
                        <TypeIcon type={ioc.type} />
                      </div>
                      <span className="font-mono text-sm text-gray-200 font-bold group-hover:text-soc-primary transition-colors">{ioc.value}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{ioc.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[100px] h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${ioc.confidence > 90 ? 'bg-soc-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]' : ioc.confidence > 70 ? 'bg-soc-warning' : 'bg-soc-primary'}`} 
                        style={{ width: `${ioc.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 inline-block font-bold">{ioc.confidence}% Confidence</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                      ioc.status === 'Active' ? 'bg-soc-success/10 text-soc-success border-soc-success/20' : 'bg-gray-800 text-gray-500 border-gray-700'
                    }`}>
                      {ioc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap max-w-[150px]">
                      {ioc.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-900 border border-soc-border text-gray-400 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-gray-500 font-mono">
                    {ioc.lastSeen}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleVTScan(ioc.value, ioc.type); }}
                        className="p-2 hover:bg-soc-primary/10 text-gray-500 hover:text-soc-primary rounded-lg transition-all active:scale-90"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIocs(iocs.filter(i => i.id !== ioc.id)); }}
                        className="p-2 hover:bg-soc-danger/10 text-gray-500 hover:text-soc-danger rounded-lg transition-all active:scale-90"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredIOCs.length === 0 && (
            <div className="py-20 text-center text-gray-600 italic">
               No indicators found matching your query.
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-soc-border flex items-center justify-between text-[11px] text-gray-500 font-bold uppercase tracking-widest bg-gray-900/20">
          <span>Showing {filteredIOCs.length} indicators</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-soc-border hover:bg-gray-800 transition-colors">Previous</button>
            <button className="px-3 py-1 rounded-lg bg-soc-primary text-white">1</button>
            <button className="px-3 py-1 rounded-lg border border-soc-border hover:bg-gray-800 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* MODAL: NEW INDICATOR */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-[110] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <div className="p-6 border-b border-soc-border bg-gray-900/40 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <Plus className="text-soc-primary" /> New Intelligence Entry
                 </h3>
                 <button onClick={() => setIsAddingModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                   <X size={24} />
                 </button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Indicator Value</label>
                    <input 
                      type="text" 
                      value={newIOC.value || ''}
                      onChange={(e) => setNewIOC({...newIOC, value: e.target.value})}
                      placeholder="e.g. 192.168.1.1 or malwaredomain.com"
                      className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-white text-sm focus:ring-1 focus:ring-soc-primary outline-none transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Type</label>
                      <select 
                        value={newIOC.type}
                        onChange={(e) => setNewIOC({...newIOC, type: e.target.value as IOCType})}
                        className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-gray-300 text-sm outline-none"
                      >
                        <option value={IOCType.IP}>IP ADDRESS</option>
                        <option value={IOCType.DOMAIN}>DOMAIN</option>
                        <option value={IOCType.HASH}>HASH (SHA-256)</option>
                        <option value={IOCType.URL}>URL</option>
                        <option value={IOCType.EMAIL}>EMAIL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Confidence %</label>
                      <input 
                        type="number" 
                        value={newIOC.confidence}
                        onChange={(e) => setNewIOC({...newIOC, confidence: parseInt(e.target.value)})}
                        className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-white text-sm outline-none"
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Description / Threat Context</label>
                    <textarea 
                      rows={3}
                      value={newIOC.description || ''}
                      onChange={(e) => setNewIOC({...newIOC, description: e.target.value})}
                      className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-white text-sm outline-none resize-none"
                    />
                 </div>
              </div>
              <div className="p-6 bg-gray-900/30 flex gap-3 border-t border-soc-border">
                <button onClick={() => setIsAddingModalOpen(false)} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-white transition-colors">Discard</button>
                <button 
                  onClick={handleAddIOC}
                  className="flex-1 py-2 bg-soc-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Ingest Indicator
                </button>
              </div>
           </div>
        </div>
      )}

      {/* SIDE PANEL: INDICATOR DETAILS */}
      {selectedIOC && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] transition-opacity"
            onClick={() => !isValidating && setSelectedIOC(null)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-soc-card border-l border-soc-border z-[130] shadow-2xl animate-in slide-in-from-right duration-300 ring-1 ring-white/10">
             <div className="flex flex-col h-full">
                <div className="p-6 border-b border-soc-border bg-gray-900/40 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-soc-primary/10 rounded-2xl text-soc-primary border border-soc-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                         <Target size={28} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white truncate max-w-[250px]">{selectedIOC.value}</h2>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">STIX 2.1 Ref: {selectedIOC.id}</p>
                      </div>
                   </div>
                   {!isValidating && (
                     <button 
                        onClick={() => setSelectedIOC(null)}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-all"
                      >
                        <X size={24} />
                      </button>
                   )}
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                   {/* Summary Section */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-soc-bg border border-soc-border p-4 rounded-2xl flex flex-col items-center">
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Reputation Score</p>
                         <div className="relative w-20 h-20 flex items-center justify-center mt-2">
                           <svg className="w-full h-full transform -rotate-90">
                             <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                             <circle 
                               cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="5" fill="transparent" 
                               className={selectedIOC.reputationScore && selectedIOC.reputationScore > 80 ? 'text-soc-danger' : 'text-soc-primary'} 
                               strokeDasharray={220}
                               strokeDashoffset={220 - (220 * (selectedIOC.reputationScore || 0)) / 100}
                               strokeLinecap="round"
                             />
                           </svg>
                           <span className="absolute text-xl font-black text-white">{selectedIOC.reputationScore}%</span>
                         </div>
                      </div>
                      <div className="bg-soc-bg border border-soc-border p-4 rounded-2xl flex flex-col justify-center gap-4">
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Confidence</p>
                            <p className="text-lg font-black text-white">{selectedIOC.confidence}%</p>
                         </div>
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                            <p className={`text-xs font-black uppercase tracking-widest ${selectedIOC.status === 'Active' ? 'text-soc-success' : 'text-gray-500'}`}>
                              {selectedIOC.status}
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Tactical Intel */}
                   <section className="space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                         <Zap size={18} className="text-soc-primary" /> Tactical Intel & Context
                      </h4>
                      <div className="bg-soc-bg/50 border border-soc-border p-5 rounded-2xl space-y-4 shadow-inner">
                         <div className="flex justify-between items-center border-b border-soc-border/30 pb-3">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Associated Actor</span>
                            <span className="text-sm font-bold text-soc-danger">{selectedIOC.associatedActor || 'N/A'}</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-soc-border/30 pb-3">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Detection Locale</span>
                            <span className="text-sm text-gray-300 font-medium">{selectedIOC.location || 'Unknown'}</span>
                         </div>
                         <div className="pt-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-2 tracking-widest">Dossiê History</span>
                            <p className="text-xs text-gray-400 leading-relaxed italic">
                              "{selectedIOC.description}"
                            </p>
                         </div>
                      </div>
                   </section>

                   {/* Enrichment Actions */}
                   <section className="space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                         <BarChart3 size={18} className="text-soc-accent" /> Intelligence Enrichment
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleVTScan(selectedIOC.value, selectedIOC.type)}
                          className="flex flex-col items-center gap-2 p-4 bg-gray-900 border border-soc-border rounded-xl hover:bg-gray-800 transition-all hover:border-soc-primary/50 group"
                        >
                           <ShieldAlert size={20} className="text-gray-500 group-hover:text-soc-primary" />
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VirusTotal Scan</span>
                        </button>
                        <button 
                          onClick={() => handleWhois(selectedIOC.value)}
                          className="flex flex-col items-center gap-2 p-4 bg-gray-900 border border-soc-border rounded-xl hover:bg-gray-800 transition-all hover:border-soc-accent/50 group"
                        >
                           <Globe size={20} className="text-gray-500 group-hover:text-soc-accent" />
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reverse Whois</span>
                        </button>
                      </div>
                   </section>
                </div>

                <div className="p-8 border-t border-soc-border bg-gray-900/40 flex gap-4">
                   <button 
                    onClick={handleValidateIOC}
                    disabled={isValidating}
                    className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-soc-primary/20 ${
                      validationSuccess ? 'bg-soc-success text-white' : 'bg-soc-primary hover:bg-soc-primary/80 text-white'
                    } disabled:opacity-50`}
                   >
                      {isValidating ? <Loader2 className="animate-spin" size={18} /> : 
                       validationSuccess ? <ShieldCheck size={18} /> : <CheckCircle2 size={18} />}
                      {isValidating ? 'Validating...' : validationSuccess ? 'IOC Verified' : 'Validate IOC'}
                   </button>
                   <button 
                    onClick={() => handleFeedSource(selectedIOC.value)}
                    className="px-6 border border-soc-border hover:bg-gray-800 text-gray-400 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2"
                   >
                      <ExternalLink size={18} /> Feed Source
                   </button>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};
