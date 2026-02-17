
import React, { useState, useMemo } from 'react';
import { 
  UserX, MessageSquare, Search, Filter, Download, ExternalLink, 
  Globe, Smartphone, ShieldAlert, Loader2, Wifi, Activity,
  RefreshCw, MessageCircle
} from 'lucide-react';

interface InsiderViewProps {
  monitoredForums?: string[];
  monitoredChats?: string[];
}

interface IntelligenceEntry {
  id: string;
  user: string;
  forum: string;
  post: string;
  date: string;
  url: string;
  isLive?: boolean;
}

const staticForumPosts: IntelligenceEntry[] = [
  { id: '1', user: 'MalwareTrader', forum: 'XSS.is', post: 'Data breach claim — screenshots — negotiating buyer access', date: '14/02/2026 10:51', url: 'https://xss.is/threads/92831' },
  { id: '2', user: 'GhostZero', forum: 'BreachForums', post: 'Selling 1.2M logs from E-commerce platform', date: '14/02/2026 09:12', url: 'https://breached.vc/viewtopic.php?t=4821' },
  { id: '3', user: 'NullByte', forum: 'Exploit.in', post: 'Looking for partner for RDP access exploit', date: '13/02/2026 23:45', url: 'https://exploit.in/topic/11202' },
];

const staticChatMessages = [
  { id: '1', date: '14/02/2026 10:45', user: 'ZeroDayDev', chat: 'DarkNet Intelligence', source: 'Telegram', message: 'Anyone has the new variant of the stealer?', url: 'https://t.me/darknet_intel/482' },
  { id: '2', date: '14/02/2026 10:30', user: 'AdminOps', chat: 'Ops Brazil', source: 'Discord', message: 'Server down. Moving to backup node at 10.5.2.1.', url: 'https://discord.com/channels/928374/102938' },
];

export const InsiderView: React.FC<InsiderViewProps> = ({ 
  monitoredForums = [], 
  monitoredChats = []
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'forums' | 'chats'>('forums');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const forumData = useMemo(() => {
    const liveEntries: IntelligenceEntry[] = monitoredForums
      .filter(f => !staticForumPosts.some(s => s.forum === f))
      .map((f, index) => ({
        id: `live-${index}`,
        user: 'Crawler_Bot_01',
        forum: f,
        post: 'Coleta ativa de novos tópicos e mensagens em andamento...',
        date: new Date().toLocaleTimeString(),
        url: '#',
        isLive: true
      }));

    return [...staticForumPosts, ...liveEntries];
  }, [monitoredForums]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleOpenSource = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <UserX className="text-soc-danger" /> Insider & Darkweb Monitoring
          </h1>
          <p className="text-sm text-gray-500">Monitoramento tático de fóruns e canais configurados em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-soc-bg border border-soc-success/30 rounded-xl flex items-center gap-3 text-soc-success text-xs font-bold animate-pulse">
            <Wifi size={14} /> LIVE COLLECTION ACTIVE
          </div>
          <button 
            onClick={() => setIsExporting(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-bold border border-soc-border"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="bg-soc-danger/10 border border-soc-danger rounded-2xl p-6 flex items-center gap-6">
        <div className="p-4 bg-soc-danger text-white rounded-xl">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Potencial Vazamento Detectado</h3>
          <p className="text-sm text-gray-400">Ativos vinculados ao seu domínio apareceram em fóruns de discussão. Inicie o Playbook de Resposta se necessário.</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-soc-border p-1 bg-soc-card/30 rounded-t-xl">
        <div className="flex gap-1">
          <button onClick={() => setActiveSubTab('forums')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'forums' ? 'bg-soc-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
            <Globe size={16} /> Forum Intelligence
          </button>
          <button onClick={() => setActiveSubTab('chats')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'chats' ? 'bg-soc-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
            <Smartphone size={16} /> Chat Scraper Results
          </button>
        </div>
        <button 
          onClick={handleManualSync}
          disabled={isSyncing}
          className="mr-2 flex items-center gap-2 px-4 py-1.5 bg-gray-900 border border-soc-border rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-soc-primary transition-all disabled:opacity-50"
        >
          {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {isSyncing ? 'Synchronizing...' : 'Update Intelligence'}
        </button>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-xl overflow-hidden shadow-2xl relative">
        {activeSubTab === 'forums' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User / Source</th>
                  <th className="px-6 py-4">Forum</th>
                  <th className="px-6 py-4">Intelligence</th>
                  <th className="px-6 py-4 text-right">Pivot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soc-border">
                {forumData.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-200 text-sm">{post.user}</span>
                        {post.isLive && (
                          <span className="text-[8px] bg-soc-success/10 text-soc-success border border-soc-success/20 px-1 rounded font-black animate-pulse">CRAWLER</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-soc-primary/10 text-soc-primary border border-soc-primary/20 font-bold uppercase">
                        {post.forum}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-md truncate">{post.post}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenSource(post.url)} 
                        className="p-2 bg-gray-900 border border-soc-border rounded-lg text-gray-500 hover:text-soc-primary"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-soc-border">
            {staticChatMessages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-gray-800/20 transition-colors flex gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-soc-border ${msg.source === 'Telegram' ? 'bg-blue-500/10 text-blue-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                  {msg.source === 'Telegram' ? <MessageCircle size={20} /> : <MessageSquare size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-200 text-sm">{msg.user}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{msg.date}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-900 text-gray-400 border border-soc-border">{msg.chat}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-mono bg-soc-bg p-3 rounded-lg border border-soc-border/50">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
