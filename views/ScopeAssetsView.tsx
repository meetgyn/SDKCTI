
import React, { useState } from 'react';
import { 
  Globe, Shield, Plus, Trash2, Search, 
  RefreshCcw, Layout, Fingerprint, Server, Link, X
} from 'lucide-react';
import { ScopeAsset } from '../App';

interface ScopeAssetsViewProps {
  assets: ScopeAsset[];
  setAssets: (assets: ScopeAsset[] | ((prev: ScopeAsset[]) => ScopeAsset[])) => void;
}

export const ScopeAssetsView: React.FC<ScopeAssetsViewProps> = ({ assets, setAssets }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<ScopeAsset['type']>('Domain');

  const handleAddAsset = () => {
    if (!newValue) return;
    
    const newId = Date.now().toString();
    const newAsset: ScopeAsset = {
      id: newId,
      type: newType,
      value: newValue,
      status: 'Verifying',
      lastSeen: 'Just now',
      tags: ['Manual']
    };

    // Adiciona o novo asset preservando os anteriores
    setAssets((prev) => [newAsset, ...prev]);
    setNewValue('');
    setIsAdding(false);
    
    // Simulação de verificação de segurança (3 segundos)
    // CORREÇÃO: Usando a forma funcional para não perder o asset recém-adicionado
    setTimeout(() => {
      setAssets((prev) => 
        prev.map((a) => 
          a.id === newId ? { ...a, status: 'Protected', lastSeen: 'Verified now' } : a
        )
      );
    }, 3000);
  };

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layout className="text-soc-primary" /> Scope Manager
          </h1>
          <p className="text-sm text-gray-500">Ativos cadastrados aqui serão usados para buscas reais no Asset Monitor.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-soc-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-soc-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Monitored</p>
          <p className="text-3xl font-black text-white">{assets.length}</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Verified Clean</p>
          <p className="text-3xl font-black text-soc-success">{assets.filter(a => a.status === 'Protected').length}</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-2xl text-left">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Exposure Alerts</p>
          <p className="text-3xl font-black text-soc-danger">{assets.filter(a => a.status === 'Exposed').length}</p>
        </div>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-soc-border">
                <th className="px-6 py-4">Asset Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Check</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-border">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-800/20 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-800 rounded-lg text-soc-primary">
                        {asset.type === 'Domain' ? <Globe size={16} /> : 
                         asset.type === 'IP' ? <Server size={16} /> : 
                         asset.type === 'Keyword' ? <Fingerprint size={16} /> : <Link size={16} />}
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase">{asset.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-white">{asset.value}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        asset.status === 'Protected' ? 'bg-soc-success' : 
                        asset.status === 'Verifying' ? 'bg-soc-primary animate-pulse' : 'bg-soc-danger'
                      }`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        asset.status === 'Protected' ? 'text-soc-success' : 
                        asset.status === 'Verifying' ? 'text-soc-primary' : 'text-soc-danger'
                      }`}>{asset.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">{asset.lastSeen}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => removeAsset(asset.id)}
                      className="p-2 hover:bg-soc-danger/10 text-gray-600 hover:text-soc-danger rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500 italic">
                    Nenhum ativo cadastrado no escopo de monitoramento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[200] bg-soc-bg/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-soc-card border border-soc-border rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="p-6 border-b border-soc-border bg-gray-900/40 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="text-soc-primary" /> Register Target Asset
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Asset Type</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-gray-300 text-sm focus:ring-1 focus:ring-soc-primary outline-none"
                >
                  <option value="Domain">Root Domain (ex: google.com)</option>
                  <option value="IP">IP Range / CIDR (ex: 1.1.1.1/24)</option>
                  <option value="Keyword">Brand Keyword (ex: BrandName)</option>
                  <option value="EmailDomain">Email Domain (@brand.com)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Value</label>
                <input 
                  type="text" 
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter domain or IP..."
                  className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 px-4 text-white text-sm focus:ring-1 focus:ring-soc-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-900/30 border-t border-soc-border flex gap-3">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-white transition-colors">Cancel</button>
              <button 
                onClick={handleAddAsset}
                className="flex-1 py-3 bg-soc-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-soc-primary/20 hover:scale-[1.02] transition-all"
              >
                Ingest & Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
