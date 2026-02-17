
import React, { useState, useRef } from 'react';
import { 
  FileBarChart, FileText, Send, Loader2, Download, 
  Printer, X, Check, Shield, Globe, Sparkles, Briefcase, 
  Zap, ShieldAlert, CheckCircle2, AlertCircle, Lock,
  Activity
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const IntelligenceReporterView: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<'Executive' | 'Technical' | 'Exposure'>('Executive');
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  const [showFinishedActions, setShowFinishedActions] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    setReportContent(null);
    setGroundingLinks([]);
    setShowFinishedActions(false);

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      
      const prompt = `
        Você é um Analista Sênior de Cyber Threat Intelligence (CTI).
        PESQUISE NA WEB POR EVENTOS REAIS DAS ÚLTIMAS 48 HORAS.
        Gere um relatório de inteligência ${reportType} em Português focado em ameaças reais.
        Considere ativos monitorados: empresa-cliente.com.br e range IP 200.155.10.0/24.
        
        Conteúdo OBRIGATÓRIO:
        1. Notícias reais de novos grupos de Ransomware ou ataques APT detectados hoje/ontem.
        2. Vulnerabilidades críticas (CVEs) que entraram no CISA KEV esta semana.
        3. Menções reais a vazamentos de dados de empresas brasileiras ou do setor financeiro.
        
        Formatação: H1 para título, H2 para seções, bullet points para IOCs.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      setReportContent(response.text || "Falha ao gerar conteúdo.");
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links = chunks
          .filter((c: any) => c.web)
          .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        setGroundingLinks(links);
      }
    } catch (error: any) {
      console.error("Error generating report:", error);
      setReportContent("Erro ao conectar com o motor de inteligência real. Verifique sua chave API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
      setShowFinishedActions(true);
    }, 100);
  };

  const closeReport = () => {
    setReportContent(null);
    setShowFinishedActions(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileBarChart className="text-soc-primary" /> AI Intelligence Reporter
          </h1>
          <p className="text-sm text-gray-500">Relatórios gerados via AI Grounding baseados em dados reais da web.</p>
        </div>
      </div>

      {!reportContent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print animate-in fade-in duration-500">
          <div className={`bg-soc-card border p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:border-soc-primary/50 transition-all cursor-pointer group ${reportType === 'Executive' ? 'border-soc-primary shadow-lg shadow-soc-primary/10' : 'border-soc-border'}`} onClick={() => setReportType('Executive')}>
            <div className={`p-4 rounded-2xl transition-all ${reportType === 'Executive' ? 'bg-soc-primary text-white scale-110' : 'bg-gray-900 text-gray-500 group-hover:text-soc-primary'}`}>
              <Briefcase size={32} />
            </div>
            <h3 className="font-bold text-lg text-white">Executivo</h3>
            <p className="text-xs text-gray-500">Visão estratégica para diretoria e gestão de risco.</p>
          </div>

          <div className={`bg-soc-card border p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:border-soc-accent/50 transition-all cursor-pointer group ${reportType === 'Technical' ? 'border-soc-accent shadow-lg shadow-soc-accent/10' : 'border-soc-border'}`} onClick={() => setReportType('Technical')}>
            <div className={`p-4 rounded-2xl transition-all ${reportType === 'Technical' ? 'bg-soc-accent text-white scale-110' : 'bg-gray-900 text-gray-500 group-hover:text-soc-accent'}`}>
              <Zap size={32} />
            </div>
            <h3 className="font-bold text-lg text-white">Tático & IOCs</h3>
            <p className="text-xs text-gray-500">Detalhes técnicos e indicadores para times de defesa.</p>
          </div>

          <div className={`bg-soc-card border p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:border-soc-danger/50 transition-all cursor-pointer group ${reportType === 'Exposure' ? 'border-soc-danger shadow-lg shadow-soc-danger/10' : 'border-soc-border'}`} onClick={() => setReportType('Exposure')}>
            <div className={`p-4 rounded-2xl transition-all ${reportType === 'Exposure' ? 'bg-soc-danger text-white scale-110' : 'bg-gray-900 text-gray-500 group-hover:text-soc-danger'}`}>
              <ShieldAlert size={32} />
            </div>
            <h3 className="font-bold text-lg text-white">Vazamentos</h3>
            <p className="text-xs text-gray-500">Focado em exposição de marca e credenciais vazadas.</p>
          </div>

          <div className="md:col-span-3 pt-6">
            <button 
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full py-5 bg-soc-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-soc-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isGenerating ? "Processando Inteligência..." : `Gerar Relatório ${reportType}`}
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 print-container" ref={reportRef}>
          <div className="mb-4 bg-soc-card border border-soc-border p-4 rounded-2xl flex justify-between items-center no-print">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-soc-success" size={20} />
              <h3 className="font-bold text-white">Relatório Concluído</h3>
            </div>
            <div className="flex gap-3">
              <button onClick={handlePrint} className="px-4 py-2 bg-soc-primary text-white rounded-xl text-xs font-bold flex items-center gap-2">
                <Printer size={16} /> Imprimir / PDF
              </button>
              <button onClick={closeReport} className="px-4 py-2 bg-soc-danger/10 text-soc-danger rounded-xl text-xs font-bold flex items-center gap-2">
                <X size={16} /> Fechar
              </button>
            </div>
          </div>

          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 report-paper text-left min-h-[1123px]">
            <div className="p-12 border-b-4 border-soc-primary flex justify-between items-start bg-gray-50/50">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-soc-primary rounded-lg text-white"><Shield size={24} /></div>
                  <span className="text-2xl font-black tracking-tighter uppercase text-gray-900">Threat<span className="text-soc-primary">One</span></span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-soc-primary tracking-[0.2em]">Classificação de Segurança</p>
                  <p className="text-lg font-bold text-gray-800 uppercase tracking-tight">CONFIDENCIAL / RESTRITO</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data de Emissão</p>
                <p className="text-sm font-black text-gray-900">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="p-16">
              <div className="prose prose-slate prose-lg max-w-none">
                <div className="report-content-block bg-white p-2 rounded-3xl text-gray-800 leading-relaxed font-sans whitespace-pre-wrap text-lg">
                  {reportContent}
                </div>
              </div>

              {groundingLinks.length > 0 && (
                <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-200 no-print">
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Globe size={14} /> Fontes Pesquisadas
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groundingLinks.map((link, i) => (
                        <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-soc-primary hover:underline flex items-center gap-2 bg-white p-2 rounded border border-gray-200 truncate">
                           <Check size={12} /> {link.title || link.uri}
                        </a>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
