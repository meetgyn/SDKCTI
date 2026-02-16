
import React, { useState, useMemo } from 'react';
import { 
  Search, Bell, Settings, LogOut, HelpCircle, User, Shield, Key, 
  AlertCircle, Clock, X, Languages, Save, CheckCircle2, ShieldCheck, 
  RefreshCcw, Eye, Copy, Plus, Trash2, Power, BookOpen, MessageSquare, 
  Keyboard, Info, ExternalLink, Terminal, Cpu, HardDrive, Wifi, ArrowLeft,
  ChevronRight, FileText, Code, GraduationCap, Zap, ShieldAlert, Activity,
  Globe, AlertTriangle
} from 'lucide-react';
import { Language } from '../App';

interface HeaderProps {
  activeTab: string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

interface AlertNotification {
  id: number;
  title: string;
  pt: string;
  desc: string;
  longDesc?: string;
  time: string;
  type: 'critical' | 'high' | 'medium';
  sourceUrl: string;
  impactScore: number;
}

const mockAlerts: AlertNotification[] = [
  { 
    id: 1, 
    title: 'New Critical CVE', 
    pt: 'Nova CVE Crítica', 
    desc: 'CVE-2024-21410 in Exchange Server.', 
    longDesc: 'Microsoft Exchange Server Elevation of Privilege Vulnerability. Exploitation detected in the wild by state-sponsored actors. High impact on confidentiality and integrity.',
    time: '2 mins ago', 
    type: 'critical',
    sourceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-21410',
    impactScore: 9.8
  },
  { 
    id: 2, 
    title: 'APT28 Activity', 
    pt: 'Atividade APT28', 
    desc: 'Spike in traffic to known C2 nodes.', 
    longDesc: 'Network telemetry identified outbound traffic to infrastructure associated with Pawn Storm (APT28). Targets seem to be focusing on OAuth token theft.',
    time: '15 mins ago', 
    type: 'high',
    sourceUrl: 'https://attack.mitre.org/groups/G0007/',
    impactScore: 8.5
  },
  {
    id: 3,
    title: 'Ransomware Leak',
    pt: 'Vazamento Ransomware',
    desc: 'New victim posted on LockBit 3.0 blog.',
    longDesc: 'LockBit 3.0 has published a new entry targeting a regional logistics provider. 50GB of data exfiltrated including employee contracts.',
    time: '1 hour ago',
    type: 'high',
    sourceUrl: 'https://www.bleepingcomputer.com/tag/ransomware/',
    impactScore: 7.2
  }
];

export const Header: React.FC<HeaderProps> = ({ activeTab, language, setLanguage }) => {
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeConfigModal, setActiveConfigModal] = useState<string | null>(null);
  const [activeHelpModal, setActiveHelpModal] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertNotification | null>(null);
  
  // States for Help Center
  const [searchDocs, setSearchDocs] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // States for Configuration
  const [autoSync, setAutoSync] = useState(true);
  const [auditLevel, setAuditLevel] = useState<'BASIC' | 'EXTENDED' | 'FORENSIC'>('EXTENDED');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30m');
  const [tokens, setTokens] = useState([
    { id: '1', name: 'SIEM Integration', key: 'sk_live_....4x2p', status: 'Active' },
    { id: '2', name: 'SOAR Playbook', key: 'sk_test_....9z1a', status: 'Active' }
  ]);

  const docTopics = [
    { 
      id: 'start', 
      title: language === 'en' ? 'Getting Started' : 'Primeiros Passos', 
      icon: Zap, 
      desc: language === 'en' ? 'Installation, initial setup and first analysis.' : 'Instalação, configuração inicial e primeira análise.',
      content: language === 'en' ? 'To begin, configure your API keys and sync your first data feed. Sentinel CTI uses STIX 2.1 for intelligence exchange.' : 'Para começar, configure suas chaves de API e sincronize seu primeiro feed. O Sentinel CTI utiliza STIX 2.1.'
    },
    { 
      id: 'api', 
      title: 'API Integration', 
      icon: Code, 
      desc: language === 'en' ? 'REST endpoints and authentication reference.' : 'Referência de endpoints REST e autenticação.',
      content: 'GET /v1/indicators - Returns active IOCs.\nPOST /v1/actors - Register new threat entities.\nAuth: Bearer <API_TOKEN>'
    },
    { 
      id: 'ti101', 
      title: 'Threat Intelligence 101', 
      icon: GraduationCap, 
      desc: language === 'en' ? 'Intelligence Cycle and Diamond Model basics.' : 'Ciclo de Inteligência e Diamond Model.',
      content: language === 'en' ? 'Intelligence is not just data. It requires Collection, Analysis, and Dissemination. Focus on TTPs (Tactics, Techniques, and Procedures).' : 'Inteligência não é apenas dado. Requer Coleta, Análise e Disseminação. Foque em TTPs.'
    },
    { 
      id: 'playbooks', 
      title: 'SOC Playbooks', 
      icon: FileText, 
      desc: language === 'en' ? 'Automation guides and response protocols.' : 'Guias de automação e protocolos de resposta.',
      content: language === 'en' ? 'Automate containment for ransomware. Use our Python SDK to trigger isolation in EDR/FW tools.' : 'Automatize contenção de ransomware. Use nosso SDK Python para disparar isolamento em ferramentas de EDR/FW.'
    }
  ];

  const filteredDocs = useMemo(() => {
    return docTopics.filter(doc => 
      doc.title.toLowerCase().includes(searchDocs.toLowerCase()) || 
      doc.desc.toLowerCase().includes(searchDocs.toLowerCase())
    );
  }, [searchDocs, language]);

  const t = {
    search: language === 'en' ? 'Global search (IOCs, CVEs, Actors)...' : 'Busca global (IOCs, CVEs, Atores)...',
    alertsTitle: language === 'en' ? 'Security Notifications' : 'Notificações de Segurança',
    viewAllAlerts: language === 'en' ? 'View All Intelligence Alerts' : 'Ver Todos os Alertas de Inteligência',
    settingsTitle: language === 'en' ? 'System Settings' : 'Configurações do Sistema',
    profile: language === 'en' ? 'Profile Settings' : 'Configurações de Perfil',
    policy: language === 'en' ? 'Security Policy' : 'Política de Segurança',
    tokens: language === 'en' ? 'API Tokens' : 'Tokens de API',
    logout: language === 'en' ? 'Log Out Session' : 'Encerrar Sessão',
    langSwitch: language === 'en' ? 'Mudar para Português' : 'Switch to English',
    save: language === 'en' ? 'Save Changes' : 'Salvar Alterações',
    cancel: language === 'en' ? 'Cancel' : 'Cancelar',
    autoSync: language === 'en' ? 'Auto-Sync' : 'Sincronização Automática',
    auditLevel: language === 'en' ? 'Audit Level' : 'Nível de Auditoria',
    enabled: language === 'en' ? 'ENABLED' : 'ATIVADO',
    disabled: language === 'en' ? 'DISABLED' : 'DESATIVADO',
    genToken: language === 'en' ? 'Generate New Token' : 'Gerar Novo Token',
    mfa: language === 'en' ? 'Multi-Factor Auth' : 'Autenticação Multifator',
    timeout: language === 'en' ? 'Session Timeout' : 'Expiração de Sessão',
    helpCenter: language === 'en' ? 'Help Center' : 'Central de Ajuda',
    docs: language === 'en' ? 'Documentation' : 'Documentação',
    support: language === 'en' ? 'Contact Support' : 'Contatar Suporte',
    shortcuts: language === 'en' ? 'Keyboard Shortcuts' : 'Atalhos de Teclado',
    about: language === 'en' ? 'About Sentinel CTI' : 'Sobre o Sentinel CTI',
    version: language === 'en' ? 'Version' : 'Versão',
    systemStatus: language === 'en' ? 'System Operational' : 'Sistema Operacional',
    close: language === 'en' ? 'Close' : 'Fechar',
    back: language === 'en' ? 'Back' : 'Voltar'
  };

  const toggleAlerts = () => {
    setIsAlertsOpen(!isAlertsOpen);
    setIsSettingsOpen(false);
    setIsHelpOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsAlertsOpen(false);
    setIsHelpOpen(false);
  };

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
    setIsAlertsOpen(false);
    setIsSettingsOpen(false);
  };

  const handleAlertClick = (alert: AlertNotification) => {
    setSelectedAlert(alert);
    setIsAlertsOpen(false);
  };

  const handleConfigClick = (type: string) => {
    setActiveConfigModal(type);
    setIsSettingsOpen(false);
  };

  const handleHelpClick = (type: string) => {
    setActiveHelpModal(type);
    setIsHelpOpen(false);
    setSelectedDocId(null);
    setSearchDocs('');
  };

  const cycleAuditLevel = () => {
    if (auditLevel === 'BASIC') setAuditLevel('EXTENDED');
    else if (auditLevel === 'EXTENDED') setAuditLevel('FORENSIC');
    else setAuditLevel('BASIC');
  };

  const generateToken = () => {
    const newToken = {
      id: Date.now().toString(),
      name: language === 'en' ? 'New API Access' : 'Novo Acesso API',
      key: `sk_live_....${Math.random().toString(36).substring(7)}`,
      status: 'Active'
    };
    setTokens([...tokens, newToken]);
  };

  const selectedDoc = docTopics.find(d => d.id === selectedDocId);

  return (
    <header className="h-16 border-b border-soc-border bg-soc-card flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white capitalize">
          {activeTab.replace('-', ' ')}
        </h2>
        <div className="h-4 w-[1px] bg-soc-border"></div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-soc-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder={t.search}
            className="bg-soc-bg border border-soc-border rounded-full py-1.5 pl-10 pr-4 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-soc-primary/50 transition-all text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Alertas */}
        <div className="relative">
          <button onClick={toggleAlerts} className={`p-2 rounded-full transition-all relative ${isAlertsOpen ? 'bg-soc-primary/20 text-soc-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-soc-danger rounded-full border-2 border-soc-card"></span>
          </button>
          {isAlertsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/50">
              <div className="p-4 border-b border-soc-border bg-gray-900/30 flex justify-between items-center">
                <h3 className="font-bold text-sm text-white">{t.alertsTitle}</h3>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-soc-border">
                {mockAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    onClick={() => handleAlertClick(alert)}
                    className="p-4 hover:bg-gray-800/30 transition-colors cursor-pointer group flex gap-3"
                  >
                    <div className={`shrink-0 w-2 h-2 mt-1.5 rounded-full ${
                      alert.type === 'critical' ? 'bg-soc-danger' : 'bg-soc-warning'
                    }`}></div>
                    <div>
                      <p className="text-xs font-bold text-gray-100 group-hover:text-soc-primary transition-colors">
                        {language === 'en' ? alert.title : alert.pt}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{alert.desc}</p>
                      <p className="text-[9px] text-gray-600 mt-1 font-mono uppercase">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-gray-900/50 text-[10px] font-bold text-gray-500 hover:text-white transition-colors border-t border-soc-border uppercase tracking-widest">{t.viewAllAlerts}</button>
            </div>
          )}
        </div>

        {/* Configurações */}
        <div className="relative">
          <button onClick={toggleSettings} className={`p-2 rounded-full transition-all ${isSettingsOpen ? 'bg-soc-primary/20 text-soc-primary rotate-45' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <Settings size={20} />
          </button>
          {isSettingsOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/50">
              <div className="p-4 border-b border-soc-border bg-gray-900/30">
                <p className="text-xs font-bold text-white">{t.settingsTitle}</p>
              </div>
              <div className="p-2 space-y-1">
                <button onClick={() => handleConfigClick('Profile')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
                  <User size={16} className="group-hover:text-soc-primary" /> {t.profile}
                </button>
                <button onClick={() => handleConfigClick('Security')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
                  <Shield size={16} className="group-hover:text-soc-primary" /> {t.policy}
                </button>
                <button onClick={() => handleConfigClick('API')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
                  <Key size={16} className="group-hover:text-soc-primary" /> {t.tokens}
                </button>
                <div className="h-[1px] bg-soc-border my-1 mx-2"></div>
                <button onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-soc-accent hover:bg-soc-accent/10 transition-all text-left">
                  <Languages size={16} /> {t.langSwitch}
                </button>
                <div className="h-[1px] bg-soc-border my-1 mx-2"></div>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-soc-danger hover:bg-red-500/10 transition-all text-left">
                  <LogOut size={16} /> {t.logout}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-soc-border mx-2"></div>

        {/* Menu de Ajuda */}
        <div className="relative">
          <button onClick={toggleHelp} className={`p-2 rounded-full transition-all ${isHelpOpen ? 'bg-soc-primary/20 text-soc-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <HelpCircle size={20} />
          </button>
          {isHelpOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/50">
              <div className="p-4 border-b border-soc-border bg-gray-900/30">
                <p className="text-xs font-bold text-white">{t.helpCenter}</p>
              </div>
              <div className="p-2 space-y-1">
                <button onClick={() => handleHelpClick('Docs')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
                  <BookOpen size={16} className="group-hover:text-soc-primary" /> {t.docs}
                </button>
                <button onClick={() => handleHelpClick('Support')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
                  <MessageSquare size={16} className="group-hover:text-soc-primary" /> {t.support}
                </button>
                <button onClick={() => handleHelpClick('Shortcuts')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
                  <Keyboard size={16} className="group-hover:text-soc-primary" /> {t.shortcuts}
                </button>
                <div className="h-[1px] bg-soc-border my-1 mx-2"></div>
                <button onClick={() => handleHelpClick('About')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all group text-left">
                  <Info size={16} className="group-hover:text-soc-primary" /> {t.about}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ALERT DOSSIER DETAILS */}
      {selectedAlert && (
        <div className="fixed inset-0 z-[110] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="w-full max-w-lg bg-soc-card border border-soc-border rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col">
              <div className="p-6 border-b border-soc-border bg-gray-900/40 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className={`p-3 rounded-2xl ${
                     selectedAlert.type === 'critical' ? 'bg-soc-danger/10 text-soc-danger' : 'bg-soc-warning/10 text-soc-warning'
                   }`}>
                     <ShieldAlert size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white">Intelligence Notification</h3>
                     <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{selectedAlert.time}</p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedAlert(null)} className="text-gray-500 hover:text-white transition-colors">
                   <X size={24} />
                 </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white leading-tight">
                    {language === 'en' ? selectedAlert.title : selectedAlert.pt}
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-soc-bg border border-soc-border px-2.5 py-1 rounded-full">
                       <Activity size={14} className="text-soc-primary" /> 
                       Impact Score: <span className={selectedAlert.type === 'critical' ? 'text-soc-danger' : 'text-soc-warning'}>{selectedAlert.impactScore}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-soc-bg border border-soc-border px-2.5 py-1 rounded-full">
                       <Shield size={14} className="text-soc-success" /> Verified Source
                    </div>
                  </div>
                </div>

                <div className="bg-soc-bg/50 border border-soc-border rounded-2xl p-5 space-y-4 shadow-inner">
                   <p className="text-sm text-gray-300 leading-relaxed">
                     {selectedAlert.longDesc || selectedAlert.desc}
                   </p>
                </div>

                <div className="flex flex-col gap-3">
                   <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                     <AlertTriangle size={14} className="text-soc-warning" /> Tactical Action Required
                   </h5>
                   <div className="text-xs text-gray-400 italic bg-gray-900/40 p-3 rounded-xl border border-soc-border">
                     "Evaluate infrastructure exposure to the identified IOCs and synchronize with the next SOAR cycle. Monitor for lateral movements within the network segments mentioned."
                   </div>
                </div>
              </div>

              <div className="p-8 bg-gray-900/30 border-t border-soc-border flex gap-3">
                 <button 
                  onClick={() => window.open(selectedAlert.sourceUrl, '_blank')}
                  className="flex-1 bg-soc-primary hover:bg-soc-primary/80 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-soc-primary/20 hover:scale-[1.02]"
                 >
                   <ExternalLink size={18} /> Analyze External Source
                 </button>
                 <button 
                  onClick={() => setSelectedAlert(null)}
                  className="px-6 border border-soc-border hover:bg-gray-800 text-gray-400 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2"
                 >
                   <CheckCircle2 size={18} /> Acknowledge
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL DE AJUDA E DOCUMENTAÇÃO INTEGRADO */}
      {activeHelpModal && (
        <div className="fixed inset-0 z-[110] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/10">
             <div className="p-6 border-b border-soc-border flex justify-between items-center bg-gray-900/40">
                <div className="flex items-center gap-3">
                  {selectedDocId ? (
                    <button onClick={() => setSelectedDocId(null)} className="p-2 hover:bg-gray-800 rounded-lg text-soc-primary transition-all">
                      <ArrowLeft size={20} />
                    </button>
                  ) : (
                    <HelpCircle className="text-soc-primary" size={24} />
                  )}
                  <h3 className="text-xl font-bold text-white">
                    {selectedDocId ? selectedDoc?.title : 
                     activeHelpModal === 'Docs' ? t.docs : 
                     activeHelpModal === 'Support' ? t.support : 
                     activeHelpModal === 'Shortcuts' ? t.shortcuts : t.about}
                  </h3>
                </div>
                <button onClick={() => setActiveHelpModal(null)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8">
               {/* VIEW: DOCUMENTATION (GRID + SEARCH) */}
               {activeHelpModal === 'Docs' && !selectedDocId && (
                 <div className="space-y-6">
                    <div className="relative mb-6 group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-soc-primary transition-colors" size={16} />
                      <input 
                        type="text" 
                        value={searchDocs}
                        onChange={(e) => setSearchDocs(e.target.value)}
                        placeholder={language === 'en' ? 'Search topics or articles...' : 'Buscar tópicos ou artigos...'} 
                        className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-1 focus:ring-soc-primary text-white outline-none transition-all" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDocs.length > 0 ? filteredDocs.map(doc => (
                        <button 
                          key={doc.id} 
                          onClick={() => setSelectedDocId(doc.id)}
                          className="p-4 bg-gray-900/50 border border-soc-border rounded-xl text-left hover:border-soc-primary/50 transition-all group flex gap-4"
                        >
                           <div className="w-10 h-10 rounded-lg bg-soc-primary/10 flex items-center justify-center text-soc-primary shrink-0 group-hover:scale-110 transition-transform">
                             <doc.icon size={20} />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-white group-hover:text-soc-primary">{doc.title}</p>
                             <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{doc.desc}</p>
                           </div>
                        </button>
                      )) : (
                        <div className="col-span-2 py-20 text-center opacity-50">
                           <Search size={40} className="mx-auto mb-4" />
                           <p className="text-sm">{language === 'en' ? 'No documentation found.' : 'Nenhuma documentação encontrada.'}</p>
                        </div>
                      )}
                    </div>
                 </div>
               )}

               {/* VIEW: ARTICLE CONTENT */}
               {selectedDocId && selectedDoc && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-2 text-xs font-bold text-soc-primary uppercase tracking-widest">
                      <selectedDoc.icon size={14} />
                      {selectedDoc.title}
                    </div>
                    <div className="prose prose-invert max-w-none">
                       <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap bg-gray-900/50 p-6 rounded-2xl border border-soc-border font-mono">
                         {selectedDoc.content}
                       </p>
                    </div>
                    <div className="pt-6 border-t border-soc-border flex justify-between">
                       <button onClick={() => setSelectedDocId(null)} className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2">
                         <ArrowLeft size={14} /> {t.back}
                       </button>
                       <button className="text-xs font-bold text-soc-primary hover:underline flex items-center gap-2">
                         <ExternalLink size={14} /> {language === 'en' ? 'Full Reference' : 'Referência Completa'}
                       </button>
                    </div>
                 </div>
               )}

               {/* VIEW: SUPPORT */}
               {activeHelpModal === 'Support' && (
                 <div className="space-y-6 text-center py-4">
                    <div className="w-20 h-20 bg-soc-success/10 rounded-full flex items-center justify-center mx-auto text-soc-success mb-2">
                       <MessageSquare size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-white">{language === 'en' ? 'Need Tactical Assistance?' : 'Precisa de Assistência Tática?'}</h4>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">{language === 'en' ? 'Our Cyber Intelligence Response Team is available 24/7 for Enterprise Tier customers.' : 'Nossa Equipe de Resposta em Inteligência está disponível 24/7 para clientes Enterprise.'}</p>
                    <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
                      <button className="py-3 bg-soc-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"><Terminal size={18} /> {language === 'en' ? 'Open Intelligence Ticket' : 'Abrir Ticket de Inteligência'}</button>
                      <button className="py-3 bg-soc-bg border border-soc-border text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"><MessageSquare size={18} /> {language === 'en' ? 'Live Chat (Priority One)' : 'Chat ao Vivo (Prioridade 1)'}</button>
                    </div>
                 </div>
               )}

               {/* VIEW: KEYBOARD SHORTCUTS */}
               {activeHelpModal === 'Shortcuts' && (
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {[
                        { key: 'G + D', label: 'Go to Dashboard', pt: 'Ir para Dashboard' },
                        { key: 'G + A', label: 'Go to Threat Actors', pt: 'Ir para Atores' },
                        { key: 'G + I', label: 'Go to Indicators', pt: 'Ir para Indicadores' },
                        { key: 'S', label: 'Focus Search', pt: 'Focar na Busca' },
                        { key: 'Esc', label: 'Close Modals', pt: 'Fechar Modais' },
                        { key: '?', label: 'Open Help', pt: 'Abrir Ajuda' }
                      ].map(sc => (
                        <div key={sc.key} className="flex items-center justify-between py-2 border-b border-soc-border">
                          <span className="text-sm text-gray-400">{language === 'en' ? sc.label : sc.pt}</span>
                          <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] font-mono text-soc-primary font-bold shadow-sm">{sc.key}</kbd>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {/* VIEW: ABOUT */}
               {activeHelpModal === 'About' && (
                 <div className="space-y-8">
                    <div className="flex flex-col items-center">
                       <div className="w-16 h-16 bg-soc-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-soc-primary/20"><Shield size={32} className="text-white" /></div>
                       <h4 className="text-2xl font-black text-white tracking-tighter">SENTINEL<span className="text-soc-primary">CTI</span></h4>
                       <p className="text-xs text-gray-500 font-mono mt-1">v2.5.0-STABLE "Aegis" • Build #48291</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="bg-soc-bg border border-soc-border p-3 rounded-xl flex flex-col items-center gap-1">
                          <Cpu size={16} className="text-soc-accent" /><p className="text-[10px] text-gray-500 font-bold uppercase">Kernel</p><p className="text-xs text-white font-mono">v5.15-HARDENED</p>
                       </div>
                       <div className="bg-soc-bg border border-soc-border p-3 rounded-xl flex flex-col items-center gap-1">
                          <Wifi size={16} className="text-soc-success" /><p className="text-[10px] text-gray-500 font-bold uppercase">Network</p><p className="text-xs text-white font-mono">ENCRYPTED/TLS</p>
                       </div>
                       <div className="bg-soc-bg border border-soc-border p-3 rounded-xl flex flex-col items-center gap-1">
                          <HardDrive size={16} className="text-soc-warning" /><p className="text-[10px] text-gray-500 font-bold uppercase">Storage</p><p className="text-xs text-white font-mono">HOT-SWAP/IMMUTABLE</p>
                       </div>
                    </div>
                    <div className="bg-gray-900/80 p-4 rounded-xl border border-soc-border font-mono text-[11px] text-gray-400 space-y-1">
                       <p className="text-soc-primary font-bold"># SENTINEL CTI SYSTEM LOGS</p>
                       <p>> Initializing Threat Database... [OK]</p><p>> Verifying STIX 2.1 Compliance... [OK]</p><p>> Syncing with Darkweb Crawlers... [OK]</p><p>> Status: Fully Operational</p>
                    </div>
                 </div>
               )}
             </div>

             <div className="p-6 bg-gray-900/30 border-t border-soc-border flex justify-center">
                <button onClick={() => setActiveHelpModal(null)} className="px-10 py-2.5 bg-soc-bg border border-soc-border text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl text-sm font-bold transition-all">{t.close}</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURAÇÃO (Mantido do anterior para persistência) */}
      {activeConfigModal && (
        <div className="fixed inset-0 z-[100] bg-soc-bg/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-soc-card border border-soc-border rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="p-6 border-b border-soc-border flex justify-between items-center bg-gray-900/40">
              <div className="flex items-center gap-3">
                <Settings className="text-soc-primary" size={24} />
                <h3 className="text-xl font-bold text-white">
                  {activeConfigModal === 'Profile' ? t.profile : activeConfigModal === 'Security' ? t.policy : t.tokens}
                </h3>
              </div>
              <button onClick={() => setActiveConfigModal(null)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              {activeConfigModal === 'Profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-soc-bg border border-soc-border rounded-xl">
                    <div className="w-12 h-12 bg-soc-primary/20 rounded-full flex items-center justify-center text-soc-primary"><User size={24} /></div>
                    <div><p className="text-sm font-bold text-white">Sentinel Administrator</p><p className="text-xs text-gray-500">Tier 1 SOC Analyst • Active</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setAutoSync(!autoSync)} className={`p-4 rounded-xl border transition-all text-left ${autoSync ? 'bg-soc-success/5 border-soc-success/30' : 'bg-gray-900 border-soc-border'}`}>
                      <div className="flex justify-between items-center mb-1"><p className="text-[10px] text-gray-500 uppercase font-bold">{t.autoSync}</p><Power size={12} className={autoSync ? 'text-soc-success' : 'text-gray-500'} /></div>
                      <p className={`text-xs font-bold tracking-widest ${autoSync ? t.enabled : t.disabled}`}>{autoSync ? t.enabled : t.disabled}</p>
                    </button>
                    <button onClick={cycleAuditLevel} className="p-4 bg-gray-900 border border-soc-border rounded-xl hover:border-soc-primary/50 transition-all text-left group">
                      <div className="flex justify-between items-center mb-1"><p className="text-[10px] text-gray-500 uppercase font-bold">{t.auditLevel}</p><RefreshCcw size={12} className="text-gray-500 group-hover:rotate-180 transition-transform duration-500" /></div>
                      <p className={`text-xs font-bold tracking-widest ${auditLevel === 'FORENSIC' ? 'text-soc-danger' : auditLevel === 'EXTENDED' ? 'text-soc-warning' : 'text-soc-primary'}`}>{auditLevel}</p>
                    </button>
                  </div>
                </div>
              )}
              {activeConfigModal === 'Security' && (
                <div className="space-y-4">
                  <div className="p-4 bg-soc-bg border border-soc-border rounded-xl flex items-center justify-between">
                    <div><p className="text-sm font-bold text-white">{t.mfa}</p><p className="text-xs text-gray-500">Enforce FIDO2/WebAuthn</p></div>
                    <button onClick={() => setMfaEnabled(!mfaEnabled)} className={`w-12 h-6 rounded-full relative transition-all ${mfaEnabled ? 'bg-soc-primary' : 'bg-gray-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${mfaEnabled ? 'left-7' : 'left-1'}`}></div></button>
                  </div>
                  <div className="p-4 bg-soc-bg border border-soc-border rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">{t.timeout}</p>
                    <div className="flex gap-2">
                      {['15m', '30m', '1h', '4h'].map(time => (
                        <button key={time} onClick={() => setSessionTimeout(time)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${sessionTimeout === time ? 'bg-soc-primary/20 border-soc-primary text-white' : 'bg-gray-900 border-soc-border text-gray-500'}`}>{time}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeConfigModal === 'API' && (
                <div className="space-y-4">
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {tokens.map(token => (
                      <div key={token.id} className="p-3 bg-soc-bg border border-soc-border rounded-xl flex items-center justify-between group">
                        <div className="min-w-0 flex-1 mr-3"><p className="text-xs font-bold text-white truncate">{token.name}</p><p className="text-[10px] text-gray-600 font-mono truncate">{token.key}</p></div>
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-gray-800 text-gray-500 rounded"><Copy size={12} /></button>
                          <button onClick={() => setTokens(tokens.filter(t => t.id !== token.id))} className="p-1.5 hover:bg-soc-danger/10 text-gray-500 hover:text-soc-danger rounded"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={generateToken} className="w-full py-2 bg-soc-bg border border-dashed border-soc-border text-gray-500 hover:text-soc-primary hover:border-soc-primary transition-all rounded-xl text-xs font-bold flex items-center justify-center gap-2"><Plus size={16} /> {t.genToken}</button>
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-900/30 border-t border-soc-border flex gap-3">
               <button onClick={() => setActiveConfigModal(null)} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-white transition-colors">{t.cancel}</button>
               <button onClick={() => setActiveConfigModal(null)} className="flex-1 py-2 bg-soc-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"><Save size={16} /> {t.save}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
