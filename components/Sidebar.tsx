
import React, { useState } from 'react';
import { Point, Vector, GridConfig, Language } from '../types';
import { Circle, MoveUpRight, Grid3X3, Trash2, ChevronDown, ChevronRight, Link, Unlink, Palette, Settings2, FileDown, Layers, Languages } from 'lucide-react';

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
      objects: '对象',
      import: '导入',
      settings: '设置',
      points: '点',
      vectors: '向量',
      add: '添加',
      modifyAllPoints: '批量修改点',
      modifyAllVectors: '批量修改向量',
      name: '名称',
      size: '大小',
      length: '长度',
      angle: '角度',
      width: '粗细',
      labelPos: '标签位置',
      importPoints: '批量导入点',
      importVectors: '批量导入向量',
      formatPoint: '格式: 名称, X, Y (每行一个)',
      formatVector: '格式: 名称, 角度 (每行一个)',
      vecLen: '向量长度',
      btnImport: '开始导入',
      viewOptions: '显示选项',
      showGrid: '显示网格线',
      showLabels: '显示坐标刻度',
      palette: '配色方案',
      bg: '背景',
      axis: '轴线',
      labels: '标签文字',
      gridMajor: '主网格',
      gridMinor: '次网格',
      dimensions: '比例设定',
      xScale: 'X轴缩放',
      yScale: 'Y轴缩放',
      noneAdded: '暂无数据',
      placeholderPt: 'A, 1.2, 3.4\nB, -2, 5',
      placeholderVec: 'u, 45\nv, 180'
    },
    en: {
      studio: 'Studio X-Y',
      objects: 'Objects',
      import: 'Import',
      settings: 'Settings',
      points: 'Points',
      vectors: 'Vectors',
      add: 'Add',
      modifyAllPoints: 'Batch Modify Points',
      modifyAllVectors: 'Batch Modify Vectors',
      name: 'Name',
      size: 'Size',
      length: 'Length',
      angle: 'Angle',
      width: 'Width',
      labelPos: 'Label Position',
      importPoints: 'Bulk Import Points',
      importVectors: 'Bulk Import Vectors',
      formatPoint: 'Format: Name, X, Y (One per line)',
      formatVector: 'Format: Name, Angle (One per line)',
      vecLen: 'Vector Length',
      btnImport: 'Import Data',
      viewOptions: 'View Options',
      showGrid: 'Show Grid Lines',
      showLabels: 'Show Labels (Ticks)',
      palette: 'Palette',
      bg: 'Background',
      axis: 'Axis Line',
      labels: 'Labels',
      gridMajor: 'Grid Major',
      gridMinor: 'Grid Minor',
      dimensions: 'Dimensions',
      xScale: 'X Scale',
      yScale: 'Y Scale',
      noneAdded: 'No items added.',
      placeholderPt: 'A, 1.2, 3.4\nB, -2, 5',
      placeholderVec: 'u, 45\nv, 180'
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

  const toggleLock = () => {
    setGridConfig(prev => ({ ...prev, lockAspectRatio: !prev.lockAspectRatio, unitSizeY: prev.unitSizeX }));
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20 overflow-hidden">
      <div className="p-8 pb-4 text-center">
        <h1 className="text-xl font-black text-white flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Grid3X3 size={20} className="text-white" />
          </div>
          <span className="tracking-tighter uppercase italic">{t.studio}</span>
        </h1>
        
        {/* Language Toggle */}
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 transition-colors uppercase"
          >
            <Languages size={12} />
            {lang === 'zh' ? 'English' : '简体中文'}
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-800/50 px-6 gap-2 mt-2">
        {['objects', 'import', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-[9px] font-bold uppercase tracking-[0.15em] transition-all border-b-2 flex-1 ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            {(t as any)[tab]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {activeTab === 'objects' && (
          <>
            {/* Points Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Circle size={10} className="text-blue-500 fill-blue-500" /> {t.points}
                </h2>
                <button onClick={() => addPoint()} className="text-[9px] font-bold uppercase bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-500 transition-colors">
                  + {t.add}
                </button>
              </div>

              {points.length > 0 && (
                <div className="mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers size={10} className="text-slate-400" />
                    <span className="text-[9px] font-black uppercase text-slate-400">{t.modifyAllPoints}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input type="color" className="w-8 h-6 bg-transparent" onChange={(e) => batchUpdatePoints({ color: e.target.value })} />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex justify-between text-[8px] uppercase font-bold text-slate-600">
                        <span>{t.size}</span>
                      </div>
                      <input type="range" min="1" max="20" className="w-full h-1 accent-blue-500 bg-slate-700 rounded-full appearance-none" onChange={(e) => batchUpdatePoints({ size: parseInt(e.target.value) })} />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {points.length === 0 && <div className="text-[10px] text-slate-600 italic">{t.noneAdded}</div>}
                {points.map(p => (
                  <div key={p.id} className="bg-slate-800/30 rounded-xl border border-slate-800 p-2 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <button onClick={() => toggleExpand(p.id)} className="flex items-center gap-2 text-slate-300 flex-1 truncate text-xs font-medium">
                        {expandedItems[p.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></div>
                        <span className="font-mono text-blue-400 truncate">{p.label}</span>
                        <span className="text-[10px] text-slate-500">({p.x}, {p.y})</span>
                      </button>
                      <button onClick={() => deletePoint(p.id)} className="p-1 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    {expandedItems[p.id] && (
                      <div className="mt-2 space-y-3 p-2 border-t border-slate-800/50">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-600">X</label>
                            <input type="number" step="0.1" value={p.x} onChange={e => updatePoint(p.id, { x: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:border-blue-500 outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-600">Y</label>
                            <input type="number" step="0.1" value={p.y} onChange={e => updatePoint(p.id, { y: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <input type="color" value={p.color} onChange={e => updatePoint(p.id, { color: e.target.value })} className="w-8 h-6 bg-transparent cursor-pointer rounded overflow-hidden" />
                           <input type="text" value={p.label} onChange={e => updatePoint(p.id, { label: e.target.value })} className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white font-mono" placeholder={t.name} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Vectors Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MoveUpRight size={10} className="text-emerald-500" /> {t.vectors}
                </h2>
                <button onClick={() => addVector()} className="text-[9px] font-bold uppercase bg-emerald-600 text-white px-3 py-1 rounded-full hover:bg-emerald-500 transition-colors">
                  + {t.add}
                </button>
              </div>

              {vectors.length > 0 && (
                <div className="mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers size={10} className="text-slate-400" />
                    <span className="text-[9px] font-black uppercase text-slate-400">{t.modifyAllVectors}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input type="color" className="w-8 h-6 bg-transparent" onChange={(e) => batchUpdateVectors({ color: e.target.value })} />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex justify-between text-[8px] uppercase font-bold text-slate-600">
                        <span>{t.width}</span>
                      </div>
                      <input type="range" min="1" max="10" step="0.5" className="w-full h-1 accent-emerald-500 bg-slate-700 rounded-full appearance-none" onChange={(e) => batchUpdateVectors({ thickness: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {vectors.length === 0 && <div className="text-[10px] text-slate-600 italic">{t.noneAdded}</div>}
                {vectors.map(v => (
                  <div key={v.id} className="bg-slate-800/30 rounded-xl border border-slate-800 p-2 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <button onClick={() => toggleExpand(v.id)} className="flex items-center gap-2 text-slate-300 flex-1 truncate text-xs font-medium">
                        {expandedItems[v.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <span className="font-mono text-emerald-400">{v.label}</span>
                        <span className="text-[10px] text-slate-500">{v.length}u @ {v.angle}°</span>
                      </button>
                      <button onClick={() => deleteVector(v.id)} className="p-1 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    {expandedItems[v.id] && (
                      <div className="mt-2 space-y-3 p-2 border-t border-slate-800/50 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-600">{t.length}</label>
                            <input type="number" step="0.1" value={v.length} onChange={e => updateVector(v.id, { length: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-600">{t.angle} (°)</label>
                            <input type="number" step="1" value={v.angle} onChange={e => updateVector(v.id, { angle: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white" />
                          </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-[9px] uppercase font-bold text-slate-600">
                            <span>{t.labelPos}</span>
                            <span className="text-emerald-400">{(v.labelPosition * 100).toFixed(0)}%</span>
                           </div>
                           <input type="range" min="0" max="1" step="0.01" value={v.labelPosition} onChange={e => updateVector(v.id, { labelPosition: parseFloat(e.target.value) })} className="w-full h-1 accent-emerald-500 bg-slate-800 rounded-full appearance-none" />
                        </div>
                        <div className="flex items-center gap-2">
                           <input type="color" value={v.color} onChange={e => updateVector(v.id, { color: e.target.value })} className="w-8 h-6 bg-transparent cursor-pointer rounded overflow-hidden" />
                           <input type="text" value={v.label} onChange={e => updateVector(v.id, { label: e.target.value })} className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white font-mono" placeholder={t.name} />
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
          <div className="space-y-8">
             <section className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileDown size={10} className="text-blue-500" /> {t.importPoints}
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed uppercase font-bold">{t.formatPoint}</p>
              <textarea value={pointImportText} onChange={e => setPointImportText(e.target.value)} placeholder={t.placeholderPt} className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-blue-400 outline-none focus:border-blue-500 transition-colors" />
              <button onClick={handleImportPoints} disabled={!pointImportText.trim()} className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                {t.btnImport}
              </button>
            </section>

            <section className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileDown size={10} className="text-emerald-500" /> {t.importVectors}
              </h2>
              <p className="text-[9px] text-slate-600 leading-relaxed uppercase font-bold">{t.formatVector}</p>
              <div className="flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                 <label className="text-[10px] font-bold text-slate-400 uppercase">{t.vecLen}</label>
                 <input type="number" value={importVectorLength} onChange={e => setImportVectorLength(parseFloat(e.target.value) || 0)} className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-400 font-mono" />
              </div>
              <textarea value={vectorImportText} onChange={e => setVectorImportText(e.target.value)} placeholder={t.placeholderVec} className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none focus:border-emerald-500 transition-colors" />
              <button onClick={handleImportVectors} disabled={!vectorImportText.trim()} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                {t.btnImport}
              </button>
            </section>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-10">
            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={10} className="text-blue-500" /> {t.viewOptions}
              </h2>
              <div className="space-y-4 bg-slate-800/20 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">{t.showGrid}</span>
                  <button onClick={() => setGridConfig(prev => ({...prev, showGrid: !prev.showGrid}))} className={`w-10 h-5 rounded-full transition-all relative ${gridConfig.showGrid ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${gridConfig.showGrid ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">{t.showLabels}</span>
                  <button onClick={() => setGridConfig(prev => ({...prev, showLabels: !prev.showLabels}))} className={`w-10 h-5 rounded-full transition-all relative ${gridConfig.showLabels ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${gridConfig.showLabels ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Palette size={10} className="text-purple-500" /> {t.palette}
              </h2>
              <div className="grid gap-3 bg-slate-800/20 p-4 rounded-2xl border border-slate-800">
                {[
                  { label: t.bg, key: 'bgColor' },
                  { label: t.axis, key: 'axisColor' },
                  { label: t.labels, key: 'textColor' },
                  { label: t.gridMajor, key: 'gridColorMajor' },
                  { label: t.gridMinor, key: 'gridColorMinor' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-400 font-bold">{item.label}</label>
                    <input type="color" value={(gridConfig as any)[item.key]} onChange={e => setGridConfig(prev => ({...prev, [item.key]: e.target.value}))} className="w-8 h-5 rounded cursor-pointer border-none bg-transparent" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.dimensions}</h2>
                <button onClick={toggleLock} className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${gridConfig.lockAspectRatio ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-slate-700 text-slate-600'}`}>
                  {gridConfig.lockAspectRatio ? <Link size={10} /> : <Unlink size={10} />}
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                    <span>{t.xScale}</span>
                    <span className="text-blue-400 font-mono">{gridConfig.unitSizeX.toFixed(0)} px/u</span>
                  </div>
                  <input type="range" min="5" max="1000" value={gridConfig.unitSizeX} onChange={e => updateScaleX(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 appearance-none rounded accent-blue-500" />
                </div>
                {!gridConfig.lockAspectRatio && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                      <span>{t.yScale}</span>
                      <span className="text-emerald-400 font-mono">{gridConfig.unitSizeY.toFixed(0)} px/u</span>
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
