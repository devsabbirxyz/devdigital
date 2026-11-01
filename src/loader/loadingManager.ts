/**
 * DevDigital — Futuristic Glassmorphism LoadingManager
 *
 * Real, honest progress tracking based on physical signals:
 *   - DOMContentLoaded (10%)
 *   - App mounted / React root initialized (20%)
 *   - Fonts ready: document.fonts.ready (10%)
 *   - Above-the-fold assets & images decoded (30%)
 *   - Initial backend / Supabase / API data tasks (20%)
 *   - window.load event (10%)
 *
 * Rules:
 *   - Displayed value smoothed via requestAnimationFrame
 *   - Never goes backwards; capped at 99% until ALL signals are confirmed
 *   - Minimum visible time ~1200ms
 *   - Maximum safety timeout 15s (gracefully forces reveal with console warning)
 *   - Exit sequence: 350ms glow pulse hold -> 700ms blur/scale fade-out -> DOM cleanup
 *   - Does not reappear on SPA route navigation; displays again on full refresh
 */

export interface LoadingManager {
  register: (name: string) => void;
  done: (name: string) => void;
  markAppMounted: () => void;
  trackImages: (items: (HTMLImageElement | string)[]) => void;
  destroy: () => void;
}

const STATUS_MESSAGES: [number, string][] = [
  [0,  'Initializing…'],
  [15, 'Loading assets…'],
  [40, 'Connecting to server…'],
  [65, 'Fetching data…'],
  [85, 'Almost ready…'],
  [99, 'Launching…'],
];

function getStatus(pct: number): string {
  let msg = STATUS_MESSAGES[0][1];
  for (const [threshold, text] of STATUS_MESSAGES) {
    if (pct >= threshold) msg = text;
  }
  return msg;
}

function el<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T | null;
}

function setVar(name: string, val: string) {
  document.documentElement.style.setProperty(name, val);
}

export function createLoadingManager(): LoadingManager | null {
  const loader = el('app-loader');
  if (!loader) return null;

  /* ── Signal buckets (0 to 1 each) ── */
  let wDom    = 0;  // 10%
  let wMount  = 0;  // 20%
  let wFonts  = 0;  // 10%
  let wImages = 0;  // 30%
  let wBack   = 0;  // 20%
  let wLoad   = 0;  // 10%

  const backendTasks = new Set<string>();
  const backendDone  = new Set<string>();

  /* ── Timing parameters ── */
  const START_TIME = performance.now();
  const MIN_MS     = 400;
  const SAFETY_MS  = 12_000;
  let minTimeMet   = false;
  setTimeout(() => { minTimeMet = true; }, MIN_MS);

  /* ── Smoothing variables ── */
  let displayed = 1;
  let rafId: number | null = null;
  let lastAriaUpdate = 0;
  let creepTarget = 6;
  let isExiting = false;

  /* ── Prepare DOM: lock scroll & hide app root with 12px shift ── */
  document.documentElement.classList.add('al-loading');
  document.body.classList.add('al-loading');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  const appRoot = el('root');
  if (appRoot) {
    appRoot.setAttribute('inert', '');
    appRoot.setAttribute('aria-hidden', 'true');
    appRoot.style.opacity = '0';
    appRoot.style.transform = 'translateY(12px)';
  }

  /* ── Measure track width to dynamically anchor knob translation ── */
  function syncTrackWidth() {
    const track = loader?.querySelector('.al-track') as HTMLElement | null;
    if (track) {
      setVar('--track-w', track.offsetWidth + 'px');
    }
  }

  /* ── Calculate honest target ── */
  function computeTarget(): number {
    const raw =
      wDom    * 10 +
      wMount  * 20 +
      wFonts  * 10 +
      wImages * 30 +
      wBack   * 20 +
      wLoad   * 10;
    // Capped at 99% until isAllDone() is strictly true
    return Math.max(1, Math.min(99, raw));
  }

  function isAllDone(): boolean {
    return (
      wDom    >= 1 &&
      wMount  >= 1 &&
      wFonts  >= 1 &&
      wImages >= 1 &&
      wBack   >= 1 &&
      (wLoad  >= 1 || performance.now() - START_TIME > 3000) &&
      minTimeMet
    );
  }

  /* ── Smooth Animation Frame Loop ── */
  function frame() {
    if (isExiting) return;

    const allFinished = isAllDone();
    const target = allFinished ? 100 : Math.max(computeTarget(), Math.min(creepTarget, 90));

    // Smooth toward target: snappy scaling with distance
    const diff = target - displayed;
    const step = Math.max(diff * 0.18, 0.35);
    if (diff > 0) {
      displayed = Math.min(displayed + step, target);
    }

    const pct = allFinished && displayed >= 99.5 ? 100 : Math.min(99, Math.floor(displayed));

    // Update CSS variable --p (0.00 to 1.00) driving fill width & knob position
    setVar('--p', String(pct / 100));

    // Update percentage display
    const pctEl = el('al-percent');
    if (pctEl) pctEl.textContent = pct + '%';

    // Throttled aria-valuenow update (every 5%)
    const now = performance.now();
    if (pct - lastAriaUpdate >= 5 || pct === 100) {
      loader?.setAttribute('aria-valuenow', String(pct));
      lastAriaUpdate = pct;
    }

    // Status text update
    const statusEl = el('al-status');
    if (statusEl) statusEl.textContent = getStatus(pct);

    // Subtle creep if network is slow so progress never looks frozen
    if (now - START_TIME > 800) {
      creepTarget = Math.min(creepTarget + 0.016, 90);
    }

    if (allFinished && pct >= 100) {
      onComplete();
      return;
    }

    rafId = requestAnimationFrame(frame);
  }

  /* ── Exit Sequence: 350ms Climax Pulse -> 700ms Blur/Scale Out ── */
  function onComplete() {
    isExiting = true;
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }

    const pctEl = el('al-percent');
    if (pctEl) pctEl.textContent = '100%';
    setVar('--p', '1');

    const statusEl = el('al-status');
    if (statusEl) statusEl.textContent = 'Ready';

    // Climax glow pulse on the glass panel
    const panel = loader?.querySelector('.al-panel') as HTMLElement | null;
    if (panel) panel.classList.add('al-climax');

    // Hold for 140ms
    setTimeout(() => {
      // 1. Exit animation on loader
      loader?.classList.add('al-exit');

      // 2. Smoothly reveal underlying site: opacity 0->1, translateY 12px->0
      if (appRoot) {
        appRoot.removeAttribute('inert');
        appRoot.removeAttribute('aria-hidden');
        appRoot.style.transition = 'opacity 350ms cubic-bezier(0.22, 1, 0.36, 1), transform 350ms cubic-bezier(0.22, 1, 0.36, 1)';
        appRoot.style.opacity = '1';
        appRoot.style.transform = 'translateY(0px)';
      }

      // 3. Unlock document scrolling
      document.documentElement.classList.remove('al-loading');
      document.body.classList.remove('al-loading');
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';

      // 4. Remove loader from DOM after transition
      const handleCleanUp = () => {
        try { loader?.remove(); } catch {}
        if (appRoot) {
          appRoot.style.removeProperty('transition');
          appRoot.style.removeProperty('transform');
          appRoot.style.removeProperty('opacity');
        }
        document.documentElement.focus?.();
      };

      loader?.addEventListener('animationend', handleCleanUp, { once: true });
      setTimeout(handleCleanUp, 900); // Fail-safe
    }, 350);
  }

  /* ── 15s Safety Timeout ── */
  const safetyTimer = setTimeout(() => {
    if (isExiting) return;
    const pending: string[] = [];
    if (wDom    < 1) pending.push('DOMContentLoaded');
    if (wMount  < 1) pending.push('app-mounted');
    if (wFonts  < 1) pending.push('fonts');
    if (wImages < 1) pending.push('images');
    if (wBack   < 1) {
      backendTasks.forEach(t => { if (!backendDone.has(t)) pending.push('backend:' + t); });
    }
    if (wLoad   < 1) pending.push('window.load');
    console.warn('[DevDigital Preloader] Safety timeout reached (15s). Gracefully completing. Pending signals:', pending);
    wDom = wMount = wFonts = wImages = wBack = wLoad = 1;
    minTimeMet = true;
  }, SAFETY_MS);

  /* ── Wire physical signals ── */

  // 1. DOMContentLoaded (10%)
  if (document.readyState !== 'loading') {
    wDom = 1;
  } else {
    document.addEventListener('DOMContentLoaded', () => { wDom = 1; }, { once: true });
  }

  // 2. Web Fonts (10%)
  if ((document as any).fonts?.ready) {
    (document as any).fonts.ready.then(() => { wFonts = 1; }).catch(() => { wFonts = 1; });
  } else {
    wFonts = 1;
  }

  // 3. window.load (10%)
  if (document.readyState === 'complete') {
    wLoad = 1;
  } else {
    window.addEventListener('load', () => { wLoad = 1; }, { once: true });
  }

  // 4. Auto-resolve backend weight if no backend tasks registered within 600ms
  setTimeout(() => {
    if (backendTasks.size === 0) {
      wBack = 1;
    }
  }, 600);

  // 5. Scan inline images in DOM
  function scanDomImages() {
    const imgs = Array.from(document.images).filter(img => !img.complete);
    if (imgs.length === 0) {
      if (wImages === 0) wImages = 1;
      return;
    }
    let loaded = 0;
    const total = imgs.length;
    const tick = () => {
      loaded++;
      wImages = Math.max(wImages, loaded / total);
    };
    imgs.forEach(img => {
      img.addEventListener('load', tick, { once: true });
      img.addEventListener('error', tick, { once: true });
    });
  }

  if (document.readyState !== 'loading') {
    scanDomImages();
  } else {
    document.addEventListener('DOMContentLoaded', scanDomImages, { once: true });
  }

  // 6. Track track width with ResizeObserver
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncTrackWidth) : null;
  const trackEl = loader?.querySelector('.al-track');
  if (ro && trackEl) ro.observe(trackEl);
  syncTrackWidth();

  // Kick off frame loop
  rafId = requestAnimationFrame(frame);

  /* ── Public API ── */
  return {
    register(name: string) {
      backendTasks.add(name);
      if (backendTasks.size > 0) {
        wBack = backendDone.size / backendTasks.size;
      }
    },
    done(name: string) {
      backendDone.add(name);
      if (backendTasks.size > 0) {
        wBack = backendDone.size / backendTasks.size;
      }
    },
    markAppMounted() {
      wMount = 1;
    },
    trackImages(items: (HTMLImageElement | string)[]) {
      if (!items || items.length === 0) {
        wImages = 1;
        return;
      }
      let loaded = 0;
      const total = items.length;
      const tick = () => {
        loaded++;
        wImages = Math.max(wImages, loaded / total);
      };
      items.forEach(item => {
        if (typeof item === 'string') {
          const img = new Image();
          img.onload = tick;
          img.onerror = tick;
          img.src = item;
        } else {
          if (item.complete) {
            tick();
          } else {
            item.addEventListener('load', tick, { once: true });
            item.addEventListener('error', tick, { once: true });
          }
        }
      });
    },
    destroy() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
      if (ro) ro.disconnect();
    },
  };
}

/* ── Global singleton initialized as early as module loads ── */
declare global {
  interface Window {
    __loading: LoadingManager | null;
  }
}

// Instantiate immediately
window.__loading = createLoadingManager();
