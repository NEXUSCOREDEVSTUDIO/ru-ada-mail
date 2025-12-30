"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/");
            } else {
                setUserEmail(user.email || "");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="glass-panel" style={{
            width: '280px',
            height: 'calc(100vh - 2rem)',
            margin: '1rem',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative glow */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-20%',
                width: '150%',
                height: '50%',
                background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15), transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div style={{ marginBottom: '3rem', position: 'relative' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Jar<span style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>.edu</span>
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Intranet Segura
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <Link href="/dashboard/compose" className="btn" style={{
                    marginBottom: '1.5rem',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Mensaje
                </Link>

                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                    MENU PRINCIPAL
                </div>

                <Link href="/dashboard" style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    background: isActive('/dashboard') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: isActive('/dashboard') ? 'white' : 'var(--text-secondary)',
                    border: isActive('/dashboard') ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                }}>
                    📤 <span style={{ flex: 1 }}>Bandeja de Entrada</span>
                </Link>
                <Link href="/dashboard/sent" style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    background: isActive('/dashboard/sent') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: isActive('/dashboard/sent') ? 'white' : 'var(--text-secondary)',
                    border: isActive('/dashboard/sent') ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                }}>
                    🚀 <span style={{ flex: 1 }}>Enviados</span>
                </Link>
            </nav>

            <div style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '1rem',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--text-muted), var(--background))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                }}>
                    👤
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sesión actual</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {userEmail.split('@')[0]}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    title="Cerrar Sesión"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                        e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                >
                    ✕
                </button>
            </div>
        </aside>
    );
}
