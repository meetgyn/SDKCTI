
import React, { useState, useMemo } from 'react';
import { 
  Target, Search, Download, Plus, Trash2, Shield, 
  Terminal, FileCode, Mail, X, Activity, RefreshCcw, Loader2, Globe2
} from 'lucide-react';
import { IOCType } from '../types';
import { GoogleGenAI } from "@google/genai";

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
  }
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
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [newIOC, setNewIOC] = useState<Partial<IOCEntry>>({
    type: IOCType.IP,
    status: 'Active',
    confidence: 80,
    tags: []
  });

  const handleSyncIOCs = async () => {
    setIsSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Liste 5 indicadores de comprometimento (IPs ou domínios) reais e recentes de ataques cibernéticos globais de 2024. Forneça apenas o valor e o tipo.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      console.log("AI Indicators sync result:", response.text);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredIOCs = useMemo(() => {
    return iocs.filter(ioc => 
      ioc.value.toLowerCase().includes(filter.toLowerCase()) ||
      ioc.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [filter, iocs]);

  const handleAddIOC = () => {
    if (!newIOC.value) return;
    const entry: IOCEntry = {
      id: Date.now().toString(),
      value: newIOC.value,
      type: newIOC.type as IOCType,
      confidence: newIOC.confidence || 50,
      status: 'Active',
      lastSeen: new Date().toISOString().replace('T', ' ').split('.')[0],
      tags: newIOC.tags || [],
      description: newIOC.description || 'Manualmente adicionado.'
    };
    setIocs([entry, ...iocs]);
    setIsAddingModalOpen(false);
    setNewIOC({ type: IOCType.IP, status: 'Active', confidence: 80 });
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="text-soc-primary" /> Indicator Management
          </h1>
          <p className="text-sm text-gray-500">Gestão de indicadores (IOCs) enriquecidos via IA.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSyncIOCs}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-soc-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-accent/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
            {isSyncing ? 'Sincronizando...' : 'Sync via AI'}
          </button>
          <button 
            onClick={() => setIsAddingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-soc-primary text-white rounded-lg text-sm font-bold transition-all"
          >
            <Plus size={18} /> New IOC
          </button>
        </div>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-xl shadow-xl">
        <div className="p-4 border-b border-soc-border flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search indicators..." 
              className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-soc-primary text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-soc-border">
                <th className="px-6 py-4">Indicator</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-border">
              {filteredIOCs.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-gray-800/20 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-soc-bg border border-soc-border rounded text-gray-400 group-hover:text-soc-primary">
                        <TypeIcon type={ioc.type} />
                      </div>
                      <span className="font-mono text-sm text-gray-200 group-hover:text-soc-primary">{ioc.value}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">{ioc.type}</td>
                  <td className="px-6 py-4 text-xs text-white">{ioc.confidence}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${ioc.status === 'Active' ? 'bg-soc-success/10 text-soc-success border-soc-success/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{ioc.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-soc-danger/10 text-gray-500 hover:text-soc-danger rounded-lg"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddingModalOpen && (
        <div className="fixed inset-0 z-[110] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden text-left">
              <div className="p-6 border-b border-soc-border bg-gray-900/40 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white">Ingest New Indicator</h3>
                 <button onClick={() => setIsAddingModalOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Value</label>
                    <input type="text" value={newIOC.value || ''} onChange={(e) => setNewIOC({...newIOC, value: e.target.value})} className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-white text-sm outline-none" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Type</label>
                      <select value={newIOC.type} onChange={(e) => setNewIOC({...newIOC, type: e.target.value as IOCType})} className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-gray-300 text-sm outline-none">
                        <option value={IOCType.IP}>IP</option>
                        <option value={IOCType.DOMAIN}>DOMAIN</option>
                        <option value={IOCType.HASH}>HASH</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Confidence</label>
                      <input type="number" value={newIOC.confidence} onChange={(e) => setNewIOC({...newIOC, confidence: parseInt(e.target.value)})} className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-white text-sm outline-none" />
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-gray-900/30 flex gap-3 border-t border-soc-border">
                <button onClick={() => setIsAddingModalOpen(false)} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-white">Discard</button>
                <button onClick={handleAddIOC} className="flex-1 py-2 bg-soc-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-primary/20">Save Indicator</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
