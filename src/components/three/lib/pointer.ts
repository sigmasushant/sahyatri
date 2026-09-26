/**
 * Shared, allocation-free pointer position in [-1, 1] across the viewport.
 * Scenes read it every frame; only fine pointers (mouse, trackpad) move it.
 */
export const pointer = { x: 0, y: 0 };

let attached = false;

export function attachPointer() {
  if (attached || typeof window === 'undefined') return;
  attached = true;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true },
  );
}
