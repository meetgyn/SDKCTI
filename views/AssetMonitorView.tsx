
import React, { useState, useMemo } from 'react';
import { 
  Monitor, Search, Globe, ExternalLink, 
  Activity, Code, RefreshCcw, Loader2, Sparkles,
  Terminal, Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ScopeAsset } from '../App';

interface AssetRepo {
  id: string;
  name: string;
  provider: 'GitHub' | 'GitLab' | 'Bitbucket' | 'Other';
  organization: string;
  leakType: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  lastScan: string;
  url: string;
}

interface AssetMonitorViewProps {
  scopeAssets: ScopeAsset[];
}

export const AssetMonitorView: React.FC<AssetMonitorViewProps> = ({ scopeAssets }) => {
  const [discoveredAssets, setDiscoveredAssets] = useState<AssetRepo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<{title: string, uri: string}[]>([]);
  const [generatedDorks, setGeneratedDorks] = useState<string[]>([]);

  const handleGlobalScan = async () => {
    if (scopeAssets.length === 0) {
      alert("Adicione ativos no Scope Manager antes de iniciar a varredura.");
      return;
    }

    setIsSyncing(true);
    setScanStatus("Gerando Dorks Táticos e consultando repositórios...");
    setGroundingSources([]);

    const dorks = scopeAssets.flatMap(asset => [
      `site:github.com "${asset.value}" password OR secret`,
      `site:gitlab.com "${asset.value}" config OR .env`,
      `site:bitbucket.org "${asset.value}" API_KEY`
    ]);
    setGeneratedDorks(dorks);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const assetList = scopeAssets.map(a => a.value).join(', ');
      const prompt = `
        Aja como um especialista em Threat Hunting e OSINT.
        Analise a presença dos seguintes ativos: [${assetList}] em plataformas de código (GitHub, GitLab, Bitbucket).
        Identifique repositórios que contenham chaves de API, segredos ou arquivos de configuração vazados.
        Retorne um resumo técnico dos riscos e liste as URLs dos repositórios suspeitos.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links = chunks
          .filter((c: any) => c.web)
          .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        setGroundingSources(links);

        const newDiscoveries: AssetRepo[] = links.map((link, idx) => {
          const url = link.uri.toLowerCase();
          let provider: AssetRepo['provider'] = 'Other';
          if (url.includes('github.com')) provider = 'GitHub';
          else if (url.includes('gitlab.com')) provider = 'GitLab';
          else if (url.includes('bitbucket.org')) provider = 'Bitbucket';

          const isCritical = url.includes('config') || url.includes('secret') || url.includes('.env') || url.includes('key');

          return {
            id: `disc-${Date.now()}-${idx}`,
            name: link.title || "Discovered Repository",
            provider,
            organization: "Exposed via OSINT",
            leakType: isCritical ? "Secret/Credential Leak" : "Potential Source Exposure",
            riskLevel: isCritical ? 'High' : 'Medium',
            lastScan: new Date().toLocaleString(),
            url: link.uri
          };
        });

        setDiscoveredAssets(newDiscoveries);
        setScanStatus(`Varredura concluída. ${newDiscoveries.length} possíveis exposições identificadas.`);
      } else {
        setScanStatus("Nenhuma exposição óbvia encontrada nos índices públicos.");
      }

    } catch (error: any) {
      console.error("Erro na varredura OSINT:", error);
      setScanStatus("Falha na varredura via motor de inteligência.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setScanStatus(null), 10000);
    }
  };

  const filteredAssets = useMemo(() => {
    return discoveredAssets.filter(asset => {
      const matchSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchProvider = selectedProvider === 'All' || asset.provider === selectedProvider;
      return matchSearch && matchProvider;
    });
  }, [searchTerm, selectedProvider, discoveredAssets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Monitor className="text-soc-accent" /> Asset Monitor (OSINT Scanning)
          </h1>
          <p className="text-sm text-gray-500">Monitoramento contínuo de superfícies externas (GitHub, GitLab, Bitbucket).</p>
        </div>
        <div className="flex gap-2">
          {scanStatus && (
            <div className="flex items-center gap-2 px-3 py-2 bg-soc-accent/10 text-soc-accent text-[10px] font-bold rounded-lg border border-soc-accent/20 animate-in fade-in slide-in-from-right-2">
              <Sparkles size={14} className="animate-pulse" /> {scanStatus}
            </div>
          )}
          <button 
            onClick={handleGlobalScan}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-soc-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-accent/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
            {isSyncing ? 'Dorking Web...' : 'Force Global Scan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Scope Items</p>
          <p className="text-3xl font-black text-white">{scopeAssets.length}</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Exposure Incidents</p>
          <p className="text-3xl font-black text-soc-danger">{discoveredAssets.filter(a => a.riskLevel === 'High').length}</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sources Verified</p>
          <p className="text-3xl font-black text-white">{groundingSources.length}</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Engine Method</p>
          <div className="flex items-center gap-2 text-soc-primary font-black uppercase text-xs tracking-tighter mt-1">
            <Zap size={14} /> OSINT Dorking
          </div>
        </div>
      </div>

      {generatedDorks.length > 0 && (
        <div className="bg-gray-900 border border-soc-border rounded-2xl overflow-hidden shadow-inner">
          <div className="px-4 py-2 bg-gray-800 border-b border-soc-border flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-soc-accent" /> Active Dorking Engine
            </span>
            <span className="text-[9px] text-soc-accent font-mono animate-pulse">EXECUTING OSINT HUNTER...</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
             {generatedDorks.map((dork, i) => (
               <div key={i} className="text-[10px] font-mono text-gray-500 bg-black/40 p-2 rounded border border-white/5 truncate hover:text-soc-accent transition-colors">
                 <span className="text-soc-accent mr-2">$</span> {dork}
               </div>
             ))}
          </div>
        </div>
      )}

      <div className="bg-soc-card border border-soc-border rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search discovered assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soc-bg border border-soc-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-soc-accent outline-none text-white transition-all"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'GitHub', 'GitLab', 'Bitbucket'].map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                  selectedProvider === provider 
                    ? 'bg-soc-accent border-soc-accent text-white shadow-lg shadow-soc-accent/20' 
                    : 'bg-soc-bg border-soc-border text-gray-500 hover:text-white hover:border-gray-700'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono justify-end">
            <Activity size={14} className="text-soc-accent" /> Intelligence Engine: Gemini 3 Flash
          </div>
        </div>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-soc-border bg-gray-900/30 flex items-center justify-between text-left">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-soc-accent" /> Intelligence Results (Leak Candidates)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-soc-border">
                <th className="px-6 py-5">Identified Repo/Source</th>
                <th className="px-6 py-5">Platform</th>
                <th className="px-6 py-5">Leak Type</th>
                <th className="px-6 py-5">Risk</th>
                <th className="px-6 py-5 text-right">Evidence</th>
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
                      <span className="text-sm font-bold text-gray-100 line-clamp-1 max-w-[200px]">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{asset.provider}</td>
                  <td className="px-6 py-4 text-xs text-soc-danger">{asset.leakType}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase ${asset.riskLevel === 'High' ? 'text-red-500' : 'text-orange-500'}`}>
                      {asset.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => window.open(asset.url, '_blank')} className="px-4 py-2 bg-soc-accent/10 text-soc-accent border border-soc-accent/20 rounded-xl text-xs font-bold hover:bg-soc-accent hover:text-white transition-all">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
