
import React, { useState, useMemo } from 'react';
import { 
  Skull, MapPin, Calendar, Globe, AlertTriangle, ExternalLink, 
  Search, Filter, X, ShieldAlert, FileText, Activity, 
  TrendingUp, HardDrive, DollarSign, Info, Loader2, CheckCircle2
} from 'lucide-react';

interface Victim {
  id: string;
  group: string;
  target: string;
  sector: string;
  country: string;
  date: string;
  status: string;
  summary: string;
  ransomAmount?: string;
  leakedData?: string[];
}

const victims: Victim[] = [
  { 
    id: '1', 
    group: 'LockBit 3.0', 
    target: 'Global Logistics Corp', 
    sector: 'Transportation', 
    country: 'Germany', 
    date: '2024-05-24', 
    status: 'Data Published',
    summary: 'Ataque massivo via vulnerabilidade em VPN legada. O grupo exfiltrou mais de 400GB de dados operacionais e manifestos de carga. Após falha na negociação, o dump completo foi disponibilizado no blog do grupo no TOR.',
    ransomAmount: '$2,500,000',
    leakedData: ['Employee PII', 'Financial Statements', 'Route Logistics', 'Client Contracts']
  },
  { 
    id: '2', 
    group: 'BlackCat (ALPHV)', 
    target: 'Healthcare United', 
    sector: 'Medical', 
    country: 'USA', 
    date: '2024-05-23', 
    status: 'Negotiating',
    summary: 'Comprometimento via credenciais de terceiro. Foco em registros médicos e números de previdência social. Os sistemas críticos foram criptografados, mas o backup offline permitiu recuperação parcial.',
    ransomAmount: '$5,000,000',
    leakedData: ['Patient Records', 'Social Security Numbers', 'Internal Emails']
  },
  { 
    id: '3', 
    group: 'Clop', 
    target: 'Nordic Finance Group', 
    sector: 'Banking', 
    country: 'Sweden', 
    date: '2024-05-23', 
    status: 'Evidence Only',
    summary: 'Exploração de vulnerabilidade Zero-Day em software de transferência de arquivos. Atualmente o grupo postou apenas "proof-of-concepts" para forçar o contato da vítima.',
    ransomAmount: 'N/A',
    leakedData: ['Database Backups (Partial)']
  },
  { 
    id: '4', 
    group: 'Play', 
    target: 'Retail Solutions Ltd', 
    sector: 'Retail', 
    country: 'UK', 
    date: '2024-05-22', 
    status: 'Data Published',
    summary: 'Exploração do protocolo RDP exposto. O ataque resultou no vazamento de informações de cartões de crédito (hashes) e dados de inventário.',
    ransomAmount: '$800,000',
    leakedData: ['Customer Emails', 'Inventory Logs', 'Hashed Credentials']
  },
  { 
    id: '5', 
    group: 'Medusa', 
    target: 'EduConnect Systems', 
    sector: 'Education', 
    country: 'Canada', 
    date: '2024-05-21', 
    status: 'Pending',
    summary: 'Ameaça de publicação de dados de estudantes. O grupo deu um prazo de 7 dias para o pagamento antes de iniciar o leilão dos dados no Darkweb.',
    ransomAmount: '$150,000',
    leakedData: ['Student IDs', 'Academic Transcripts', 'Admin Passwords']
  },
  { 
    id: '6', 
    group: 'BianLian', 
    target: 'Constructo Max', 
    sector: 'Construction', 
    country: 'Brazil', 
    date: '2024-05-20', 
    status: 'Negotiating',
    summary: 'Infiltração silenciosa que durou 3 meses antes da detecção. Grupo focado apenas em exfiltração, sem criptografia de arquivos (Extorsão Pura).',
    ransomAmount: '$1,200,000',
    leakedData: ['Architectural Blueprints', 'Corporate Taxes', 'Project Bids']
  },
];

export const RansomwareVictimsView: React.FC = () => {
  const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMapping, setIsMapping] = useState(false);
  const [mappingComplete, setMappingComplete] = useState(false);

  // Filtra as vítimas baseado no termo de pesquisa (Target ou Group)
  const filteredVictims = useMemo(() => {
    return victims.filter(v => 
      v.target.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.group.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleVisitLeakBlog = (victim: Victim) => {
    // Simula a geração de um link de inteligência para o site de vazamento do grupo
    const query = encodeURIComponent(`${victim.group} ransomware leak site official`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const handleMapTTPs = async () => {
    if (!selectedVictim) return;
    
    setIsMapping(true);
    setMappingComplete(false);
    
    // Simulação de mapeamento automatizado contra MITRE ATT&CK
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsMapping(false);
    setMappingComplete(true);
    
    // Auto-dismiss feedback
    setTimeout(() => setMappingComplete(false), 3000);
  };

  return (
    <div className="space-y-6 relative min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Skull className="text-soc-danger" /> Ransomware "Wall of Shame" Monitor
          </h1>
          <p className="text-sm text-gray-500">Monitoramento em tempo real de vazamentos e extorsões de grupos RaaS.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Filtrar por grupo ou alvo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-soc-card border border-soc-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-soc-primary w-64 text-white"
            />
          </div>
          <button className="p-2 bg-soc-card border border-soc-border rounded-lg text-gray-400 hover:text-white">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {filteredVictims.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVictims.map((victim) => (
            <div 
              key={victim.id} 
              onClick={() => setSelectedVictim(victim)}
              className="bg-soc-card border border-soc-border rounded-xl overflow-hidden hover:border-soc-danger/50 hover:shadow-lg hover:shadow-soc-danger/5 transition-all group cursor-pointer"
            >
              <div className="p-4 bg-gray-900/50 border-b border-soc-border flex items-center justify-between">
                <span className="text-xs font-bold text-soc-danger uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} /> {victim.group}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  victim.status === 'Data Published' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {victim.status === 'Data Published' ? 'Vazado' : 'Em Negociação'}
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-soc-primary transition-colors">{victim.target}</h3>
                  <p className="text-xs text-gray-500 font-medium">Setor: {victim.sector}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <MapPin size={14} className="text-soc-primary" /> {victim.country}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} className="text-soc-primary" /> {victim.date}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-soc-border/50">
                  <button className="flex items-center gap-1.5 text-xs text-soc-primary font-bold hover:underline">
                    <Info size={14} /> Detalhes do Caso
                  </button>
                  <div className="text-[10px] text-gray-600 font-mono">ID: {victim.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-soc-card border border-soc-border border-dashed rounded-2xl">
          <div className="p-4 bg-soc-bg rounded-full mb-4 text-gray-600">
            <Search size={40} />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhum resultado encontrado</h3>
          <p className="text-sm text-gray-500 max-w-xs mt-2">
            Não encontramos nenhuma vítima ou grupo que corresponda a "{searchTerm}".
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-6 px-4 py-2 bg-soc-primary text-white rounded-lg text-sm font-bold hover:bg-soc-primary/80 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Side Detail Panel */}
      {selectedVictim && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => !isMapping && setSelectedVictim(null)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-soc-card border-l border-soc-border z-50 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-soc-border flex items-center justify-between bg-gray-900/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-soc-danger/10 rounded-lg text-soc-danger">
                    <Skull size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Case Analysis</h2>
                    <p className="text-xs text-gray-500 font-mono">Reference: {selectedVictim.group} // {selectedVictim.id}</p>
                  </div>
                </div>
                {!isMapping && (
                  <button 
                    onClick={() => setSelectedVictim(null)}
                    className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-all"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Header Info */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{selectedVictim.target}</h3>
                    <span className="px-3 py-1 bg-soc-danger/20 text-soc-danger border border-soc-danger/30 rounded-full text-xs font-bold">
                      HIGH RISK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-soc-bg p-3 rounded-lg border border-soc-border">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Setor</p>
                      <p className="text-sm text-gray-200">{selectedVictim.sector}</p>
                    </div>
                    <div className="bg-soc-bg p-3 rounded-lg border border-soc-border">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Resgate Estimado</p>
                      <p className="text-sm text-soc-success font-bold flex items-center gap-1">
                        <DollarSign size={14} /> {selectedVictim.ransomAmount}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Intelligence Summary */}
                <section>
                  <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-soc-primary" /> Intelligence Summary
                  </h4>
                  <div className="bg-soc-bg/50 p-4 rounded-xl border border-soc-border leading-relaxed text-sm text-gray-400 italic">
                    "{selectedVictim.summary}"
                  </div>
                </section>

                {/* Exfiltrated Data */}
                <section>
                  <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2 mb-3">
                    <HardDrive size={16} className="text-soc-warning" /> Compromised Assets & Data
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVictim.leakedData?.map((data, idx) => (
                      <span key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-xs border border-soc-border">
                        {data}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Threat Actor Context */}
                <section>
                  <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2 mb-3">
                    <ShieldAlert size={16} className="text-soc-danger" /> Threat Actor: {selectedVictim.group}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-soc-bg rounded-lg border border-soc-border">
                      <span className="text-xs text-gray-500">TTP Prevalence</span>
                      <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-soc-danger w-[85%]"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-soc-bg rounded-lg border border-soc-border">
                      <span className="text-xs text-gray-500">Confidence Level</span>
                      <span className="text-xs text-soc-success font-bold">HIGH (92%)</span>
                    </div>
                  </div>
                </section>

                {/* Action Footer */}
                <div className="pt-6 border-t border-soc-border bg-gray-900/40 p-6 -mx-8 -mb-8 flex gap-3">
                  <button 
                    onClick={() => handleVisitLeakBlog(selectedVictim)}
                    className="flex-1 bg-soc-primary hover:bg-soc-primary/80 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-soc-primary/20 hover:scale-[1.02]"
                  >
                    <ExternalLink size={18} /> Visit Leak Blog
                  </button>
                  <button 
                    onClick={handleMapTTPs}
                    disabled={isMapping}
                    className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                      mappingComplete ? 'bg-soc-success/10 border-soc-success text-soc-success' : 'border-soc-border bg-gray-800 text-gray-300 hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    {isMapping ? <Loader2 className="animate-spin" size={18} /> : 
                     mappingComplete ? <CheckCircle2 size={18} /> : <Activity size={18} />}
                    {isMapping ? 'Mapping...' : mappingComplete ? 'TTPs Mapped' : 'Map TTPs'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
