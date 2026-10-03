# After Hours — project roadmap

## Current revision: model first

Latest refresh: cleaner enamel facades and satin metal; car moved to left-side parking and bike to the front; four additional framed billboards; neon cornices, stair lighting and balcony planters; five independently rotating AC rotors (stationary for reduced motion); rain removed while kitchen steam remains; transparent beveled glass foundation with a reflective promenade and illuminated edges.
User requested a Jesse-inspired black loader → animated ramen bowl and progress → START → establishing camera reveal, with no navbar or page copy. The current deliverable is the 3D environment; portfolio content and world-object navigation wait until after the model review.

- [x] Add full-volume V-style and femme cyberpunk figures with cyberware, tattoos, idle motion, and cigar ember smoke.
- [x] Replace the left-side scooter with a detailed red futuristic motorcycle built from original geometry.
- [x] Compare the first prototype with Jesse's physical, orbitable shop experience.
- [x] Gather restaurant, hotel, and night-city image references in `REFERENCES.md`.
- [x] Replace the page shell and implement actual construction/shader progress.
- [x] Rebuild the geometry: open restaurant, hotel, workshop, balconies, stairs, rear utilities, and rooftop structures.
- [x] Add original signs, textured surfaces, vehicle, scooter, street characters, props, hologram, rain, and steam.
- [x] Add free orbit, zoom, keyboard controls, responsive framing, and reduced-motion support.
- [x] Complete final production build and browser checks for this revision.

Revision verification: `npm run build` passes. Observed the animated bowl/progress, START, and camera reveal in the browser. Checked drag orbit, rear detail, keyboard reset, and responsive framing at 390 × 844. Corrected a material initialization warning and two occluded sign surfaces during review. No runtime errors were observed. Detailed phone hardware performance and deployment testing remain outside this local model review.

The original phase history below describes the earlier prototype; its navigation and panels have now been removed at the user's request.

## 1. Foundation
Create a React, TypeScript, Vite application. Establish the visual language, content model, and navigation.

## 2. Interactive district
Build an original procedural Three.js street with a workshop, netrunner studio, vehicle, pedestrians, rain, lighting, and camera destinations. No third-party model licenses required for these original assets.

## 3. Portfolio experience
Add project dossiers, about and contact panels, clickable world markers, keyboard navigation, sound controls, and reduced-motion support. Clearly label sample content until real project information is supplied.

## 4. Polish and delivery
Refine responsive layout, add a usable non-WebGL fallback, verify production compilation and interactions, and document setup and remaining content needs.

## Future asset pass
Replace selected procedural models with bespoke Blender assets and baked textures if a more realistic art direction is desired. Add real project descriptions, links, résumé, and contact details before publishing.

## Status
- [x] Foundation — React, TypeScript, Vite, content model, and responsive shell.
- [x] Interactive district — procedural architecture, car, terminal desk, pedestrians, rain, neon signs, and destination cameras.
- [x] Portfolio experience — project tabs, profile and contact panels, direct navigation, keyboard dismissal and focus management, optional ambience, and reduced motion.
- [x] First-version polish and delivery — production build, browser interaction checks, desktop and 390px mobile visual inspection, and setup documentation.

## Verification
- `npm run build`: TypeScript and production bundling passed.
- Browser: scene rendered; project selection, profile and contact destinations, and Escape-to-close verified.
- Mobile: inspected at 390 × 844; restored default viewport afterward.
- Browser warning/error log: empty during the final inspection.
- Dependency installation audit: no known vulnerabilities reported.

## Remaining before a public launch
- Add real projects, biography, résumé, email, and social URLs.
- Review the art direction together; custom Blender assets are an optional follow-on production phase.
- Choose a deployment destination and publish the approved site.
