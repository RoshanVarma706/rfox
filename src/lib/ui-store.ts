import { useSyncExternalStore } from "react";

type Toast = { id: number; text: string };
type UIState = { cartOpen: boolean; toast: Toast | null };

let uiState: UIState = { cartOpen: false, toast: null };
const listeners = new Set<() => void>();
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function emit() {
  listeners.forEach((listener) => listener());
}

function patch(next: Partial<UIState>) {
  uiState = { ...uiState, ...next };
  emit();
}

export function useUI() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => uiState,
    () => uiState,
  );
}

export function openCart() {
  patch({ cartOpen: true });
}

export function closeCart() {
  patch({ cartOpen: false });
}

export function notify(text: string) {
  const toast = { id: Date.now(), text };
  patch({ toast });
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => patch({ toast: null }), 2600);
}
