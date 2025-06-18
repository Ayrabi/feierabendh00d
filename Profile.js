import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import ProfileMenu from "./ProfileMenu";

const DEFAULT_IMAGE = "https://via.placeholder.com/100?text=Profilbild";

export default function Profile({ user, userData, db, auth }) {
  const [statusText, setStatusText] = useState(userData.statusText || "");
  const [editingStatus, setEditingStatus] = useState(false);
  const [imageUrl, setImageUrl] = useState(userData.imageUrl || DEFAULT_IMAGE);
  const [imageFile, setImageFile] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const isAdmin = userData.role === "admin";
  const isOwnProfile = user.uid === userData.uid;

  // Status speichern
  const saveStatusText = async () => {
    setSavingStatus(true);
    try {
      const profileRef = doc(db, "profiles", user.uid);
      await updateDoc(profileRef, { statusText });
      setSaveMessage("Status erfolgreich gespeichert");
    } catch (error) {
      setSaveMessage("Fehler beim Speichern");
    }
    setSavingStatus(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // Profilbild bearbeiten (nur eigenes oder Admin)
  const handleImageChange = (e) => {
    if (!isOwnProfile && !isAdmin) return;
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (imageFile) {
      // Bild hochladen in Firebase Storage (optional)
    }
  }, [imageFile]);

  return (
    <div
      style={{
        backgroundColor: "#111",
        borderRadius: 10,
        padding: 20,
        color: "#d9903f",
        maxWidth: 700,
        margin: "auto",
        position: "relative",
      }}
    >
      <ProfileMenu user={user} userData={userData} />

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ flexShrink: 0, width: 100 }}>
          <label
            htmlFor="imageUpload"
            style={{ cursor: isOwnProfile || isAdmin ? "pointer" : "default" }}
          >
            <img
              src={imageUrl}
              alt="Profilbild"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #d9903f",
              }}
            />
            {(isOwnProfile || isAdmin) && (
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            )}
          </label>
        </div>

        <div style={{ flex: 1 }}>
          <h2>{userData.name}</h2>
          <p><strong>Mitgliedsnummer:</strong> {userData.mitgliedsnummer}</p>
          <p><strong>Funktion:</strong> {userData.funktion}</p>
          <p><strong>Status:</strong> {userData.status}</p>
          <p><strong>Geburtsdatum:</strong> {userData.geburtsdatum}</p>
          <p><strong>Rechte:</strong> {userData.rechte}</p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {editingStatus ? (
          <>
            <textarea
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />
            <button onClick={saveStatusText} disabled={savingStatus}>
              Speichern
            </button>
          </>
        ) : (
          <>
            <p><strong>Statusnachricht:</strong> {statusText}</p>
            {(isOwnProfile || isAdmin) && (
              <button onClick={() => setEditingStatus(true)}>
                Status bearbeiten
              </button>
            )}
          </>
        )}
        {saveMessage && <p>{saveMessage}</p>}
      </div>
    </div>
  );
}
