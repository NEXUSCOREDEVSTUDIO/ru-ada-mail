"use client";

import { useEffect, useState } from "react";
import { Email, subscribeToInbox } from "@/lib/db_service";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function InboxPage() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to auth changes properly
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && user.email) {
                const unsubscribeDB = subscribeToInbox(user.email, (data) => {
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
                            <span style={{ fontSize: '1.1rem', color: 'white' }}>De: <span style={{ color: 'var(--primary)' }}>{selectedEmail.from}</span></span>
                            <span style={{ fontSize: '0.9rem' }}>Para: {selectedEmail.to}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Bandeja de Entrada</h1>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {emails.length} mensajes
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando mensajes...</div>
            ) : emails.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                    No tienes correos nuevos.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {emails.map((email) => (
                        <div
                            key={email.id}
                            onClick={() => setSelectedEmail(email)}
                            style={{
                                padding: '1.25rem 1.5rem',
                                background: email.read ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.05)',
                                borderLeft: email.read ? '2px solid transparent' : '2px solid var(--primary)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = email.read ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.05)'}
                        >
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                flexShrink: 0,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}>
                                {email.from.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: email.read ? 400 : 700, fontSize: '1rem' }}>{email.from}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {email.date ? new Date(email.date).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <div style={{ fontWeight: email.read ? 400 : 600, marginBottom: '0.25rem', color: 'var(--foreground)' }}>
                                    {email.subject}
                                </div>
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
