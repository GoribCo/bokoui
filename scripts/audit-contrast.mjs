import fs from "fs";
const dir = "src/styles/themes/";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".css") && f !== "index.css");
const parse = (css, sel) => { css = css.replace(/\/\*[\s\S]*?\*\//g, ""); // collect var maps per block selector containing sel
  const out = {};
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const s = m[1].trim(); if (!sel(s)) continue;
    for (const d of m[2].matchAll(/--ui-([\w-]+):\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  }
  return out;
};
const lum = h => { const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4); return .2126*c[0]+.7152*c[1]+.0722*c[2]; };
const cr = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+.05)/(y+.05); };
const mix = (a,b,p) => "#"+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*p+parseInt(b.slice(i,i+2),16)*(1-p)).toString(16).padStart(2,"0")).join("");
const base = fs.readFileSync(dir+"flat.css","utf8");
const baseL = parse(base, s=>s===":root:not([data-mode=\"dark\"])"), baseD = parse(base, s=>s===":root[data-mode=\"dark\"]");
let fails = 0;
for (const f of files) {
  const css = fs.readFileSync(dir+f,"utf8"); const id = f.replace(".css","");
  const st = {...parse(base, s=>s===":root"), ...parse(css, s=>s===`:root[data-theme="${id}"]`)};
  const L = {...baseL, ...st, ...parse(css, s=>s.includes(`data-theme="${id}"]:not`))};
  const D = {...baseD, ...st, ...parse(css, s=>s.includes(`data-theme="${id}"][data-mode`))};
  for (const [mode,T] of [["light",L],["dark",D]]) {
    const chk = (label,a,b,min) => { const r=cr(a,b); if (r<min){fails++;console.log(`FAIL ${id}/${mode} ${label}: ${r.toFixed(2)} < ${min}  (${a} on ${b})`);} };
    chk("fg/bg",T.fg,T.bg,4.5); chk("muted-fg/bg",T["muted-fg"],T.bg,4.5); chk("muted-fg/muted",T["muted-fg"],T.muted,4.5);
    chk("field-border/bg (3:1)",T["field-border"],T.bg,3); chk("ring/bg (3:1)",T.ring,T.bg,3);
    for (const t of ["primary","secondary","accent","neutral","success","warning","danger","info"]) {
      chk(`${t}-fg/${t}`,T[t+"-fg"],T[t],4.5);
      const ink = mix(T[t],T.fg,(parseInt(T["ink-tone"])||60)/100); chk(`${t} ink/bg`,ink,T.bg,4.5);
    }
  }
}
console.log(fails? `${fails} failures`:"ALL PASS");
