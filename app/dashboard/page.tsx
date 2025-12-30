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
            <div className="animate-enter" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <button
                    onClick={() => setSelectedEmail(null)}
                    className="btn-secondary"
                    style={{
                        marginBottom: '1.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    ← Volver a la lista
                </button>

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px' }}>
                    <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>{selectedEmail.subject}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}>
                                    {selectedEmail.from.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedEmail.from}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Para: {selectedEmail.to}</div>
                                </div>
                            </div>
                            <div style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)'
                            }}>
                                {selectedEmail.date ? new Date(selectedEmail.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }) : 'Reciente'}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap',
                        minHeight: '200px',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit'
                    }}>
                        {selectedEmail.body}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Entrada</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Gestiona tus comunicaciones escolares</p>
                </div>
                <div style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--glass-bg)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--glass-border)'
                }}>
                    {emails.length} mensajes totales
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>🌀</div>
                    <div style={{ color: 'var(--text-muted)' }}>Sincronizando correos...</div>
                </div>
            ) : emails.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', borderRadius: '24px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Todo al día</h3>
                    <p style={{ color: 'var(--text-muted)' }}>No tienes correos nuevos en tu bandeja.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {emails.map((email, i) => (
                        <div
                            key={email.id}
                            className="list-item animate-enter"
                            style={{
                                animationDelay: `${i * 0.05}s`,
                                padding: '1.25rem 1.5rem',
                                background: email.read ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                border: email.read ? '1px solid transparent' : '1px solid rgba(99, 102, 241, 0.3)',
                                position: 'relative'
                            }}
                            onClick={() => setSelectedEmail(email)}
                        >
                            {!email.read && (
                                <div style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'var(--accent)',
                                    boxShadow: '0 0 10px var(--accent)'
                                }} />
                            )}

                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                background: email.read ? 'var(--glass-bg)' : 'linear-gradient(135deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                flexShrink: 0,
                                color: 'white'
                            }}>
                                {email.from.charAt(0).toUpperCase()}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', alignItems: 'center' }}>
                                    <span style={{ fontWeight: email.read ? 500 : 700, fontSize: '1rem', color: email.read ? 'var(--text-secondary)' : 'white' }}>
                                        {email.from}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                        {email.date ? new Date(email.date).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <div style={{ fontWeight: email.read ? 400 : 600, marginBottom: '0.35rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                                    {email.subject}
                                </div>
                                <div style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.925rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '90%'
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
