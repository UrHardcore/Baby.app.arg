/* ========================================
   Mi Baby ARG - Firebase Configuration
   ======================================== */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyD3x8BNAUe-dt-qbb-XnEOFK6SqACNFjL8",
  authDomain: "mi-baby-arg.firebaseapp.com",
  projectId: "mi-baby-arg",
  storageBucket: "mi-baby-arg.firebasestorage.app",
  messagingSenderId: "46383256954",
  appId: "1:46383256954:web:1aa0d9f652b907a27ef2c3",
  measurementId: "G-W0NPXVWE2D"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Objeto Global para Autenticación
window.FirebaseAuth = {
  auth,
  currentUser: null,

  async register(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      displayName,
      created: Date.now()
    });
    this.currentUser = cred.user;
    return cred.user;
  },

  async login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    this.currentUser = cred.user;
    return cred.user;
  },

  async loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = cred.user;
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || '',
        created: Date.now()
      });
    }
    this.currentUser = user;
    return user;
  },

  async logout() {
    await signOut(auth);
    this.currentUser = null;
  },

  onAuthChanged(callback) {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      callback(user);
    });
  },

  getUid() {
    return this.currentUser ? this.currentUser.uid : (auth.currentUser ? auth.currentUser.uid : null);
  }
};

// Objeto Global para Base de Datos (Firestore)
window.FirebaseDB = {
  async getUserData(uid) {
    if (!uid) return null;
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  },

  async saveUserData(uid, data) {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  },

  async getBabyProfile(uid) {
    if (!uid) return null;
    const snap = await getDoc(doc(db, 'babyProfiles', uid));
    return snap.exists() ? snap.data() : null;
  },

  async saveBabyProfile(uid, profile) {
    if (!uid) return;
    await setDoc(doc(db, 'babyProfiles', uid), profile, { merge: true });
  },

  async getAppData(uid) {
    if (!uid) return {};
    const snap = await getDoc(doc(db, 'appData', uid));
    return snap.exists() ? snap.data() : {};
  },

  async saveAppData(uid, data) {
    if (!uid) return;
    await setDoc(doc(db, 'appData', uid), data, { merge: true });
  }
};

// Avisar al sistema que Firebase está listo
window.firebaseReady = true;
document.dispatchEvent(new Event('firebase-ready'));
