// Inline <head> script for app/layout.tsx. Runs before first paint and turns on
// the reveal styles (html[data-motion="on"]) unless the visitor prefers reduced
// motion. Server-rendered content stays visible when JS is off. If the reveal
// code has not booted within 2.5s (slow or failed JS), it switches motion off
// again so nothing is left hidden.
export const MOTION_BOOT_SCRIPT = `(function(){try{var w=window,d=document.documentElement;w.__revealScript=1;if(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-motion','on');setTimeout(function(){if(!w.__revealBooted&&document.querySelector('[data-reveal]')){w.__revealFallback=1;d.removeAttribute('data-motion')}},2500)}catch(e){}})();`;
