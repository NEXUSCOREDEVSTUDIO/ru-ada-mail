"use client";

import { useEffect, useState } from "react";
import { Email, subscribeToSent } from "@/lib/db_service";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SentPage() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to auth
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && user.email) {
                const unsubscribeDB = subscribeToSent(user.email, (data) => {
                    setEmails(data);
                    setLoading(false);
                });
                return () => unsubscribeDB();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    if (selectedEmail) {
        return (
            <div style={{ animation: 'fadeIn 0.3s' }}>
                <button
                    onClick={() => setSelectedEmail(null)}
                    className="btn btn-secondary"
                    style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    ← Volver
                </button>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedEmail.subject}</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem' }}>De: {selectedEmail.from}</span>
                            <span style={{ fontSize: '1.1rem', color: 'white' }}>Para: <span style={{ color: 'var(--accent)' }}>{selectedEmail.to}</span></span>
                        </div>
                        <span style={{ fontSize: '0.9rem' }}>
                            {selectedEmail.date ? new Date(selectedEmail.date).toLocaleString() : 'Reciente'}
                        </span>
                    </div>
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', minHeight: '200px' }}>
                        {selectedEmail.body}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Enviados</h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando enviados...</div>
            ) : emails.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                    No has enviado correos.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {emails.map((email) => (
                        <div
                            key={email.id}
                            onClick={() => setSelectedEmail(email)}
                            style={{
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--glass-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>
                                ↗
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 600 }}>Para: {email.to}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {email.date ? new Date(email.date).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{email.subject}</div>
                                <div style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {email.body}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
