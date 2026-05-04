import { auth, db, googleProvider } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const authOverlay = document.getElementById('auth-overlay');
const mainApp = document.getElementById('app-container');

export const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("Usuario autenticado:", user.email);
            if (authOverlay) authOverlay.classList.add('hidden');
            if (mainApp) mainApp.classList.remove('hidden');
            await loadUserData(user.uid);
        } else {
            if (authOverlay) authOverlay.classList.remove('hidden');
            if (mainApp) mainApp.classList.add('hidden');
        }
    });
};

export const saveUserData = async (data) => {
    const user = auth.currentUser;
    if (user) {
        try {
            await setDoc(doc(db, "users", user.uid), data, { merge: true });
            alert("Datos sincronizados en la nube");
        } catch (e) {
            console.error("Error guardando:", e);
        }
    }
};

const loadUserData = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (window.updateUIWithData) {
                window.updateUIWithData(data);
            }
        }
    } catch (e) {
        console.error("Error cargando datos:", e);
    }
};

window.loginGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        alert("Error al iniciar sesión con Google: " + error.message);
    }
};

window.logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
};