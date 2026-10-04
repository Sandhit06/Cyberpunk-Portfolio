import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
const Scene = lazy(() => import('./Scene'));
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function App() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  const [hint, setHint] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const onProgress = useCallback((value: number) => setProgress(value), []);
  const onReady = useCallback(() => { setProgress(100); setReady(true); }, []);
  const onError = useCallback(() => setError(true), []);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  useEffect(() => { if (!started) return; const show = setTimeout(() => setHint(true), reduced ? 400 : 4300); const hide = setTimeout(() => setHint(false), 10500); return () => { clearTimeout(show); clearTimeout(hide); }; }, [started, reduced]);
  return <main className={started ? 'experience entered' : 'experience'}>
    <div className="world" role="region" aria-label="An orbitable three-dimensional cyberpunk restaurant, hotel, and netrunner workshop at night. Drag to rotate, scroll or pinch to zoom. Arrow keys orbit; plus and minus zoom; R resets the view.">
      <SceneBoundary onError={onError}><Suspense fallback={null}><Scene started={started} reduced={reduced} onProgress={onProgress} onReady={onReady} onError={onError}/></Suspense></SceneBoundary>
    </div>
    <div className={`entry-screen ${started && !error ? 'entry-screen-hidden' : ''}`} aria-hidden={started && !error}>
      {error ? <div className="error-state"><p>The city couldn’t come online.</p><span>This experience needs WebGL. Try reloading or opening it in a browser with hardware acceleration.</span><button onClick={() => location.reload()}>RETRY</button></div> : ready ? <button className="start-button" onClick={() => setStarted(true)} disabled={started} autoFocus>START</button> : <div className="loading-state" role="status" aria-live="polite">
        <svg className="ramen-loader" viewBox="0 0 160 130" aria-hidden="true"><g className="steam"><path d="M55 49c-13-13 12-17 0-31"/><path d="M79 46c-13-13 12-17 0-31"/><path d="M103 49c-13-13 12-17 0-31"/></g><g className="bowl"><path d="M27 68h106c-4 32-25 45-53 45S31 100 27 68Z"/><path d="M23 63h114"/><path d="M66 117h28"/><path d="m94 59 45-36m-34 39 40-29"/></g></svg>
        <p>Cooking Your Ramen… <span>{progress}%</span></p><div className="load-track" aria-hidden="true"><i style={{ transform: `scaleX(${progress / 100})` }}/></div>
      </div>}
    </div>
    <p className={`gesture-hint ${hint ? 'visible' : ''}`} aria-hidden={!hint}>DRAG TO EXPLORE <span>·</span> SCROLL TO ZOOM <span>·</span> CLICK TO DISCOVER</p>
  </main>;
}
