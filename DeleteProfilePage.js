import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function DeleteProfilePage({ db }) {
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      const snapshot = await getDocs(collection(db, "profiles"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProfiles(data);
    };
    fetchProfiles();
  }, [db]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "profiles", id));
      setProfiles(profiles.filter((p) => p.id !== id));
      setMessage("Profil erfolgreich gelöscht.");
    } catch (error) {
      setMessage("Fehler beim Löschen: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-[#d9903f]">
      <h2 className="text-xl font-bold mb-4">Profile löschen</h2>
      {message && <p className="mb-2">{message}</p>}
      <ul className="space-y-2">
        {profiles.map((profile) => (
          <li
            key={profile.id}
            className="flex justify-between items-center bg-[#222] p-3 rounded"
          >
            <span>{profile.name || profile.email}</span>
            <button
              onClick={() => handleDelete(profile.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
