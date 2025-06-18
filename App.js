import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import Login from "./components/Login";
import Profile from "./components/Profile";
import IntroVideo from "./components/IntroVideo";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Lade User-Daten aus Firestore
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          // Intro Video zeigen nur beim ersten Login
          if (docSnap.data().showIntro !== false) {
            setShowIntro(true);
            await updateDoc(docRef, { showIntro: false });
          } else {
            setShowIntro(false);
          }
        }
        setLoadingUserData(false);
      } else {
        setUserData(null);
        setLoadingUserData(false);
        setShowIntro(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loadingUserData) return <div style={{padding: "20px", color:"#d9903f"}}>Lade...</div>;

  if (!user) return <Login auth={auth} db={db} />;

  return (
    <div className="app-container" style={{padding: "20px", maxWidth: "900px", margin: "auto"}}>
      <button
        onClick={() => signOut(auth)}
        style={{
          backgroundColor: "#d9903f",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          color: "#000",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        Abmelden
      </button>
      {showIntro ? (
        <IntroVideo onFinished={() => setShowIntro(false)} />
      ) : (
        <Profile user={user} userData={userData} db={db} auth={auth} />
      )}
    </div>
  );
}

export default App;
