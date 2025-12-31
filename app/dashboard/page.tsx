"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { Message, sendMessage, subscribeToChat, getChatId, deleteMessage, editMessage } from "@/lib/db_service";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
    const [activeChatPhone, setActiveChatPhone] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [myPhone, setMyPhone] = useState("");
    const [inputText, setInputText] = useState("");
    const [editingMsgId, setEditingMsgId] = useState<string | null>(null);

    // Create a ref for auto-scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(u => {
            if (u && u.email) {
                setMyPhone(u.email.split('@')[0]);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (activeChatPhone && myPhone) {
            const chatId = getChatId(myPhone, activeChatPhone);
            const unsub = subscribeToChat(chatId, setMessages);
            return () => unsub();
        }
    }, [activeChatPhone, myPhone]);

    useEffect(() => {
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !activeChatPhone) return;

        if (editingMsgId) {
            const chatId = getChatId(myPhone, activeChatPhone);
            await editMessage(chatId, editingMsgId, inputText);
            setEditingMsgId(null);
        } else {
            await sendMessage(myPhone, activeChatPhone, inputText);
        }
        setInputText("");
    };

    const handleDelete = async (msgId: string) => {
        if (!activeChatPhone || !confirm("¿Eliminar mensaje?")) return;
        const chatId = getChatId(myPhone, activeChatPhone);
        await deleteMessage(chatId, msgId);
    };

    const startEdit = (msg: Message) => {
        if (msg.id) {
            setEditingMsgId(msg.id);
            setInputText(msg.body);
        }
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* LEFT SIDE: LIST */}
            <Sidebar onSelectChat={setActiveChatPhone} />

            {/* RIGHT SIDE: CHAT */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0b141a', position: 'relative' }}>
                {/* Background pattern */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                    opacity: 0.06,
                    pointerEvents: 'none'
                }} />

                {activeChatPhone ? (
                    <>
                        {/* Header */}
                        <div style={{
                            height: '60px',
                            background: 'var(--panel-header)',
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            borderLeft: '1px solid var(--border-color)',
                            zIndex: 10
                        }}>
                            <div style={{ width: '40px', height: '40px', background: '#6a7175', borderRadius: '50%', marginRight: '1rem', display: 'grid', placeItems: 'center' }}>
                                👤
                            </div>
                            <div style={{ fontWeight: 500 }}>{activeChatPhone}</div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 5 }}>
                            {messages.map(msg => {
                                const isMe = msg.from === myPhone;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`msg-bubble ${isMe ? 'msg-outgoing' : 'msg-incoming'}`}
                                        onDoubleClick={() => isMe && startEdit(msg)}
                                    >
                                        {msg.body}
                                        <div className="msg-meta">
                                            {isMe && (
                                                <div style={{ display: 'inline-block', marginRight: '4px' }}>
                                                    <button onClick={() => handleDelete(msg.id!)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '10px' }}>🗑️</button>
                                                </div>
                                            )}
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isMe && <span style={{ marginLeft: '2px', color: msg.seen ? '#53bdeb' : 'inherit' }}>✓✓</span>}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '10px 16px', background: 'var(--panel-header)', zIndex: 10 }}>
                            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button type="button" className="btn-icon">😊</button>
                                <button type="button" className="btn-icon">📎</button>
                                <input
                                    className="chat-input"
                                    placeholder={editingMsgId ? "Editando mensaje..." : "Escribe un mensaje"}
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    autoFocus
                                />
                                {editingMsgId && <button type="button" onClick={() => { setEditingMsgId(null); setInputText(""); }} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>✖</button>}
                                <button type="submit" className="btn-icon">➤</button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderLeft: '1px solid var(--border-color)', color: '#8696a0', zIndex: 5 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                        <h2 style={{ fontWeight: 300, color: '#e9edef' }}>AsereMail para Web</h2>
                        <p style={{ maxWidth: '400px', marginTop: '1rem' }}>Envía y recibe mensajes sin necesidad de mantener tu teléfono conectado. Usa AsereMail en hasta 4 dispositivos vinculados y 1 teléfono.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
