
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Point, Vector, GridConfig } from '../types';

interface Props {
  points: Point[];
  vectors: Vector[];
  gridConfig: GridConfig;
  setGridConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
}

const CoordinateCanvas = forwardRef<HTMLCanvasElement, Props>(({ points, vectors, gridConfig, setGridConfig }, ref) => {
  const localRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useImperativeHandle(ref, () => localRef.current!);

  const calculateStep = (pixelsPerUnit: number) => {
    const minPixelGap = 60; 
    const rawStep = minPixelGap / pixelsPerUnit;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const res = rawStep / magnitude;

    let step;
    if (res < 1.5) step = 1;
    else if (res < 3.5) step = 2;
    else if (res < 7.5) step = 5;
    else step = 10;

    return step * magnitude;
  };

  useEffect(() => {
    const canvas = localRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== Math.floor(width * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const { 
        bgColor, axisColor, gridColorMajor, gridColorMinor, textColor, 
        unitSizeX, unitSizeY, showGrid, showLabels, originX, originY 
      } = gridConfig;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2 + originX;
      const centerY = height / 2 + originY;

      const stepX = calculateStep(unitSizeX);
      const stepY = calculateStep(unitSizeY);

      // 1. Draw Grid Lines
      if (showGrid) {
        ctx.lineCap = 'butt';
        
        ctx.beginPath();
        ctx.strokeStyle = gridColorMinor;
        ctx.lineWidth = 0.5;
        const minorStepX = stepX / 2;
        const minorStepY = stepY / 2;
        
        for (let x = Math.floor((-centerX) / (minorStepX * unitSizeX)) * minorStepX; x * unitSizeX + centerX < width; x += minorStepX) {
          const posX = centerX + x * unitSizeX;
          ctx.moveTo(posX, 0); ctx.lineTo(posX, height);
        }
        for (let y = Math.floor((-centerY) / (minorStepY * unitSizeY)) * minorStepY; y * unitSizeY + centerY < height; y += minorStepY) {
          const posY = centerY - y * unitSizeY;
          ctx.moveTo(0, posY); ctx.lineTo(width, posY);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = gridColorMajor;
        ctx.lineWidth = 1;
        for (let x = Math.floor((-centerX) / (stepX * unitSizeX)) * stepX; x * unitSizeX + centerX < width; x += stepX) {
          const posX = centerX + x * unitSizeX;
          ctx.moveTo(posX, 0); ctx.lineTo(posX, height);
        }
        for (let y = Math.floor((-centerY) / (stepY * unitSizeY)) * stepY; y * unitSizeY + centerY < height; y += stepY) {
          const posY = centerY - y * unitSizeY;
          ctx.moveTo(0, posY); ctx.lineTo(width, posY);
        }
        ctx.stroke();
      }

      // 2. Draw Axis Lines
      ctx.beginPath();
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2;
      ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
      ctx.stroke();

      // 3. Draw Axis Ticks
      if (showLabels) {
        ctx.beginPath();
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 1.5;
        const tickSize = 4;

        for (let x = Math.floor((-centerX) / (stepX * unitSizeX)) * stepX; x * unitSizeX + centerX < width; x += stepX) {
          if (Math.abs(x) < 0.0000001) continue;
          const posX = centerX + x * unitSizeX;
          ctx.moveTo(posX, centerY - tickSize);
          ctx.lineTo(posX, centerY + tickSize);
        }
        for (let y = Math.floor((-centerY) / (stepY * unitSizeY)) * stepY; y * unitSizeY + centerY < height; y += stepY) {
          if (Math.abs(y) < 0.0000001) continue;
          const posY = centerY - y * unitSizeY;
          ctx.moveTo(centerX - tickSize, posY);
          ctx.lineTo(centerX + tickSize, posY);
        }
        ctx.stroke();
      }

      // Axis Arrows
      const drawArrow = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-10, -5); ctx.lineTo(-10, 5);
        ctx.closePath();
        ctx.fillStyle = axisColor;
        ctx.fill();
        ctx.restore();
      };
      drawArrow(width, centerY, 0);
      drawArrow(0, centerY, Math.PI);
      drawArrow(centerX, 0, -Math.PI / 2);
      drawArrow(centerX, height, Math.PI / 2);

      // 4. Labels
      if (showLabels) {
        ctx.fillStyle = textColor;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        
        for (let x = Math.floor((-centerX) / (stepX * unitSizeX)) * stepX; x * unitSizeX + centerX < width; x += stepX) {
          if (Math.abs(x) < 0.0000001) continue;
          const posX = centerX + x * unitSizeX;
          ctx.fillText(parseFloat(x.toFixed(5)).toString(), posX, centerY + 18);
        }
        ctx.textAlign = 'right';
        for (let y = Math.floor((-centerY) / (stepY * unitSizeY)) * stepY; y * unitSizeY + centerY < height; y += stepY) {
          if (Math.abs(y) < 0.0000001) continue;
          const posY = centerY - y * unitSizeY;
          ctx.fillText(parseFloat(y.toFixed(5)).toString(), centerX - 12, posY + 4);
        }
        ctx.fillText("0", centerX - 12, centerY + 18);
      }

      // 5. Draw Vectors
      vectors.forEach(v => {
        if (!v.visible) return;
        const x1 = centerX + v.startX * unitSizeX;
        const y1 = centerY - v.startY * unitSizeY;
        const rad = (v.angle * Math.PI) / 180;
        const x2 = x1 + (v.length * Math.cos(rad)) * unitSizeX;
        const y2 = y1 - (v.length * Math.sin(rad)) * unitSizeY;

        ctx.strokeStyle = v.color;
        ctx.lineWidth = v.thickness;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.stroke();

        const visualAngle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.translate(x2, y2);
        ctx.rotate(visualAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-v.arrowSize, -v.arrowSize/2.5); ctx.lineTo(-v.arrowSize, v.arrowSize/2.5);
        ctx.closePath();
        ctx.fillStyle = v.color;
        ctx.fill();
        ctx.restore();

        if (v.label) {
          ctx.fillStyle = v.color;
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          // Calculate label position based on labelPosition property
          const pos = v.labelPosition ?? 0.5;
          const lx = x1 + (x2 - x1) * pos;
          const ly = y1 + (y2 - y1) * pos;
          ctx.fillText(v.label, lx, ly - 10);
        }
      });

      // 6. Draw Points
      points.forEach(p => {
        if (!p.visible) return;
        const x = centerX + p.x * unitSizeX;
        const y = centerY - p.y * unitSizeY;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.label) {
          ctx.fillStyle = textColor;
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(p.label, x + p.size + 4, y - p.size - 4);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gridConfig, points, vectors]);

  const dragRef = useRef({ isDragging: false, lastX: 0, lastY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { isDragging: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    setGridConfig(prev => ({ ...prev, originX: prev.originX + dx, originY: prev.originY + dy }));
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };

  const handleMouseUp = () => dragRef.current.isDragging = false;
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.94 : 1.06;
    setGridConfig(prev => {
      const newX = Math.max(2, Math.min(5000, prev.unitSizeX * zoomFactor));
      const newY = prev.lockAspectRatio ? newX : Math.max(2, Math.min(5000, prev.unitSizeY * zoomFactor));
      return { ...prev, unitSizeX: newX, unitSizeY: newY };
    });
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <canvas 
        ref={localRef}
        className="block w-full h-full outline-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
});

export default CoordinateCanvas;
