import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

/**
 * Firebase configuration
 * Contains the Firebase project settings
 * 
 * To set up your own Firebase project:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select an existing one
 * 3. Add a web app to your project
 * 4. Copy the configuration values provided
 * 5. Create a .env.local file in the project root 
 * 6. Add your Firebase configuration values as environment variables:
 *    - NEXT_PUBLIC_FIREBASE_API_KEY
 *    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *    - NEXT_PUBLIC_FIREBASE_APP_ID
 * 
 * See the README.md for detailed instructions
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-app.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-app',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-app.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456789',
};

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Initialize Firebase
 * Only initialize if we're in the browser or if Firebase hasn't been initialized yet
 * 
 * Note: If you're getting authentication errors, check that your environment variables
 * are set correctly in .env.local
 */
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

// Only initialize Firebase in the browser
if (isBrowser) {
  // Check if Firebase has already been initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize auth
  auth = getAuth(app);
}

export { app, auth };

export default app; 