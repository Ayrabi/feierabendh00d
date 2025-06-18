import React, { useState } from "react";
import { updatePassword } from "firebase/auth";

export default function SettingsPage({ user, userData, auth, navigate }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const isAdmin = userData.role === "admin";

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwörter stimmen nicht überein.");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage("Passwort erfolgreich geändert.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("Fehler beim Ändern des Passworts: " + error.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "#d9903f",
        padding: 20,
        borderRadius: 10,
        maxWidth: 500,
        margin: "auto",
        marginTop: 40,
      }}
    >
      <h2 style={{ textAlign: "center" }}>Einstellungen</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Neues Passwort:</label>
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <label>Passwort bestätigen:</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <div style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            id="showPw"
          />
          <label htmlFor="showPw" style={{ marginLeft: 5 }}>
            Passwort anzeigen
          </label>
        </div>
        <button onClick={handleChangePassword}>Passwort ändern</button>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>

      {isAdmin && (
        <div style={{ borderTop: "1px solid #444", paddingTop: 20 }}>
          <h3>Admin-Bereich</h3>
          <button onClick={() => navigate("/create-profile")} style={{ marginBottom: 10 }}>
            Neues Profil erstellen
          </button>
          <br />
          <button
            onClick={() => navigate("/delete-profile")}
            style={{ backgroundColor: "#600", color: "#fff" }}
          >
            Profile löschen
          </button>
        </div>
      )}
    </div>
  );
}
