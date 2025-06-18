import React, { useState } from "react";

export default function Login({ auth, db }) {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  // Admin E-Mail (hartkodiert) – anpassen!
  const adminEmail = "admin@feierabendhood.de";

  const toggleMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isAdminLogin) {
        // Admin Login
        if (email !== adminEmail) {
          setError("Nur Admin darf sich hier anmelden.");
          return;
        }
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        // Nutzer Login
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <img
        src="https://media.discordapp.net/attachments/894677276531253312/1383887420742963392/83DB8580-94B3-4CD2-9881-99C2E09ED7C2.png"
        alt="Logo"
        style={{ width: 150, marginBottom: 20 }}
      />
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: 15 }}>{isAdminLogin ? "Admin Login" : "Nutzer Login"}</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div style={{ position: "relative", marginBottom: 15 }}>
          <input
            style={styles.input}
            type={passwordVisible ? "text" : "password"}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            style={styles.pwToggle}
          >
            {passwordVisible ? "🙈" : "👁️"}
          </button>
        </div>

        <button style={styles.button} type="submit">
          Einloggen
        </button>

        <button
          type="button"
          onClick={toggleMode}
          style={{ ...styles.button, backgroundColor: "#444", marginTop: 10 }}
        >
          {isAdminLogin ? "Zum Nutzer Login" : "Zum Admin Login"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 350,
    margin: "80px auto",
    padding: 20,
    backgroundColor: "#111",
    borderRadius: 10,
    boxShadow: "0 0 10px #d9903f",
    color: "#d9903f",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    fontSize: "1em",
    borderRadius: 5,
    border: "none",
    marginBottom: 10,
  },
  button: {
    padding: "10px",
    fontSize: "1em",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#d9903f",
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold",
  },
  pwToggle: {
    position: "absolute",
    right: 10,
    top: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    color: "#d9903f",
  },
};
