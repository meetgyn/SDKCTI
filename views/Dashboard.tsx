
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { AlertCircle, Zap, ShieldCheck, Bug, TrendingUp, Clock, Activity, X, ShieldAlert, Globe, Terminal, Search, Filter } from 'lucide-react';
import { Language } from '../App';

interface DashboardProps {
  language?: Language;
}

interface Incident {
  id: string;
  title: string;
  source: string;
  time: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Investigating' | 'Resolved' | 'New';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const mockFullIncidents: Incident[] = [
  { id: '1', title: 'SSH Brute Force Attempt', source: '192.168.1.104', time: '2 mins ago', severity: 'High', status: 'New' },
  { id: '2', title: 'Malicious File Detected', source: 'Workstation-DE-04', time: '15 mins ago', severity: 'Critical', status: 'Investigating' },
  { id: '3', title: 'DDoS Traffic Spike', source: 'Edge-Gateway-01', time: '1 hour ago', severity: 'Medium', status: 'Resolved' },
  { id: '4', title: 'Unusual Admin Login', source: 'Admin-Portal', time: '3 hours ago', severity: 'High', status: 'New' },
  { id: '5', title: 'Data Exfiltration Alert', source: 'Database-Srv-02', time: '5 hours ago', severity: 'Critical', status: 'Investigating' },
  { id: '6', title: 'WAF Rule Triggered', source: 'CloudFront-Edge', time: '8 hours ago', severity: 'Low', status: 'Resolved' },
  { id: '7', title: 'Internal Port Scan', source: '10.0.4.55', time: '12 hours ago', severity: 'Medium', status: 'New' },
];

export const Dashboard: React.FC<DashboardProps> = ({ language = 'en' }) => {
  const [isIncidentsModalOpen, setIsIncidentsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    totalThreats: language === 'en' ? 'Total Threats' : 'Ameaças Totais',
    activeCampaigns: language === 'en' ? 'Active Campaigns' : 'Campanhas Ativas',
    criticalVulns: language === 'en' ? 'Critical Vulns' : 'Vulns Críticas',
    mitigated: language === 'en' ? 'Mitigated Cases' : 'Casos Mitigados',
    overview: language === 'en' ? 'Threat Activity Overview' : 'Visão Geral de Ameaças',
    vectors: language === 'en' ? 'Attack Vectors' : 'Vetores de Ataque',
    recentIncidents: language === 'en' ? 'Recent Incidents' : 'Incidentes Recentes',
    feeds: language === 'en' ? 'Intelligence Feeds' : 'Feeds de Inteligência',
    viewAll: language === 'en' ? 'View All' : 'Ver Tudo',
    last7: language === 'en' ? 'Last 7 Days' : 'Últimos 7 Dias',
    close: language === 'en' ? 'Close' : 'Fechar',
    allIncidents: language === 'en' ? 'All Security Incidents' : 'Todos os Incidentes',
  };

  const stats = [
    { label: t.totalThreats, value: '1,284', trend: '+12%', color: 'text-soc-danger', icon: AlertCircle, bg: 'bg-red-500/10' },
    { label: t.activeCampaigns, value: '14', trend: '+2', color: 'text-soc-warning', icon: Zap, bg: 'bg-amber-500/10' },
    { label: t.criticalVulns, value: '89', trend: '-5%', color: 'text-soc-accent', icon: Bug, bg: 'bg-purple-500/10' },
    { label: t.mitigated, value: '452', trend: '+24%', color: 'text-soc-success', icon: ShieldCheck, bg: 'bg-emerald-500/10' },
  ];

  const data = [
    { name: 'Mon', threats: 400 }, { name: 'Tue', threats: 300 }, { name: 'Wed', threats: 200 },
    { name: 'Thu', threats: 278 }, { name: 'Fri', threats: 189 }, { name: 'Sat', threats: 239 },
    { name: 'Sun', threats: 349 },
  ];

  const pieData = [
    { name: 'Phishing', value: 400 }, { name: 'Malware', value: 300 },
    { name: 'Ransomware', value: 300 }, { name: 'APT', value: 200 },
  ];

  const filteredIncidents = mockFullIncidents.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-soc-card border border-soc-border p-5 rounded-xl transition-all hover:border-soc-primary/50 group text-left">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-900 ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-soc-card border border-soc-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-soc-primary" />
              {t.overview}
            </h3>
            <select className="bg-soc-bg border border-soc-border text-xs rounded-lg px-2 py-1 focus:outline-none text-gray-400">
              <option>{t.last7}</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#11141b', borderColor: '#1f2937', color: '#fff' }} />
                <Area type="monotone" dataKey="threats" stroke="#3b82f6" fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-soc-card border border-soc-border rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 text-left">{t.vectors}</h3>
          <div className="flex-1 h-[250px] min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={0}
                  tick={{ fill: '#9ca3af', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#11141b', borderColor: '#1f2937', color: '#fff', borderRadius: '8px' }} 
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]} 
                  barSize={35}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-soc-card border border-soc-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-soc-border bg-gray-900/30 flex items-center justify-between">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-soc-warning" /> {t.recentIncidents}
            </h3>
            <button 
              onClick={() => setIsIncidentsModalOpen(true)}
              className="text-xs text-soc-primary hover:underline font-medium"
            >
              {t.viewAll}
            </button>
          </div>
          <div className="divide-y divide-soc-border">
            {mockFullIncidents.slice(0, 3).map((incident) => (
              <div key={incident.id} className="p-4 flex items-center gap-4 text-left hover:bg-gray-800/20 transition-all cursor-pointer">
                <div className={`p-2 rounded-lg ${incident.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">{incident.title}</p>
                  <p className="text-xs text-gray-500">Source: {incident.source}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-mono">{incident.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-soc-card border border-soc-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-soc-border bg-gray-900/30 flex items-center justify-between text-left">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-soc-success" /> {t.feeds}
            </h3>
          </div>
          <div className="divide-y divide-soc-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4 text-left">
                <Activity size={20} className="text-soc-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">New APT28 Campaign</p>
                  <p className="text-xs text-gray-500">Source: CISA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALL INCIDENTS MODAL */}
      {isIncidentsModalOpen && (
        <div className="fixed inset-0 z-[100] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-soc-card border border-soc-border rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-soc-border flex justify-between items-center bg-gray-900/40 shrink-0">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-soc-danger" size={24} />
                <h3 className="text-xl font-bold text-white">{t.allIncidents}</h3>
              </div>
              <button 
                onClick={() => setIsIncidentsModalOpen(false)} 
                className="text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 border-b border-soc-border bg-gray-900/20 flex gap-4 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter incidents..." 
                  className="w-full bg-soc-bg border border-soc-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-soc-primary text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 border border-soc-border rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
                <Filter size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold border-b border-soc-border sticky top-0 z-10">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Incident Title</th>
                    <th className="px-6 py-4">Source Asset</th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soc-border">
                  {filteredIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-800/30 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                          incident.status === 'New' ? 'bg-soc-primary/10 text-soc-primary border-soc-primary/20' :
                          incident.status === 'Investigating' ? 'bg-soc-warning/10 text-soc-warning border-soc-warning/20' :
                          'bg-soc-success/10 text-soc-success border-soc-success/20'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white group-hover:text-soc-primary transition-colors">{incident.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-gray-500" />
                          <span className="text-xs font-mono text-gray-400">{incident.source}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            incident.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                            incident.severity === 'High' ? 'bg-orange-500' :
                            incident.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                          }`}></div>
                          <span className="text-xs font-bold text-gray-200">{incident.severity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-gray-500 font-mono">
                        {incident.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredIncidents.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <Terminal className="mx-auto text-gray-700" size={40} />
                  <p className="text-gray-500 italic">No incidents match your search.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-900/30 border-t border-soc-border shrink-0">
               <button 
                onClick={() => setIsIncidentsModalOpen(false)} 
                className="w-full py-3 bg-gray-800 text-gray-400 rounded-2xl font-bold hover:text-white hover:bg-gray-700 transition-all"
              >
                {t.close}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
