
export interface BibleVerse {
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export type AspectRatio = '4:5' | '16:9' | '1:1';

export interface Translation {
  id: string;
  name: string;
  xmlKey: string;
  isExternal?: boolean;
}

export interface LanguageGroup {
  language: string;
  nativeName: string;
  versions: Translation[];
}

export interface LayoutConfig {
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
}

export const LAYOUTS: Record<AspectRatio, LayoutConfig> = {
  '4:5': { width: 1080, height: 1350, fontSize: 58, lineHeight: 75 },
  '16:9': { width: 1920, height: 1080, fontSize: 72, lineHeight: 90 },
  '1:1': { width: 1080, height: 1080, fontSize: 54, lineHeight: 70 }
};

export const BIBLE_BOOKS = [
  "1 Mosebok", "2 Mosebok", "3 Mosebok", "4 Mosebok", "5 Mosebok", "Josua", "Domarboken", "Rut", "1 Samuelsboken", "2 Samuelsboken", 
  "1 Kungaboken", "2 Kungaboken", "1 Krönikeboken", "2 Krönikeboken", "Esra", "Nehemja", "Ester", "Job", "Psaltaren", "Ordspråksboken", 
  "Predikaren", "Höga Visan", "Jesaja", "Jeremia", "Klagovisorna", "Hesekiel", "Daniel", "Hosea", "Joel", 
  "Amos", "Obadja", "Jona", "Mika", "Nahum", "Habackuk", "Sefanja", "Haggai", "Sakarja", "Malaki",
  "Matteus", "Markus", "Lukas", "Johannes", "Apostlagärningarna", "Romarbrevet", "1 Korintierbrevet", "2 Korintierbrevet", "Galaterbrevet", 
  "Efesierbrevet", "Filippierbrevet", "Kolosserbrevet", "1 Thessalonikerbrevet", "2 Thessalonikerbrevet", "1 Timoteusbrevet", "2 Timoteusbrevet", 
  "Titusbrevet", "Filemonbrevet", "Hebreerbrevet", "Jakobsbrevet", "1 Petrusbrevet", "2 Petrusbrevet", "1 Johannesbrevet", "2 Johannesbrevet", 
  "3 Johannesbrevet", "Judasbrevet", "Uppenbarelseboken"
];

export const DEFAULT_LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    language: "Inbyggda (Svenska)",
    nativeName: "Swedish",
    versions: [
      { id: "B2000", name: "Bibel 2000 (Demo)", xmlKey: "B2000" },
      { id: "SFB2015", name: "Folkbibeln (Demo)", xmlKey: "SFB2015" }
    ]
  }
];
