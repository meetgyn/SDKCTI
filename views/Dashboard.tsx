
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { AlertCircle, Zap, ShieldCheck, Bug, TrendingUp, Clock, Activity } from 'lucide-react';
import { Language } from '../App';

interface DashboardProps {
  language?: Language;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ language = 'en' }) => {
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
            <button className="text-xs text-soc-primary hover:underline font-medium">{t.viewAll}</button>
          </div>
          <div className="divide-y divide-soc-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4 text-left">
                <AlertCircle size={20} className="text-soc-danger" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">SSH Login Attempt</p>
                  <p className="text-xs text-gray-500">Source: 192.168.1.104</p>
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
    </div>
  );
};
