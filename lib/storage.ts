export interface Email {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    date: string;
    read: boolean;
}

const STORAGE_KEY = "jar_emails";

export const getEmails = (): Email[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
};

export const saveEmail = (email: Email) => {
    const emails = getEmails();
    const newEmails = [email, ...emails];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEmails));
};

export const getInbox = (userEmail: string) => {
    const emails = getEmails();
    return emails.filter(e => e.to.toLowerCase() === userEmail.toLowerCase());
};

export const getSent = (userEmail: string) => {
    const emails = getEmails();
    return emails.filter(e => e.from.toLowerCase() === userEmail.toLowerCase());
};

// Seed some functionality if empty
export const seedDefaults = (userEmail: string) => {
    const emails = getEmails();
    const hasWelcome = emails.some(e => e.to === userEmail && e.subject === "Bienvenido a Jar Edu");

    if (!hasWelcome) {
        const welcomeEmail: Email = {
            id: Date.now().toString(),
            from: "admin@jar.edu",
            to: userEmail,
            subject: "Bienvenido a Jar Edu",
            body: `Hola,\n\nBienvenido al sistema de comunicación oficial de Jar Edu.\n\nEste sistema te permite comunicarte con tus compañeros y profesores.\n\nAtentamente,\nLa Administración`,
            date: new Date().toISOString(),
            read: false
        };
        saveEmail(welcomeEmail);
    }
};
