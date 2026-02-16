
import React, { useState, useMemo } from 'react';
import { 
  Database, ShieldAlert, Clock, ExternalLink, Search, Filter, 
  Download, ArrowUpRight, X, Info, ShieldCheck, Activity, Globe,
  AlertTriangle, CheckCircle2
} from 'lucide-react';

interface Vulnerability {
  cve: string;
  vendor: string;
  product: string;
  dateAdded: string;
  dueDate: string;
  score: number;
  status: string;
  description: string;
  requiredAction: string;
  referenceUrl: string;
}

const vulnerabilities: Vulnerability[] = [
  { 
    cve: 'CVE-2024-21410', 
    vendor: 'Microsoft', 
    product: 'Exchange Server', 
    dateAdded: '2024-05-14', 
    dueDate: '2024-06-04', 
    score: 9.8, 
    status: 'Active',
    description: 'Microsoft Exchange Server Elevation of Privilege Vulnerability. A remote attacker could exploit this vulnerability to gain elevated privileges on the affected system.',
    requiredAction: 'Apply updates per vendor instructions or mitigate using Extended Protection for Authentication.',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-21410'
  },
  { 
    cve: 'CVE-2023-38831', 
    vendor: 'RARLAB', 
    product: 'WinRAR', 
    dateAdded: '2024-05-10', 
    dueDate: '2024-05-31', 
    score: 7.8, 
    status: 'Active',
    description: 'RARLAB WinRAR allows remote attackers to execute arbitrary code when a user attempts to view a benign file within a specially crafted ZIP archive.',
    requiredAction: 'Update to version 6.23 or later.',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2023-38831'
  },
  { 
    cve: 'CVE-2024-3400', 
    vendor: 'Palo Alto', 
    product: 'PAN-OS', 
    dateAdded: '2024-04-12', 
    dueDate: '2024-05-03', 
    score: 10.0, 
    status: 'Mitigated',
    description: 'A command injection vulnerability in the GlobalProtect feature of Palo Alto Networks PAN-OS software for specific versions allows an unauthenticated attacker to execute arbitrary code with root privileges.',
    requiredAction: 'Apply relevant patches provided by Palo Alto Networks immediately.',
    referenceUrl: 'https://security.paloaltonetworks.com/CVE-2024-3400'
  },
  { 
    cve: 'CVE-2024-23113', 
    vendor: 'Fortinet', 
    product: 'FortiOS', 
    dateAdded: '2024-03-20', 
    dueDate: '2024-04-10', 
    score: 9.8, 
    status: 'Active',
    description: 'A format string vulnerability [CWE-134] in Fortinet FortiOS fgfm daemon may allow a remote unauthenticated attacker to execute arbitrary code or commands via specially crafted requests.',
    requiredAction: 'Update to the latest version as specified in the Fortinet security advisory.',
    referenceUrl: 'https://www.fortiguard.com/psirt/FG-IR-24-029'
  },
  { 
    cve: 'CVE-2024-21887', 
    vendor: 'Ivanti', 
    product: 'Connect Secure', 
    dateAdded: '2024-02-15', 
    dueDate: '2024-03-07', 
    score: 9.1, 
    status: 'Active',
    description: 'A command injection vulnerability in web components of Ivanti Connect Secure and Ivanti Policy Secure allows an authenticated administrator to send specially crafted requests and execute arbitrary commands.',
    requiredAction: 'Apply the mitigation XML or update to the patched version.',
    referenceUrl: 'https://forums.ivanti.com/s/article/KB-CVE-2023-46805-Authentication-Bypass-CVE-2024-21887-Command-Injection-for-Ivanti-Connect-Secure-and-Ivanti-Policy-Secure-Gateways'
  },
];

export const CisaKevView: React.FC = () => {
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVulns = useMemo(() => {
    return vulnerabilities.filter(v => 
      v.cve.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleOpenLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 relative min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Database className="text-soc-warning" /> CISA KEV Catalog Monitor
          </h1>
          <p className="text-sm text-gray-500">Tracking vulnerabilities with known active exploitation (BOD 22-01).</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm border border-soc-border hover:bg-gray-700 transition-colors">
            <Download size={16} /> Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-soc-card border border-soc-border p-5 rounded-xl">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Cataloged</p>
          <p className="text-2xl font-bold text-white">1,124</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-xl">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Due This Week</p>
          <p className="text-2xl font-bold text-soc-danger">12</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-xl">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Avg CVSS Score</p>
          <p className="text-2xl font-bold text-soc-warning">8.4</p>
        </div>
        <div className="bg-soc-card border border-soc-border p-5 rounded-xl">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Target Systems</p>
          <p className="text-2xl font-bold text-soc-primary">45</p>
        </div>
      </div>

      <div className="bg-soc-card border border-soc-border rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-soc-border bg-gray-900/20 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter by CVE, Vendor, or Product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soc-bg border border-soc-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-soc-primary text-white"
            />
          </div>
          <button className="p-2 border border-soc-border rounded-lg text-gray-500 hover:text-white"><Filter size={18} /></button>
        </div>
        
        <div className="overflow-x-auto">
          {filteredVulns.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900 text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-soc-border">
                  <th className="px-6 py-4">CVE ID</th>
                  <th className="px-6 py-4">Vendor & Product</th>
                  <th className="px-6 py-4">CVSS Base</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soc-border">
                {filteredVulns.map((v) => (
                  <tr 
                    key={v.cve} 
                    onClick={() => setSelectedVuln(v)}
                    className="hover:bg-gray-800/20 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={14} className={v.score >= 9 ? 'text-soc-danger' : 'text-soc-warning'} />
                        <span className="font-mono text-sm text-gray-200 font-bold group-hover:text-soc-primary transition-colors">{v.cve}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-200">{v.product}</p>
                      <p className="text-xs text-gray-500">{v.vendor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`text-xs font-bold px-2 py-0.5 rounded ${
                          v.score >= 9 ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {v.score.toFixed(1)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock size={12} /> {v.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'Active' ? 'bg-red-500/10 text-red-500 border border-red-900/50' : 'bg-soc-success/10 text-soc-success border border-soc-success/50'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => handleOpenLink(e, v.referenceUrl)}
                        className="p-1.5 hover:bg-soc-primary/10 rounded-lg text-soc-primary transition-all hover:scale-110 active:scale-95"
                        title="Open External Reference"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">No vulnerabilities found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {selectedVuln && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedVuln(null)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-soc-card border-l border-soc-border z-50 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-soc-border flex items-center justify-between bg-gray-900/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedVuln.score >= 9 ? 'bg-soc-danger/10 text-soc-danger' : 'bg-soc-warning/10 text-soc-warning'}`}>
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedVuln.cve}</h2>
                    <p className="text-xs text-gray-500 font-mono">Cataloged: {selectedVuln.dateAdded}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedVuln(null)}
                  className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Severity & Status */}
                <section>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-soc-bg p-4 rounded-xl border border-soc-border">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">CVSS Score</p>
                      <div className="flex items-end gap-2">
                        <p className={`text-3xl font-bold ${selectedVuln.score >= 9 ? 'text-soc-danger' : 'text-soc-warning'}`}>
                          {selectedVuln.score.toFixed(1)}
                        </p>
                        <span className="text-[10px] text-gray-500 mb-1">/ 10.0</span>
                      </div>
                    </div>
                    <div className="bg-soc-bg p-4 rounded-xl border border-soc-border">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Remediation Due</p>
                      <p className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock size={18} className="text-soc-primary" /> {selectedVuln.dueDate}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Details */}
                <section>
                  <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2 mb-3">
                    <Info size={16} className="text-soc-primary" /> Vulnerability Description
                  </h4>
                  <div className="bg-soc-bg/50 p-4 rounded-xl border border-soc-border leading-relaxed text-sm text-gray-400">
                    {selectedVuln.description}
                  </div>
                </section>

                {/* Affected Asset */}
                <section>
                  <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2 mb-3">
                    <Activity size={16} className="text-soc-accent" /> Affected Vendor & Product
                  </h4>
                  <div className="p-4 bg-soc-bg border border-soc-border rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Vendor</span>
                      <span className="text-sm font-bold text-white">{selectedVuln.vendor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Product</span>
                      <span className="text-sm font-bold text-white">{selectedVuln.product}</span>
                    </div>
                  </div>
                </section>

                {/* Required Action */}
                <section>
                  <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-soc-danger" /> Required Remediation Action
                  </h4>
                  <div className="bg-soc-danger/5 border border-soc-danger/20 p-4 rounded-xl text-sm text-soc-danger italic font-medium">
                    {selectedVuln.requiredAction}
                  </div>
                </section>

                {/* Action Footer */}
                <div className="pt-6 border-t border-soc-border flex gap-3">
                  <button 
                    onClick={(e) => handleOpenLink(e, selectedVuln.referenceUrl)}
                    className="flex-1 bg-soc-primary hover:bg-soc-primary/80 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-soc-primary/20"
                  >
                    <Globe size={18} /> Official NVD Advisory
                  </button>
                  <button className="flex-1 border border-soc-border hover:bg-gray-800 text-gray-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <ShieldCheck size={18} /> Mark as Mitigated
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
