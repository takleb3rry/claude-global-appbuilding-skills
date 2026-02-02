/**
 * MSW Browser Setup
 *
 * For Storybook and browser-based development.
 * Enables API mocking in the browser.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// ============================================
// BROWSER INITIALIZATION
// ============================================

/*
// In your app's entry point (main.tsx or similar):

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  });
}

enableMocking().then(() => {
  // Render your app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
*/

// ============================================
// STORYBOOK SETUP
// ============================================

/*
// In .storybook/preview.ts:

import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '../src/mocks/handlers';

initialize();

export const loaders = [mswLoader];

export const parameters = {
  msw: {
    handlers,
  },
};
*/
