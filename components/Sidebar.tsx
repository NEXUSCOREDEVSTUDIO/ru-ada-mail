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
                // Sync with local fallback if needed for legacy components, but try to use context in future
                localStorage.setItem("jar_user", user.email || "");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("jar_user");
        router.push("/");
    };

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="glass-panel" style={{
            width: '250px',
            height: 'calc(100vh - 2rem)',
            margin: '1rem',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem'
        }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    Jar<span style={{ color: 'var(--primary)' }}>.edu</span>
                </h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <Link href="/dashboard" style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: isActive('/dashboard') ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: isActive('/dashboard') ? 'white' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 500
                }}>
                    📥 Bandeja de Entrada
                </Link>
                <Link href="/dashboard/sent" style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: isActive('/dashboard/sent') ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: isActive('/dashboard/sent') ? 'white' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 500
                }}>
                    📤 Enviados
                </Link>

                <Link href="/dashboard/compose" style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                }}>
                    ✏️ Redactar
                </Link>
            </nav>

            <div style={{
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '1rem',
                marginTop: '1rem'
            }}>
                <div style={{ fontSize: '0.875rem', color: 'white', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userEmail}
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        padding: 0
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
