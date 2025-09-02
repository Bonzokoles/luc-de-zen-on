1. Animacja tła Babylon.js na każdej podstronie
Utwórz komponent src/components/BgAnimation.jsx (React):

jsx
import { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

export default function BgAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);

    const torus = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 8, thickness: 0.5 }, scene);

    scene.registerBeforeRender(() => {
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;
    });

    engine.runRenderLoop(() => scene.render());

    window.addEventListener('resize', () => engine.resize());

    return () => engine.dispose();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
    />
  );
}
2. Włączenie animacji tła w layoucie strony (np. src/layouts/BaseLayout.astro)
text
---
import BgAnimation from '../components/BgAnimation.jsx';
---

<html>
  <head>
    <title>Odzyskana strona</title>
    <!-- meta, style itp... -->
  </head>
  <body>
    <BgAnimation />
    <slot /> <!-- tutaj będzie zawartość strony -->
  </body>
</html>
3. Prosty efekt przejścia stron (Fade)
Dodaj do globalnego CSS np. src/styles/global.css:

css
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease, transform 300ms ease;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 300ms ease;
}
4. Obsługa przejść stron w React (jeśli Twój projekt używa React)
jsx
// src/components/PageTransition.jsx
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default function PageTransition({ children, locationKey }) {
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={locationKey} classNames="page" timeout={300}>
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
}
I owinąć główny router lub layout React komponentem PageTransition.

5. Animacje montowania komponentów
W każdym komponencie React używaj np. framer-motion lub proste transicje CSS, np.:

jsx
import { motion } from 'framer-motion';

export default function MyComponent() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* content */}
    </motion.div>
  );
}
Podsumowanie
Dodaj komponent BgAnimation do layoutu, by mieć animowane tło na każdej stronie,

Użyj prostych efektów CSS i React Transition Group do przejść stron i montowania komponentów,

To lekkie rozszerzenie bez ingerencji w Twoje odzyskane pliki i pozwala na łatwe wzbogacenie interakcji.

Jeśli projekt nie używa React, mogę pomóc stworzyć alternatywną wersję dla Svelte lub czystego JavaScript.