
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

export type Language = 'en' | 'pt';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('en');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard language={language} />;
      case 'threat-actors': return <ThreatActorsView />;
      case 'indicators': return <IndicatorsView />;
      case 'insider': return <InsiderView />;
      case 'playbooks': return <PlaybooksView />;
      case 'suppliers': return <SupplierAssessmentView />;
      case 'leaks': return <PasswordLeaksView />;
      case 'stackmon': return <AssetMonitorView />;
      case 'ransomware': return <RansomwareVictimsView />;
      case 'stix-graph': return <StixGraphView />;
      case 'cisa-kev': return <CisaKevView />;
      default: return <Dashboard language={language} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-soc-bg font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} language={language} setLanguage={setLanguage} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
