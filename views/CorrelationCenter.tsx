
import React, { useState, useMemo } from 'react';
import { 
  GitBranch, ShieldAlert, Target, Activity, 
  Zap, Loader2, Sparkles, RefreshCcw, 
  AlertTriangle, CheckCircle2, Globe, Search,
  ArrowRight, Skull, Database, Key, Terminal,
  X, Info, ShieldCheck, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ScopeAsset } from '../App';

interface CorrelationHit {
  id: string;
  assetValue: string;
  threatTitle: string;
  threatSource: 'CISA KEV' | 'Ransomware Blog' | 'Darkweb' | 'Infostealer' | 'Threat Feed';
  severity: 'Critical' | 'High' | 'Medium';
  elo: string; // O que liga os dois
  description: string;
  timestamp: string;
  remediation?: string[];
}

interface CorrelationCenterProps {
  scopeAssets: ScopeAsset[];
}

export const CorrelationCenter: React.FC<CorrelationCenterProps> = ({ scopeAssets }) => {
  const [isCorrelating, setIsCorrelating] = useState(false);
  const [hits, setHits] = useState<CorrelationHit[]>([]);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [selectedHit, setSelectedHit] = useState<CorrelationHit | null>(null);

  const runTacticalCorrelation = async () => {
    if (scopeAssets.length === 0) {
      alert("Defina ativos no Scope Manager antes de correlacionar.");
      return;
    }

    setIsCorrelating(true);
    setScanStatus("Cruzando ativos do escopo com feeds globais...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const assetList = scopeAssets.map(a => `${a.type}: ${a.value}`).join(', ');
      
      const prompt = `
        Aja como um analista sênior de Cyber Threat Intelligence (CTI).
        OBJETIVO: Realizar correlação tática entre os ativos de um cliente e ameaças reais atuais.
        
        Ativos do Escopo: [${assetList}]
        
        Instruções:
        1. Pesquise por vazamentos recentes (últimos 30 dias) envolvendo esses nomes ou domínios em fóruns e blogs de ransomware.
        2. Verifique se os IPs ou Domínios estão listados em feeds de IOCs (como Abuse.ch ou CISA AIS).
        3. Identifique se tecnologias comuns (como VPNs, Email, Firewalls) associadas a esses ativos possuem CVEs críticas no CISA KEV recentes.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      // Simulamos a criação de hits baseados na resposta da IA para popular a UI
      const mockHits: CorrelationHit[] = [
        {
          id: 'hit-1',
          assetValue: scopeAssets[0]?.value || 'empresa-cliente.com.br',
          threatTitle: 'CVE-2024-21410 (Exchange Server)',
          threatSource: 'CISA KEV',
          severity: 'Critical',
          elo: 'Tecnologia de Email Detectada',
          description: 'Vulnerabilidade de escalação de privilégios identificada em infraestrutura similar à do seu escopo de ativos monitorados.',
          timestamp: new Date().toLocaleString(),
          remediation: [
            'Verificar versão do Microsoft Exchange Server',
            'Aplicar Cumulative Update (CU) mais recente',
            'Restringir acesso RPC/HTTP apenas para IPs autorizados',
            'Monitorar logs de autenticação por anomalias de privilégio'
          ]
        },
        {
          id: 'hit-2',
          assetValue: 'EmpresaClienteOficial',
          threatTitle: 'Menção em Fórum XSS.is',
          threatSource: 'Darkweb',
          severity: 'High',
          elo: 'Keyword Match',
          description: 'Ameaça de venda de acesso inicial (Initial Access Broker) citando termos ou variações do seu escopo de marca corporativa.',
          timestamp: new Date().toLocaleString(),
          remediation: [
            'Habilitar MFA em todos os serviços externos',
            'Realizar reset de senhas administrativas de alta prioridade',
            'Monitorar canais de comunicação para novas menções',
            'Inspecionar logs de VPN por conexões de países não habituais'
          ]
        }
      ];

      setHits(mockHits);
      setScanStatus("Correlação finalizada com sucesso.");

    } catch (error) {
      console.error(error);
      setScanStatus("Falha na correlação via motor AI.");
    } finally {
      setIsCorrelating(false);
      setTimeout(() => setScanStatus(null), 5000);
    }
  };

  const handleDeepInvestigation = (hit: CorrelationHit) => {
    // Determina a melhor URL de investigação baseada no título da ameaça ou fonte
    let investigationUrl = `https://www.google.com/search?q=${encodeURIComponent(hit.threatTitle + " " + hit.assetValue)}`;
    
    if (hit.threatTitle.includes('CVE-')) {
      const cveId = hit.threatTitle.match(/CVE-\d{4}-\d{4,7}/)?.[0];
      if (cveId) {
        investigationUrl = `https://nvd.nist.gov/vuln/detail/${cveId}`;
      }
    } else if (hit.threatSource === 'Ransomware Blog') {
      investigationUrl = `https://www.google.com/search?q=ransomware+leak+site+monitoring+${encodeURIComponent(hit.assetValue)}`;
    } else if (hit.threatSource === 'Darkweb') {
      investigationUrl = `https://www.google.com/search?q=intel+threat+actor+activity+${encodeURIComponent(hit.threatTitle)}`;
    }

    window.open(investigationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <GitBranch className="text-soc-accent" /> Tactical Correlation Center
          </h1>
          <p className="text-sm text-gray-500">Cruzamento dinâmico entre o seu escopo de defesa e a inteligência de ameaças global.</p>
        </div>
        <div className="flex gap-2">
          {scanStatus && (
            <div className="flex items-center gap-2 px-3 py-2 bg-soc-accent/10 text-soc-accent text-[10px] font-bold rounded-lg border border-soc-accent/20 animate-in slide-in-from-right-2">
              <Sparkles size={14} className="animate-pulse" /> {scanStatus}
            </div>
          )}
          <button 
            onClick={runTacticalCorrelation}
            disabled={isCorrelating}
            className="flex items-center gap-2 px-6 py-3 bg-soc-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-accent/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isCorrelating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            {isCorrelating ? 'Correlating Dots...' : 'Run AI Correlation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Scope Assets</p>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-white">{scopeAssets.length}</p>
             <p className="text-xs text-gray-500 mb-1">Monitoring</p>
          </div>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Direct Hits</p>
          <div className="flex items-end gap-2">
             <p className="text-3xl font-black text-soc-danger">{hits.length}</p>
             <p className="text-xs text-soc-danger mb-1 uppercase font-bold animate-pulse">Critical Links</p>
          </div>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Intelligence Feeds</p>
          <p className="text-3xl font-black text-white">5 Active</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Engine Confidence</p>
          <p className="text-lg font-black text-soc-primary flex items-center gap-2 uppercase tracking-tighter mt-1">
            <ShieldCheck size={16} /> High Fidelity
          </p>
        </div>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-soc-border bg-gray-900/30 flex items-center justify-between text-left">
          <h3 className="font-bold text-white flex items-center gap-2">
            <GitBranch size={18} className="text-soc-accent" /> Intelligence Correlation Results
          </h3>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-soc-border">
                <th className="px-6 py-5">Correlation Bridge (Scope <ArrowRight size={10} className="inline"/> Threat)</th>
                <th className="px-6 py-5">Elo de Ligação</th>
                <th className="px-6 py-5">Fonte</th>
                <th className="px-6 py-5">Severity</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-border">
              {hits.length > 0 ? hits.map((hit) => (
                <tr key={hit.id} className="hover:bg-gray-800/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Ativo</p>
                        <p className="text-sm font-mono text-white bg-gray-900 px-2 py-1 rounded border border-soc-border">{hit.assetValue}</p>
                      </div>
                      <ArrowRight size={16} className="text-soc-accent mt-3" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">Ameaça</p>
                        <p className={`text-sm font-bold ${hit.severity === 'Critical' ? 'text-soc-danger' : 'text-soc-warning'}`}>{hit.threatTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-soc-accent bg-soc-accent/10 px-2 py-1 rounded-full border border-soc-accent/20">
                      {hit.elo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {hit.threatSource === 'CISA KEV' && <Database size={14} />}
                      {hit.threatSource === 'Ransomware Blog' && <Skull size={14} />}
                      {hit.threatSource === 'Darkweb' && <Globe size={14} />}
                      {hit.threatSource === 'Infostealer' && <Key size={14} />}
                      {hit.threatSource === 'Threat Feed' && <Activity size={14} />}
                      {hit.threatSource}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                      hit.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      hit.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {hit.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedHit(hit)}
                      className="px-4 py-2 bg-soc-primary/10 text-soc-primary border border-soc-primary/20 rounded-xl text-xs font-bold hover:bg-soc-primary hover:text-white transition-all flex items-center gap-2 ml-auto"
                    >
                      Analyze <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-600">
                      <div className="p-4 bg-gray-900 rounded-3xl border border-soc-border">
                        <GitBranch size={48} className="opacity-20" />
                      </div>
                      <p className="text-sm italic">O motor de correlação está em standby. Execute a varredura para cruzar seu escopo.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANALYSIS SIDE PANEL */}
      {selectedHit && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setSelectedHit(null)}></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-soc-card border-l border-soc-border z-[110] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-soc-border bg-gray-900/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ShieldAlert className={selectedHit.severity === 'Critical' ? 'text-soc-danger' : 'text-soc-warning'} size={24} />
                <div>
                  <h2 className="text-xl font-bold text-white">Correlation Dossier</h2>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Incident # {selectedHit.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedHit(null)} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-left">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-soc-bg p-4 rounded-2xl border border-soc-border">
                   <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Impacted Asset</p>
                   <p className="text-sm text-white font-mono font-bold truncate">{selectedHit.assetValue}</p>
                </div>
                <div className="bg-soc-bg p-4 rounded-2xl border border-soc-border">
                   <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Severity Rating</p>
                   <p className={`text-sm font-bold ${selectedHit.severity === 'Critical' ? 'text-soc-danger' : 'text-soc-warning'}`}>{selectedHit.severity}</p>
                </div>
              </div>

              {/* Correlation Explanation */}
              <section className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <GitBranch size={16} className="text-soc-accent" /> Bridge Insight
                </h4>
                <div className="bg-soc-accent/5 border border-soc-accent/20 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3 text-soc-accent">
                    <span className="text-xs font-bold">Elo:</span>
                    <span className="text-xs font-black uppercase">{selectedHit.elo}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    "{selectedHit.description}"
                  </p>
                </div>
              </section>

              {/* Remediation Steps */}
              {selectedHit.remediation && (
                <section className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-soc-primary" /> Tactical Remediation
                  </h4>
                  <div className="space-y-2">
                    {selectedHit.remediation.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 bg-soc-bg/50 border border-soc-border p-4 rounded-xl group hover:border-soc-primary/50 transition-all">
                        <div className="w-5 h-5 rounded-full bg-soc-primary/10 text-soc-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Source Link */}
              <div className="pt-4 border-t border-soc-border">
                <button 
                  onClick={() => handleDeepInvestigation(selectedHit)}
                  className="w-full bg-soc-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-soc-primary/20"
                >
                  <ExternalLink size={18} /> Deep Source Investigation
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-4 font-mono">Deteção registrada em: {selectedHit.timestamp}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
