## 2025-02-17 - [JS Performance: Scroll Throttling & Animation Loop]
**Learning:** Found that multiple scroll listeners were updating DOM elements on every event without throttling. Also discovered a redundant requestAnimationFrame loop and frequent getBoundingClientRect calls in the cursor glow effect.
**Action:** Apply requestAnimationFrame throttling to scroll listeners and optimize the animation loop to run only when active. Cache layout-triggering properties like getBoundingClientRect.
