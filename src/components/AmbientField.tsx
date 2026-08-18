import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A continuous colour field advected like a fluid.
 *
 * Rather than translating discrete shapes, this simulates dye carried through a
 * divergence-free velocity field: pointer motion injects both dye and momentum,
 * and a slow curl flow keeps the field moving on its own. The result stretches,
 * folds and blends as one surface — there are no individual blobs to perceive,
 * and nothing is anchored to the cursor.
 *
 * Runs on a small grid and is scaled up under a heavy blur, so the cost is a few
 * thousand cells per frame rather than a shader.
 *
 * Belongs to the landing only. Once the conversation starts this unmounts and
 * the simulation loop stops entirely, leaving a plain, calm background.
 */

const GRID_W = 208;
const GRID_H = 120;
const CELLS = GRID_W * GRID_H;

/** Warm identity palette; one dye channel each. */
const DYE_COLORS = [
  [130, 196, 255], // soft blue
  [178, 150, 255], // violet
  [255, 150, 196], // pink
  [140, 232, 196], // mint
  [255, 190, 150], // peach
];
const CHANNELS = DYE_COLORS.length;


const DISSIPATION = 0.9975;
const FLOW_SPEED = 0.95;
const REPLENISH = 0.005;

export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || shouldReduceMotion) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = GRID_W;
    canvas.height = GRID_H;

    const dye = Array.from({ length: CHANNELS }, () => new Float32Array(CELLS));
    const next = Array.from({ length: CHANNELS }, () => new Float32Array(CELLS));
    // Barely-there resting film. The reference keeps its centre clean paper and
    // lets the ribbon live where the pointer has actually been.
    const base = Array.from({ length: CHANNELS }, () => new Float32Array(CELLS));
    const image = ctx.createImageData(GRID_W, GRID_H);

    // Seed a soft resting distribution so the field is never empty.
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const i = y * GRID_W + x;
        const u = x / GRID_W;
        const v = y / GRID_H;
        // A wide, faint wreath around the edges — clean through the middle.
        const edge = Math.max(0, Math.hypot((u - 0.5) * 1.25, v - 0.5) - 0.2);
        for (let c = 0; c < CHANNELS; c++) {
          const ang = (c / CHANNELS) * Math.PI * 2;
          const lobe = Math.max(
            0,
            0.5 - Math.hypot(u - (0.5 + Math.cos(ang) * 0.42), v - (0.5 + Math.sin(ang) * 0.42)) * 1.5,
          );
          base[c][i] = lobe * Math.min(1, edge * 3.2) * 0.95;
          dye[c][i] = base[c][i];
        }
      }
    }

    // Raw pointer target, the smoothed point that chases it, and the last point
    // dye was laid at — injection interpolates between the last two so a stroke
    // is continuous rather than a dab per frame.
    let pointerX = 0.5;
    let pointerY = 0.4;
    let prevX = 0.5;
    let prevY = 0.4;
    let inkX = 0.5;
    let inkY = 0.4;
    let velX = 0;
    let velY = 0;
    let hasPointer = false;

    const fine = window.matchMedia("(pointer: fine)").matches;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // Coalesced events carry the samples the browser batched into this frame,
      // so the real path is used instead of only its endpoint.
      const events = event.getCoalescedEvents?.() ?? [];
      const latest = events.length ? events[events.length - 1] : event;
      pointerX = latest.clientX / window.innerWidth;
      pointerY = latest.clientY / window.innerHeight;
      hasPointer = true;
    };

    /** Curl of a scalar potential → divergence-free, so the field swirls. */
    const flowAt = (x: number, y: number, t: number, out: [number, number]) => {
      const s = 2.4;
      const a = Math.sin(x * s + t * 0.22) * Math.cos(y * s * 0.8 - t * 0.17);
      const b = Math.sin(x * s * 0.6 - t * 0.13) * Math.cos(y * s * 1.3 + t * 0.19);
      out[0] = (Math.cos(y * s * 0.8 - t * 0.17) * a + b) * 0.6;
      out[1] = -(Math.cos(x * s + t * 0.22) * a - b) * 0.6;
    };

    const sample = (field: Float32Array, x: number, y: number) => {
      const cx = Math.min(GRID_W - 1.001, Math.max(0, x));
      const cy = Math.min(GRID_H - 1.001, Math.max(0, y));
      const x0 = cx | 0;
      const y0 = cy | 0;
      const fx = cx - x0;
      const fy = cy - y0;
      const i00 = y0 * GRID_W + x0;
      const i10 = i00 + 1;
      const i01 = i00 + GRID_W;
      const i11 = i01 + 1;
      const top = field[i00] * (1 - fx) + field[i10] * fx;
      const bot = field[i01] * (1 - fx) + field[i11] * fx;
      return top * (1 - fy) + bot * fy;
    };

    let raf = 0;
    let last = performance.now();
    const startedAt = last;
    const flow: [number, number] = [0, 0];

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - startedAt) / 1000;

      // Frame-rate independent smoothing. Per-frame constants would run twice as
      // fast at 120Hz as at 60Hz and hitch whenever a frame is dropped, which
      // reads as jitter; an exponential converging on dt does not.
      const chase = 1 - Math.exp(-11 * dt);
      const decay = Math.exp(-2.6 * dt);

      const dx = pointerX - prevX;
      const dy = pointerY - prevY;
      prevX += dx * chase;
      prevY += dy * chase;

      // Velocity is built from the smoothed point and clamped, so one large
      // pointer jump cannot burst the field.
      const vScale = dt > 0 ? Math.min(1, 0.016 / dt) : 1;
      velX = velX * decay + dx * chase * 9 * vScale;
      velY = velY * decay + dy * chase * 9 * vScale;
      const vMag = Math.hypot(velX, velY);
      if (vMag > 1.4) {
        velX = (velX / vMag) * 1.4;
        velY = (velY / vMag) * 1.4;
      }

      const px = prevX * GRID_W;
      const py = prevY * GRID_H;
      const speed = Math.min(1, vMag);

      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          const i = y * GRID_W + x;
          flowAt(x / GRID_W, y / GRID_H, t, flow);
          let fx = flow[0] * FLOW_SPEED;
          let fy = flow[1] * FLOW_SPEED;

          // Momentum falls off smoothly with distance — an impulse in the flow,
          // not a shape drawn at the cursor.
          const rx = (x - px) / GRID_W;
          const ry = (y - py) / GRID_H;
          const influence = Math.exp(-(rx * rx + ry * ry) * 26);
          fx += velX * influence * 3.1;
          fy += velY * influence * 3.1;

          const sx = x - fx * dt * GRID_W * 0.9;
          const sy = y - fy * dt * GRID_H * 0.9;

          for (let c = 0; c < CHANNELS; c++) {
            const advected = sample(dye[c], sx, sy) * DISSIPATION;
            // Gentle pull back toward rest keeps the field alive indefinitely
            // without it ever flattening into a static image.
            next[c][i] = advected + (base[c][i] - advected) * REPLENISH;
          }
        }
      }

      for (let c = 0; c < CHANNELS; c++) dye[c].set(next[c]);

      // Lay dye along the path travelled since the previous frame rather than at
      // a single point, so fast sweeps draw a continuous ribbon instead of
      // separate dabs. Colour is chosen by a slow time function — cycling the
      // channel per frame made the dye flip hue at refresh rate, which was the
      // visible flicker.
      if (hasPointer && fine) {
        const fromX = inkX * GRID_W;
        const fromY = inkY * GRID_H;
        const dist = Math.hypot(px - fromX, py - fromY);

        if (dist > 0.01 || speed > 0.02) {
          const steps = Math.max(1, Math.min(48, Math.ceil(dist / 1.1)));
          const amount = Math.min(2.0, speed * 6.5) / steps;

          // Slowly rotating colour weights — a smooth blend, never a hard switch.
          const phase = t * 0.5;
          const w: number[] = [];
          let wSum = 0;
          for (let c = 0; c < CHANNELS; c++) {
            // Narrow lobes so one or two hues dominate at a time — averaging all
            // of them together is what turns a ribbon into grey mud.
            const lobe = Math.pow(
              Math.max(0, Math.cos(phase - (c / CHANNELS) * Math.PI * 2)),
              3,
            );
            w.push(lobe + 0.04);
            wSum += w[c];
          }

          const radius = 10;
          for (let sIdx = 1; sIdx <= steps; sIdx++) {
            const k = sIdx / steps;
            const cxp = fromX + (px - fromX) * k;
            const cyp = fromY + (py - fromY) * k;
            const bx = Math.floor(cxp);
            const by = Math.floor(cyp);
            const fracX = cxp - bx;
            const fracY = cyp - by;

            for (let oy = -radius; oy <= radius; oy++) {
              for (let ox = -radius; ox <= radius; ox++) {
                const gx = bx + ox;
                const gy = by + oy;
                if (gx < 0 || gy < 0 || gx >= GRID_W || gy >= GRID_H) continue;
                // Distance measured from the true sub-cell position, so motion
                // between cells is continuous instead of snapping.
                const ddx = ox - fracX;
                const ddy = oy - fracY;
                const falloff = Math.exp(-(ddx * ddx + ddy * ddy) / 16);
                if (falloff < 0.004) continue;
                const idx = gy * GRID_W + gx;
                const add = amount * falloff;
                for (let c = 0; c < CHANNELS; c++) {
                  const cell = dye[c][idx] + (add * w[c]) / wSum;
                  dye[c][idx] = cell > 1.25 ? 1.25 : cell;
                }
              }
            }
          }
        }
        inkX = prevX;
        inkY = prevY;
      }

      const data = image.data;
      for (let i = 0; i < CELLS; i++) {
        let total = 0;
        let dominant = 0;
        for (let c = 0; c < CHANNELS; c++) {
          const v = dye[c][i];
          total += v;
          if (v > dominant) dominant = v;
        }
        const p = i * 4;
        if (total <= 0.004) {
          data[p + 3] = 0;
          continue;
        }

        // Weight by density squared: the strongest hue keeps its identity and
        // neighbours tint it, rather than every channel averaging to grey.
        let r = 0;
        let g = 0;
        let b = 0;
        let wSum = 0;
        for (let c = 0; c < CHANNELS; c++) {
          const v = dye[c][i];
          if (v <= 0.002) continue;
          const w = v * v;
          r += DYE_COLORS[c][0] * w;
          g += DYE_COLORS[c][1] * w;
          b += DYE_COLORS[c][2] * w;
          wSum += w;
        }
        r /= wSum;
        g /= wSum;
        b /= wSum;

        // Dense cores lift toward white — light concentrating, not paint pooling.
        const core = Math.min(1, Math.max(0, (dominant - 0.9) * 0.7));
        r += (255 - r) * core * 0.5;
        g += (255 - g) * core * 0.5;
        b += (255 - b) * core * 0.5;

        data[p] = Math.min(255, r);
        data[p + 1] = Math.min(255, g);
        data[p + 2] = Math.min(255, b);
        data[p + 3] = Math.min(232, 255 * (1 - Math.exp(-total * 1.5)));
      }
      ctx.putImageData(image, 0, 0);

      raf = window.requestAnimationFrame(tick);
    };

    if (fine) window.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(raf);
    };
  }, [shouldReduceMotion]);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: shouldReduceMotion ? 0.2 : 1.1, ease: [0.22, 1, 0.36, 1] },
      }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {shouldReduceMotion ? (
        /* Static wash: the colour stays, the motion does not. */
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 45% at 28% 32%, color-mix(in srgb, var(--color-glow) 13%, transparent), transparent 70%)," +
              "radial-gradient(50% 55% at 76% 40%, color-mix(in srgb, var(--color-tone-professional) 10%, transparent), transparent 70%)",
          }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            // Upscaling the small grid under blur is what turns discrete cells
            // into one continuous surface.
            filter: "blur(11px) saturate(126%) brightness(1.03)",
            transform: "scale(1.06)",
            opacity: 0.92,
          }}
        />
      )}
    </motion.div>
  );
}
