## 2025-02-17 - [JS Performance: Scroll Throttling & Animation Loop]
**Learning:** Found that multiple scroll listeners were updating DOM elements on every event without throttling. Also discovered a redundant requestAnimationFrame loop and frequent getBoundingClientRect calls in the cursor glow effect.
**Action:** Apply requestAnimationFrame throttling to scroll listeners and optimize the animation loop to run only when active. Cache layout-triggering properties like getBoundingClientRect.

## 2026-02-18 - [Layout Fix: RTL Mobile Navbar Alignment]
**Learning:** Default RTL flexbox behavior places the logo on the right and controls on the left. On small viewports (<600px), this can create a "rigid block" of controls that feels poorly integrated. Many agents failed by not addressing the specific flex container interaction in RTL.
**Action:** Applied 'flex-direction: row-reverse !important' to both '.navbar-inner' and '.nav-actions' within a '@media(max-width: 600px)' query for '[dir="rtl"]'. This forces a Left-to-Right visual order (Logo Left, Hamburger Far Right) which is the preferred UX pattern for this site, ensuring consistency between LTR and RTL mobile headers. Also hidden '.logo-text' on mobile to eliminate phantom spacing.
