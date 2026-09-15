import { BibleVerse } from '../types.ts';

const getBookAlias = (name: string): string[] => {
  const aliases: Record<string, string[]> = {
    "Psaltaren": ["Psaltaren", "Psalms", "Psalm", "Ps", "Psa"],
    "Matteus": ["Matteus", "Matthew", "Matt", "Mt"],
    "1 Mosebok": ["1 Mosebok", "Genesis", "Gen", "Gn"],
    "Johannes": ["Johannes", "John", "Joh", "Jn"],
    "Romarbrevet": ["Romarbrevet", "Romans", "Rom", "Ro"],
  };
  return aliases[name] || [name];
};

export const getChapterFromXml = (
  xmlString: string | undefined, 
  bookName: string, 
  chapterNum: number
): BibleVerse[] => {
  if (!xmlString || xmlString.trim() === "") return [];
  
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      console.error("XML Parse Error");
      return [];
    }

    const possibleNames = getBookAlias(bookName);
    let bookElement: Element | null = null;

    for (const name of possibleNames) {
      bookElement = xmlDoc.querySelector(`book[name*="${name}" i], book[id*="${name}" i], book[bname*="${name}" i]`);
      if (bookElement) break;
    }

    if (!bookElement) {
      bookElement = xmlDoc.querySelector('book');
    }

    if (!bookElement) return [];
    
    const chapter = bookElement.querySelector(`chapter[number="${chapterNum}"], chapter[id="${chapterNum}"], c[n="${chapterNum}"]`);
    if (!chapter) return [];
    
    const verses = chapter.querySelectorAll('verse, v');
    return Array.from(verses).map(v => ({
      book_name: bookName,
      chapter: chapterNum,
      verse: parseInt(v.getAttribute('number') || v.getAttribute('id') || v.getAttribute('n') || '0'),
      text: v.textContent?.trim() || ""
    })).filter(v => v.text !== "");
  } catch (err) {
    console.error("Kritisk krasch i XML-parser:", err);
    return [];
  }
};