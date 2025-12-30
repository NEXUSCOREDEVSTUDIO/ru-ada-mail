"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmail } from "@/lib/db_service";
import { auth } from "@/lib/firebase";

export default function ComposePage() {
    const router = useRouter();
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!to.trim() || !subject.trim() || !body.trim()) return;

        setSending(true);
        const user = auth.currentUser;

        if (user && user.email) {
            // Ensure 'to' has domain
            let recipient = to.trim();
            if (!recipient.includes('@')) {
                recipient += '@jar.edu';
            }

            try {
                await sendEmail(user.email, recipient, subject, body);
                router.push("/dashboard/sent");
            } catch (error) {
                console.error("Error sending email:", error);
                alert("Error al enviar. Verifica tu conexión.");
            }
        } else {
            alert("Sesión no válida. Por favor recarga.");
        }
        setSending(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Redactar Nuevo</h1>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Para:</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="usuario (se añade @jar.edu automáticamente)"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                        disabled={sending}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Asunto:</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Asunto del mensaje"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={sending}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mensaje:</label>
                    <textarea
                        className="input-field"
                        style={{ minHeight: '300px', resize: 'vertical' }}
                        placeholder="Escribe tu mensaje aquí..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        disabled={sending}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={sending}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={sending}
                        className="btn"
                        style={{ minWidth: '120px' }}
                    >
                        {sending ? 'Enviando...' : 'Enviar ✈️'}
                    </button>
                </div>

            </form>
        </div>
    );
}
