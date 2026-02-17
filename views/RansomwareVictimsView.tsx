
import React, { useState, useMemo } from 'react';
import { 
  Skull, MapPin, Calendar, Globe, AlertTriangle, ExternalLink, 
  Search, X, FileText, Activity, Loader2, RefreshCcw, Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Victim {
  id: string;
  group: string;
  target: string;
  sector: string;
  country: string;
  date: string;
  status: string;
  summary: string;
  ransomAmount?: string;
  leakedData?: string[];
}

const victimsData: Victim[] = [
  { 
    id: '1', 
    group: 'LockBit 3.0', 
    target: 'Global Logistics Corp', 
    sector: 'Transportation', 
    country: 'Germany', 
    date: '2024-05-24', 
    status: 'Data Published',
    summary: 'Ataque massivo via vulnerabilidade em VPN legada. O grupo exfiltrou mais de 400GB de dados operacionais.',
    ransomAmount: '$2,500,000',
    leakedData: ['Employee PII', 'Financial Statements']
  }
];

export const RansomwareVictimsView: React.FC = () => {
  const [victims, setVictims] = useState<Victim[]>(victimsData);
  const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLiveSync = async () => {
    setIsSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Resuma os 3 anúncios mais recentes de vítimas de ransomware publicados hoje ou ontem em blogs de vazamento.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      console.log("Ransomware Live Sync Result:", response.text);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredVictims = useMemo(() => {
    return victims.filter(v => 
      v.target.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.group.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, victims]);

  return (
    <div className="space-y-6 relative min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Skull className="text-soc-danger" /> Ransomware "Wall of Shame"
          </h1>
          <p className="text-sm text-gray-500">Monitoramento real-time de vítimas publicadas em blogs de extorsão.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleLiveSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-soc-danger text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-danger/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isSyncing ? 'Scanning...' : 'Live AI Scan'}
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search victims/groups..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-soc-card border border-soc-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none text-white w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVictims.map((victim) => (
          <div 
            key={victim.id} 
            onClick={() => setSelectedVictim(victim)}
            className="bg-soc-card border border-soc-border rounded-xl overflow-hidden hover:border-soc-danger/50 transition-all group cursor-pointer"
          >
            <div className="p-4 bg-gray-900/50 border-b border-soc-border flex items-center justify-between">
              <span className="text-xs font-bold text-soc-danger uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} /> {victim.group}
              </span>
            </div>
            <div className="p-5 space-y-4 text-left">
              <h3 className="text-lg font-bold text-gray-100 group-hover:text-soc-primary">{victim.target}</h3>
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={14}/> {victim.country}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {victim.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVictim && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSelectedVictim(null)}></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-soc-card border-l border-soc-border z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-soc-border bg-gray-900/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Skull size={24} className="text-soc-danger" />
                <h2 className="text-xl font-bold text-white">Case Analysis</h2>
              </div>
              <button onClick={() => setSelectedVictim(null)} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 text-left">
              <h3 className="text-2xl font-bold text-white">{selectedVictim.target}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-soc-bg p-3 rounded-lg border border-soc-border">
                   <p className="text-[10px] font-bold text-gray-500 uppercase">Resgate Estimado</p>
                   <p className="text-sm text-soc-success font-bold">{selectedVictim.ransomAmount}</p>
                </div>
                <div className="bg-soc-bg p-3 rounded-lg border border-soc-border">
                   <p className="text-[10px] font-bold text-gray-500 uppercase">Setor</p>
                   <p className="text-sm text-gray-200">{selectedVictim.sector}</p>
                </div>
              </div>
              <div className="space-y-3">
                 <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2"><FileText size={16} /> Intelligence Summary</h4>
                 <p className="text-sm text-gray-400 italic bg-soc-bg/50 p-4 rounded-xl border border-soc-border leading-relaxed">"{selectedVictim.summary}"</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
