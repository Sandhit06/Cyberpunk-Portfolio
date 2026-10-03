# 🌃 Neon Alleyway: 3D Cyberpunk Portfolio

## 📖 Project Overview
This project is a highly immersive, 3D web-based portfolio inspired by cyberpunk aesthetics. The user starts at the entrance of a dark, rain-slicked neon alleyway. As they scroll, the camera moves forward down the alley. The user's portfolio projects are integrated into the environment as glowing neon signs and holographic billboards attached to the alley walls. 

**Objective for AI:** Read this document and generate a Next.js (or React) application utilizing React Three Fiber to build this exact experience.

---

## 🛠️ Tech Stack
*   **Framework:** React / Next.js
*   **3D Rendering:** `three`, `@react-three/fiber` (R3F)
*   **3D Helpers:** `@react-three/drei` (for HTML overlays, GLTF loading, environment)
*   **Post-Processing:** `@react-three/postprocessing` (Crucial for the neon bloom/glow effects)
*   **Animations:** `gsap` (for camera scroll-path logic and hover animations) OR `@react-three/drei`'s `ScrollControls`.
*   **Styling:** Tailwind CSS (for the 2D UI overlays)

---

## 🏗️ Scene Architecture & Requirements

### 1. The Environment (The Alley)
*   **Model:** We will use a baked `.glb` or `.gltf` model of a narrow alleyway (brick walls, puddles on the ground, pipes, AC units). 
*   **Lighting:** 
    *   Very low ambient light (dark blue/purple tint).
    *   Point lights placed near the neon signs to cast colored light on the surrounding brick walls.
*   **Post-processing (Crucial):** Implement an `EffectComposer` with a `Bloom` effect to make the neon colors actually "glow" against the dark background.

### 2. Weather Effects (Rain)
*   **Particles:** Create a custom component `Rain.jsx` that generates a particle system (using `InstancedMesh` or `Points`) falling continuously along the Y-axis to simulate heavy rain.

### 3. Camera & Scroll Interaction
*   **Setup:** The camera starts at `z: 10` (entrance of the alley) and looks towards `z: -50` (end of the alley).
*   **Interaction:** Tie the window's vertical scroll position to the camera's Z-axis position. As the user scrolls down the page, the camera slowly moves forward through the 3D space.
*   **Tool:** Use `@react-three/drei`'s `<ScrollControls>` or GSAP `ScrollTrigger` bound to the camera's ref.

### 4. Portfolio Projects (Neon Signs)
*   **Concept:** Projects are 3D planes or text geometry attached to the alley walls.
*   **Materials:** Use `MeshStandardMaterial` or `MeshBasicMaterial` with a high `emissive` value and vivid colors (Cyan, Magenta, Neon Green) so the Post-processing Bloom catches them.
*   **Interactions:** 
    *   *Hover:* When the mouse raycasts over a sign, trigger a quick "glitch" animation (flickering emissive intensity) and slightly scale up the mesh. Change cursor to pointer.
    *   *Click:* The camera smoothly lerps (zooms in) to face the sign directly, and a 2D HTML modal (using Drei's `<Html>` component) fades in over the screen containing project details, tech stack, and links.

---

## 📂 Suggested Component Structure for AI to Generate

1.  **`App.jsx`**: Main entry point, sets up the full-screen `<Canvas>` and `<EffectComposer>`.
2.  **`Scene.jsx`**: Holds the lights, the `AlleyModel`, the `RainParticles`, and the `CameraControls`.
3.  **`CameraRig.jsx`**: Handles the scroll-to-Z-axis logic and the lerping/zooming when a project is clicked.
4.  **`AlleyModel.jsx`**: Loads the `.glb` environment using `useGLTF`.
5.  **`ProjectSign.jsx`**: Reusable component taking props `(position, rotation, projectData, color)`. Handles hover state, glitch logic, and click events.
6.  **`ProjectModal.jsx`**: A 2D Tailwind-styled overlay that conditionally renders when a `ProjectSign` is clicked.
7.  **`RainParticles.jsx`**: The Three.js point system for falling rain.

---

## 🤖 Instructions for the AI Prompting this File:
1. Start by initializing the basic React Three Fiber Canvas with a black background and Post-processing Bloom.
2. Next, generate the `CameraRig` that moves the camera forward through an empty space based on scroll.
3. Then, mock up a basic corridor using simple Three.js planes (walls and floor) to act as a placeholder for a 3D model.
4. Add the `ProjectSign` components along the walls with hover glitch effects.
5. Finally, connect the click logic to zoom the camera into the signs and display the 2D HTML project description.