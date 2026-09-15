import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BIBLE_BOOKS, 
  BibleVerse, 
  AspectRatio,
  Translation,
  DEFAULT_LANGUAGE_GROUPS
} from './types.ts';
import { getChapterFromXml } from './services/localBibleService.ts';
import { OVERSATTNINGAR as BUILTIN_XML } from './data/xmlData.ts';
import BibleCanvas from './components/BibleCanvas.tsx';
import { 
  BookOpen, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  CheckCircle2, 
  Info,
  Layers,
  Tv
} from 'lucide-react';

const App: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[18]); // Psaltaren
  const [selectedChapter, setSelectedChapter] = useState(23);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [externalXmls, setExternalXmls] = useState<Record<string, string>>({});
  const [availableTranslations, setAvailableTranslations] = useState<Translation[]>(
    DEFAULT_LANGUAGE_GROUPS.flatMap(g => g.versions)
  );

  const [ver1, setVer1] = useState<Translation>(availableTranslations[0]);
  const [ver2, setVer2] = useState<Translation>(availableTranslations[1] || availableTranslations[0]);

  const [chapterData1, setChapterData1] = useState<BibleVerse[]>([]);
  const [chapterData2, setChapterData2] = useState<BibleVerse[]>([]);
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1080&h=1350');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const castWindowRef = useRef<Window | null>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newXmls: Record<string, string> = { ...externalXmls };
    const newTranslations: Translation[] = [...availableTranslations];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.toLowerCase().endsWith('.xml')) {
        const text = await file.text();
        const id = file.name.replace('.xml', '').toUpperCase();
        newXmls[id] = text;
        if (!newTranslations.find(t => t.id === id)) {
          newTranslations.push({ id, name: `${id} (Extern)`, xmlKey: id, isExternal: true });
        }
      }
    }
    setExternalXmls(newXmls);
    setAvailableTranslations(newTranslations);
  };

  const loadData = useCallback(() => {
    const getXml = (key: string) => BUILTIN_XML[key] || externalXmls[key] || "";
    const res1 = getChapterFromXml(getXml(ver1.xmlKey), selectedBook, selectedChapter);
    const res2 = getChapterFromXml(getXml(ver2.xmlKey), selectedBook, selectedChapter);

    setChapterData1(res1);
    setChapterData2(res2);
    if (res1.length > 0 && selectedVerseIndex >= res1.length) setSelectedVerseIndex(0);
  }, [selectedBook, selectedChapter, ver1, ver2, externalXmls]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `BibelGenerator-${selectedBook}-${selectedChapter}-${selectedVerseIndex + 1}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCast = () => {
    if (castWindowRef.current && !castWindowRef.current.closed) {
      castWindowRef.current.focus();
      return;
    }

    const win = window.open('', 'BibelGeneratorCast', 'width=1280,height=720');
    if (!win) {
      alert("Popup blockerades! Tillåt popuper för att kasta till skärm.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>BibelGenerator - Cast</title>
          <style>
            body { margin: 0; background: black; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
          </style>
        </head>
        <body>
          <img id="cast-image" src="${canvasRef.current?.toDataURL() || ''}" />
        </body>
      </html>
    `);
    win.document.close();
    castWindowRef.current = win;
  };

  useEffect(() => {
    const updateCast = () => {
      if (castWindowRef.current && !castWindowRef.current.closed && canvasRef.current) {
        const img = castWindowRef.current.document.getElementById('cast-image') as HTMLImageElement;
        if (img) {
          img.src = canvasRef.current.toDataURL();
        }
      }
    };
    
    // We use a small timeout to ensure the canvas has finished rendering
    const timer = setTimeout(updateCast, 100);
    return () => clearTimeout(timer);
  }, [chapterData1, chapterData2, selectedVerseIndex, aspectRatio, bgImage, ver1, ver2]);

  useEffect(() => {
    return () => {
      if (castWindowRef.current) castWindowRef.current.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="sticky top-0 z-[100] bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 px-6 h-20 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 rounded-xl"><BookOpen className="w-6 h-6 text-white" /></div>
          <div>
            <h1 className="text-xl font-black italic">BIBEL<span className="text-indigo-400 not-italic">GENERATOR</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Offline Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCast} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-500/20">
            <Tv className="w-4 h-4" /> KASTA TILL SKÄRM
          </button>
          <button onClick={handleDownload} className="bg-white text-slate-900 px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-white/5">
            <Download className="w-4 h-4" /> SPARA BILD
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl">
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Kom igång
            </h2>
            <ol className="text-xs text-slate-400 space-y-3 list-decimal list-inside">
              <li>Klicka på <strong>"Ladda in XML-biblar"</strong> nedan.</li>
              <li>Välj din mapp med alla .xml-filer.</li>
              <li>Välj dina översättningar i listorna.</li>
              <li>Bläddra fram till versen och exportera!</li>
            </ol>
            <button 
              onClick={() => folderInputRef.current?.click()}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all"
            >
              <Upload className="w-4 h-4" /> Ladda in XML-biblar
            </button>
            <input type="file" ref={folderInputRef} onChange={handleFolderUpload} className="hidden" multiple accept=".xml" />
            {Object.keys(externalXmls).length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase">
                <CheckCircle2 className="w-3 h-3" /> {Object.keys(externalXmls).length} biblar laddade
              </div>
            )}
          </section>

          <section className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1">Översättning 1 (Överst)</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" value={ver1.id} onChange={(e) => setVer1(availableTranslations.find(t => t.id === e.target.value) || ver1)}>
                {availableTranslations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1">Översättning 2 (Under)</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" value={ver2.id} onChange={(e) => setVer2(availableTranslations.find(t => t.id === e.target.value) || ver2)}>
                {availableTranslations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </section>

          <section className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Välj ställe</h2>
            
            <div className="relative">
              <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 font-bold text-sm appearance-none">
                {BIBLE_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}
              </select>
              <span className="absolute -top-2 left-3 bg-[#020617] px-2 text-[8px] font-black text-slate-500 uppercase">Bok</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input type="number" value={selectedChapter} onChange={(e) => setSelectedChapter(parseInt(e.target.value) || 1)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center font-bold" />
                <span className="absolute -top-2 left-3 bg-[#020617] px-2 text-[8px] font-black text-slate-500 uppercase">Kapitel</span>
              </div>
              <div className="relative">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl">
                  <button onClick={() => setSelectedVerseIndex(v => Math.max(0, v - 1))} className="p-3 text-indigo-400 hover:bg-white/5"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="flex-1 text-center font-bold">{selectedVerseIndex + 1}</span>
                  <button onClick={() => setSelectedVerseIndex(v => Math.min(chapterData1.length - 1, v + 1))} className="p-3 text-indigo-400 hover:bg-white/5"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <span className="absolute -top-2 left-3 bg-[#020617] px-2 text-[8px] font-black text-slate-500 uppercase">Vers</span>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <h2 className="text-[10px] font-black text-slate-500 uppercase px-1">Design</h2>
            <div className="grid grid-cols-3 gap-2">
              {['4:5', '16:9', '1:1'].map((r) => (
                <button key={r} onClick={() => setAspectRatio(r as AspectRatio)} className={`py-3 rounded-xl border text-[9px] font-black uppercase ${aspectRatio === r ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{r}</button>
              ))}
            </div>
            <button onClick={() => bgInputRef.current?.click()} className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"><Layers className="w-4 h-4" /> Byt bakgrund</button>
            <input type="file" ref={bgInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setBgImage(ev.target?.result as string); reader.readAsDataURL(file); } }} className="hidden" accept="image/*" />
          </section>
        </div>

        <div className="lg:col-span-8">
          <div className="flex flex-col items-center">
            <BibleCanvas 
              verse1={chapterData1[selectedVerseIndex]} 
              verse2={chapterData2[selectedVerseIndex]}
              lang1Name={ver1.name} 
              lang2Name={ver2.name} 
              backgroundImage={bgImage}
              aspectRatio={aspectRatio} 
              onCanvasReady={(canvas) => (canvasRef.current = canvas)}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 shadow-inner">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{ver1.name}</span>
              <p className="mt-3 text-lg font-serif italic text-white leading-relaxed">"{chapterData1[selectedVerseIndex]?.text || "Väntar på text..."}"</p>
            </div>
            <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 shadow-inner">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{ver2.name}</span>
              <p className="mt-3 text-lg text-slate-400 italic leading-relaxed">"{chapterData2[selectedVerseIndex]?.text || "---"}"</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;