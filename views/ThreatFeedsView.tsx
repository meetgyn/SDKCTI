
import React, { useState } from 'react';
import { 
  Activity, RefreshCcw, ExternalLink, Globe, ShieldAlert, 
  Search, Filter, Zap, Target, Database, Terminal, 
  FileCode, Mail, X, Info, ShieldCheck, BarChart3, Loader2
} from 'lucide-react';

interface FeedArtifact {
  value: string;
  type: 'IP' | 'Domain' | 'Hash' | 'URL';
  severity: 'High' | 'Medium' | 'Low';
}

interface ThreatFeed {
  id: string;
  source: string;
  category: string;
  lastUpdate: string;
  reliability: 'High' | 'Medium';
  description: string;
  artifacts: FeedArtifact[];
  sourceUrl: string;
}

const mockFeeds: ThreatFeed[] = [
  {
    id: 'f-1',
    source: 'CISA Automated Indicator Sharing',
    category: 'State Sponsored',
    lastUpdate: '5 mins ago',
    reliability: 'High',
    description: 'Indicadores técnicos relacionados a exploração ativa de vulnerabilidades de dia zero em firewalls de borda.',
    sourceUrl: 'https://www.cisa.gov/resources-tools/programs/automated-indicator-sharing-ais',
    artifacts: [
      { value: '194.26.135.212', type: 'IP', severity: 'High' },
      { value: 'system-update-fix.com', type: 'Domain', severity: 'High' },
      { value: '64d26663f738f65e219...', type: 'Hash', severity: 'Medium' }
    ]
  },
  {
    id: 'f-2',
    source: 'Abuse.ch Ransomware Tracker',
    category: 'CrimeWare',
    lastUpdate: '12 mins ago',
    reliability: 'High',
    description: 'Novos servidores de C2 identificados para a botnet IcedID e infraestrutura de suporte a LockBit.',
    sourceUrl: 'https://ransomwaretracker.abuse.ch/',
    artifacts: [
      { value: '45.153.242.129', type: 'IP', severity: 'High' },
      { value: 'http://cdn.top-service.net/dl', type: 'URL', severity: 'High' }
    ]
  },
  {
    id: 'f-3',
    source: 'FBI Flash Alert',
    category: 'Advisory',
    lastUpdate: '1 hour ago',
    reliability: 'High',
    description: 'Indicadores de comprometimento associados a campanhas de spear-phishing visando o setor de energia.',
    sourceUrl: 'https://www.ic3.gov/',
    artifacts: [
      { value: 'hr-portal-secure.com', type: 'Domain', severity: 'High' },
      { value: 'e3b0c44298fc1c149af...', type: 'Hash', severity: 'High' },
      { value: '103.212.94.11', type: 'IP', severity: 'Medium' }
    ]
  }
];

export const ThreatFeedsView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<FeedArtifact | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const openIntelSource = (artifact: FeedArtifact, engine: 'VT' | 'OTX' | 'ABUSE') => {
    let url = '';
    const val = encodeURIComponent(artifact.value);
    
    if (engine === 'VT') {
      url = `https://www.virustotal.com/gui/search/${val}`;
    } else if (engine === 'OTX') {
      url = `https://otx.alienvault.com/indicator/${artifact.type.toLowerCase()}/${val}`;
    } else if (engine === 'ABUSE') {
      url = artifact.type === 'IP' 
        ? `https://abuseipdb.com/check/${val}` 
        : `https://urlhaus.abuse.ch/browse.php?search=${val}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="text-soc-primary" /> Active Threat Feeds
          </h1>
          <p className="text-sm text-gray-500">Agregação em tempo real de inteligência de código aberto e proprietária.</p>
        </div>
        <button 
          onClick={handleSync}
          className="flex items-center gap-2 px-4 py-2 bg-soc-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-primary/20 hover:scale-105 transition-all"
        >
          <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing Feeds...' : 'Force Sync Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockFeeds.map((feed) => (
          <div key={feed.id} className="bg-soc-card border border-soc-border rounded-2xl overflow-hidden shadow-xl hover:border-soc-primary/30 transition-all">
            <div className="p-5 border-b border-soc-border bg-gray-900/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-soc-primary/10 rounded-lg text-soc-primary">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white">{feed.source}</h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{feed.category} • Updated {feed.lastUpdate}</p>
                </div>
              </div>
              <button 
                onClick={() => window.open(feed.sourceUrl, '_blank')}
                className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                title="View Feed Source"
              >
                <ExternalLink size={18} />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} className="text-soc-primary" /> Feed Context
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  "{feed.description}"
                </p>
                <div className="flex items-center gap-3 p-3 bg-soc-bg border border-soc-border rounded-xl">
                  <ShieldCheck size={18} className="text-soc-success" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Confidence Score</p>
                    <p className="text-xs text-white font-bold">{feed.reliability} Reliability</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-soc-warning" /> Extracted Artifacts (Click to Investigate)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {feed.artifacts.map((artifact, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedArtifact(artifact)}
                      className="flex items-center justify-between p-3 bg-soc-bg border border-soc-border rounded-xl hover:border-soc-primary hover:bg-soc-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded bg-gray-900 border border-soc-border group-hover:border-soc-primary/30 transition-colors`}>
                          {artifact.type === 'IP' ? <Globe size={14} /> : 
                           artifact.type === 'Domain' ? <ShieldAlert size={14} /> : 
                           artifact.type === 'Hash' ? <Terminal size={14} /> : <FileCode size={14} />}
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-soc-primary truncate max-w-[150px]">
                          {artifact.value}
                        </span>
                      </div>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                        artifact.severity === 'High' ? 'bg-soc-danger/10 text-soc-danger border-soc-danger/20' : 'bg-soc-warning/10 text-soc-warning border-soc-warning/20'
                      }`}>
                        {artifact.severity}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK INTEL MODAL */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-[150] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-full max-w-md bg-soc-card border border-soc-border rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="p-6 border-b border-soc-border bg-gray-900/40 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-soc-accent/10 rounded-2xl text-soc-accent border border-soc-accent/20">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Quick Intel Pivot</h3>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Target: {selectedArtifact.type}</p>
                </div>
              </div>
              <button onClick={() => setSelectedArtifact(null)} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-soc-bg border border-soc-border rounded-2xl p-5 flex flex-col items-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Analyzing Artifact</p>
                <p className="text-lg font-black text-white font-mono break-all text-center">{selectedArtifact.value}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => openIntelSource(selectedArtifact, 'VT')}
                  className="flex items-center justify-between p-4 bg-gray-900 border border-soc-border rounded-2xl hover:bg-soc-primary/10 hover:border-soc-primary transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-soc-bg flex items-center justify-center text-gray-500 group-hover:text-soc-primary">
                      <ShieldAlert size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">VirusTotal Analysis</p>
                      <p className="text-[10px] text-gray-500">Multi-engine malware scan</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-700 group-hover:text-soc-primary" />
                </button>

                <button 
                  onClick={() => openIntelSource(selectedArtifact, 'OTX')}
                  className="flex items-center justify-between p-4 bg-gray-900 border border-soc-border rounded-2xl hover:bg-soc-accent/10 hover:border-soc-accent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-soc-bg flex items-center justify-center text-gray-500 group-hover:text-soc-accent">
                      <Target size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">AlienVault OTX</p>
                      <p className="text-[10px] text-gray-500">Community pulse & relations</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-700 group-hover:text-soc-accent" />
                </button>

                <button 
                  onClick={() => openIntelSource(selectedArtifact, 'ABUSE')}
                  className="flex items-center justify-between p-4 bg-gray-900 border border-soc-border rounded-2xl hover:bg-soc-warning/10 hover:border-soc-warning transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-soc-bg flex items-center justify-center text-gray-500 group-hover:text-soc-warning">
                      <Globe size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{selectedArtifact.type === 'IP' ? 'AbuseIPDB' : 'URLHaus'}</p>
                      <p className="text-[10px] text-gray-500">Reputation & Abuse reports</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-700 group-hover:text-soc-warning" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-gray-900/30 border-t border-soc-border flex gap-3">
              <button 
                onClick={() => setSelectedArtifact(null)}
                className="w-full py-3 bg-gray-800 text-gray-400 rounded-2xl font-bold hover:text-white hover:bg-gray-700 transition-all"
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
