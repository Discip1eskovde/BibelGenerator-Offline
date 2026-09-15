
---

# BibelGenerator Offline 📖✨

**BibelGenerator Offline** är en modern, webbaserad applikation byggd med React, TypeScript och Tailwind CSS. Den är speciellt framtagen för församlingar, predikanter och kreatörer som enkelt vill generera vackra, anpassningsbara bilder av bibelverser (för t.ex. sociala medier eller projektion) samt kasta/presentera verser live på en extern skärm eller projektor – helt offline med lokala XML-dataset.

---

## 🚀 Huvudfunktioner

* **Helt Offline-baserad:** Kräver inga externa API-anrop för bibeltexterna. Läs in egna XML-biblar direkt via mappen.
* **Stöd för flera översättningar (Parallel-view):** Jämför och visa två olika bibelöversättningar samtidigt på samma bild.
* **Live Cast & Presentation:** Kasta direktsända bibelverser till en extra skärm eller projektor med stöd för fullskärmsläge och flerskärmshantering (via Screen Details API).
* **Avancerad bildredigering & Design:**
* Byt bildformat (4:5 för Instagram/Facebook, 16:9 för presentationer/skärmar, 1:1 för kvadratiska inlägg).
* Anpassa positioner (X/Y-led) och textstorlekar dynamiskt.
* Välj bland färdiga bakgrundsmallar (natur, rymd, hav etc.) eller ladda upp egna bakgrundsbilder.


* **Automatisk sparande (Presets):** Dina designval sparas automatiskt i webbläsarens `localStorage`.
* **Export:** Spara ner färdiga högupplösta PNG-bilder med ett klick.

---

## 🛠️ Teknikstack

* **Frontend:** React 19, TypeScript, Tailwind CSS
* **Ikoner:** Lucide React
* **Kompilering i webbläsare:** Babel Standalone (möjliggör körning direkt via statiska filer)
* **Lokal Server:** Inbyggda skript för enkel lokal körning (Node.js eller PowerShell HTTP-lyssnare).

---

## 📦 Installation & Kom igång

1. **Klona repot eller ladda ner som ZIP:**
```bash
git clone https://github.com/DITT-ANVÄNDARNAMN/bibelgenerator-offline.git
cd bibelgenerator-offline

```


2. **Starta programmet:**
* **Alternativ A (Windows - Enklast):**
Dubbelklicka på filen `START_WINDOWS.bat` (eller kör via kommandoformatet). Den startar en lokal server automatiskt och öppnar webbläsaren åt dig.
* **Alternativ B (Node.js):**
```bash
npm install
npm start

```


* **Alternativ C (Manuell filöppning):**
Du kan även öppna `STARTA_HÄR.html` eller `index.html` direkt i en modern webbläsare (som Google Chrome eller Microsoft Edge). *Obs: För full funktionalitet vid filinläsning rekommenderas att köra via en lokal server.*



---

## 📖 Hur man använder programmet

1. Klicka på **"Ladda in XML-biblar"** i sidofältet.
2. Välj din mapp med dina bibel-XML-filer.
3. Välj önskad bok, kapitel och vers i rullistorna.
4. Anpassa design, översättningar och bakgrund efter tycke.
5. Klicka på **"Kasta till skärm"** för presentation eller **"Spara bild"** för att ladda ner resultatet som PNG!

---
Länk till biblen i 200+ språk och 1000+ versioner i XML format:  
https://github.com/Beblia/Holy-Bible-XML-Format
## 📄 Licens

Detta projekt är öppen källkod och tillgängligt under [ISC-licensen](https://www.google.com/search?q=LICENSE).
