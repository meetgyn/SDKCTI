
import React, { useState } from 'react';
import { 
  UserX, MessageSquare, Search, Filter, Download, ExternalLink, 
  Globe, Smartphone, ShieldAlert, Loader2, CheckCircle2, Terminal,
  ShieldCheck, BellOff, MessageCircle, FileText, Share2
} from 'lucide-react';

const forumPosts = [
  { id: '1', user: 'MalwareTrader', forum: 'XSS.is', post: 'Data breach claim — screenshots — negotiating buyer access', date: '14/02/2026 10:51', url: 'https://xss.is/threads/92831', details: 'Seller claims access to a Brazilian financial institution. Attached 3 PNGs showing internal systems.' },
  { id: '2', user: 'GhostZero', forum: 'BreachForums', post: 'Selling 1.2M logs from E-commerce platform', date: '14/02/2026 09:12', url: 'https://breached.vc/viewtopic.php?t=4821', details: 'Contains email, hashed password, and partial credit card info.' },
  { id: '3', user: 'NullByte', forum: 'Exploit.in', post: 'Looking for partner for RDP access exploit', date: '13/02/2026 23:45', url: 'https://exploit.in/topic/11202', details: 'Targeting US-based health sector.' },
];

const chatMessages = [
  { id: '1', date: '14/02/2026 10:45', user: 'ZeroDayDev', chat: 'DarkNet Intelligence', source: 'Telegram', message: 'Anyone has the new variant of the stealer? Paying top dollar.', url: 'https://t.me/darknet_intel/482' },
  { id: '2', date: '14/02/2026 10:30', user: 'AdminOps', chat: 'Ops Brazil', source: 'Discord', message: 'Server down. Moving to backup node at 10.5.2.1.', url: 'https://discord.com/channels/928374/102938' },
  { id: '3', date: '14/02/2026 08:22', user: 'Unknown', chat: 'Private Leak Group', source: 'WhatsApp', message: 'Shared file: credentials_dump_v3.xlsx', url: 'https://wa.me/leak_group_artifact' },
];

export const InsiderView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'forums' | 'chats'>('forums');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigationComplete, setInvestigationComplete] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleOpenSource = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLaunchInvestigation = async () => {
    setIsInvestigating(true);
    setInvestigationComplete(false);
    
    // Simulação de análise forense automatizada e abertura de ticket no SOAR
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsInvestigating(false);
    setInvestigationComplete(true);
    
    // Auto-dismiss do feedback de sucesso
    setTimeout(() => setInvestigationComplete(false), 5000);
  };

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    
    const dataToExport = activeSubTab === 'forums' ? forumPosts : chatMessages;
    const headers = activeSubTab === 'forums' 
      ? ['Date', 'User', 'Forum', 'Post', 'URL'] 
      : ['Date', 'User', 'Source', 'Chat', 'Message', 'URL'];

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => {
        if (activeSubTab === 'forums') {
          const f = item as typeof forumPosts[0];
          return `"${f.date}","${f.user}","${f.forum}","${f.post.replace(/"/g, '""')}","${f.url}"`;
        } else {
          const c = item as typeof chatMessages[0];
          return `"${c.date}","${c.user}","${c.source}","${c.chat}","${c.message.replace(/"/g, '""')}","${c.url}"`;
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `insider_intel_${activeSubTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <UserX className="text-soc-danger" /> Insider & Darkweb Monitoring
          </h1>
          <p className="text-sm text-gray-500">Real-time monitoring of cybercriminal forums and encrypted chat channels.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-bold transition-all border border-soc-border disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isExporting ? 'Exporting...' : 'Export Results (CSV)'}
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-soc-border p-1 bg-soc-card/30 rounded-t-xl">
        <button 
          onClick={() => setActiveSubTab('forums')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeSubTab === 'forums' ? 'bg-soc-primary text-white shadow-lg shadow-soc-primary/10' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Globe size={16} /> Forum Monitoring
        </button>
        <button 
          onClick={() => setActiveSubTab('chats')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeSubTab === 'chats' ? 'bg-soc-primary text-white shadow-lg shadow-soc-primary/10' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Smartphone size={16} /> Chat Intelligence (E2EE)
        </button>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-xl">
        {activeSubTab === 'forums' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Forum</th>
                  <th className="px-6 py-4">Post Headline</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soc-border">
                {forumPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-200">{post.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-900/50 font-bold uppercase">
                        {post.forum}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 max-w-md truncate">{post.post}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button 
                          onClick={() => handleOpenSource(post.url)}
                          className="p-2 bg-gray-900 border border-soc-border hover:bg-soc-primary/10 rounded-lg text-gray-600 hover:text-soc-primary transition-all active:scale-95 group-hover:border-soc-primary/30"
                          title="Open Link Source"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button className="p-2 bg-gray-900 border border-soc-border hover:bg-soc-accent/10 rounded-lg text-gray-600 hover:text-soc-accent transition-all">
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-soc-border">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-gray-800/20 transition-colors flex gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-soc-border transition-transform group-hover:scale-110 ${
                  msg.source === 'Telegram' ? 'bg-blue-500/10 text-blue-500 border-blue-900/30' :
                  msg.source === 'Discord' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-900/30' :
                  'bg-green-500/10 text-green-500 border-green-900/30'
                }`}>
                  {msg.source === 'Telegram' ? <MessageCircle size={20} /> : <MessageSquare size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-200 text-sm">{msg.user}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{msg.date}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-900 text-gray-400 border border-soc-border">
                      {msg.source} » {msg.chat}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 font-mono bg-soc-bg p-3 rounded-lg border border-soc-border/50 group-hover:border-soc-primary/20 transition-all">
                    {msg.message}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col gap-2">
                   <button 
                    onClick={() => handleOpenSource(msg.url)}
                    className="p-2 bg-gray-900 border border-soc-border hover:bg-soc-primary/10 rounded-lg text-gray-600 hover:text-soc-primary transition-all active:scale-95"
                    title="View Message Context"
                   >
                     <ExternalLink size={16} />
                   </button>
                   <button className="p-2 bg-gray-900 border border-soc-border hover:bg-soc-accent/10 rounded-lg text-gray-600 hover:text-soc-accent transition-all">
                      <Share2 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`border rounded-xl p-6 flex items-start gap-4 transition-all duration-500 ${
        isAcknowledged 
          ? 'bg-gray-800/20 border-gray-800 opacity-80' 
          : 'bg-soc-danger/5 border-soc-danger/20 hover:bg-soc-danger/[0.07] animate-pulse'
      }`}>
        <div className={`p-3 rounded-full transition-colors duration-500 ${
          isAcknowledged ? 'bg-gray-700 text-gray-400' : 'bg-soc-danger/10 text-soc-danger'
        }`}>
          {isAcknowledged ? <BellOff size={24} /> : <ShieldAlert size={24} />}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg transition-colors ${
            isAcknowledged ? 'text-gray-400' : 'text-soc-danger'
          }`}>
            {isAcknowledged ? 'Threat Acknowledged' : 'Critical Intelligence Alert'}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Suspicious data patterns detected: "Brazilian Financial Sector", "Internal System Dump", "XSS.is Forum". 
            Potential insider threat exfiltration or unauthorized access sales.
          </p>
          
          <div className="mt-4 flex items-center gap-3">
            {!isAcknowledged && (
              <button 
                onClick={handleLaunchInvestigation}
                disabled={isInvestigating}
                className="bg-soc-danger text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-soc-danger/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isInvestigating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Initializing SOC Response...
                  </>
                ) : (
                  <>
                    <Terminal size={18} /> Launch Investigation
                  </>
                )}
              </button>
            )}
            
            <button 
              onClick={handleAcknowledge}
              disabled={isAcknowledged}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                isAcknowledged 
                  ? 'bg-soc-success/10 text-soc-success border border-soc-success/20 cursor-default' 
                  : 'bg-transparent border border-soc-danger/30 text-soc-danger hover:bg-soc-danger/10'
              }`}
            >
              {isAcknowledged ? <ShieldCheck size={18} /> : null}
              {isAcknowledged ? 'SLA Met: Acknowledged' : 'Acknowledge Threat'}
            </button>

            {investigationComplete && (
              <div className="flex items-center gap-2 text-soc-success text-xs font-bold animate-in fade-in slide-in-from-left-2 duration-300 bg-soc-success/5 px-3 py-1 rounded-full border border-soc-success/20">
                <CheckCircle2 size={16} />
                SOAR Case #CTI-2026-0881 Created
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
