# After Hours — Sandhit’s District

An original 3D cyberpunk environment built with React, TypeScript, React Three Fiber, and Vite. The current revision focuses exclusively on the model and entry sequence: black loader, animated ramen bowl, progress, START, and an establishing camera reveal. The previous navbar, headings, and portfolio panels have been removed.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` checks TypeScript and creates the production site in `dist`; `npm run preview` serves that build locally.

## Explore

Click START after model construction and shader preparation finish. Drag to orbit through 360 degrees; scroll or pinch to zoom. With the canvas focused, arrow keys rotate, plus/minus zoom, and R restores the establishing view. There is no persistent page UI. A brief gesture hint fades out. System reduced-motion preferences disable rain, steam, hologram movement, and the animated camera reveal. A WebGL error offers a retry.

## Edit

- `src/App.tsx`: loading and start sequence, progress, reduced motion, and error state.
- `src/Scene.tsx`: lighting, reflections, atmosphere, hologram, orbit controls, and camera reveal.
- `src/model/architecture.ts`: open restaurant, hotel, balconies, workshop, stairs, and service façade.
- `src/model/props.ts`: street, coupe, scooter, characters, counter props, signs, and rooftop equipment.
- `src/model/kit.ts`: geometry construction, material textures, original sign graphics, and static mesh batching.
- `REFERENCES.md`: visual reference board, credits, and comparison with Jesse's portfolio.
- `PLAN.md`: phase history and current scope.

Portfolio content and object-based navigation are intentionally deferred to the next phase, after model review. The signs are currently part of the environment. No forms, analytics, or external account links are installed.

## Art direction and limitations

The scene uses original locally generated geometry, weathered surface textures, and sign artwork. The model includes open interiors, projecting balconies, individual stair treads, railings, roof equipment, bottles, bowls, stools, and clothed figures. Static geometry is merged by material to reduce draw calls. The street uses a 512px planar reflection, soft bloom, and a restrained rain and steam system. Lighting is real-time; no Blender baking or third-party models are claimed. Runtime textures, fonts, and environment lighting do not depend on external downloads. This is an authored stylized model, not a photorealistic scan.

Inspired by the spatial portfolio approach in [Jesse Zhou’s case study](https://jesse-zhou.medium.com/jesses-ramen-case-study-77bae77ab5f0), with an original scene and implementation. The supplied `images.jpg` and `neon_alleyway_blueprint.md` remain as reference material.
