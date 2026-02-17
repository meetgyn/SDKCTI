
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './views/Dashboard';
import { ThreatActorsView } from './views/ThreatActorsView';
import { IndicatorsView } from './views/IndicatorsView';
import { InsiderView } from './views/InsiderView';
import { PlaybooksView } from './views/PlaybooksView';
import { SupplierAssessmentView } from './views/SupplierAssessmentView';
import { PasswordLeaksView } from './views/PasswordLeaksView';
import { RansomwareVictimsView } from './views/RansomwareVictimsView';
import { StixGraphView } from './views/StixGraphView';
import { CisaKevView } from './views/CisaKevView';
import { AssetMonitorView } from './views/AssetMonitorView';
import { ThreatFeedsView } from './views/ThreatFeedsView';
import { ScopeAssetsView } from './views/ScopeAssetsView';
import { IntelligenceReporterView } from './views/IntelligenceReporterView';
import { CorrelationCenter } from './views/CorrelationCenter';

export type Language = 'en' | 'pt';

export interface SystemSettings {
  user_name: string;
  user_role: string;
  system_name: string;
  accent_color: string;
}

export interface AuthSite {
  id: string;
  name: string;
  url: string;
  user: string;
  pass: string;
}

export interface ScopeAsset {
  id: string;
  type: 'Domain' | 'IP' | 'Keyword' | 'EmailDomain';
  value: string;
  status: 'Verifying' | 'Protected' | 'Exposed';
  lastSeen: string;
  tags: string[];
}

const API_URL = 'http://localhost:3001/api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('pt');
  const [scopeAssets, setScopeAssets] = useState<ScopeAsset[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    user_name: 'Carregando...',
    user_role: 'Analista',
    system_name: 'ThreatOne',
    accent_color: '#3b82f6'
  });

  const [monitoredForums, setMonitoredForums] = useState(['XSS.is', 'Exploit.in', 'BreachForums']);
  const [monitoredChats, setMonitoredChats] = useState(['Telegram: @darknet_intel', 'Discord: Ops Brazil']);
  const [authSites, setAuthSites] = useState<AuthSite[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        const [assetsRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/assets`),
          fetch(`${API_URL}/settings`)
        ]);
        
        const assetsData = await assetsRes.json();
        const settingsData = await settingsRes.json();

        setScopeAssets(assetsData.map((item: any) => ({
          id: item.id.toString(),
          type: item.type,
          value: item.value,
          status: item.status,
          lastSeen: item.last_seen,
          tags: ['MySQL']
        })));

        if (settingsData.user_name) {
          setSettings(settingsData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    loadData();
  }, []);

  const handleUpdateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      setSettings(updated);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard language={language} />;
      case 'correlation': return <CorrelationCenter scopeAssets={scopeAssets} />;
      case 'threat-actors': return <ThreatActorsView />;
      case 'indicators': return <IndicatorsView />;
      case 'insider': return <InsiderView monitoredForums={monitoredForums} monitoredChats={monitoredChats} />;
      case 'playbooks': return <PlaybooksView />;
      case 'suppliers': return <SupplierAssessmentView />;
      case 'leaks': return <PasswordLeaksView />;
      case 'stackmon': return <AssetMonitorView scopeAssets={scopeAssets} />;
      case 'ransomware': return <RansomwareVictimsView />;
      case 'stix-graph': return <StixGraphView />;
      case 'cisa-kev': return <CisaKevView />;
      case 'feeds': return <ThreatFeedsView />;
      case 'scope': return <ScopeAssetsView assets={scopeAssets} setAssets={setScopeAssets} />;
      case 'reports': return <IntelligenceReporterView />;
      default: return <Dashboard language={language} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-soc-bg font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        language={language} 
        settings={settings}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeTab={activeTab} 
          language={language} 
          setLanguage={setLanguage} 
          monitoredForums={monitoredForums}
          setMonitoredForums={setMonitoredForums}
          monitoredChats={monitoredChats}
          setMonitoredChats={setMonitoredChats}
          authSites={authSites}
          setAuthSites={setAuthSites}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
