// ============================================================
// Selector de cliente: API real (PHP/MySQL) o mock en memoria.
//
//  - Por defecto usa la API real.
//  - Para volver al mock (sin backend), pon en tu archivo .env:
//        VITE_USE_MOCK=true
// ============================================================

import { base44 as realApi } from './apiClient';
import { base44 as mockApi } from './mockData';

const useMock = String(import.meta.env.VITE_USE_MOCK).toLowerCase() === 'true';

export const base44 = useMock ? mockApi : realApi;

if (useMock) {
  // eslint-disable-next-line no-console
  console.info('[Mundo Animalia] Usando datos MOCK (VITE_USE_MOCK=true)');
}
