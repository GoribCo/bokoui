import { DEFAULT_FONT_SIZE, FONT_SIZE_STORAGE_KEY, fontSizes } from "@/lib/fonts/font-options";

const validSizes = fontSizes.filter((size) => size !== DEFAULT_FONT_SIZE);

// Runs before first paint: applies the remembered text size so the page does not reflow after load.
const script = `try{var s=localStorage.getItem(${JSON.stringify(FONT_SIZE_STORAGE_KEY)});if(${JSON.stringify(validSizes)}.indexOf(s)>-1)document.documentElement.dataset.fontSize=s}catch(e){}`;

/** Put in `<head>`, like `ThemeScript`. */
export function FontSizeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
