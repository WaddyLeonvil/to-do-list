import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyC7KYcoSRc11XqfPXat-q87TdMe1DNqLC0',
  authDomain: 'quicktasks-4194f.firebaseapp.com',
  projectId: 'quicktasks-4194f',
  storageBucket: 'quicktasks-4194f.appspot.com',
  messagingSenderId: '695454242256',
  appId: '1:695454242256:web:11641392ca8567cd4cd5d5',
  measurementId: 'G-BBNHY7S4EC',
};

export async function getUserToken() {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    return await currentUser.getIdToken();
  }

  throw new Error('User is not authenticated');
}

export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserInDatabase(userCredential.user);

    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
}

export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
}

export async function signOutOfAccount() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
}

async function saveUserInDatabase(user) {
  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firebase_uid: user.uid,
      email: user.email,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save user in PostgreSQL');
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
