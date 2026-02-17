
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShieldAlert, Target, Users, FileText, UserX, Key, Monitor, 
  Package, Activity, ChevronDown, ChevronRight, Database, Network, Skull, 
  Layout, FileBarChart, GitBranch
} from 'lucide-react';
import { Language, SystemSettings } from '../App';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  settings: SystemSettings;
}

interface MenuItem {
  id?: string;
  label: string;
  ptLabel?: string;
  icon?: any;
  isHeader?: boolean;
  items?: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, settings }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setCollapsedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuSections: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', ptLabel: 'Painel Geral', icon: LayoutDashboard },
    { 
      label: 'SCOPE & ASSETS', 
      ptLabel: 'ESCOPO E ATIVOS',
      isHeader: true,
      items: [
        { id: 'scope', label: 'Scope Manager', ptLabel: 'Gestão de Ativos', icon: Layout },
        { id: 'correlation', label: 'Correlation Center', ptLabel: 'Central de Correlação', icon: GitBranch },
        { id: 'reports', label: 'Intel Reports', ptLabel: 'Relatórios de Intel', icon: FileBarChart },
      ]
    },
    { 
      label: 'THREAT INTEL', 
      ptLabel: 'INTELIGÊNCIA',
      isHeader: true,
      items: [
        { id: 'threat-actors', label: 'Threat Actors', ptLabel: 'Atores de Ameaça', icon: Users },
        { id: 'ransomware', label: 'Ransomware Victims', ptLabel: 'Vítimas Ransomware', icon: Skull },
        { id: 'stix-graph', label: 'STIX Graph', ptLabel: 'Grafo STIX', icon: Network },
        { id: 'cisa-kev', label: 'CISA KEV', ptLabel: 'Catálogo CISA', icon: Database },
        { id: 'indicators', label: 'Indicators (IOCs)', ptLabel: 'Indicadores (IOCs)', icon: Target },
        { id: 'feeds', label: 'Threat Feeds', ptLabel: 'Feeds de Ameaça', icon: Activity },
      ]
    },
    { 
      label: 'INVESTIGATION', 
      ptLabel: 'INVESTIGAÇÃO',
      isHeader: true,
      items: [
        { id: 'playbooks', label: 'Playbooks', ptLabel: 'Guias (Playbooks)', icon: FileText },
        { id: 'insider', label: 'Insider Monitoring', ptLabel: 'Monitoramento Interno', icon: UserX },
      ]
    },
    { 
      label: 'STACKPASS / MONITOR', 
      ptLabel: 'MONITORAMENTO',
      isHeader: true,
      items: [
        { id: 'leaks', label: 'Password Leaks', ptLabel: 'Vazamentos Senha', icon: Key },
        { id: 'stackmon', label: 'Asset Monitor', ptLabel: 'Monitor de Ativos', icon: Monitor },
      ]
    },
    { 
      label: 'GOVERNANCE', 
      ptLabel: 'GOVERNANÇA',
      isHeader: true,
      items: [
        { id: 'suppliers', label: 'Suppliers', ptLabel: 'Fornecedores', icon: Package },
      ]
    },
  ];

  return (
    <aside className="w-64 bg-soc-card border-r border-soc-border flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded flex items-center justify-center shadow-lg transition-all" style={{ backgroundColor: settings.accent_color }}>
          <ShieldAlert className="text-white" size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-white uppercase">
          {settings.system_name.slice(0, -3)}
          <span style={{ color: settings.accent_color }}>{settings.system_name.slice(-3)}</span>
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={`section-${idx}`} className="mb-2 text-left">
            {section.isHeader ? (
              <>
                <button 
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4 mb-2 px-2 hover:text-gray-300 transition-colors"
                >
                  {language === 'en' ? section.label : section.ptLabel}
                  {collapsedSections[section.label] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </button>
                {!collapsedSections[section.label] && (
                  <div className="space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {section.items?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id!)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                          activeTab === item.id 
                            ? 'text-white shadow-lg' 
                            : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-100'
                        }`}
                        style={activeTab === item.id ? { backgroundColor: settings.accent_color } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={16} />
                          {language === 'en' ? item.label : item.ptLabel}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setActiveTab(section.id!)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  activeTab === section.id 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-100'
                }`}
                style={activeTab === section.id ? { backgroundColor: settings.accent_color } : {}}
              >
                <section.icon size={18} />
                {language === 'en' ? section.label : section.ptLabel}
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-soc-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/50 border border-soc-border">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: settings.accent_color }}
          >
            {settings.user_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-200 truncate">{settings.user_name}</p>
            <p className="text-xs text-gray-500 truncate">{settings.user_role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
