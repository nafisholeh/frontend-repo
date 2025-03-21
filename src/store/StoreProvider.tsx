'use client';

import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { store } from './store';

/**
 * Store Provider component
 * Provides the Redux store to the application
 */
export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
} 