
import React, { useState } from 'react';
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

export interface AuthSite {
  id: string;
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('en');

  // Global Monitoring State
  const [monitoredForums, setMonitoredForums] = useState(['XSS.is', 'Exploit.in', 'BreachForums']);
  const [monitoredChats, setMonitoredChats] = useState(['Telegram: @darknet_intel', 'Discord: Ops Brazil']);
  const [authSites, setAuthSites] = useState<AuthSite[]>([
    { id: '1', url: 'https://intel-source.example.com', user: 'analyst_01', pass: '********' }
  ]);

  // Global Scope State
  const [scopeAssets, setScopeAssets] = useState<ScopeAsset[]>([
    { id: '1', type: 'Domain', value: 'empresa-cliente.com.br', status: 'Protected', lastSeen: '10 mins ago', tags: ['Principal', 'Web'] },
    { id: '2', type: 'IP', value: '200.155.10.0/24', status: 'Protected', lastSeen: '1 hour ago', tags: ['DataCenter', 'DMZ'] },
    { id: '3', type: 'Keyword', value: 'EmpresaClienteOficial', status: 'Exposed', lastSeen: '2 mins ago', tags: ['Brand Protection'] },
  ]);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard language={language} />;
      case 'correlation': return <CorrelationCenter scopeAssets={scopeAssets} />;
      case 'threat-actors': return <ThreatActorsView />;
      case 'indicators': return <IndicatorsView />;
      case 'insider': return (
        <InsiderView 
          monitoredForums={monitoredForums} 
          monitoredChats={monitoredChats} 
        />
      );
      case 'playbooks': return <PlaybooksView />;
      case 'suppliers': return <SupplierAssessmentView />;
      case 'leaks': return <PasswordLeaksView />;
      case 'stackmon': return (
        <AssetMonitorView 
          scopeAssets={scopeAssets} 
        />
      );
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
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
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
