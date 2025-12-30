"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setError("");

    const email = `${username.split('@')[0].trim().toLowerCase()}@jar.edu`;

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redirect handled by onAuthStateChanged
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este usuario ya está registrado.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Usuario o contraseña incorrectos.");
      } else if (err.code === 'auth/weak-password') {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Ocurrió un error: " + err.message);
      }
    }
  };

  if (loading) return null; // Or a spinner

  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw'
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Jar<span style={{ color: 'var(--primary)' }}>.edu</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isRegistering ? "Registro de Cuenta Unica" : "Sistema de Comunicación Intra-Escolar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={{ position: 'relative', textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Usuario Unico</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-field"
                placeholder="usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingRight: '100px' }}
                autoFocus
                required
              />
              <span style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}>
                @jar.edu
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Contraseña</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>
            {isRegistering ? "Registrar Cuenta" : "Acceder al Sistema"}
          </button>
        </form>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isRegistering ? (
            <>¿Ya tienes cuenta? <button onClick={() => setIsRegistering(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Inicia Sesión</button></>
          ) : (
            <>¿Nuevo estudiante? <button onClick={() => setIsRegistering(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Crea tu cuenta única</button></>
          )}
        </div>
      </div>
    </main>
  );
}
