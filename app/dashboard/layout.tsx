import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                padding: '1rem',
                paddingLeft: 0,
                height: '100%',
                overflow: 'hidden'
            }}>
                <div className="glass-panel" style={{
                    height: '100%',
                    width: '100%',
                    padding: '2rem',
                    overflowY: 'auto'
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
