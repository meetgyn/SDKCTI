
import React, { useState, useEffect } from 'react';
import { 
  Package, ClipboardCheck, Info, ChevronRight, CheckCircle2, 
  AlertCircle, ShieldCheck, Download, Loader2, Settings, 
  Plus, Trash2, Edit3, X, Save, ArrowLeft 
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  category: string;
}

const defaultQuestions: Question[] = [
  { id: 1, text: "O fornecedor garante a notificação de incidentes de segurança em até 24h após a detecção?", category: "Governança" },
  { id: 2, text: "O fornecedor mantém uma Software Bill of Materials (SBOM) atualizada para os componentes de software?", category: "Técnico" },
  { id: 3, text: "O acesso administrativo utiliza ferramentas de PAM com aprovação Just-In-Time (JIT)?", category: "Controle de Acesso" },
  { id: 4, text: "O fornecedor suporta o uso de chaves de criptografia gerenciadas pelo cliente (BYOK)?", category: "Proteção" },
  { id: 5, text: "O fornecedor possui monitoramento de segurança contínuo (SOC) 24x7?", category: "Maturidade" },
  { id: 6, text: "Existe compromisso formal de remediar vulnerabilidades críticas em no máximo 15 dias?", category: "Maturidade" },
  { id: 7, text: "100% dos endpoints dos colaboradores utilizam solução de EDR/XDR em modo de bloqueio?", category: "Proteção" },
  { id: 8, text: "O plano de Disaster Recovery (DRP) foi testado com sucesso nos últimos 12 meses?", category: "Governança" },
  { id: 9, text: "O fornecedor audita formalmente a segurança de seus próprios sub-processadores (4th parties)?", category: "Governança" },
  { id: 10, text: "Os dados do cliente são isolados logicamente de outros clientes em nível de banco de dados?", category: "Técnico" },
];

export const SupplierAssessmentView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [isManaging, setIsManaging] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Estados para edição/adição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempQuestion, setTempQuestion] = useState({ text: '', category: 'Maturidade' });

  const handleAnswer = (val: boolean) => {
    setAnswers({ ...answers, [questions[currentStep].id]: val });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    const totalQuestions = questions.length;
    if (totalQuestions === 0) return { score: 0, label: 'N/A', color: 'text-gray-500' };
    
    const correctAnswers = Object.values(answers).filter(Boolean).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    let label = 'BAIXO';
    let color = 'text-soc-danger';
    if (score >= 80) { label = 'EXCELENTE'; color = 'text-soc-success'; }
    else if (score >= 60) { label = 'MODERADO'; color = 'text-soc-warning'; }
    
    return { score, label, color };
  };

  const addQuestion = () => {
    if (!tempQuestion.text) return;
    const newQ = { 
      id: Date.now(), 
      text: tempQuestion.text, 
      category: tempQuestion.category 
    };
    setQuestions([...questions, newQ]);
    setTempQuestion({ text: '', category: 'Maturidade' });
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const startEditing = (q: Question) => {
    setEditingId(q.id);
    setTempQuestion({ text: q.text, category: q.category });
  };

  const saveEdit = () => {
    setQuestions(questions.map(q => q.id === editingId ? { ...q, ...tempQuestion } : q));
    setEditingId(null);
    setTempQuestion({ text: '', category: 'Maturidade' });
  };

  const handleDownloadPDF = async () => {
    const result = calculateScore();
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reportContent = `
THREATONE - RELATÓRIO DE AUDITORIA DE FORNECEDOR
==================================================
Data: ${new Date().toLocaleString()}
Score Final: ${result.score}% - Rating: ${result.label}

RESPOSTAS DETALHADAS:
${questions.map(q => `${answers[q.id] ? '[SIM]' : '[NÃO]'} ${q.text} (${q.category})`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Auditoria_Fornecedor_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloading(false);
  };

  if (isManaging) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <button onClick={() => setIsManaging(false)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold">
            <ArrowLeft size={18} /> Voltar para Auditoria
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="text-soc-primary" size={20} /> Configurar Questionário
          </h2>
        </div>

        <div className="bg-soc-card border border-soc-border rounded-2xl p-6 space-y-6">
          <div className="bg-soc-bg border border-dashed border-soc-primary/30 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-soc-primary uppercase tracking-widest">{editingId ? 'Editar Pergunta' : 'Nova Pergunta'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <input 
                  type="text" 
                  value={tempQuestion.text}
                  onChange={(e) => setTempQuestion({...tempQuestion, text: e.target.value})}
                  placeholder="Ex: O fornecedor utiliza criptografia em repouso?"
                  className="w-full bg-soc-card border border-soc-border rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-soc-primary outline-none"
                />
              </div>
              <select 
                value={tempQuestion.category}
                onChange={(e) => setTempQuestion({...tempQuestion, category: e.target.value})}
                className="bg-soc-card border border-soc-border rounded-lg px-4 py-2 text-sm text-gray-400 outline-none"
              >
                <option>Maturidade</option>
                <option>Controle de Acesso</option>
                <option>Proteção</option>
                <option>Governança</option>
                <option>Técnico</option>
              </select>
            </div>
            <button 
              onClick={editingId ? saveEdit : addQuestion}
              className="w-full py-2 bg-soc-primary text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-soc-primary/80 transition-all"
            >
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? 'Salvar Alteração' : 'Adicionar ao Questionário'}
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Perguntas Atuais ({questions.length})</h3>
            {questions.map((q) => (
              <div key={q.id} className="p-4 bg-soc-bg border border-soc-border rounded-xl flex items-center justify-between group hover:border-soc-primary/30 transition-all">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-soc-primary uppercase">{q.category}</span>
                  <p className="text-sm text-gray-200">{q.text}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditing(q)} className="p-2 text-gray-500 hover:text-white transition-all"><Edit3 size={16} /></button>
                  <button onClick={() => deleteQuestion(q.id)} className="p-2 text-gray-500 hover:text-soc-danger transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const result = isFinished ? calculateScore() : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="text-soc-primary" /> Supplier Assessment
          </h1>
          <p className="text-gray-500 mt-1">Due diligence automatizada para riscos de terceiros.</p>
        </div>
        {!isFinished && (
          <button 
            onClick={() => setIsManaging(true)}
            className="px-4 py-2 bg-gray-800 text-gray-400 border border-soc-border rounded-xl text-sm font-bold flex items-center gap-2 hover:text-white transition-all"
          >
            <Settings size={18} /> Ajustar Perguntas
          </button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="bg-soc-card border border-dashed border-soc-border p-20 rounded-3xl text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-gray-600" />
          <h3 className="text-xl font-bold text-white">Nenhuma pergunta configurada</h3>
          <p className="text-gray-500">Adicione perguntas para iniciar a auditoria do cliente.</p>
          <button onClick={() => setIsManaging(true)} className="px-6 py-2 bg-soc-primary text-white rounded-xl font-bold">Configurar Agora</button>
        </div>
      ) : !isFinished ? (
        <div className="bg-soc-card border border-soc-border rounded-3xl overflow-hidden shadow-xl animate-in fade-in duration-500">
          <div className="h-2 bg-gray-900">
            <div 
              className="h-full bg-soc-primary transition-all duration-500" 
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="p-12 space-y-8">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-soc-primary uppercase tracking-widest px-3 py-1 bg-soc-primary/10 rounded-full border border-soc-primary/20">
                {questions[currentStep].category}
              </span>
              <span className="text-xs font-mono text-gray-500">
                Questão {currentStep + 1} de {questions.length}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white leading-tight">
              {questions[currentStep].text}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => handleAnswer(true)}
                className="group p-6 bg-soc-bg border border-soc-border rounded-2xl hover:border-soc-success/50 hover:bg-soc-success/5 transition-all flex items-center justify-between"
              >
                <div className="text-left">
                  <p className="font-bold text-white group-hover:text-soc-success">Sim / Implementado</p>
                  <p className="text-xs text-gray-500 mt-1">Conformidade total detectada.</p>
                </div>
                <CheckCircle2 size={24} className="text-gray-800 group-hover:text-soc-success transition-colors" />
              </button>

              <button 
                onClick={() => handleAnswer(false)}
                className="group p-6 bg-soc-bg border border-soc-border rounded-2xl hover:border-soc-danger/50 hover:bg-soc-danger/5 transition-all flex items-center justify-between"
              >
                <div className="text-left">
                  <p className="font-bold text-white group-hover:text-soc-danger">Não / Parcial</p>
                  <p className="text-xs text-gray-500 mt-1">Ausência ou falha de controle.</p>
                </div>
                <AlertCircle size={24} className="text-gray-800 group-hover:text-soc-danger transition-colors" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-soc-card border border-soc-border rounded-3xl p-10 text-center shadow-2xl animate-in zoom-in-95">
          <div className="inline-block p-4 rounded-full bg-gray-900 border border-soc-border mb-6">
            <ShieldCheck size={48} className={result?.color} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Avaliação Concluída</h2>
          <p className="text-gray-500 mb-8">Score de Maturidade Gerado</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-soc-bg p-6 rounded-2xl border border-soc-border">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Score Final</p>
              <p className={`text-4xl font-bold ${result?.color}`}>{result?.score}%</p>
            </div>
            <div className="bg-soc-bg p-6 rounded-2xl border border-soc-border">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
              <p className={`text-xl font-bold ${result?.color}`}>{result?.label}</p>
            </div>
            <div className="bg-soc-bg p-6 rounded-2xl border border-soc-border">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Elegibilidade</p>
              <p className={`text-xl font-bold ${result?.score >= 70 ? 'text-soc-success' : 'text-soc-danger'}`}>
                {result?.score >= 70 ? 'APROVADO' : 'REJEITADO'}
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`px-8 py-3 bg-soc-primary text-white rounded-xl font-bold shadow-lg shadow-soc-primary/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50`}
            >
              {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
              {isDownloading ? 'Gerando...' : 'Download Report'}
            </button>
            <button 
              onClick={() => { setIsFinished(false); setCurrentStep(0); setAnswers({}); }}
              className="px-8 py-3 bg-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition-all"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
