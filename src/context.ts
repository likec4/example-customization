import type { Fqn } from 'likec4/model';
import { createContext, use } from 'react';

/**
 * Context for managing the custom overlay.
 * We keep it in separate file to improve HMR experience.
 */
export const CustomOverlayCtx = createContext({
  visibleElement: null as Fqn | null,
  open: (_fqn: Fqn) => { },
  close: () => { }
} as const)

export const useCustomOverlay = () => use(CustomOverlayCtx)
