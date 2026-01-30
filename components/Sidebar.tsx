
import React, { useState } from 'react';
import { Point, Vector, GridConfig, Language } from '../types';
import { Circle, MoveUpRight, Grid3X3, Trash2, ChevronDown, ChevronRight, Link, Unlink, Palette, Settings2, FileDown, Layers, Languages, Type, Sliders, MousePointer2 } from 'lucide-react';

interface SidebarProps {
  lang: Language;
  setLang: (l: Language) => void;
  points: Point[];
  vectors: Vector[];
  gridConfig: GridConfig;
  setGridConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
  addPoint: (p?: Partial<Point>) => void;
  addVector: (v?: Partial<Vector>) => void;
  updatePoint: (id: string, updates: Partial<Point>) => void;
  updateVector: (id: string, updates: Partial<Vector>) => void;
  batchUpdatePoints: (updates: Partial<Point>) => void;
  batchUpdateVectors: (updates: Partial<Vector>) => void;
  deletePoint: (id: string) => void;
  deleteVector: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  lang, setLang, points, vectors, gridConfig, setGridConfig,
  addPoint, addVector, updatePoint, updateVector, 
  batchUpdatePoints, batchUpdateVectors,
  deletePoint, deleteVector
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'objects' | 'import'>('objects');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Import States
  const [pointImportText, setPointImportText] = useState("");
  const [vectorImportText, setVectorImportText] = useState("");
  const [importVectorLength, setImportVectorLength] = useState(5);

  const t = {
    zh: {
      studio: '几何坐标工作室',
      objects: '对象管理',
      import: '批量导入',
      settings: '环境设置',
      points: '点集合',
      vectors: '向量集合',
      add: '新增',
      batchModify: '批量修改',
      name: '标签内容',
      size: '点半径',
      length: '长度',
      angle: '角度',
      width: '线宽',
      labelPos: '标签偏置',
      labelColor: '标签颜色',
      labelSize: '文字大小',
      importPoints: '导入点',
      importVectors: '导入向量',
      formatPoint: '格式: 名称, X, Y',
      formatVector: '格式: 名称, 角度',
      vecLen: '预设长度',
      btnImport: '开始导入',
      viewOptions: '画布显示',
      showGrid: '网格背景',
      showLabels: '轴刻度',
      palette: '色彩主题',
      bg: '背景颜色',
      axis: '坐标轴',
      labels: '坐标文字',
      gridMajor: '主网格',
      gridMinor: '次网格',
      dimensions: '比例设定',
      xScale: 'X轴比例',
      yScale: 'Y轴比例',
      noneAdded: '无对象',
      placeholderPt: 'A, 1.2, 3.4\nB, -2, 5',
      placeholderVec: 'u, 45\nv, 180',
      labelStyle: '【标签样式】',
      objectStyle: '【几何样式】'
    },
    en: {
      studio: 'Studio X-Y',
      objects: 'Objects',
      import: 'Import',
      settings: 'Settings',
      points: 'Points',
      vectors: 'Vectors',
      add: 'Add',
      batchModify: 'Batch Edit',
      name: 'Label Text',
      size: 'Point Size',
      length: 'Length',
      angle: 'Angle',
      width: 'Thickness',
      labelPos: 'Label Offset',
      labelColor: 'Label Color',
      labelSize: 'Font Size',
      importPoints: 'Bulk Points',
      importVectors: 'Bulk Vectors',
      formatPoint: 'Format: Name, X, Y',
      formatVector: 'Format: Name, Angle',
      vecLen: 'Default Len',
      btnImport: 'Import',
      viewOptions: 'Visibility',
      showGrid: 'Show Grid',
      showLabels: 'Show Ticks',
      palette: 'Theme',
      bg: 'Background',
      axis: 'Axis Lines',
      labels: 'Labels',
      gridMajor: 'Grid Major',
      gridMinor: 'Grid Minor',
      dimensions: 'Scaling',
      xScale: 'X-Scale',
      yScale: 'Y-Scale',
      noneAdded: 'Empty.',
      placeholderPt: 'A, 1.2, 3.4\nB, -2, 5',
      placeholderVec: 'u, 45\nv, 180',
      labelStyle: '[ LABEL STYLE ]',
      objectStyle: '[ BODY STYLE ]'
    }
  }[lang];

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImportPoints = () => {
    const lines = pointImportText.split('\n').filter(l => l.trim());
    lines.forEach(line => {
      const parts = line.split(/[,\t，]/).map(p => p.trim());
      if (parts.length >= 3) {
        const name = parts[0];
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        if (!isNaN(x) && !isNaN(y)) {
          addPoint({ label: name, x, y });
        }
      }
    });
    setPointImportText("");
    setActiveTab('objects');
  };

  const handleImportVectors = () => {
    const lines = vectorImportText.split('\n').filter(l => l.trim());
    lines.forEach(line => {
      const parts = line.split(/[,\t，]/).map(p => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const angle = parseFloat(parts[1]);
        if (!isNaN(angle)) {
          addVector({ label: name, angle, length: importVectorLength });
        }
      }
    });
    setVectorImportText("");
    setActiveTab('objects');
  };

  const updateScaleX = (val: number) => {
    setGridConfig(prev => {
      if (prev.lockAspectRatio) return { ...prev, unitSizeX: val, unitSizeY: val };
      return { ...prev, unitSizeX: val };
    });
  };

  const updateScaleY = (val: number) => {
    setGridConfig(prev => {
      if (prev.lockAspectRatio) return { ...prev, unitSizeX: val, unitSizeY: val };
      return { ...prev, unitSizeY: val };
    });
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20 overflow-hidden font-sans">
      <div className="p-8 pb-4 text-center border-b border-slate-800/50">
        <h1 className="text-xl font-black text-white flex items-center justify-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Grid3X3 size={20} className="text-white" />
          </div>
          <span className="tracking-tighter uppercase italic">{t.studio}</span>
        </h1>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-bold text-slate-300 transition-all uppercase shadow-inner"
          >
            <Languages size={12} />
            {lang === 'zh' ? 'Switch to English' : '切换至中文'}
          </button>
        </div>
      </div>

      <div className="flex px-4 gap-1 mt-4">
        {['objects', 'import', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-md flex-1 ${activeTab === tab ? 'bg-slate-800 text-indigo-400 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
          >
            {(t as any)[tab]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-10">
        {activeTab === 'objects' && (
          <>
            {/* Points Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 bg-indigo-500/10 px-3 py-1 rounded-full">
                  <Circle size={10} className="fill-indigo-500" /> {t.points}
                </h2>
                <button onClick={() => addPoint()} className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-500 transition-transform active:scale-95 shadow-lg shadow-indigo-900/40">
                  {t.add}
                </button>
              </div>

              {points.length > 0 && (
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers size={12} className="text-indigo-400" />
                    <span className="text-[9px] font-black uppercase text-indigo-300">{t.batchModify}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 p-2 bg-slate-900/40 rounded-lg border border-slate-800/50">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 uppercase"><Type size={10}/> {t.labelColor}</div>
                      <input type="color" className="w-full h-7 bg-transparent cursor-pointer rounded overflow-hidden" onChange={(e) => batchUpdatePoints({ labelColor: e.target.value })} />
                      <div className="text-[8px] font-bold text-slate-500 uppercase">{t.labelSize}</div>
                      <input type="range" min="8" max="40" className="w-full h-1 accent-indigo-500 bg-slate-700 rounded-full" onChange={(e) => batchUpdatePoints({ labelSize: parseInt(e.target.value) })} />
                    </div>
                    <div className="space-y-2 p-2 bg-slate-900/40 rounded-lg border border-slate-800/50">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 uppercase"><MousePointer2 size={10}/> {t.bg}</div>
                      <input type="color" className="w-full h-7 bg-transparent cursor-pointer rounded overflow-hidden" onChange={(e) => batchUpdatePoints({ color: e.target.value })} />
                      <div className="text-[8px] font-bold text-slate-500 uppercase">{t.size}</div>
                      <input type="range" min="1" max="20" className="w-full h-1 accent-indigo-500 bg-slate-700 rounded-full" onChange={(e) => batchUpdatePoints({ size: parseInt(e.target.value) })} />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {points.length === 0 && <div className="text-[11px] text-slate-600 italic text-center py-4">{t.noneAdded}</div>}
                {points.map(p => (
                  <div key={p.id} className="bg-slate-800/30 rounded-lg border border-slate-800 hover:border-indigo-500/50 transition-all overflow-hidden group">
                    <div className="flex items-center justify-between p-2">
                      <button onClick={() => toggleExpand(p.id)} className="flex items-center gap-2 text-slate-300 flex-1 truncate text-xs">
                        <div className={`transition-transform duration-200 ${expandedItems[p.id] ? 'rotate-90 text-indigo-400' : ''}`}><ChevronRight size={14} /></div>
                        <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: p.color }}></div>
                        <span className="font-mono text-indigo-400 font-bold truncate">{p.label}</span>
                      </button>
                      <button onClick={() => deletePoint(p.id)} className="p-1 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                    {expandedItems[p.id] && (
                      <div className="px-3 pb-3 pt-1 space-y-4 border-t border-slate-800/50 bg-slate-900/20">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1"><span className="text-[8px] font-bold text-slate-600 uppercase">X-Axis</span><input type="number" step="0.1" value={p.x} onChange={e => updatePoint(p.id, { x: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" /></div>
                          <div className="space-y-1"><span className="text-[8px] font-bold text-slate-600 uppercase">Y-Axis</span><input type="number" step="0.1" value={p.y} onChange={e => updatePoint(p.id, { y: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" /></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-2">
                           <div className="space-y-2">
                              <h4 className="text-[8px] font-black uppercase text-indigo-500/80 tracking-widest border-b border-indigo-500/20 pb-1">{t.labelStyle}</h4>
                              <div className="flex items-center gap-2"><input type="color" value={p.labelColor} onChange={e => updatePoint(p.id, { labelColor: e.target.value })} className="w-6 h-6 bg-transparent" /><input type="range" min="8" max="40" value={p.labelSize} onChange={e => updatePoint(p.id, { labelSize: parseInt(e.target.value) })} className="flex-1 h-1 accent-indigo-500" /></div>
                              <input type="text" value={p.label} onChange={e => updatePoint(p.id, { label: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-white font-mono" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-[8px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-1">{t.objectStyle}</h4>
                              <div className="flex items-center gap-2"><input type="color" value={p.color} onChange={e => updatePoint(p.id, { color: e.target.value })} className="w-6 h-6 bg-transparent" /><input type="range" min="1" max="20" value={p.size} onChange={e => updatePoint(p.id, { size: parseInt(e.target.value) })} className="flex-1 h-1 accent-indigo-500" /></div>
                              <div className="h-7"></div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Vectors Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between mt-12">
                <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <MoveUpRight size={10} /> {t.vectors}
                </h2>
                <button onClick={() => addVector()} className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-4 py-1 rounded-md hover:bg-emerald-500 transition-transform active:scale-95 shadow-lg shadow-emerald-900/40">
                  {t.add}
                </button>
              </div>

              {vectors.length > 0 && (
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers size={12} className="text-emerald-400" />
                    <span className="text-[9px] font-black uppercase text-emerald-300">{t.batchModify}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 p-2 bg-slate-900/40 rounded-lg border border-slate-800/50">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 uppercase"><Type size={10}/> {t.labelColor}</div>
                      <input type="color" className="w-full h-7 bg-transparent cursor-pointer rounded overflow-hidden" onChange={(e) => batchUpdateVectors({ labelColor: e.target.value })} />
                      <div className="text-[8px] font-bold text-slate-500 uppercase">{t.labelSize}</div>
                      <input type="range" min="8" max="40" className="w-full h-1 accent-emerald-500 bg-slate-700 rounded-full" onChange={(e) => batchUpdateVectors({ labelSize: parseInt(e.target.value) })} />
                    </div>
                    <div className="space-y-2 p-2 bg-slate-900/40 rounded-lg border border-slate-800/50">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 uppercase"><Sliders size={10}/> {t.bg}</div>
                      <input type="color" className="w-full h-7 bg-transparent cursor-pointer rounded overflow-hidden" onChange={(e) => batchUpdateVectors({ color: e.target.value })} />
                      <div className="text-[8px] font-bold text-slate-500 uppercase">{t.width}</div>
                      <input type="range" min="1" max="10" step="0.5" className="w-full h-1 accent-emerald-500 bg-slate-700 rounded-full" onChange={(e) => batchUpdateVectors({ thickness: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {vectors.length === 0 && <div className="text-[11px] text-slate-600 italic text-center py-4">{t.noneAdded}</div>}
                {vectors.map(v => (
                  <div key={v.id} className="bg-slate-800/30 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-all overflow-hidden group">
                    <div className="flex items-center justify-between p-2">
                      <button onClick={() => toggleExpand(v.id)} className="flex items-center gap-2 text-slate-300 flex-1 truncate text-xs">
                        <div className={`transition-transform duration-200 ${expandedItems[v.id] ? 'rotate-90 text-emerald-400' : ''}`}><ChevronRight size={14} /></div>
                        <span className="font-mono text-emerald-400 font-bold truncate">{v.label}</span>
                        <span className="text-[9px] text-slate-500 font-mono">({v.length}u @ {v.angle}°)</span>
                      </button>
                      <button onClick={() => deleteVector(v.id)} className="p-1 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                    {expandedItems[v.id] && (
                      <div className="px-3 pb-3 pt-1 space-y-4 border-t border-slate-800/50 bg-slate-900/20">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1"><span className="text-[8px] font-bold text-slate-600 uppercase">{t.length}</span><input type="number" step="0.1" value={v.length} onChange={e => updateVector(v.id, { length: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" /></div>
                          <div className="space-y-1"><span className="text-[8px] font-bold text-slate-600 uppercase">{t.angle}</span><input type="number" step="1" value={v.angle} onChange={e => updateVector(v.id, { angle: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" /></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-2">
                           <div className="space-y-2">
                              <h4 className="text-[8px] font-black uppercase text-emerald-500/80 tracking-widest border-b border-emerald-500/20 pb-1">{t.labelStyle}</h4>
                              <div className="flex items-center gap-2"><input type="color" value={v.labelColor} onChange={e => updateVector(v.id, { labelColor: e.target.value })} className="w-6 h-6 bg-transparent" /><input type="range" min="8" max="40" value={v.labelSize} onChange={e => updateVector(v.id, { labelSize: parseInt(e.target.value) })} className="flex-1 h-1 accent-emerald-500" /></div>
                              <div className="space-y-1"><div className="flex justify-between text-[7px] font-bold text-slate-500 uppercase"><span>{t.labelPos}</span><span className="text-emerald-400 font-mono">{(v.labelPosition * 100).toFixed(0)}%</span></div><input type="range" min="0" max="1" step="0.01" value={v.labelPosition} onChange={e => updateVector(v.id, { labelPosition: parseFloat(e.target.value) })} className="w-full h-1 accent-emerald-500" /></div>
                              <input type="text" value={v.label} onChange={e => updateVector(v.id, { label: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-white font-mono" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-[8px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-1">{t.objectStyle}</h4>
                              <div className="flex items-center gap-2"><input type="color" value={v.color} onChange={e => updateVector(v.id, { color: e.target.value })} className="w-6 h-6 bg-transparent" /><input type="range" min="1" max="10" step="0.5" value={v.thickness} onChange={e => updateVector(v.id, { thickness: parseFloat(e.target.value) })} className="flex-1 h-1 accent-emerald-500" /></div>
                              <div className="h-10"></div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'import' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <section className="space-y-4">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 border-b border-indigo-900 pb-2">
                <FileDown size={14} /> {t.importPoints}
              </h2>
              <p className="text-[9px] text-slate-500 leading-relaxed uppercase font-black">{t.formatPoint}</p>
              <textarea value={pointImportText} onChange={e => setPointImportText(e.target.value)} placeholder={t.placeholderPt} className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-indigo-400 outline-none focus:border-indigo-500 transition-colors shadow-inner" />
              <button onClick={handleImportPoints} disabled={!pointImportText.trim()} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                {t.btnImport}
              </button>
            </section>

            <section className="space-y-4">
              <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-900 pb-2">
                <FileDown size={14} /> {t.importVectors}
              </h2>
              <p className="text-[9px] text-slate-500 leading-relaxed uppercase font-black">{t.formatVector}</p>
              <div className="flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                 <label className="text-[10px] font-bold text-slate-400 uppercase">{t.vecLen}</label>
                 <input type="number" value={importVectorLength} onChange={e => setImportVectorLength(parseFloat(e.target.value) || 0)} className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-400 font-mono" />
              </div>
              <textarea value={vectorImportText} onChange={e => setVectorImportText(e.target.value)} placeholder={t.placeholderVec} className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none focus:border-emerald-500 transition-colors shadow-inner" />
              <button onClick={handleImportVectors} disabled={!vectorImportText.trim()} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                {t.btnImport}
              </button>
            </section>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                <Settings2 size={14} className="text-indigo-500" /> {t.viewOptions}
              </h2>
              <div className="space-y-4 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{t.showGrid}</span>
                  <button onClick={() => setGridConfig(prev => ({...prev, showGrid: !prev.showGrid}))} className={`w-10 h-5 rounded-full transition-all relative ${gridConfig.showGrid ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-md ${gridConfig.showGrid ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{t.showLabels}</span>
                  <button onClick={() => setGridConfig(prev => ({...prev, showLabels: !prev.showLabels}))} className={`w-10 h-5 rounded-full transition-all relative ${gridConfig.showLabels ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-md ${gridConfig.showLabels ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                <Palette size={14} className="text-purple-500" /> {t.palette}
              </h2>
              <div className="grid gap-3 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                {[
                  { label: t.bg, key: 'bgColor' },
                  { label: t.axis, key: 'axisColor' },
                  { label: t.labels, key: 'textColor' },
                  { label: t.gridMajor, key: 'gridColorMajor' },
                  { label: t.gridMinor, key: 'gridColorMinor' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.label}</label>
                    <input type="color" value={(gridConfig as any)[item.key]} onChange={e => setGridConfig(prev => ({...prev, [item.key]: e.target.value}))} className="w-8 h-5 rounded cursor-pointer border-none bg-transparent" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dimensions}</h2>
                <button onClick={() => setGridConfig(prev => ({...prev, lockAspectRatio: !prev.lockAspectRatio}))} className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${gridConfig.lockAspectRatio ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 text-slate-600'}`}>
                  {gridConfig.lockAspectRatio ? <Link size={10} /> : <Unlink size={10} />}
                </button>
              </div>

              <div className="space-y-6 p-4 bg-slate-800/10 rounded-xl border border-slate-800/50">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-black text-slate-600">
                    <span>{t.xScale}</span>
                    <span className="text-indigo-400 font-mono">{gridConfig.unitSizeX.toFixed(0)} PX</span>
                  </div>
                  <input type="range" min="5" max="1000" value={gridConfig.unitSizeX} onChange={e => updateScaleX(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 appearance-none rounded accent-indigo-500" />
                </div>
                {!gridConfig.lockAspectRatio && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase font-black text-slate-600">
                      <span>{t.yScale}</span>
                      <span className="text-emerald-400 font-mono">{gridConfig.unitSizeY.toFixed(0)} PX</span>
                    </div>
                    <input type="range" min="5" max="1000" value={gridConfig.unitSizeY} onChange={e => updateScaleY(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 appearance-none rounded accent-emerald-500" />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
