
/**
 * DIN KARTA ÖVER ÖVERSÄTTNINGAR
 * 
 * Här lägger du in innehållet från dina XML-filer. 
 * Varje 'nyckel' (t.ex. "B2000") måste matcha det som står som 'xmlKey' i types.ts.
 */

export const OVERSATTNINGAR: Record<string, string> = {
  // EXEMPEL: Klistra in hela XML-koden mellan backticks (`)
  "B2000": `
<bible translation="Bibel 2000">
  <book name="Psaltaren">
    <chapter number="23">
      <verse number="1">Herren är min herde, ingenting skall fattas mig.</verse>
      <verse number="2">Han låter mig vila på gröna ängar, han för mig till vatten där jag finner ro.</verse>
    </chapter>
  </book>
</bible>
`,

  "SFB2015": `
<bible translation="SFB 2015">
  <book name="Psaltaren">
    <chapter number="23">
      <verse number="1">Herren är min herde, mig skall inget fattas.</verse>
    </chapter>
  </book>
</bible>
`,

  "NKJV": `
<bible translation="NKJV">
  <book name="Psalms">
    <chapter number="23">
      <verse number="1">The LORD is my shepherd; I shall not want.</verse>
      <verse number="2">He makes me to lie down in green pastures; He leads me beside the still waters.</verse>
    </chapter>
  </book>
</bible>
`,

  "EN_ESV": ``, // Klistra in ESV XML här
  "EN_NIV": ``  // Klistra in NIV XML här
};
