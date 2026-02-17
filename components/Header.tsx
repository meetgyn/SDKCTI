
import React, { useState } from 'react';
import { 
  Search, Bell, Settings, X, Languages, CheckCircle2, 
  Eye, Plus, Trash2, Info, Activity, Key, Globe, AlertTriangle, 
  Shield, Database, Code, Network, Copyright, Zap, EyeOff
} from 'lucide-react';
import { Language, AuthSite } from '../App';

interface HeaderProps {
  activeTab: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  monitoredForums: string[];
  setMonitoredForums: (val: string[]) => void;
  monitoredChats: string[];
  setMonitoredChats: (val: string[]) => void;
  authSites: AuthSite[];
  setAuthSites: (val: AuthSite[]) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, language, setLanguage, 
  monitoredForums, setMonitoredForums, 
  monitoredChats, setMonitoredChats
}) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeConfigModal, setActiveConfigModal] = useState<string | null>(null);
  
  const [newForum, setNewForum] = useState('');
  const [newChat, setNewChat] = useState('');
  
  // API Keys state - Initialized with empty strings to be editable
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    virustotal: '',
    alienvault: '',
    shodan: '',
    cisakey: '',
    github: '',
    ransomwareApi: ''
  });

  const [customApis, setCustomApis] = useState<{id: string, name: string, key: string}[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomProvider, setNewCustomProvider] = useState({ name: '', key: '' });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const t = {
    search: language === 'en' ? 'Global search...' : 'Busca global...',
    monitoring: language === 'en' ? 'Monitoring Config' : 'Config. de Monitoramento',
    apiTitle: language === 'en' ? 'API Integrations' : 'Integrações de API',
    aboutTitle: language === 'en' ? 'About Sentinel CTI' : 'Sobre o Sentinel CTI',
    langSwitch: language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês',
    save: language === 'en' ? 'Finish' : 'Concluir',
    cancel: language === 'en' ? 'Close' : 'Fechar',
  };

  const toggleSettings = () => { setIsSettingsOpen(!isSettingsOpen); setIsAlertsOpen(false); };

  const handleConfigClick = (type: string) => { 
    setActiveConfigModal(type); 
    setIsSettingsOpen(false); 
  };

  const updateApiKey = (id: string, val: string) => {
    setApiKeys(prev => ({ ...prev, [id]: val }));
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddForum = () => {
    if (newForum.trim()) {
      setMonitoredForums([...monitoredForums, newForum.trim()]);
      setNewForum('');
    }
  };

  const handleAddChat = () => {
    if (newChat.trim()) {
      setMonitoredChats([...monitoredChats, newChat.trim()]);
      setNewChat('');
    }
  };

  const addCustomProvider = () => {
    if (!newCustomProvider.name || !newCustomProvider.key) return;
    setCustomApis(prev => [...prev, { ...newCustomProvider, id: Date.now().toString() }]);
    setNewCustomProvider({ name: '', key: '' });
    setIsAddingCustom(false);
  };

  return (
    <header className="h-16 border-b border-soc-border bg-soc-card flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
        <div className="h-4 w-[1px] bg-soc-border"></div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-soc-primary transition-colors" size={16} />
          <input type="text" placeholder={t.search} className="bg-soc-bg border border-soc-border rounded-full py-1.5 pl-10 pr-4 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-soc-primary/50 text-white"/>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setIsAlertsOpen(!isAlertsOpen)} className={`p-2 rounded-full relative ${isAlertsOpen ? 'bg-soc-primary/20 text-soc-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
          <Bell size={20} /><span className="absolute top-2 right-2.5 w-2 h-2 bg-soc-danger rounded-full border-2 border-soc-card"></span>
        </button>
        <button onClick={toggleSettings} className={`p-2 rounded-full transition-all ${isSettingsOpen ? 'bg-soc-primary/20 text-soc-primary rotate-45' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
          <Settings size={20} />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="absolute right-6 top-16 mt-2 w-72 bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 ring-1 ring-white/5">
          <div className="p-4 border-b border-soc-border bg-gray-900/30 font-bold text-[10px] text-gray-500 uppercase tracking-widest">System Configuration</div>
          <div className="p-2 space-y-1">
            <button onClick={() => handleConfigClick('Monitoring')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
              <Activity size={16} className="group-hover:text-soc-primary" /> {t.monitoring}
            </button>
            <button onClick={() => handleConfigClick('API')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
              <Key size={16} className="group-hover:text-soc-warning" /> {t.apiTitle}
            </button>
            <button onClick={() => handleConfigClick('About')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
              <Info size={16} className="group-hover:text-soc-accent" /> {t.aboutTitle}
            </button>
            <div className="h-[1px] bg-soc-border my-2 mx-2"></div>
            <button onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-soc-primary hover:bg-soc-primary/10 transition-all text-left">
              <Languages size={16} /> {t.langSwitch}
            </button>
          </div>
        </div>
      )}

      {activeConfigModal && (
        <div className="fixed inset-0 z-[100] bg-soc-bg/95 backdrop-blur-lg flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-soc-card border border-soc-border rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-soc-border flex justify-between items-center bg-gray-900/40 shrink-0">
              <div className="flex items-center gap-3">
                {activeConfigModal === 'Monitoring' && <Activity className="text-soc-primary" size={24} />}
                {activeConfigModal === 'API' && <Key className="text-soc-warning" size={24} />}
                {activeConfigModal === 'About' && <Info className="text-soc-accent" size={24} />}
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
                  {activeConfigModal === 'Monitoring' ? t.monitoring : activeConfigModal === 'API' ? t.apiTitle : t.aboutTitle}
                </h3>
              </div>
              <button onClick={() => setActiveConfigModal(null)} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeConfigModal === 'Monitoring' && (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14} className="text-soc-primary" /> Fóruns & Chats Públicos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                         <div className="flex gap-2">
                           <input type="text" value={newForum} onChange={(e)=>setNewForum(e.target.value)} placeholder="Add Forum URL/Name..." className="flex-1 bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-soc-primary outline-none" />
                           <button onClick={handleAddForum} className="p-2 bg-soc-primary text-white rounded-xl"><Plus size={18}/></button>
                         </div>
                         <div className="flex flex-wrap gap-2">{monitoredForums.map(f=><span key={f} className="text-[10px] bg-gray-900 px-2 py-1 rounded border border-soc-border text-gray-400">{f}</span>)}</div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex gap-2">
                           <input type="text" value={newChat} onChange={(e)=>setNewChat(e.target.value)} placeholder="Add Chat Channel..." className="flex-1 bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-soc-accent outline-none" />
                           <button onClick={handleAddChat} className="p-2 bg-soc-accent text-white rounded-xl"><Plus size={18}/></button>
                         </div>
                         <div className="flex flex-wrap gap-2">{monitoredChats.map(c=><span key={c} className="text-[10px] bg-gray-900 px-2 py-1 rounded border border-soc-border text-gray-400">{c}</span>)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeConfigModal === 'API' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-2">
                  <div className="p-4 bg-soc-warning/5 border border-soc-warning/20 rounded-2xl flex gap-4 items-start">
                    <AlertTriangle className="text-soc-warning shrink-0" size={20} />
                    <p className="text-xs text-gray-400 leading-relaxed">Insira suas chaves de API abaixo. Elas serão salvas localmente para alimentar as ferramentas de monitoramento e busca.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* VirusTotal */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Shield size={12} className="text-soc-primary" /> VirusTotal API Key</label>
                      <div className="relative">
                        <input type={showKeys['vt'] ? 'text' : 'password'} value={apiKeys.virustotal} onChange={(e) => updateApiKey('virustotal', e.target.value)} placeholder="VirusTotal Key..." className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-soc-warning pr-12" />
                        <button onClick={() => toggleKeyVisibility('vt')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showKeys['vt'] ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                      </div>
                    </div>

                    {/* Shodan - SEPARATE LINE */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Database size={12} className="text-soc-accent" /> Shodan API Key</label>
                      <div className="relative">
                        <input type={showKeys['shodan'] ? 'text' : 'password'} value={apiKeys.shodan} onChange={(e) => updateApiKey('shodan', e.target.value)} placeholder="Shodan Key..." className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-soc-warning pr-12" />
                        <button onClick={() => toggleKeyVisibility('shodan')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showKeys['shodan'] ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                      </div>
                    </div>

                    {/* CISA Feed - SEPARATE LINE */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Activity size={12} className="text-soc-warning" /> CISA Feed Token</label>
                      <div className="relative">
                        <input type={showKeys['cisa'] ? 'text' : 'password'} value={apiKeys.cisakey} onChange={(e) => updateApiKey('cisakey', e.target.value)} placeholder="CISA Feed Token..." className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-soc-warning pr-12" />
                        <button onClick={() => toggleKeyVisibility('cisa')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showKeys['cisa'] ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                      </div>
                    </div>

                    {/* Ransomware Victims Monitor API */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Network size={12} className="text-soc-danger" /> Ransomware Monitor API</label>
                      <div className="relative">
                        <input type={showKeys['ransom'] ? 'text' : 'password'} value={apiKeys.ransomwareApi} onChange={(e) => updateApiKey('ransomwareApi', e.target.value)} placeholder="Ransomware Feed API..." className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-soc-warning pr-12" />
                        <button onClick={() => toggleKeyVisibility('ransom')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showKeys['ransom'] ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                      </div>
                    </div>

                    {/* GitHub */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Code size={12} className="text-soc-primary" /> GitHub Personal Access Token</label>
                      <div className="relative">
                        <input type={showKeys['github'] ? 'text' : 'password'} value={apiKeys.github} onChange={(e) => updateApiKey('github', e.target.value)} placeholder="GitHub PAT..." className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-soc-warning pr-12" />
                        <button onClick={() => toggleKeyVisibility('github')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showKeys['github'] ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                      </div>
                    </div>

                    {customApis.map((api) => (
                      <div key={api.id} className="space-y-2 p-4 bg-gray-900 rounded-xl border border-soc-border flex justify-between items-center group">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-soc-success uppercase tracking-widest">{api.name}</label>
                          <p className="text-xs text-gray-500 font-mono truncate">{api.key.replace(/./g, '*')}</p>
                        </div>
                        <button onClick={() => setCustomApis(customApis.filter(a => a.id !== api.id))} className="text-soc-danger p-2 hover:bg-soc-danger/10 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>

                  {isAddingCustom ? (
                    <div className="bg-gray-900/50 border border-soc-primary/30 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
                      <h4 className="text-[10px] font-bold text-soc-primary uppercase tracking-widest">Register New Intelligence Provider</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Provider Name" value={newCustomProvider.name} onChange={(e) => setNewCustomProvider({...newCustomProvider, name: e.target.value})} className="bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-xs text-white" />
                        <input type="text" placeholder="API Key..." value={newCustomProvider.key} onChange={(e) => setNewCustomProvider({...newCustomProvider, key: e.target.value})} className="bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-xs text-white" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={addCustomProvider} className="flex-1 py-2 bg-soc-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">Register</button>
                        <button onClick={() => setIsAddingCustom(false)} className="px-4 py-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsAddingCustom(true)} className="w-full py-3 bg-soc-warning/10 border border-soc-warning/30 text-soc-warning rounded-2xl text-xs font-bold hover:bg-soc-warning/20 transition-all flex items-center justify-center gap-2"><Plus size={16} /> Adicionar Novo Provedor de Inteligência</button>
                  )}
                </div>
              )}

              {activeConfigModal === 'About' && (
                <div className="space-y-8 text-center py-4">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-soc-primary/20 rounded-3xl flex items-center justify-center border border-soc-primary/30 shadow-2xl mb-6"><Shield size={40} className="text-soc-primary" /></div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Sentinel<span className="text-soc-primary">CTI</span></h2>
                    <p className="text-xs text-gray-500 font-mono mt-2 bg-gray-900 px-3 py-1 rounded-full border border-soc-border">v2.4.0-Stable // 2026.05.24</p>
                  </div>
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-soc-primary uppercase tracking-[0.2em]">Direitos Autorais</h4>
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm"><Copyright size={14} /> 2026 Sentinel Defense Systems. All rights reserved.</div>
                    </div>
                    <div className="space-y-3 text-left bg-gray-900/40 border border-soc-border p-6 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Zap size={14} className="text-soc-warning" /> Operação do Sistema</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">A plataforma integra-se com APIs externas e utiliza o <b>Gemini 3 Pro</b> com busca em tempo real para validar ameaças e monitorar ativos. Toda inteligência é agregada via web scraping e grounding.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-900/30 border-t border-soc-border flex gap-3">
               <button onClick={() => setActiveConfigModal(null)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-white transition-all">{t.cancel}</button>
               {activeConfigModal !== 'About' && <button onClick={() => setActiveConfigModal(null)} className="flex-1 py-3 bg-soc-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-soc-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"><CheckCircle2 size={18} /> {t.save}</button>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
