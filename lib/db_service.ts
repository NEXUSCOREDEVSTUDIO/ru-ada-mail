import { db } from "./firebase";
import { ref, push, onValue, update, remove, set, get, serverTimestamp } from "firebase/database";

export interface Contact {
    phone: string;
    name: string;
}

export interface Message {
    id?: string;
    from: string; // phone number
    to: string;   // phone number
    body: string;
    timestamp: any;
    seen: boolean;
    type: 'text' | 'image';
}

// FORMAT PHONE: helpers to sanitize
export const sanitizePhone = (p: string) => p.replace(/\D/g, '');

// --- CONTACTS ---
export const addContact = async (myPhone: string, contactPhone: string, contactName: string) => {
    const cleanMy = sanitizePhone(myPhone);
    const cleanContact = sanitizePhone(contactPhone);
    const refPath = `users/${cleanMy}/contacts/${cleanContact}`;
    await set(ref(db, refPath), {
        phone: cleanContact,
        name: contactName
    });
};

export const subscribeToContacts = (myPhone: string, callback: (contacts: Contact[]) => void) => {
    const cleanMy = sanitizePhone(myPhone);
    return onValue(ref(db, `users/${cleanMy}/contacts`), (snap) => {
        const data = snap.val();
        if (!data) return callback([]);
        const list = Object.values(data) as Contact[];
        // Sort alpha
        list.sort((a, b) => a.name.localeCompare(b.name));
        callback(list);
    });
}

// --- MESSAGES ---
// Chat ID is usually combination of two phones sorted
export const getChatId = (phone1: string, phone2: string) => {
    const p1 = sanitizePhone(phone1);
    const p2 = sanitizePhone(phone2);
    return p1 < p2 ? `${p1}_${p2}` : `${p2}_${p1}`;
}

export const sendMessage = async (from: string, to: string, body: string) => {
    const chatId = getChatId(from, to);
    const msgRef = ref(db, `chats/${chatId}/messages`);

    await push(msgRef, {
        from: sanitizePhone(from),
        to: sanitizePhone(to),
        body,
        timestamp: serverTimestamp(),
        seen: false,
        type: 'text'
    });

    // Update "last message" for both users (for chat list preview if we implemented that)
};

export const subscribeToChat = (chatId: string, callback: (msgs: Message[]) => void) => {
    return onValue(ref(db, `chats/${chatId}/messages`), (snap) => {
        const data = snap.val();
        if (!data) return callback([]);

        const list = Object.entries(data).map(([key, val]: [string, any]) => ({
            id: key,
            ...val
        }));
        // Sort by time
        list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        callback(list);
    });
};

// EDIT & DELETE
export const deleteMessage = async (chatId: string, msgId: string) => {
    await remove(ref(db, `chats/${chatId}/messages/${msgId}`));
};

export const editMessage = async (chatId: string, msgId: string, newBody: string) => {
    await update(ref(db, `chats/${chatId}/messages/${msgId}`), {
        body: newBody
    });
};
