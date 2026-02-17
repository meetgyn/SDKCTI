
import React, { useState } from 'react';
import { 
  Search, Bell, Settings, X, Languages, CheckCircle2, Eye, Info, Activity, Key, Globe, 
  AlertTriangle, User, Palette, Save, Layout, Plus, Trash2, EyeOff, Code, Database, Shield, Network
} from 'lucide-react';
import { Language, SystemSettings, AuthSite } from '../App';

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
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, language, setLanguage, monitoredForums, setMonitoredForums, monitoredChats, setMonitoredChats,
  authSites, setAuthSites, settings, onUpdateSettings
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeConfigModal, setActiveConfigModal] = useState<string | null>(null);
  
  // States para APIs e Monitoramento
  const [newForum, setNewForum] = useState('');
  const [newChat, setNewChat] = useState('');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    virustotal: '', shodan: '', alienvault: '', github: '', ransomwareApi: ''
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isAddingAuthSite, setIsAddingAuthSite] = useState(false);
  const [newAuthSite, setNewAuthSite] = useState<Partial<AuthSite>>({ name: '', url: '', user: '', pass: '' });

  // States para Perfil e Branding
  const [editProfile, setEditProfile] = useState({ name: settings.user_name, role: settings.user_role });
  const [editBranding, setEditBranding] = useState({ systemName: settings.system_name, color: settings.accent_color });

  const t = {
    search: language === 'en' ? 'Global search...' : 'Busca global...',
    monitoring: language === 'en' ? 'Monitoring Config' : 'Config. de Monitoramento',
    apiTitle: language === 'en' ? 'API Integrations' : 'Integrações de API',
    profile: language === 'en' ? 'User Profile' : 'Perfil do Usuário',
    branding: language === 'en' ? 'System Branding' : 'Marca do Sistema',
    aboutTitle: language === 'en' ? 'About' : 'Sobre',
    langSwitch: language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês',
    save: language === 'en' ? 'Finish' : 'Concluir',
    cancel: language === 'en' ? 'Close' : 'Fechar',
  };

  const handleSaveProfile = async () => {
    await onUpdateSettings({ user_name: editProfile.name, user_role: editProfile.role });
    setActiveConfigModal(null);
  };

  const handleSaveBranding = async () => {
    await onUpdateSettings({ system_name: editBranding.systemName, accent_color: editBranding.color });
    setActiveConfigModal(null);
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddAuthSite = () => {
    if (newAuthSite.name && newAuthSite.url) {
      setAuthSites([...authSites, { ...newAuthSite, id: Date.now().toString() } as AuthSite]);
      setNewAuthSite({ name: '', url: '', user: '', pass: '' });
      setIsAddingAuthSite(false);
    }
  };

  return (
    <header className="h-16 border-b border-soc-border bg-soc-card flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 text-left">
        <h2 className="text-lg font-semibold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
        <div className="h-4 w-[1px] bg-soc-border"></div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-soc-primary transition-colors" size={16} />
          <input type="text" placeholder={t.search} className="bg-soc-bg border border-soc-border rounded-full py-1.5 pl-10 pr-4 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-soc-primary/50 text-white"/>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-2 rounded-full transition-all ${isSettingsOpen ? 'bg-soc-primary/20 text-soc-primary rotate-45' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
          <Settings size={20} />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="absolute right-6 top-16 mt-2 w-72 bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 ring-1 ring-white/5">
          <div className="p-4 border-b border-soc-border bg-gray-900/30 font-bold text-[10px] text-gray-500 uppercase tracking-widest text-left">Configurações</div>
          <div className="p-2 space-y-1">
            <button onClick={() => setActiveConfigModal('Monitoring')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
              <Activity size={16} /> {t.monitoring}
            </button>
            <button onClick={() => setActiveConfigModal('API')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
              <Key size={16} /> {t.apiTitle}
            </button>
            <button onClick={() => setActiveConfigModal('Profile')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
              <User size={16} /> {t.profile}
            </button>
            <button onClick={() => setActiveConfigModal('Branding')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
              <Palette size={16} /> {t.branding}
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
          <div className="w-full max-w-2xl bg-soc-card border border-soc-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-soc-border flex justify-between items-center bg-gray-900/40 shrink-0">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
                {activeConfigModal === 'Monitoring' ? t.monitoring : activeConfigModal === 'API' ? t.apiTitle : activeConfigModal === 'Profile' ? t.profile : activeConfigModal === 'Branding' ? t.branding : 'Settings'}
              </h3>
              <button onClick={() => setActiveConfigModal(null)} className="text-gray-500 hover:text-white p-2 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-left">
              {activeConfigModal === 'Monitoring' && (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14} className="text-soc-primary" /> Fóruns & Chats Públicos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                         <div className="flex gap-2">
                           <input type="text" value={newForum} onChange={(e)=>setNewForum(e.target.value)} placeholder="URL do Fórum..." className="flex-1 bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-soc-primary outline-none" />
                           <button onClick={() => {if(newForum) setMonitoredForums([...monitoredForums, newForum]); setNewForum('')}} className="p-2 bg-soc-primary text-white rounded-xl"><Plus size={18}/></button>
                         </div>
                         <div className="flex flex-wrap gap-2">{monitoredForums.map(f=><span key={f} className="text-[10px] bg-gray-900 px-2 py-1 rounded border border-soc-border text-gray-400">{f}</span>)}</div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex gap-2">
                           <input type="text" value={newChat} onChange={(e)=>setNewChat(e.target.value)} placeholder="Canal de Chat..." className="flex-1 bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-soc-accent outline-none" />
                           <button onClick={() => {if(newChat) setMonitoredChats([...monitoredChats, newChat]); setNewChat('')}} className="p-2 bg-soc-accent text-white rounded-xl"><Plus size={18}/></button>
                         </div>
                         <div className="flex flex-wrap gap-2">{monitoredChats.map(c=><span key={c} className="text-[10px] bg-gray-900 px-2 py-1 rounded border border-soc-border text-gray-400">{c}</span>)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Key size={14} className="text-soc-warning" /> Sites Autenticados (Login Monitor)</h4>
                    <div className="space-y-3">
                      {authSites.map(site => (
                        <div key={site.id} className="p-4 bg-gray-900 border border-soc-border rounded-xl flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-bold text-white">{site.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{site.url}</p>
                          </div>
                          <button onClick={() => setAuthSites(authSites.filter(s => s.id !== site.id))} className="text-gray-600 hover:text-soc-danger"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      
                      {isAddingAuthSite ? (
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-soc-warning/30 space-y-4 animate-in zoom-in-95">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Nome do Alvo" value={newAuthSite.name} onChange={e=>setNewAuthSite({...newAuthSite, name: e.target.value})} className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-xs text-white"/>
                            <input type="text" placeholder="URL de Login" value={newAuthSite.url} onChange={e=>setNewAuthSite({...newAuthSite, url: e.target.value})} className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-xs text-white"/>
                            <input type="text" placeholder="Usuário" value={newAuthSite.user} onChange={e=>setNewAuthSite({...newAuthSite, user: e.target.value})} className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-xs text-white"/>
                            <input type="password" placeholder="Senha" value={newAuthSite.pass} onChange={e=>setNewAuthSite({...newAuthSite, pass: e.target.value})} className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-xs text-white"/>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleAddAuthSite} className="flex-1 py-2 bg-soc-warning text-white rounded-lg text-xs font-bold">Salvar Site</button>
                            <button onClick={() => setIsAddingAuthSite(false)} className="px-4 py-2 text-gray-500 text-xs">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setIsAddingAuthSite(true)} className="w-full py-3 border-2 border-dashed border-soc-border rounded-xl text-gray-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2">
                          <Plus size={16} /> Adicionar Site com Autenticação
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeConfigModal === 'API' && (
                <div className="space-y-6">
                  <div className="p-4 bg-soc-warning/5 border border-soc-warning/20 rounded-2xl flex gap-4 items-start">
                    <AlertTriangle className="text-soc-warning shrink-0" size={20} />
                    <p className="text-xs text-gray-400 leading-relaxed">Configurações de APIs para enriquecimento de inteligência tática.</p>
                  </div>
                  
                  {[
                    { id: 'virustotal', label: 'VirusTotal API', icon: Shield, color: 'text-soc-primary' },
                    { id: 'shodan', label: 'Shodan API', icon: Database, color: 'text-soc-accent' },
                    { id: 'alienvault', label: 'AlienVault OTX', icon: Network, color: 'text-soc-warning' },
                    { id: 'github', label: 'GitHub PAT', icon: Code, color: 'text-soc-primary' },
                    { id: 'ransomwareApi', label: 'Ransomware Feed API', icon: Activity, color: 'text-soc-danger' }
                  ].map(api => (
                    <div key={api.id} className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2"><api.icon size={12} className={api.color} /> {api.label}</label>
                      <div className="relative">
                        <input 
                          type={showKeys[api.id] ? 'text' : 'password'} 
                          value={apiKeys[api.id]} 
                          onChange={(e) => setApiKeys({...apiKeys, [api.id]: e.target.value})}
                          placeholder="API Key..." 
                          className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-soc-primary outline-none pr-10" 
                        />
                        <button onClick={() => toggleKeyVisibility(api.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showKeys[api.id] ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeConfigModal === 'Profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome do Analista</label>
                    <input type="text" value={editProfile.name} onChange={(e) => setEditProfile({...editProfile, name: e.target.value})} className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-soc-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cargo / Função</label>
                    <input type="text" value={editProfile.role} onChange={(e) => setEditProfile({...editProfile, role: e.target.value})} className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-soc-primary" />
                  </div>
                  <button onClick={handleSaveProfile} className="w-full py-3 bg-soc-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-soc-primary/20 transition-all hover:scale-[1.02]">
                    <Save size={18} /> Salvar Perfil
                  </button>
                </div>
              )}

              {activeConfigModal === 'Branding' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome do Sistema</label>
                    <input type="text" value={editBranding.systemName} onChange={(e) => setEditBranding({...editBranding, systemName: e.target.value})} className="w-full bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cor de Destaque (HEX)</label>
                    <div className="flex gap-2">
                      <input type="color" value={editBranding.color} onChange={(e) => setEditBranding({...editBranding, color: e.target.value})} className="h-10 w-10 bg-transparent border-none rounded cursor-pointer" />
                      <input type="text" value={editBranding.color} onChange={(e) => setEditBranding({...editBranding, color: e.target.value})} className="flex-1 bg-soc-bg border border-soc-border rounded-xl px-4 py-2 text-white outline-none font-mono" />
                    </div>
                  </div>
                  <button onClick={handleSaveBranding} className="w-full py-3 bg-soc-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ backgroundColor: editBranding.color }}>
                    <Save size={18} /> Aplicar Identidade Visual
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-900/30 border-t border-soc-border flex gap-3">
               <button onClick={() => setActiveConfigModal(null)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-white transition-all">{t.cancel}</button>
               <button onClick={() => setActiveConfigModal(null)} className="flex-1 py-3 bg-soc-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-soc-primary/20 transition-all flex items-center justify-center gap-2"><CheckCircle2 size={18} /> {t.save}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
