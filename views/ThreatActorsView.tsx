
import React, { useState, useMemo } from 'react';
import { 
  Users, Filter, Plus, Search, MapPin, Target, ExternalLink, 
  X, Save, Activity, ShieldAlert, Globe, Link as LinkIcon,
  ChevronRight, Network, Share2, Trash2, ArrowUpRight
} from 'lucide-react';
import { Severity } from '../types';

interface Actor {
  id: string;
  name: string;
  origin: string;
  motivation: string;
  ttps: string[];
  severity: Severity;
  lastActive: string;
  description: string;
}

const initialActors: Actor[] = [
  { id: '1', name: 'Lazarus Group', origin: 'North Korea', motivation: 'Financial Gain', ttps: ['Spear-phishing', 'Custom Malware', 'Exploit Kits'], severity: Severity.CRITICAL, lastActive: '2024-05-12', description: 'North Korean state-sponsored cyber warfare group responsible for several high-profile attacks.' },
  { id: '2', name: 'Fancy Bear (APT28)', origin: 'Russia', motivation: 'Political Espionage', ttps: ['Zero-day Exploits', 'Credential Harvesting'], severity: Severity.HIGH, lastActive: '2024-05-15', description: 'Russian cyber-espionage group associated with the GRU.' },
  { id: '3', name: 'LockBit', origin: 'Unknown', motivation: 'Ransomware', ttps: ['RaaS', 'Double Extortion'], severity: Severity.CRITICAL, lastActive: '2024-05-20', description: 'Highly active ransomware-as-a-service (RaaS) operator.' },
  { id: '4', name: 'Wizard Spider', origin: 'Eastern Europe', motivation: 'Cybercrime', ttps: ['Ryuk Ransomware', 'Conti'], severity: Severity.HIGH, lastActive: '2024-04-30', description: 'Sophisticated criminal group known for multi-stage ransomware attacks.' },
];

export const ThreatActorsView: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>(initialActors);
  const [selectedActor, setSelectedActor] = useState<Actor>(initialActors[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingRelationships, setIsViewingRelationships] = useState(false);

  // Formulário Temporário para Edição/Adição
  const [formData, setFormData] = useState<Partial<Actor>>({});

  const filteredActors = useMemo(() => {
    return actors.filter(actor => 
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.motivation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, actors]);

  const handleOpenEdit = () => {
    setFormData({ ...selectedActor });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedActors = actors.map(a => a.id === formData.id ? { ...a, ...formData } : a);
    setActors(updatedActors as Actor[]);
    setSelectedActor({ ...selectedActor, ...formData } as Actor);
    setIsEditing(false);
  };

  const handleAddNew = () => {
    const newActor: Actor = {
      id: Date.now().toString(),
      name: formData.name || 'New APT Group',
      origin: formData.origin || 'Unknown',
      motivation: formData.motivation || 'Espionage',
      ttps: ['Pending Analysis'],
      severity: formData.severity || Severity.MEDIUM,
      lastActive: new Date().toISOString().split('T')[0],
      description: formData.description || 'No description provided.'
    };
    setActors([...actors, newActor]);
    setSelectedActor(newActor);
    setIsAdding(false);
    setFormData({});
  };

  const handleOpenCampaign = (name: string) => {
    window.open(`https://attack.mitre.org/groups/`, '_blank');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full relative">
      {/* Coluna de Listagem */}
      <div className="lg:w-1/3 flex flex-col gap-4">
        <div className="bg-soc-card border border-soc-border rounded-xl p-4 shadow-xl">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, origin or motive..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-soc-primary text-white"
            />
          </div>
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Profiles ({filteredActors.length})</span>
            <button 
              onClick={() => { setFormData({}); setIsAdding(true); }}
              className="bg-soc-primary hover:bg-soc-primary/80 text-white p-2 rounded-lg transition-all shadow-lg shadow-soc-primary/20"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-320px)] pr-2">
            {filteredActors.map((actor) => (
              <button
                key={actor.id}
                onClick={() => setSelectedActor(actor)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedActor.id === actor.id 
                    ? 'bg-soc-primary/10 border-soc-primary' 
                    : 'bg-soc-bg/50 border-soc-border hover:bg-gray-800/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white">{actor.name}</h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    actor.severity === Severity.CRITICAL ? 'text-red-500' : 'text-orange-500'
                  }`}>
                    {actor.severity}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <Globe size={10} /> {actor.origin} • {actor.motivation}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Perfil Detalhado */}
      <div className="lg:flex-1 bg-soc-card border border-soc-border rounded-xl flex flex-col shadow-2xl relative min-h-[600px]">
        {/* Banner */}
        <div className="p-8 border-b border-soc-border bg-gradient-to-br from-gray-900/80 to-soc-bg rounded-t-xl">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-soc-primary/20 flex items-center justify-center text-3xl font-black text-soc-primary border border-soc-primary/30">
                {selectedActor.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">{selectedActor.name}</h2>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs text-gray-400 bg-soc-bg border border-soc-border px-3 py-1 rounded-full">{selectedActor.origin}</span>
                  <span className="text-xs text-gray-400 bg-soc-bg border border-soc-border px-3 py-1 rounded-full">{selectedActor.motivation}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleOpenEdit}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold border border-soc-border hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => setIsViewingRelationships(true)}
                className="px-4 py-2 bg-soc-primary text-white rounded-lg text-sm font-bold hover:bg-soc-primary/80 transition-all flex items-center gap-2"
              >
                <Network size={16} /> View Relationships
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <div className="p-4 bg-soc-bg/50 border border-soc-border rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Last Active</p>
                <p className="text-sm text-white font-mono">{selectedActor.lastActive}</p>
             </div>
             <div className="p-4 bg-soc-bg/50 border border-soc-border rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Severity</p>
                <p className={`text-sm font-bold ${selectedActor.severity === Severity.CRITICAL ? 'text-red-500' : 'text-orange-500'}`}>
                   {selectedActor.severity}
                </p>
             </div>
             <div className="p-4 bg-soc-bg/50 border border-soc-border rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Intelligence Status</p>
                <p className="text-sm text-soc-success font-bold">VERIFIED</p>
             </div>
          </div>
        </div>

        {/* Dossier */}
        <div className="p-8 space-y-8 overflow-y-auto">
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Operational Summary</h3>
            <p className="text-gray-300 leading-relaxed bg-soc-bg/40 p-5 rounded-xl border border-soc-border italic">
              "{selectedActor.description}"
            </p>
          </section>

          <section>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Tactics & Tools</h3>
             <div className="flex flex-wrap gap-2">
               {selectedActor.ttps.map((ttp, i) => (
                 <span key={i} className="bg-soc-primary/10 text-soc-primary border border-soc-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold">
                   {ttp}
                 </span>
               ))}
             </div>
          </section>

          <section>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Historical Campaigns</h3>
             <div className="space-y-3">
               {[1, 2].map((i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-soc-bg border border-soc-border rounded-xl group hover:border-soc-primary/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Operation Crimson Sky #{i}</p>
                        <p className="text-xs text-gray-500">Targeting Financial Sector • 2023-Q4</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenCampaign(`Campaign ${i}`)}
                      className="w-10 h-10 rounded-lg bg-gray-800 text-soc-primary flex items-center justify-center hover:bg-soc-primary hover:text-white transition-all active:scale-95"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>

      {/* Modal: ADD / EDIT Profile (Fixed Overlay) */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[100] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
             <div className="p-6 border-b border-soc-border flex justify-between items-center bg-gray-900/40">
                <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Profile' : 'Register New Actor'}</h3>
                <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Actor Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. APT-28" 
                    className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 px-4 text-white text-sm focus:ring-1 focus:ring-soc-primary outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Origin</label>
                    <input 
                      type="text" 
                      value={formData.origin || ''} 
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="e.g. Russia" 
                      className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 px-4 text-white text-sm focus:ring-1 focus:ring-soc-primary outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Severity</label>
                    <select 
                      value={formData.severity || Severity.MEDIUM}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value as Severity })}
                      className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 px-4 text-gray-300 text-sm focus:ring-1 focus:ring-soc-primary outline-none"
                    >
                      <option value={Severity.CRITICAL}>CRITICAL</option>
                      <option value={Severity.HIGH}>HIGH</option>
                      <option value={Severity.MEDIUM}>MEDIUM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Motivation</label>
                  <input 
                    type="text" 
                    value={formData.motivation || ''} 
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 px-4 text-white text-sm focus:ring-1 focus:ring-soc-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 px-4 text-white text-sm resize-none focus:ring-1 focus:ring-soc-primary outline-none" 
                  ></textarea>
                </div>
             </div>
             <div className="p-6 bg-gray-900/30 flex gap-3 border-t border-soc-border">
                <button 
                  onClick={() => { setIsAdding(false); setIsEditing(false); }}
                  className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={isEditing ? handleSaveEdit : handleAddNew}
                  className="flex-1 py-2 bg-soc-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-soc-primary/20 hover:scale-[1.02] transition-all"
                >
                  {isEditing ? 'Update Profile' : 'Save Profile'}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Modal: Relationship View (Fixed Overlay) */}
      {isViewingRelationships && (
        <div className="fixed inset-0 z-[100] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
           <div className="w-full max-w-2xl bg-soc-card border border-soc-primary/30 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col h-[550px] ring-1 ring-soc-primary/20">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-soc-primary/10 rounded-xl text-soc-primary shadow-inner"><Network size={28} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Relationship Map</h3>
                    <p className="text-xs text-gray-500 font-mono">Entity: {selectedActor.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsViewingRelationships(false)} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 bg-soc-bg rounded-2xl border border-soc-border p-4 relative overflow-hidden flex items-center justify-center shadow-inner">
                 <svg width="100%" height="100%" viewBox="0 0 400 250">
                    <defs>
                      <marker id="arrow" markerWidth="10" markerHeight="10" refX="25" refY="5" orientation="auto">
                        <path d="M0,0 L0,10 L10,5 Z" fill="#3b82f6" />
                      </marker>
                    </defs>
                    <line x1="200" y1="125" x2="100" y2="50" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow)" />
                    <line x1="200" y1="125" x2="300" y2="50" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow)" />
                    <line x1="200" y1="125" x2="200" y2="200" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
                    
                    <circle cx="200" cy="125" r="32" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" />
                    <text x="200" y="130" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ACTOR</text>
                    
                    <circle cx="100" cy="50" r="22" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1" />
                    <text x="100" y="55" textAnchor="middle" fill="#8b5cf6" fontSize="8" fontWeight="bold">IOC_IP</text>
                    
                    <circle cx="300" cy="50" r="22" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1" />
                    <text x="300" y="55" textAnchor="middle" fill="#8b5cf6" fontSize="8" fontWeight="bold">IOC_DNS</text>
                    
                    <circle cx="200" cy="200" r="22" fill="#ef4444" fillOpacity="0.1" stroke="#ef4444" strokeWidth="1" />
                    <text x="200" y="205" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">MALWARE</text>
                 </svg>
                 <div className="absolute bottom-4 left-4 text-[10px] text-gray-600 font-mono bg-black/30 px-2 py-1 rounded">
                    Relationships: uses_malware, commands_ip, resolving_dns
                 </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setIsViewingRelationships(false)}
                  className="px-8 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold border border-soc-border hover:bg-gray-700 transition-all"
                >
                  Close Analysis
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
