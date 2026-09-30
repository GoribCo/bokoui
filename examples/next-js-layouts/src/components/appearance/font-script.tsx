import { DEFAULT_FONT_ID, FONT_STORAGE_KEY, fontOptions } from "@/lib/fonts/font-options";

const validIds = fontOptions.map((option) => option.id).filter((id) => id !== DEFAULT_FONT_ID);

// Runs before first paint: applies the remembered font so the page does not flash (FR-7.4).
const script = `try{var f=localStorage.getItem(${JSON.stringify(FONT_STORAGE_KEY)});if(${JSON.stringify(validIds)}.indexOf(f)>-1)document.documentElement.dataset.font=f}catch(e){}`;

/** Put in `<head>`, like `ThemeScript`. Only needed when the font switcher is enabled. */
export function FontScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
