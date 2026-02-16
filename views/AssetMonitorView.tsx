
import React, { useState, useMemo } from 'react';
import { 
  Monitor, Search, Github, Gitlab, Globe, ExternalLink, 
  ShieldAlert, Activity, Filter, Building2, HardDrive, 
  Code, AlertTriangle, CheckCircle2, RefreshCcw
} from 'lucide-react';

interface AssetRepo {
  id: string;
  name: string;
  provider: 'GitHub' | 'GitLab' | 'Bitbucket';
  organization: string;
  leakType: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  lastScan: string;
  url: string;
}

const mockAssets: AssetRepo[] = [
  { id: '1', name: 'internal-payment-api', provider: 'GitHub', organization: 'AcmeFinancial', leakType: 'AWS Access Key', riskLevel: 'High', lastScan: '2024-05-24 10:15', url: 'https://github.com/AcmeFinancial/internal-payment-api' },
  { id: '2', name: 'dev-config-secrets', provider: 'GitLab', organization: 'InfraOps', leakType: 'Hardcoded Password', riskLevel: 'High', lastScan: '2024-05-23 18:42', url: 'https://gitlab.com/InfraOps/dev-config-secrets' },
  { id: '3', name: 'legacy-website-v2', provider: 'GitHub', organization: 'AcmeFinancial', leakType: 'PII in .env', riskLevel: 'Medium', lastScan: '2024-05-24 09:00', url: 'https://github.com/AcmeFinancial/legacy-website-v2' },
  { id: '4', name: 'mobile-app-keys', provider: 'Bitbucket', organization: 'MobileSquad', leakType: 'Google API Key', riskLevel: 'Low', lastScan: '2024-05-22 14:10', url: 'https://bitbucket.org/MobileSquad/mobile-app-keys' },
  { id: '5', name: 'shadow-hr-portal', provider: 'GitHub', organization: 'Unknown/UserPersonal', leakType: 'Database Credentials', riskLevel: 'High', lastScan: '2024-05-24 11:55', url: 'https://github.com/ShadowUser/hr-portal' },
];

export const AssetMonitorView: React.FC = () => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [orgFilter, setOrgFilter] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredAssets = useMemo(() => {
    return mockAssets.filter(asset => {
      const matchSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchProvider = selectedProvider === 'All' || asset.provider === selectedProvider;
      const matchOrg = asset.organization.toLowerCase().includes(orgFilter.toLowerCase());
      return matchSearch && matchProvider && matchOrg;
    });
  }, [searchTerm, selectedProvider, orgFilter]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Monitor className="text-soc-accent" /> StackMon™ Asset Intelligence
          </h1>
          <p className="text-sm text-gray-500">Continuous surface monitoring for source code leaks and shadow IT.</p>
        </div>
        <button 
          onClick={handleManualSync}
          className="flex items-center gap-2 px-4 py-2 bg-soc-card border border-soc-border hover:border-soc-accent text-gray-300 rounded-xl text-sm font-bold transition-all"
        >
          <RefreshCcw size={16} className={isSyncing ? 'animate-spin text-soc-accent' : ''} />
          {isSyncing ? 'Syncing...' : 'Force Global Scan'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-soc-accent/5 rotate-12 group-hover:scale-110 transition-transform duration-500">
             <Code size={100} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Monitored Repos</p>
          <p className="text-3xl font-black text-white">2,482</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-soc-danger/5 rotate-12 group-hover:scale-110 transition-transform duration-500">
             <ShieldAlert size={100} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Exposure Incidents</p>
          <p className="text-3xl font-black text-soc-danger">{mockAssets.filter(a => a.riskLevel === 'High').length}</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-soc-success/5 rotate-12 group-hover:scale-110 transition-transform duration-500">
             <Building2 size={100} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Shadow Orgs Detected</p>
          <p className="text-3xl font-black text-white">12</p>
        </div>
      </div>

      {/* SEARCH & FILTERS SECTION */}
      <div className="bg-soc-card border border-soc-border rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Filter size={14} /> Intelligence Configuration & Filters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Global Search */}
          <div className="md:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by repo name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soc-bg border border-soc-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-soc-accent outline-none text-white transition-all"
            />
          </div>

          {/* Providers Selector */}
          <div className="md:col-span-2 flex gap-2">
            {['All', 'GitHub', 'GitLab', 'Bitbucket'].map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  selectedProvider === provider 
                    ? 'bg-soc-accent border-soc-accent text-white shadow-lg shadow-soc-accent/20' 
                    : 'bg-soc-bg border-soc-border text-gray-500 hover:text-white hover:border-gray-700'
                }`}
              >
                {provider === 'GitHub' && <Github size={14} />}
                {provider === 'GitLab' && <Gitlab size={14} />}
                {provider === 'Bitbucket' && <Activity size={14} />}
                {provider}
              </button>
            ))}
          </div>

          {/* Organization Filter */}
          <div className="md:col-span-1 relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter by Organization..."
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="w-full bg-soc-bg border border-soc-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-soc-accent outline-none text-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* RESULTS TABLE */}
      <div className="bg-soc-card border border-soc-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-soc-border bg-gray-900/30 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <HardDrive size={18} className="text-soc-accent" /> Detected Vulnerable Repositories
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Found {filteredAssets.length} matching entries</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-soc-border">
                <th className="px-6 py-5">Repository Name</th>
                <th className="px-6 py-5">Provider</th>
                <th className="px-6 py-5">Organization</th>
                <th className="px-6 py-5">Leak Signature</th>
                <th className="px-6 py-5">Risk</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-border">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-800/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-soc-accent transition-colors">
                        <Code size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-100">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {asset.provider === 'GitHub' ? <Github size={14} /> : asset.provider === 'GitLab' ? <Gitlab size={14} /> : <Activity size={14} />}
                      {asset.provider}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500 font-medium">{asset.organization}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-soc-danger bg-soc-danger/10 border border-soc-danger/20 px-2 py-1 rounded-lg">
                      {asset.leakType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      asset.riskLevel === 'High' ? 'text-red-500' : 
                      asset.riskLevel === 'Medium' ? 'text-orange-500' : 'text-blue-500'
                    }`}>
                      {asset.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => window.open(asset.url, '_blank')}
                      className="px-4 py-2 bg-soc-accent/10 text-soc-accent border border-soc-accent/20 rounded-xl text-xs font-bold hover:bg-soc-accent hover:text-white transition-all flex items-center gap-2 float-right group/btn"
                    >
                      <ExternalLink size={14} className="group-hover/btn:scale-110 transition-transform" />
                      Go to Repository
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAssets.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-gray-700">
                <Search size={32} />
              </div>
              <div>
                <p className="text-gray-400 font-bold">No assets found</p>
                <p className="text-xs text-gray-600">Try adjusting your filters or organization name.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-soc-accent/5 border border-soc-accent/20 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-soc-accent/10 rounded-full text-soc-accent">
          <Activity size={24} />
        </div>
        <div>
          <h3 className="text-soc-accent font-bold text-lg">Continuous Monitoring Active</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
            StackMon™ is currently auditing <strong>2.4k repositories</strong> across <strong>12 organization namespaces</strong>. 
            All detected leaks are automatically cross-referenced with your corporate IAM policies.
          </p>
        </div>
      </div>
    </div>
  );
};
