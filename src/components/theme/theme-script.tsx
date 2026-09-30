import {
  defaultTheme,
  MODE_KEY,
  STYLE_KEY,
  themes,
  type CustomThemes,
} from "./themes";

/**
 * Inline script that sets data-theme / data-mode on <html> while the HTML is
 * still being parsed, so the first paint already has the saved theme (FR-4.5).
 * Keep in sync with apply-theme.ts.
 */
export function ThemeScript({
  customThemes = {},
}: {
  customThemes?: CustomThemes;
}) {
  const json = (value: unknown) =>
    JSON.stringify(value).replace(/</g, "\\u003c");

  const script = `(function(){try{
var d=document.documentElement,C=${json(customThemes)},B=${json(themes.map((t) => t.id))},
s=localStorage.getItem(${json(STYLE_KEY)}),m=localStorage.getItem(${json(MODE_KEY)})||"system";
if(!C[s]&&B.indexOf(s)<0)s=${json(defaultTheme)};
var r=m==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):m;
if(r!=="dark")r="light";
var c=C[s];
d.dataset.theme=c?(c.base||${json(defaultTheme)}):s;d.dataset.mode=r;d.style.colorScheme=r;
if(c){var t=Object.assign({},c.tokens,c[r]),k=[];for(var n in t){d.style.setProperty("--ui-"+n,t[n]);k.push("--ui-"+n)}d.dataset.customVars=k.join(",")}
}catch(e){}})()`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
