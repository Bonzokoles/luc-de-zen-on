1. Animacje przejść między stronami (Page Transitions)
Przykład integracji z React Transition Group (dla React w Astro)
Zainstaluj paczkę:

bash
npm install react-transition-group
Stwórz wrapper dla layoutu stron z animacją przejścia:

jsx
// src/components/PageTransition.jsx
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation } from "@remix-run/react"; // lub inny router obsługujący lokalizację

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
}
Dodaj style CSS do efektu fade:

css
.fade-enter {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}
Użyj PageTransition w głównym layoucie, aby owinąć strony.

2. Animacje otwierania komponentów (Component Mount Animations)
Przykład z użyciem Framer Motion (React)
Zainstaluj:

bash
npm install framer-motion
W komponencie React:

jsx
import { motion } from "framer-motion";

export default function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* zawartość */}
    </motion.div>
  );
}
3. Animacja tła na każdej stronie za pomocą Babylon.js
Komponent tła Babylon.js
Utwórz dedykowany komponent (np. BgAnimation.jsx lub BgAnimation.svelte), który renderuje pełnoekranowy canvas z animowanym tłem 3D:

tsx
// src/components/BgAnimation.jsx (React)
import { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

export default function BgAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true });
    const scene = new BABYLON.Scene(engine);

    // Minimalne światło i kamera do tła
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Przykład animowanego tła — np. wirujące kule
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 5 }, scene);
    sphere.position.z = 5;

    scene.registerBeforeRender(() => {
      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.002;
    });

    engine.runRenderLoop(() => scene.render());

    window.addEventListener("resize", () => engine.resize());

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        zIndex: "-1",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    />
  );
}
Dodaj <BgAnimation /> w layoucie strony Astro, aby animacja była widoczna na każdej podstronie.

4. Integracja w Astro
Dodaj animowany background w głównym layoucie (np. src/layouts/BaseLayout.astro)

Używaj componentów React do animacji stron i komponentów (lub analogicznie dla Svelte/Vue)

Podsumowanie
Efekty przejść i animacje montowania komponentów warto tworzyć z użyciem gotowych bibliotek (React Transition Group, Framer Motion, Svelte transitions),

Animację tła może zapewnić Babylon.js w dedykowanym komponencie canvas,

Wykorzystując position: fixed i z-index, animacja tła działa niezależnie od zawartości strony,