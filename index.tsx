import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as Lucide from 'lucide-react';

// --- KONSTRUKTIONER & TYPER ---

const STORAGE_KEY = 'bibel_generator_user_presets';

const BIBLE_BOOKS_MAP = [
  { sv: "1 Mosebok", svFull: "Första Moseboken", en: "Genesis", ar: "تكوين" },
  { sv: "2 Mosebok", svFull: "Andra Moseboken", en: "Exodus", ar: "خروج" },
  { sv: "3 Mosebok", svFull: "Tredje Moseboken", en: "Leviticus", ar: "لاويين" },
  { sv: "4 Mosebok", svFull: "Fjärde Moseboken", en: "Numbers", ar: "عدد" },
  { sv: "5 Mosebok", svFull: "Femte Moseboken", en: "Deuteronomy", ar: "تثنية" },
  { sv: "Josua", svFull: "Josua", en: "Joshua", ar: "يشوع" },
  { sv: "Domarboken", svFull: "Domarboken", en: "Judges", ar: "قضاة" },
  { sv: "Rut", svFull: "Rut", en: "Ruth", ar: "راعوث" },
  { sv: "1 Samuelsboken", svFull: "Första Samuelsboken", en: "1 Samuel", ar: "صموئيل الأول" },
  { sv: "2 Samuelsboken", svFull: "Andra Samuelsboken", en: "2 Samuel", ar: "صموئيل الثاني" },
  { sv: "1 Kungaboken", svFull: "Första Kungaboken", en: "1 Kings", ar: "ملوك الأول" },
  { sv: "2 Kungaboken", svFull: "Andra Kungaboken", en: "2 Kings", ar: "ملوك الثاني" },
  { sv: "1 Krönikeboken", svFull: "Första Krönikeboken", en: "1 Chronicles", ar: "أخبار الأيام الأول" },
  { sv: "2 Krönikeboken", svFull: "Andra Krönikeboken", en: "2 Chronicles", ar: "أخبار الأيام الثاني" },
  { sv: "Esra", svFull: "Esra", en: "Ezra", ar: "عزرا" },
  { sv: "Nehemja", svFull: "Nehemja", en: "Nehemiah", ar: "نحميا" },
  { sv: "Ester", svFull: "Ester", en: "Esther", ar: "استير" },
  { sv: "Job", svFull: "Job", en: "Job", ar: "أيوب" },
  { sv: "Psaltaren", svFull: "Psaltaren", en: "Psalms", ar: "مزامير" },
  { sv: "Ordspråksboken", svFull: "Ordspråksboken", en: "أمثال", ar: "أمثال" },
  { sv: "Predikaren", svFull: "Predikaren", en: "Ecclesiastes", ar: "جامعة" },
  { sv: "Höga Visan", svFull: "Höga Visan", en: "Song of Solomon", ar: "نشيد الأنشاد" },
  { sv: "Jesaja", svFull: "Jesaja", en: "Isaiah", ar: "إشعياء" },
  { sv: "Jeremia", svFull: "Jeremia", en: "Jeremiah", ar: "إرميا" },
  { sv: "Klagovisorna", svFull: "Klagovisorna", en: "Lamentations", ar: "مراثي إرميا" },
  { sv: "Hesekiel", svFull: "Hesekiel", en: "Ezekiel", ar: "حزقيال" },
  { sv: "Daniel", svFull: "Daniel", en: "Daniel", ar: "دانيال" },
  { sv: "Hosea", svFull: "Hosea", en: "Hosea", ar: "هوشع" },
  { sv: "Joel", svFull: "Joel", en: "Joel", ar: "יוئيل" },
  { sv: "Amos", svFull: "Amos", en: "Amos", ar: "عاموس" },
  { sv: "Obadja", svFull: "Obadja", en: "Obadiah", ar: "عوبديا" },
  { sv: "Jona", svFull: "Jona", en: "Jonah", ar: "يونان" },
  { sv: "Mika", svFull: "Mika", en: "Micah", ar: "ميخا" },
  { sv: "Nahum", svFull: "Nahum", en: "Nahum", ar: "ناحوم" },
  { sv: "Habackuk", svFull: "Habackuk", en: "Habakkuk", ar: "حبقوق" },
  { sv: "Sefanja", svFull: "Sefanja", en: "Zephaniah", ar: "صفنيا" },
  { sv: "Haggai", svFull: "Haggai", en: "Haggai", ar: "حجي" },
  { sv: "Sakarja", svFull: "Sakarja", en: "Zechariah", ar: "زكريا" },
  { sv: "Malaki", svFull: "Malaki", en: "Malachi", ar: "ملاخي" },
  { sv: "Matteus", svFull: "Matteusevangeliet", en: "Matthew", ar: "متى" },
  { sv: "Markus", svFull: "Markusevangeliet", en: "Mark", ar: "مرقس" },
  { sv: "Lukas", svFull: "Lukasevangeliet", en: "Luke", ar: "لوقا" },
  { sv: "Johannes", svFull: "Johannesevangeliet", en: "John", ar: "يوحنا" },
  { sv: "Apostlagärningarna", svFull: "Apostlagärningarna", en: "Acts", ar: "أعمال الرسل" },
  { sv: "Romarbrevet", svFull: "Romarbrevet", en: "Romans", ar: "رومية" },
  { sv: "1 Korintierbrevet", svFull: "Första Korintierbrevet", en: "1 Corinthians", ar: "كورنثوس الأولى" },
  { sv: "2 Korintierbrevet", svFull: "Andra Korintierbrevet", en: "2 Corinthians", ar: "كورنثوس الثانية" },
  { sv: "Galaterbrevet", svFull: "Galaterbrevet", en: "Galatians", ar: "غلاطية" },
  { sv: "Efesierbrevet", svFull: "Efesierbrevet", en: "Ephesians", ar: "أفسس" },
  { sv: "Filippierbrevet", svFull: "Filipperbrevet", en: "Philippians", ar: "فيلبي" },
  { sv: "Kolosserbrevet", svFull: "Kolosserbrevet", en: "Colossians", ar: "كولوسي" },
  { sv: "1 Thessalonikerbrevet", svFull: "Första Thessalonikerbrevet", en: "1 Thessalonians", ar: "تسالونيكي الأولى" },
  { sv: "2 Thessalonikerbrevet", svFull: "Andra Thessalonikerbrevet", en: "2 Thessalonians", ar: "تسالونيكي الثانية" },
  { sv: "1 Timoteusbrevet", svFull: "Första Timoteusbrevet", en: "1 Timothy", ar: "تيموثاوس الأولى" },
  { sv: "2 Timoteusbrevet", svFull: "Andra Timoteusbrevet", en: "2 Timothy", ar: "تيموثاوس الثانية" },
  { sv: "Titusbrevet", svFull: "Titusbrevet", en: "Titus", ar: "تيطس" },
  { sv: "Filemonbrevet", svFull: "Filemonbrevet", en: "Philemon", ar: "فليمون" },
  { sv: "Hebreerbrevet", svFull: "Hebreerbrevet", en: "Hebrews", ar: "عبرانيين" },
  { sv: "Jakobsbrevet", svFull: "Jakobs brev", en: "James", ar: "يعقوب" },
  { sv: "1 Petrusbrevet", svFull: "Första Petrusbrevet", en: "1 Peter", ar: "بطرس الأولى" },
  { sv: "2 Petrusbrevet", svFull: "Andra Petrusbrevet", en: "2 Peter", ar: "بطرس الثانية" },
  { sv: "1 Johannesbrevet", svFull: "Första Johannesbrevet", en: "1 John", ar: "يوحنا الأولى" },
  { sv: "2 Johannesbrevet", svFull: "Andra Johannesbrevet", en: "2 John", ar: "يوحنا الثانية" },
  { sv: "3 Johannesbrevet", svFull: "Tredje Johannesbrevet", en: "3 John", ar: "يوحنا الثالثة" },
  { sv: "Judasbrevet", svFull: "Judas brev", en: "Jude", ar: "يهوذا" },
  { sv: "Uppenbarelseboken", svFull: "Uppenbarelseboken", en: "Revelation", ar: "رؤيا يوحنا" }
];

const BIBLE_BOOKS = BIBLE_BOOKS_MAP.map(b => b.sv);

const BOOK_ALIASES = {
  "1 Mosebok": ["Genesis", "Gen", "Gn"],
  "Psaltaren": ["Psalms", "Psalm", "Ps", "Psa"],
  "Matteus": ["Matthew", "Matt", "Mt"],
  "Johannes": ["John", "Joh", "Jn"],
  "Uppenbarelseboken": ["Revelation", "Rev", "Re"]
};

const LAYOUTS = {
  '4:5': { width: 1080, height: 1350, fontSize: 58, lineHeight: 75 },
  '16:9': { width: 1920, height: 1080, fontSize: 72, lineHeight: 90 },
  '1:1': { width: 1080, height: 1080, fontSize: 54, lineHeight: 70 }
};

const SIZE_SCALES = [0.6, 0.8, 1.0, 1.2, 1.5];
const SIZE_LABELS = ['XS', 'S', 'M', 'L', 'XL'];

const BG_TEMPLATES = [
  { name: 'Nature', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Stars', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Sunrise', url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1920&q=80' }
];

// --- HJÄLPFUNKTIONER ---

const detectLanguage = (xmlDoc, bookElement) => {
  const bibleTag = xmlDoc.querySelector('bible');
  const langAttr = bibleTag?.getAttribute('lang')?.toLowerCase() || "";
  if (langAttr.includes('sv') || langAttr.includes('swe')) return 'sv';
  if (langAttr.includes('en') || langAttr.includes('eng')) return 'en';
  if (langAttr.includes('ar')) return 'ar';

  const firstVerseText = bookElement?.querySelector('verse, v')?.textContent || "";
  const arabicPattern = /[\u0600-\u06FF]/;
  if (arabicPattern.test(firstVerseText)) return 'ar';
  
  const bName = bookElement?.getAttribute('name')?.toLowerCase() || "";
  if (bName.includes('psalms') || bName.includes('genesis')) return 'en';
  
  return 'sv'; 
};

const getChapterFromXml = (xmlString, bookName, chapterNum) => {
  if (!xmlString) return [];
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    const allBooks = Array.from(xmlDoc.querySelectorAll('book'));
    const bookIndex = BIBLE_BOOKS.indexOf(bookName);
    const aliases = BOOK_ALIASES[bookName] || [];
    
    let book = allBooks[bookIndex];

    if (!book || (book.getAttribute('name') && !book.getAttribute('name').toLowerCase().includes(aliases[0]?.toLowerCase()))) {
        const foundByName = allBooks.find(b => {
          const bName = (b.getAttribute('name') || b.getAttribute('id') || b.getAttribute('bname') || b.getAttribute('longname') || "").toLowerCase();
          return bName.includes(bookName.toLowerCase()) || aliases.some(a => bName.includes(a.toLowerCase()));
        });
        if (foundByName) book = foundByName;
    }

    if (!book) return [];

    const lang = detectLanguage(xmlDoc, book);
    let localBookName = book.getAttribute('name') || book.getAttribute('short') || book.getAttribute('id') || book.getAttribute('bname');
    
    if (!localBookName || /^[A-Z0-9]+$/.test(localBookName)) {
      const entry = BIBLE_BOOKS_MAP[bookIndex];
      if (entry) {
        if (lang === 'ar') localBookName = entry.ar;
        else if (lang === 'en') localBookName = entry.en;
        else localBookName = entry.svFull;
      }
    }

    const chapter = book.querySelector(`chapter[number="${chapterNum}"], chapter[id="${chapterNum}"], c[n="${chapterNum}"]`);
    if (!chapter) return [];
    
    return Array.from(chapter.querySelectorAll('verse, v')).map(v => ({
      book_name: bookName,
      local_book_name: localBookName, 
      lang: lang,
      chapter: chapterNum,
      verse: parseInt(v.getAttribute('number') || v.getAttribute('id') || v.getAttribute('n') || '0'),
      text: v.textContent?.trim() || ""
    })).filter(v => v.text !== "");
  } catch (err) { 
    console.error("Fel vid XML-parsing:", err);
    return []; 
  }
};

// --- KOMPONENTER ---

const BibleCanvas = ({ 
  verse1, 
  verse2, 
  lang1Name, 
  lang2Name, 
  backgroundImage, 
  aspectRatio, 
  onCanvasReady, 
  shiftVersesY = 0, 
  shiftVersesX = 0,
  shiftRefY = 0,
  shiftRefX = 0,
  shiftCVY = 0,
  shiftCVX = 0,
  verseGap = 350,
  sizeVerses = 2,
  sizeRef = 2,
  sizeCV = 2
}) => {
  const canvasRef = useRef(null);
  const config = LAYOUTS[aspectRatio];

  const scaleVerses = SIZE_SCALES[sizeVerses];
  const scaleRef = SIZE_SCALES[sizeRef];
  const scaleCV = SIZE_SCALES[sizeCV];

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight, render = true) => {
    const words = text.split(' ');
    let line = '', currentY = y;
    ctx.textAlign = 'center';
    let lineCount = 1;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        if (render) ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        lineCount++;
      } else { line = testLine; }
    }
    if (render) ctx.fillText(line, x, currentY);
    return lineCount * lineHeight; 
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = backgroundImage;
    img.onload = () => {
      canvas.width = config.width;
      canvas.height = config.height;
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      ctx.drawImage(img, (canvas.width/2)-(img.width/2)*scale, (canvas.height/2)-(img.height/2)*scale, img.width*scale, img.height*scale);
      
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0,0,0,0.2)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
      grad.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 15;
      const centerX = canvas.width / 2;
      
      // --- SMART LAYOUT LOGIC ---
      const textWidth1 = canvas.width * 0.95;
      const textWidth2 = canvas.width * 0.95;
      const isAr1 = verse1 && /[\u0600-\u06FF]/.test(verse1.text);
      const isAr2 = verse2 && /[\u0600-\u06FF]/.test(verse2.text);
      const arMult1 = isAr1 ? 1.3 : 1.0;
      const arMult2 = isAr2 ? 1.3 : 1.0;

      const maxSafeHeight = canvas.height * 0.85; 
      const topLimit = canvas.height * 0.07;
      const bottomLimit = canvas.height * 0.93;

      // Funktion för att beräkna den faktiska bounding-boxen för hela textpaketet
      const getBounds = (s, g) => {
        let relY = 0;
        let minY = 9999, maxY = -9999;
        
        // 1. Header (Bok, Kapitel & Vers)
        const cv_h = verse1 ? Math.floor(config.fontSize * 0.8 * scaleCV * s) : 0;
        if (verse1) {
          const y = relY + shiftCVY;
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y + cv_h);
        }
        relY += cv_h + (80 * s);

        // 2. Vers 1
        const v1_h = verse1 ? wrapText(ctx, `"${verse1.text.trim()}"`, 0, 0, textWidth1, config.lineHeight * scaleVerses * arMult1 * s, false) : 0;
        if (verse1) {
          minY = Math.min(minY, relY);
          maxY = Math.max(maxY, relY + v1_h);
        }
        relY += v1_h + (verse2 ? g : 0);

        // 3. Vers 2
        const v2_h = verse2 ? wrapText(ctx, verse2.text.trim(), 0, 0, textWidth2, config.lineHeight * 0.8 * scaleVerses * arMult2 * s, false) : 0;
        if (verse2) {
          minY = Math.min(minY, relY);
          maxY = Math.max(maxY, relY + v2_h);
        }
        relY += v2_h;

        return { minY, maxY, height: maxY - minY };
      };

      let fitScale = 1.0;
      let currentVerseGap = verseGap;
      let bounds = getBounds(fitScale, currentVerseGap);

      // Iterativ loop för att skala ner om höjden är för stor
      for (let i = 0; i < 15; i++) {
        bounds = getBounds(fitScale, currentVerseGap);
        if (bounds.height <= maxSafeHeight) break;

        if (currentVerseGap > 60) {
          currentVerseGap *= 0.8;
        } else {
          fitScale *= 0.9;
        }
      }

      // Beräkna bas-Y (Topp-justerat paket + användarens shiftVersesY)
      // Vi utgår från topLimit och justerar för paketets interna minY
      let baseY = topLimit - bounds.minY + shiftVersesY;
      
      // POSITION ADJUSTMENT:
      // Om paketet går utanför ramen pga shiftVersesY, justera baseY så det hamnar inom ramarna
      if (baseY + bounds.minY < topLimit) {
        baseY = topLimit - bounds.minY;
      }
      if (baseY + bounds.maxY > bottomLimit) {
        baseY = bottomLimit - bounds.maxY;
      }

      // Nu ritar vi ut allt baserat på baseY
      const verseBaseX = centerX + shiftVersesX;
      let drawY = baseY;

      if (verse1) {
        // Header (Bok, Kapitel & Vers)
        const bookName1 = verse1.local_book_name;
        const bookName2 = verse2 ? verse2.local_book_name : '';
        const combinedBooks = bookName2 ? `${bookName1} | ${bookName2}` : bookName1;
        const headerText = `${combinedBooks} ${verse1.chapter}:${verse1.verse}`;
        
        const cv_h = Math.floor(config.fontSize * 0.8 * scaleCV * fitScale);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `bold ${cv_h}px Inter`;
        ctx.fillText(headerText, centerX + shiftCVX, drawY + shiftCVY);
        drawY += cv_h + (80 * fitScale); 

        // Vers 1
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${isAr1 ? '' : 'italic'} ${config.fontSize * scaleVerses * arMult1 * fitScale}px ${isAr1 ? 'Inter' : '"Playfair Display", serif'}`;
        const h1 = wrapText(ctx, `"${verse1.text.trim()}"`, verseBaseX, drawY, textWidth1, config.lineHeight * scaleVerses * arMult1 * fitScale);
        drawY += h1 + (verse2 ? currentVerseGap : 0);
      }

      if (verse2) {
        // Vers 2
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `${Math.floor(config.fontSize * 0.75 * scaleVerses * arMult2 * fitScale)}px Inter`;
        const h2 = wrapText(ctx, verse2.text.trim(), verseBaseX, drawY, textWidth2, config.lineHeight * 0.8 * scaleVerses * arMult2 * fitScale);
        drawY += h2;
      }
      
      ctx.shadowBlur = 0;
      onCanvasReady(canvas);
    };
  }, [verse1, verse2, lang1Name, lang2Name, backgroundImage, aspectRatio, shiftVersesY, shiftVersesX, shiftRefY, shiftRefX, shiftCVY, shiftCVX, verseGap, scaleVerses, scaleRef, scaleCV]);

  return <canvas ref={canvasRef} className="w-full h-auto rounded-[2rem] shadow-2xl border border-white/10 bg-slate-900" />;
};

const NumericInput = ({ label, value, onChange, min = -1500, max = 1500 }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center px-1">
      <span className="text-[8px] font-bold text-slate-500 uppercase">{label}</span>
      <div className="flex items-center gap-1">
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(parseInt(e.target.value) || 0)}
          className="bg-slate-700 text-indigo-400 text-[9px] w-14 px-1 py-0.5 rounded border border-white/5 text-right outline-none"
        />
        <span className="text-[8px] font-mono text-slate-600">px</span>
      </div>
    </div>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={e => onChange(parseInt(e.target.value))} 
      className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
    />
  </div>
);

const SizeSlider = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center px-1">
      <span className="text-[8px] font-bold text-slate-500 uppercase">{label}</span>
      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{SIZE_LABELS[value]}</span>
    </div>
    <input 
      type="range" min="0" max="4" step="1" value={value} 
      onChange={e => onChange(parseInt(e.target.value))} 
      className="w-full accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
    />
  </div>
);

const App = () => {
  // Laddar presets från localStorage vid start
  const getInitialValue = (key, fallback) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[key] !== undefined ? parsed[key] : fallback;
      }
    } catch(e) {}
    return fallback;
  };

  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[18]);
  const [selectedChapter, setSelectedChapter] = useState(23);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  
  // Skärmhantering
  const [screens, setScreens] = useState([]);
  const [showScreenSelector, setShowScreenSelector] = useState(false);
  const [screenError, setScreenError] = useState(null);
  const [isLoadingScreens, setIsLoadingScreens] = useState(false);
  const [activeCastScreen, setActiveCastScreen] = useState(null);
  
  // Design states (Persisteras)
  const [aspectRatio, setAspectRatio] = useState(getInitialValue('aspectRatio', '4:5'));
  const [shiftVersesY, setShiftVersesY] = useState(getInitialValue('shiftVersesY', 0));
  const [shiftVersesX, setShiftVersesX] = useState(getInitialValue('shiftVersesX', 0));
  const [verseGap, setVerseGap] = useState(getInitialValue('verseGap', 350)); 
  const [shiftRefY, setShiftRefY] = useState(getInitialValue('shiftRefY', 0));
  const [shiftRefX, setShiftRefX] = useState(getInitialValue('shiftRefX', 0));
  const [shiftCVY, setShiftCVY] = useState(getInitialValue('shiftCVY', 0));
  const [shiftCVX, setShiftCVX] = useState(getInitialValue('shiftCVX', 0));
  const [sizeVerses, setSizeVerses] = useState(getInitialValue('sizeVerses', 2));
  const [sizeRef, setSizeRef] = useState(getInitialValue('sizeRef', 2));
  const [sizeCV, setSizeCV] = useState(getInitialValue('sizeCV', 2));

  const [externalXmls, setExternalXmls] = useState({});
  const [availableTranslations, setAvailableTranslations] = useState([
    { id: "LADDA", name: "Inga biblar laddade", xmlKey: "" }
  ]);
  const [ver1, setVer1] = useState(availableTranslations[0]);
  const [ver2, setVer2] = useState(availableTranslations[0]);
  const [chapterData1, setChapterData1] = useState([]);
  const [chapterData2, setChapterData2] = useState([]);
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080');

  const canvasRef = useRef(null);
  const castWindowRef = useRef(null);
  const folderInputRef = useRef(null);
  const bgInputRef = useRef(null);

  // Auto-save effekt
  useEffect(() => {
    const presets = {
      aspectRatio, shiftVersesY, shiftVersesX, verseGap, shiftRefY, shiftRefX, shiftCVY, shiftCVX,
      sizeVerses, sizeRef, sizeCV
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }, [aspectRatio, shiftVersesY, shiftVersesX, verseGap, shiftRefY, shiftRefX, shiftCVY, shiftCVX, sizeVerses, sizeRef, sizeCV]);

  const handleFolderUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;
    const newXmls = { ...externalXmls };
    let newTranslations = [];
    for (let file of files) {
      if (file.name.toLowerCase().endsWith('.xml')) {
        const text = await file.text();
        const id = file.name.replace('.xml', '').toUpperCase();
        newXmls[id] = text;
        newTranslations.push({ id, name: id, xmlKey: id });
      }
    }
    setExternalXmls(newXmls);
    setAvailableTranslations(newTranslations);
    if (newTranslations.length > 0) {
      setVer1(newTranslations[0]);
      setVer2(newTranslations[1] || newTranslations[0]);
    }
  };

  useEffect(() => {
    const res1 = getChapterFromXml(externalXmls[ver1.xmlKey] || "", selectedBook, selectedChapter);
    const res2 = getChapterFromXml(externalXmls[ver2.xmlKey] || "", selectedBook, selectedChapter);
    setChapterData1(res1);
    setChapterData2(res2);
    if (res1.length > 0 && selectedVerseIndex >= res1.length) setSelectedVerseIndex(0);
  }, [selectedBook, selectedChapter, ver1, ver2, externalXmls]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Bibel-${selectedBook}-${selectedChapter}-${selectedVerseIndex+1}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCast = async () => {
    setShowScreenSelector(true);
    setIsLoadingScreens(true);
    setScreenError(null);

    try {
      if ('getScreenDetails' in window) {
        // @ts-ignore
        const screenDetails = await window.getScreenDetails();
        setScreens(screenDetails.screens);
        if (screenDetails.screens.length <= 1) {
          setScreenError("Endast en skärm hittades. Anslut en extra skärm/projektor för att välja var du vill kasta.");
        }
      } else {
        setScreenError("Din webbläsare stöder inte direkt skärmval. Prova att använda Google Chrome eller Microsoft Edge.");
      }
    } catch (e) {
      console.warn("Screen Details API misslyckades:", e);
      setScreenError("Kunde inte hämta skärminformation. Kontrollera att du gett tillåtelse att se dina skärmar.");
    } finally {
      setIsLoadingScreens(false);
    }
  };

  const openCastPopup = (screen = null) => {
    if (castWindowRef.current && !castWindowRef.current.closed) {
      if (screen) {
        // Om fönstret redan är öppet men vi vill flytta det till en ny skärm
        castWindowRef.current.moveTo(screen.availLeft, screen.availTop);
        castWindowRef.current.resizeTo(screen.availWidth, screen.availHeight);
      }
      castWindowRef.current.focus();
      return;
    }

    let options = "width=1280,height=720";
    if (screen) {
      options = `left=${screen.availLeft},top=${screen.availTop},width=${screen.availWidth},height=${screen.availHeight},menubar=no,toolbar=no,location=no,status=no`;
    }

    const win = window.open('', 'BibelGeneratorCast', options);
    if (!win) {
      alert("Popup blockerades! Tillåt popuper för att kasta till skärm.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>BibelGenerator - Presentation</title>
          <style>
            body { margin: 0; background: black; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; cursor: pointer; transition: transform 0.3s ease; }
            #fs-overlay {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(2, 6, 23, 0.95); color: white;
              display: flex; flex-direction: column; align-items: center; justify-content: center;
              cursor: pointer; z-index: 1000; transition: opacity 0.5s;
              text-align: center;
              backdrop-blur: 10px;
            }
            .btn {
              background: #6366f1; color: white; padding: 20px 40px; border-radius: 20px;
              font-weight: 900; font-size: 20px; margin-top: 30px; border: none;
              box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
              cursor: pointer;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .hint { font-size: 14px; opacity: 0.5; margin-top: 15px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div id="fs-overlay" onclick="document.documentElement.requestFullscreen(); this.style.opacity='0'; setTimeout(() => this.style.display='none', 500);">
            <div style="font-size: 80px; margin-bottom: 10px;">📺</div>
            <div style="font-weight: 900; font-size: 32px; letter-spacing: -1px;">REDO FÖR PRESENTATION</div>
            <div class="hint">Klicka var som helst för att starta fullskärm på denna skärm</div>
            <button class="btn">STARTA PRESENTATION</button>
          </div>
          <img id="cast-image" src="${canvasRef.current?.toDataURL() || ''}" onclick="if(!document.fullscreenElement) document.documentElement.requestFullscreen();" />
        </body>
      </html>
    `);
    win.document.close();
    castWindowRef.current = win;
    setActiveCastScreen(screen || { label: 'Nytt fönster' });

    // Monitor window closure
    const checkClosed = setInterval(() => {
      if (win.closed) {
        clearInterval(checkClosed);
        setActiveCastScreen(null);
        castWindowRef.current = null;
      }
    }, 1000);
  };

  const stopCasting = () => {
    if (castWindowRef.current) {
      castWindowRef.current.close();
      castWindowRef.current = null;
    }
    setActiveCastScreen(null);
  };

  useEffect(() => {
    const updateCast = () => {
      if (castWindowRef.current && !castWindowRef.current.closed && canvasRef.current) {
        const img = castWindowRef.current.document.getElementById('cast-image');
        if (img) {
          img.src = canvasRef.current.toDataURL();
        }
      }
    };
    const timer = setTimeout(updateCast, 150);
    return () => clearTimeout(timer);
  }, [chapterData1, chapterData2, selectedVerseIndex, aspectRatio, bgImage, ver1, ver2, shiftVersesY, shiftVersesX, verseGap, shiftRefY, shiftRefX, shiftCVY, shiftCVX]);

  useEffect(() => {
    return () => {
      if (castWindowRef.current) castWindowRef.current.close();
    };
  }, []);

  const resetPositions = () => {
    setShiftVersesY(0); setShiftVersesX(0); setShiftRefY(0); setShiftRefX(0); setShiftCVY(0); setShiftCVX(0); setVerseGap(350);
    setSizeVerses(2); setSizeRef(2); setSizeCV(2);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="sticky top-0 z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20"><Lucide.BookOpen className="w-6 h-6 text-white" /></div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">BIBEL<span className="text-indigo-400 not-italic">GENERATOR</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {activeCastScreen && (
            <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-xl animate-pulse">
              <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                Presenterar på: {activeCastScreen.label || 'Extern skärm'}
              </span>
              <button 
                onClick={stopCasting}
                className="ml-2 p-1 hover:bg-red-500/20 rounded-lg transition-colors group"
                title="Avbryt presentation"
              >
                <Lucide.XCircle className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
          <button onClick={handleCast} className="bg-indigo-500 text-white px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-3 hover:bg-indigo-400 transition-all active:scale-95 shadow-2xl shadow-indigo-500/40 border border-indigo-400/30">
            <Lucide.Tv className="w-5 h-5" /> {activeCastScreen ? 'BYT SKÄRM' : 'KASTA TILL SKÄRM'}
          </button>
          <button onClick={download} className="bg-white text-slate-900 px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-3 hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-white/5">
            <Lucide.Download className="w-4 h-4" /> SPARA BILD
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[2rem] space-y-4">
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Lucide.Info className="w-4 h-4" /> Kom igång</h2>
            <button onClick={() => folderInputRef.current.click()} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3 transition-all">
              <Lucide.Upload className="w-4 h-4" /> Ladda in XML-biblar
            </button>
            <input type="file" ref={folderInputRef} className="hidden" multiple onChange={handleFolderUpload} />
            <p className="text-[10px] text-slate-500 font-bold text-center">{Object.keys(externalXmls).length} biblar redo i minnet</p>
          </section>

          <section className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1">Översättningar</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" value={ver1.id} onChange={e => setVer1(availableTranslations.find(t => t.id === e.target.value) || ver1)}>
                {availableTranslations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" value={ver2.id} onChange={e => setVer2(availableTranslations.find(t => t.id === e.target.value) || ver2)}>
                {availableTranslations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Välj ställe</h2>
              <div className="relative">
                <select value={selectedBook} onChange={(e) => { setSelectedBook(e.target.value); setSelectedVerseIndex(0); }} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 font-bold text-sm appearance-none">
                  {BIBLE_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}
                </select>
                <span className="absolute -top-2 left-3 bg-[#020617] px-2 text-[8px] font-black text-slate-500 uppercase">Bok</span>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-2">
                <div className="relative">
                  <input type="number" value={selectedChapter} onChange={(e) => { setSelectedChapter(parseInt(e.target.value) || 1); setSelectedVerseIndex(0); }} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center font-bold" />
                  <span className="absolute -top-2 left-3 bg-[#020617] px-2 text-[8px] font-black text-slate-500 uppercase">Kapitel</span>
                </div>
                <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl">
                  <button onClick={() => setSelectedVerseIndex(v => Math.max(0, v - 1))} className="p-3 text-indigo-400 hover:bg-white/5 shrink-0 rounded-l-xl"><Lucide.ChevronLeft className="w-5 h-5" /></button>
                  <input 
                    type="number" 
                    value={selectedVerseIndex + 1} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                        setSelectedVerseIndex(Math.max(0, Math.min(chapterData1.length - 1, val - 1)));
                      }
                    }}
                    className="w-full bg-transparent text-center font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={() => setSelectedVerseIndex(v => Math.min(chapterData1.length - 1, v + 1))} className="p-3 text-indigo-400 hover:bg-white/5 shrink-0 rounded-r-xl"><Lucide.ChevronRight className="w-5 h-5" /></button>
                  <span className="absolute -top-2 left-3 bg-[#020617] px-2 text-[8px] font-black text-slate-500 uppercase z-10">Vers</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Design (Sparad)</label>
                <Lucide.Save className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(LAYOUTS).map(r => (
                  <button key={r} onClick={() => setAspectRatio(r)} className={`py-2 rounded-xl text-[10px] font-black border transition-all ${aspectRatio === r ? 'bg-white text-black border-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{r}</button>
                ))}
              </div>
              
              <div className="space-y-6 bg-slate-800/50 p-5 rounded-[1.5rem] border border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Lucide.Type className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black uppercase text-slate-300">Vers-texter</span>
                  </div>
                  <NumericInput label="Vertikalt (Y)" value={shiftVersesY} onChange={setShiftVersesY} />
                  <NumericInput label="Horisontellt (X)" value={shiftVersesX} onChange={setShiftVersesX} />
                  <SizeSlider label="Textstorlek" value={sizeVerses} onChange={setSizeVerses} />
                  <NumericInput label="Mellanrum texter" value={verseGap} onChange={setVerseGap} min={0} max={1000} />
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Lucide.FileText className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black uppercase text-slate-300">Kapitel & Vers</span>
                  </div>
                  <NumericInput label="Vertikalt (Y)" value={shiftCVY} onChange={setShiftCVY} />
                  <NumericInput label="Horisontellt (X)" value={shiftCVX} onChange={setShiftCVX} />
                  <SizeSlider label="Textstorlek" value={sizeCV} onChange={setSizeCV} />
                </div>

                <button onClick={resetPositions} className="w-full text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors pt-2 flex items-center justify-center gap-2">
                  <Lucide.RefreshCw className="w-3 h-3" /> Återställ positioner
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">Bakgrundsmallar</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BG_TEMPLATES.map((tmpl, i) => (
                      <button 
                        key={i} 
                        onClick={() => setBgImage(tmpl.url)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${bgImage === tmpl.url ? 'border-indigo-500 scale-95' : 'border-transparent hover:border-white/20'}`}
                        title={tmpl.name}
                      >
                        <img src={tmpl.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => bgInputRef.current.click()} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-xs font-bold uppercase hover:bg-white/10 flex items-center justify-center gap-2">
                  <Lucide.Layers className="w-4 h-4"/> Egen bakgrund
                </button>
              </div>
              <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const r = new FileReader();
                  r.onload = ev => { if (typeof ev.target?.result === 'string') setBgImage(ev.target.result); };
                  r.readAsDataURL(file);
                }
              }} />
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-10 flex flex-col items-center">
          <div className="w-full max-w-[600px]">
            <BibleCanvas 
              verse1={chapterData1[selectedVerseIndex]} 
              verse2={chapterData2[selectedVerseIndex]} 
              lang1Name={ver1.name} 
              lang2Name={ver2.name} 
              backgroundImage={bgImage} 
              aspectRatio={aspectRatio} 
              shiftVersesY={shiftVersesY} 
              shiftVersesX={shiftVersesX}
              shiftRefY={shiftRefY} 
              shiftRefX={shiftRefX}
              shiftCVY={shiftCVY}
              shiftCVX={shiftCVX}
              verseGap={verseGap}
              sizeVerses={sizeVerses}
              sizeRef={sizeRef}
              sizeCV={sizeCV}
              onCanvasReady={c => canvasRef.current = c}
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-white/5 shadow-inner">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{ver1.name}</span>
              <p className="mt-4 text-xl font-serif italic text-white leading-relaxed">"{chapterData1[selectedVerseIndex]?.text || "Väntar på text..."}"</p>
            </div>
            <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-white/5 shadow-inner">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{ver2.name}</span>
              <p className="mt-4 text-xl font-serif italic text-slate-400 leading-relaxed">"{chapterData2[selectedVerseIndex]?.text || "---"}"</p>
            </div>
          </div>
        </div>
      </main>

      {showScreenSelector && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black mb-6 text-center tracking-tighter italic">VÄLJ SKÄRM FÖR <span className="text-indigo-400">PRESENTATION</span></h3>
            
            {isLoadingScreens ? (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Söker efter skärmar...</p>
              </div>
            ) : screenError ? (
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-6">
                <p className="text-xs text-red-400 font-bold leading-relaxed text-center">{screenError}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {screens.map((screen, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      openCastPopup(screen);
                      setShowScreenSelector(false);
                    }}
                    className="w-full bg-white/5 hover:bg-indigo-600 p-5 rounded-2xl text-left transition-all flex items-center justify-between group border border-white/5 hover:border-indigo-400"
                  >
                    <div>
                      <div className="font-black text-sm uppercase tracking-wide">{screen.label || `Skärm ${i + 1}`}</div>
                      <div className="text-[10px] text-slate-500 group-hover:text-indigo-200 font-bold">
                        {screen.width}x{screen.height} — {screen.isPrimary ? 'Huvudskärm' : 'Extern skärm'}
                      </div>
                    </div>
                    <Lucide.Monitor className="w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3 mt-4">
              <button 
                onClick={() => {
                  openCastPopup();
                  setShowScreenSelector(false);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all border border-white/5"
              >
                Öppna i vanligt fönster istället
              </button>
              <button 
                onClick={() => setShowScreenSelector(false)}
                className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-2"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
