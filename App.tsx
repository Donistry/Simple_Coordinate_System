
import React, { useState, useRef } from 'react';
import { Point, Vector, GridConfig, Language } from './types';
import CoordinateCanvas from './components/CoordinateCanvas';
import Sidebar from './components/Sidebar';
import { Download, Target, Move } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [points, setPoints] = useState<Point[]>([
    { id: '1', x: 2, y: 3, color: '#3b82f6', size: 6, label: 'A', visible: true },
    { id: '2', x: -4, y: 1, color: '#ef4444', size: 6, label: 'B', visible: true }
  ]);
  
  const [vectors, setVectors] = useState<Vector[]>([
    { id: 'v1', startX: 0, startY: 0, length: 5, angle: 45, color: '#10b981', thickness: 2, arrowSize: 12, label: 'v', labelPosition: 0.5, visible: true }
  ]);

  const [gridConfig, setGridConfig] = useState<GridConfig>({
    bgColor: '#0f172a',
    axisColor: '#ffffff',
    gridColorMajor: '#334155',
    gridColorMinor: '#1e293b',
    textColor: '#94a3b8',
    unitSizeX: 60,
    unitSizeY: 60,
    lockAspectRatio: true,
    showGrid: true,
    showLabels: true,
    originX: 0,
    originY: 0
  });

  const addPoint = (p?: Partial<Point>) => {
    const newPoint: Point = {
      id: Math.random().toString(36).substr(2, 9),
      x: p?.x ?? 0,
      y: p?.y ?? 0,
      color: p?.color ?? '#ffffff',
      size: p?.size ?? 6,
      label: p?.label ?? `P${points.length + 1}`,
      visible: true,
      ...p
    };
    setPoints(prev => [...prev, newPoint]);
  };

  const addVector = (v?: Partial<Vector>) => {
    const newVector: Vector = {
      id: Math.random().toString(36).substr(2, 9),
      startX: v?.startX ?? 0,
      startY: v?.startY ?? 0,
      length: v?.length ?? 2,
      angle: v?.angle ?? 0,
      color: v?.color ?? '#f59e0b',
      thickness: v?.thickness ?? 2,
      arrowSize: v?.arrowSize ?? 10,
      label: v?.label ?? `u${vectors.length + 1}`,
      labelPosition: 0.5,
      visible: true,
      ...v
    };
    setVectors(prev => [...prev, newVector]);
  };

  const updatePoint = (id: string, updates: Partial<Point>) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateVector = (id: string, updates: Partial<Vector>) => {
    setVectors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const batchUpdatePoints = (updates: Partial<Point>) => {
    setPoints(prev => prev.map(p => ({ ...p, ...updates })));
  };

  const batchUpdateVectors = (updates: Partial<Vector>) => {
    setVectors(prev => prev.map(v => ({ ...v, ...updates })));
  };

  const deletePoint = (id: string) => {
    setPoints(prev => prev.filter(p => p.id !== id));
  };

  const deleteVector = (id: string) => {
    setVectors(prev => prev.filter(v => v.id !== id));
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exportImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'coordinate-system.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const resetView = () => {
    setGridConfig(prev => ({ 
      ...prev, 
      originX: 0, 
      originY: 0, 
      unitSizeX: 60, 
      unitSizeY: 60,
      lockAspectRatio: true
    }));
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-200">
      <Sidebar 
        lang={lang}
        setLang={setLang}
        points={points} 
        vectors={vectors} 
        gridConfig={gridConfig} 
        setGridConfig={setGridConfig}
        addPoint={addPoint}
        addVector={addVector}
        updatePoint={updatePoint}
        updateVector={updateVector}
        batchUpdatePoints={batchUpdatePoints}
        batchUpdateVectors={batchUpdateVectors}
        deletePoint={deletePoint}
        deleteVector={deleteVector}
      />

      <main className="flex-1 relative flex flex-col">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button 
            onClick={resetView}
            className="p-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg shadow-2xl backdrop-blur-md transition-all border border-slate-700 group"
            title={lang === 'zh' ? '重置视图' : 'Reset View'}
          >
            <Target size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
          <button 
            onClick={exportImage}
            className="p-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg shadow-2xl backdrop-blur-md transition-all border border-slate-700"
            title={lang === 'zh' ? '导出图片' : 'Export PNG'}
          >
            <Download size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden cursor-crosshair bg-slate-950">
          <CoordinateCanvas 
            ref={canvasRef}
            points={points}
            vectors={vectors}
            gridConfig={gridConfig}
            setGridConfig={setGridConfig}
          />
        </div>

        <footer className="h-10 bg-slate-900/50 border-t border-slate-800/50 backdrop-blur-md flex items-center px-6 justify-between text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> {lang === 'zh' ? '点' : 'Points'}: {points.length}</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-sm bg-emerald-500"></span> {lang === 'zh' ? '向量' : 'Vectors'}: {vectors.length}</span>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <Move size={12} className="text-slate-600" />
              <span>{lang === 'zh' ? '拖拽与缩放' : 'Pan & Zoom'}</span>
            </div>
            <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-slate-400 font-mono">
              {lang === 'zh' ? '比例' : 'Ratio'} {gridConfig.unitSizeX.toFixed(0)} : {gridConfig.unitSizeY.toFixed(0)} {gridConfig.lockAspectRatio ? (lang === 'zh' ? '(等比例)' : '(Square)') : (lang === 'zh' ? '(自由)' : '(Free)')}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
