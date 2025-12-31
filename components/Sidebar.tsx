"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Contact, subscribeToContacts, addContact } from "@/lib/db_service";
import Link from "next/link";
import { signOut } from "firebase/auth";

export default function Sidebar({ onSelectChat }: { onSelectChat?: (phone: string) => void }) {
    // onSelectChat used if using a split view. 
    // Currently, we'll assume navigation via URL for better deep linking or state lift?
    // Let's stick to Link if possible or props.

    const [userPhone, setUserPhone] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newContactPhone, setNewContactPhone] = useState("");
    const [newContactName, setNewContactName] = useState("");

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(u => {
            if (u && u.email) {
                const ph = u.email.split('@')[0];
                setUserPhone(ph);
                const unsubContacts = subscribeToContacts(ph, setContacts);
                return () => unsubContacts();
            }
        });
        return () => unsub();
    }, []);

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContactPhone || !newContactName) return;
        await addContact(userPhone, newContactPhone, newContactName);
        setShowAdd(false);
        setNewContactName("");
        setNewContactPhone("");
    };

    return (
        <aside style={{
            width: '400px',
            background: 'var(--panel-bg)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 16px',
                background: 'var(--panel-header)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '60px'
            }}>
                <div style={{ fontWeight: 600, color: '#e9edef' }}>Chats</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button title="Cerrar Sessión" onClick={() => signOut(auth)} className="btn-icon">✖</button>
                </div>
            </div>

            {/* Search / Add */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="chat-input"
                    style={{ textAlign: 'center', cursor: 'pointer', background: '#2a3942' }}
                >
                    {showAdd ? 'Cancelar' : '+ Nuevo Chat / Contacto'}
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAddContact} style={{ padding: '1rem', background: '#2a3942', borderBottom: '1px solid var(--border-color)' }}>
                    <input
                        placeholder="Nombre"
                        className="chat-input"
                        style={{ marginBottom: '0.5rem', background: '#202c33' }}
                        value={newContactName}
                        onChange={e => setNewContactName(e.target.value)}
                        required
                    />
                    <input
                        placeholder="Teléfono"
                        className="chat-input"
                        style={{ marginBottom: '0.5rem', background: '#202c33' }}
                        value={newContactPhone}
                        onChange={e => setNewContactPhone(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '4px' }}>Agregar a Contactos</button>
                </form>
            )}

            {/* Chat List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {contacts.map(c => (
                    <div
                        key={c.phone}
                        onClick={() => onSelectChat && onSelectChat(c.phone)}
                        style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2a3942'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{ width: '45px', height: '45px', background: '#6a7175', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                            👤
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.phone}</div>
                        </div>
                    </div>
                ))}
                {contacts.length === 0 && !showAdd && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        No tienes contactos. Añade uno con el botón de arriba.
                    </div>
                )}
            </div>
        </aside>
    );
}
