import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";

const DEFAULT_IMAGE = "/default-profile.png"; // ← Pfad zum Bild im public-Ordner

export default function Profile({ user, userData, db, auth }) {
  const [statusText, setStatusText] = useState(userData.statusText || "");
  const [editingStatus, setEditingStatus] = useState(false);
  const [imageUrl, setImageUrl] = useState(userData.imageUrl || DEFAULT_IMAGE);
  const [imageFile, setImageFile] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const isAdmin = userData.role === "admin";
  const isOwnProfile = user.uid === userData.uid;
  const canEditImage = isOwnProfile || isAdmin;

  // Status-Text speichern
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

  // Bild-Upload (nur wenn eigener Nutzer oder Admin)
  const handleImageChange = (e) => {
    if (!canEditImage) return;
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
      // TODO: Upload in Firebase Storage und URL speichern
      // Zum Beispiel: firebase/storage upload und danach updateDoc
      // Hier nur lokal als Preview
    }
  }, [imageFile]);

  return (
    <div
      style={{
        backgroundColor: "#000",
        borderRadius: 10,
        padding: 20,
        color: "#d9903f",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        maxWidth: 700,
        margin: "auto",
        boxShadow: "0 0 10px rgba(255,165,0,0.2)",
      }}
    >
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ flexShrink: 0, width: 150 }}>
          <label
            htmlFor="imageUpload"
            style={{ cursor: canEditImage ? "pointer" : "default" }}
          >
            <img
              src={imageUrl || DEFAULT_IMAGE}
              alt="Profilbild"
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #d9903f",
                display: "block",
              }}
            />
            {canEditImage && (
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
          <p><strong>Mitgliedsnummer:</strong> {userData.id || "000"}</p>
          <p><strong>Funktion:</strong> {userData.roleName}</p>
          <p><strong>Status:</strong> {userData.level}</p>
          <p><strong>Geburtsdatum:</strong> {userData.birthDate}</p>
          <p><strong>Rechte:</strong> {userData.permissions}</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Status</h3>
        {editingStatus ? (
          <>
            <textarea
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 5,
                fontFamily: "inherit",
              }}
            />
            <button onClick={saveStatusText} disabled={savingStatus}>
              Speichern
            </button>
          </>
        ) : (
          <p
            style={{
              backgroundColor: "#222",
              padding: 10,
              borderRadius: 5,
              cursor: isOwnProfile || isAdmin ? "pointer" : "default",
            }}
            onClick={() => {
              if (isOwnProfile || isAdmin) setEditingStatus(true);
            }}
          >
            {statusText || "Kein Status hinterlegt. (Klicken zum Bearbeiten)"}
          </p>
        )}
        {saveMessage && (
          <p style={{ color: "lime", marginTop: 5 }}>{saveMessage}</p>
        )}
      </div>
    </div>
  );
}
