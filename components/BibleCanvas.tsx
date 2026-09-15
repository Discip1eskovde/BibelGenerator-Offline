import React, { useEffect, useRef } from 'react';
import { BibleVerse, AspectRatio, LAYOUTS } from '../types.ts';

interface BibleCanvasProps {
  verse1?: BibleVerse;
  verse2?: BibleVerse;
  lang1Name: string;
  lang2Name: string;
  backgroundImage: string;
  aspectRatio: AspectRatio;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

const BibleCanvas: React.FC<BibleCanvasProps> = ({
  verse1,
  verse2,
  lang1Name,
  lang2Name,
  backgroundImage,
  aspectRatio,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = LAYOUTS[aspectRatio];

  const wrapText = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = backgroundImage;

    img.onload = () => {
      canvas.width = config.width;
      canvas.height = config.height;

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12;
      ctx.textAlign = 'center';

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (verse1) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.floor(config.fontSize * 0.6)}px Inter`;
        ctx.fillText(`${verse1.book_name} ${verse1.chapter}:${verse1.verse}`, centerX, canvas.height * 0.15);
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 60, canvas.height * 0.18);
        ctx.lineTo(centerX + 60, canvas.height * 0.18);
        ctx.stroke();
        ctx.shadowBlur = 12;
      }

      if (verse1) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `italic ${config.fontSize}px "Playfair Display", serif`;
        const wrapY = aspectRatio === '16:9' ? centerY - 50 : centerY - 100;
        wrapText(ctx, `"${verse1.text.trim()}"`, centerX, wrapY, canvas.width * 0.8, config.lineHeight);
      }

      if (verse2) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = `${Math.floor(config.fontSize * 0.7)}px Inter`;
        const subWrapY = aspectRatio === '16:9' ? centerY + 120 : centerY + 180;
        wrapText(ctx, verse2.text.trim(), centerX, subWrapY, canvas.width * 0.75, Math.floor(config.lineHeight * 0.8));
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = 'bold 18px Inter';
      ctx.fillText(`${lang1Name.toUpperCase()}  |  ${lang2Name.toUpperCase()}`, centerX, canvas.height - 60);

      onCanvasReady(canvas);
    };

    img.onerror = () => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText("Bakgrundsbilden kunde inte laddas", canvas.width/2, canvas.height/2);
    };
  }, [verse1, verse2, lang1Name, lang2Name, backgroundImage, aspectRatio, onCanvasReady]);

  return (
    <div className={`relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-slate-900 w-full h-fit`}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto block"
      />
    </div>
  );
};

export default BibleCanvas;