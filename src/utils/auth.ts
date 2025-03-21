import type { User as FirebaseUser } from 'firebase/auth';

/**
 * Serializes a Firebase user object for use in Redux state
 * This prevents the "non-serializable value detected" error
 * 
 * @param user - Firebase user object
 * @returns A serialized version of the user with only serializable properties
 */
export const serializeUser = (user: FirebaseUser | null) => {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
    isAnonymous: user.isAnonymous,
    metadata: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    }
  };
}; 