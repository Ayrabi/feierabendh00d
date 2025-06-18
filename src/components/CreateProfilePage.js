import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";

export default function CreateProfilePage({ db }) {
  const [formData, setFormData] = useState({
    name: "",
    mitgliedsnummer: "",
    funktion: "",
    status: "",
    geburtsdatum: "",
    rechte: "",
    email: "",
    role: "user", // oder "admin"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "profiles"), formData);
      setMessage("Profil erfolgreich erstellt.");
      setFormData({
        name: "",
        mitgliedsnummer: "",
        funktion: "",
        status: "",
        geburtsdatum: "",
        rechte: "",
        email: "",
        role: "user",
      });
    } catch (error) {
      setMessage("Fehler beim Erstellen: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-[#d9903f]">
      <h2 className="text-xl font-bold mb-4">Neues Profil erstellen</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="p-2 rounded bg-[#222] border border-[#444] text-white"
          />
        ))}
        <button
          type="submit"
          className="bg-[#d9903f] text-black py-2 rounded hover:opacity-90"
        >
          Profil speichern
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
