import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { writable } from "svelte/store";
import { db } from "./db";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
};

export function allEqual(string: string) {
  let stringAENew = "";
  for (let i = 0; i < string.length; i++) {
    if (string[0] == string[i]) {
      stringAENew += string[i];
    }
  }
  return stringAENew == string;
}
export async function indexedDBStore<T>(tableName: string, initialValue: () => Promise<T[]>) {
  const table = db.table(tableName);
  // if indexed db has it, use it
  // else, use the initial value and set indexed db
  let value: T[];
  if ((await table.count()) > 0) {
    value = await table.toArray();
  } else {
    value = await initialValue();
    await table.bulkAdd(value);
  }
  const originalStore = writable(value);
  const { subscribe, set, update } = originalStore;

  const reset = async () => {
    await table.clear();
    set(await initialValue());
  };

  subscribe(async (value) => {
    await table.clear();
    await table.bulkAdd(value);
  });

  return { subscribe, set, update, reset };
}

export function anchorSmoothScroll(event: MouseEvent) {
  if (event.defaultPrevented) return;
  const target = event.target as HTMLAnchorElement;
  const hash = target.hash;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (!el) return;
  event.preventDefault();
  el.scrollIntoView({ behavior: "smooth" });
}
