
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Network, Info, Layers, Maximize2, RefreshCcw, MousePointer2, 
  Plus, Minus, X, Grab, Search, Activity, Eye, EyeOff, ArrowUpRight
} from 'lucide-react';

interface StixNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  color: string;
  description: string;
}

const initialNodesData: StixNode[] = [
  { id: 'TA-1', label: 'APT28', type: 'Threat Actor', x: 200, y: 150, color: '#ef4444', description: 'Grupo de espionagem cibernética russo associado ao GRU. Conhecido por campanhas contra governos europeus.' },
  { id: 'M-1', label: 'X-Agent', type: 'Malware', x: 400, y: 100, color: '#3b82f6', description: 'Ferramenta de acesso remoto (RAT) modular usada primariamente pela APT28 para exfiltração de dados.' },
  { id: 'M-2', label: 'Sedreco', type: 'Malware', x: 400, y: 200, color: '#3b82f6', description: 'Malware de persistência que permite a execução de comandos remotos e download de módulos adicionais.' },
  { id: 'I-1', label: '185.220.101.45', type: 'Indicator', x: 600, y: 80, color: '#8b5cf6', description: 'Endereço IP identificado como servidor de Comando e Controle (C2) em operações ativas.' },
  { id: 'I-2', label: 'update-win.org', type: 'Indicator', x: 600, y: 140, color: '#8b5cf6', description: 'Domínio malicioso usado para typosquatting e entrega de payloads via spear-phishing.' },
  { id: 'V-1', label: 'CVE-2023-38831', type: 'Vulnerability', x: 400, y: 300, color: '#f59e0b', description: 'Vulnerabilidade no WinRAR que permite a execução de código arbitrário ao abrir arquivos processados.' },
];

const initialEdges = [
  { from: 'TA-1', to: 'M-1', label: 'uses' },
  { from: 'TA-1', to: 'M-2', label: 'uses' },
  { from: 'M-1', to: 'I-1', label: 'communicates with' },
  { from: 'M-1', to: 'I-2', label: 'downloads from' },
  { from: 'TA-1', to: 'V-1', label: 'exploits' },
];

export const StixGraphView: React.FC = () => {
  const [nodes, setNodes] = useState<StixNode[]>(initialNodesData);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 450 });
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [activeLayers, setActiveLayers] = useState<string[]>(['Threat Actor', 'Malware', 'Indicator', 'Vulnerability']);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);

  const toggleLayer = (type: string) => {
    setActiveLayers(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.4, Math.min(2.5, zoom + delta));
    setZoom(newZoom);
    const w = 800 / newZoom;
    const h = 450 / newZoom;
    const x = (800 - w) / 2;
    const y = (450 - h) / 2;
    setViewBox({ x, y, w, h });
  };

  const resetView = () => {
    setZoom(1);
    setViewBox({ x: 0, y: 0, w: 800, h: 450 });
    setSelectedNodeId(null);
    setActiveLayers(['Threat Actor', 'Malware', 'Indicator', 'Vulnerability']);
    setShowLayerPanel(false);
    setNodes(initialNodesData);
  };

  // Drag and Drop Logic
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingNodeId(id);
    setSelectedNodeId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !svgRef.current) return;

    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    if (!CTM) return;

    const x = (e.clientX - CTM.e) / CTM.a + viewBox.x;
    const y = (e.clientY - CTM.f) / CTM.d + viewBox.y;

    setNodes(prevNodes => 
      prevNodes.map(node => node.id === draggingNodeId ? { ...node, x, y } : node)
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const activeNodes = useMemo(() => nodes.filter(n => activeLayers.includes(n.type)), [activeLayers, nodes]);
  const activeEdges = useMemo(() => initialEdges.filter(e => {
    const from = nodes.find(n => n.id === e.from);
    const to = nodes.find(n => n.id === e.to);
    return from && to && activeLayers.includes(from.type) && activeLayers.includes(to.type);
  }), [activeLayers, nodes]);

  const selectedNode = activeNodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Network className="text-soc-accent" /> STIX Intelligence Graph
          </h1>
          <p className="text-sm text-gray-500">Análise técnica avançada com persistência de dados.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetView}
            className="p-2 bg-soc-card border border-soc-border rounded-lg text-gray-400 hover:text-white transition-all active:scale-90" 
            title="Reset Graph"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-soc-card border border-soc-border rounded-2xl overflow-hidden relative shadow-inner select-none">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
          <div className="bg-soc-bg/95 backdrop-blur border border-soc-border p-2 rounded-xl flex flex-col gap-2 shadow-2xl ring-1 ring-white/5">
            <button className="p-2 rounded-lg bg-soc-primary text-white shadow-lg shadow-soc-primary/20" title="Select Tool">
              <MousePointer2 size={18} />
            </button>
            <div className="h-[1px] bg-soc-border mx-1"></div>
            <button 
              onClick={() => handleZoom(0.2)}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => handleZoom(-0.2)}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Minus size={18} />
            </button>
            <div className="h-[1px] bg-soc-border mx-1"></div>
            <button 
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`p-2 rounded-lg transition-all ${showLayerPanel ? 'bg-soc-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <Layers size={18} />
            </button>
          </div>

          {/* Layers Panel */}
          {showLayerPanel && (
            <div className="w-56 bg-soc-card/98 backdrop-blur-xl border border-soc-border p-4 rounded-2xl shadow-2xl animate-in slide-in-from-left-4 duration-300 ring-1 ring-white/10 mt-2">
               <div className="flex justify-between items-center mb-4 pb-2 border-b border-soc-border">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filters & Layers</h4>
                  <button onClick={() => setShowLayerPanel(false)} className="text-gray-500 hover:text-white transition-colors"><X size={14} /></button>
               </div>
               <div className="space-y-1.5">
                  {['Threat Actor', 'Malware', 'Indicator', 'Vulnerability'].map(type => (
                    <button 
                      key={type}
                      onClick={() => toggleLayer(type)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${
                        activeLayers.includes(type) ? 'bg-soc-primary/10 text-white border border-soc-primary/20' : 'text-gray-500 hover:bg-gray-800 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          type === 'Threat Actor' ? 'bg-red-500' :
                          type === 'Malware' ? 'bg-blue-500' :
                          type === 'Indicator' ? 'bg-purple-500' : 'bg-amber-500'
                        }`} />
                        {type}
                      </span>
                      {activeLayers.includes(type) ? <Eye size={14} className="text-soc-primary" /> : <EyeOff size={14} />}
                    </button>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Graph Canvas - REMOVED onClick setSelectedNodeId(null) to keep info panel open */}
        <svg 
          ref={svgRef}
          className="w-full h-full cursor-default transition-all duration-300" 
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <marker id="arrowhead-stix" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orientation="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
            </marker>
            <filter id="nodeGlowStix">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Edges */}
          {activeEdges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from)!;
            const toNode = nodes.find(n => n.id === edge.to)!;
            const isHighlight = selectedNodeId === edge.from || selectedNodeId === edge.to;
            return (
              <g key={`edge-${i}`} className="animate-in fade-in duration-500">
                <line 
                  x1={fromNode.x} y1={fromNode.y} 
                  x2={toNode.x} y2={toNode.y} 
                  stroke={isHighlight ? "#3b82f6" : "#1f2937"} 
                  strokeWidth={isHighlight ? "2.5" : "1.5"} 
                  strokeDasharray={isHighlight ? "" : "4 2"}
                  markerEnd="url(#arrowhead-stix)"
                />
                <text 
                  x={(fromNode.x + toNode.x) / 2} 
                  y={(fromNode.y + toNode.y) / 2 - 8} 
                  fill={isHighlight ? "#3b82f6" : "#4b5563"} 
                  fontSize="8" 
                  textAnchor="middle" 
                  className="font-bold select-none pointer-events-none"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {activeNodes.map((node) => (
            <g 
              key={node.id} 
              transform={`translate(${node.x},${node.y})`}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className="group cursor-pointer"
            >
              <circle 
                r={20} 
                fill={node.color} 
                fillOpacity={selectedNodeId === node.id ? "0.3" : "0.1"} 
                stroke={node.color} 
                strokeWidth={selectedNodeId === node.id ? "3" : "1"}
              />
              <circle r="6" fill={node.color} filter={selectedNodeId === node.id ? "url(#nodeGlowStix)" : ""} />
              
              <text y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" className="pointer-events-none drop-shadow">
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Sidebar Info Panel - Persistent until 'X' is clicked */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-72 animate-in slide-in-from-right-4 duration-300 z-40">
            <div className="bg-soc-card/98 backdrop-blur-xl border border-soc-primary/30 p-6 rounded-2xl shadow-2xl ring-1 ring-white/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white leading-tight">{selectedNode.label}</h4>
                  <span className="text-[10px] font-bold text-soc-primary uppercase bg-soc-primary/10 px-2 py-0.5 rounded mt-2 inline-block border border-soc-primary/20">
                    {selectedNode.type}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedNodeId(null)} 
                  className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-soc-bg/50 p-3.5 rounded-xl border border-soc-border">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Description</p>
                  <p className="text-[12px] text-gray-300 leading-relaxed italic">"{selectedNode.description}"</p>
                </div>
                
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setIsInvestigating(true);
                      setTimeout(() => setIsInvestigating(false), 2000);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                      isInvestigating ? 'bg-soc-success text-white' : 'bg-soc-primary text-white hover:bg-soc-primary/80 shadow-soc-primary/20'
                    }`}
                  >
                    {isInvestigating ? <Activity className="animate-spin" size={16} /> : <Search size={16} />}
                    {isInvestigating ? 'Enriching...' : 'Enrich Intelligence'}
                  </button>
                </div>

                <div className="pt-2 flex justify-center">
                   <p className="text-[9px] text-gray-600 font-mono uppercase tracking-tighter">STIX 2.1 Object Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
