import { db } from "./firebase";
import { ref, push, onValue, query, orderByChild, equalTo, serverTimestamp, set } from "firebase/database";

export interface Email {
    id?: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    date: any; // Timestamp
    read: boolean;
}

// Subscribe to emails received by the user
export const subscribeToInbox = (userEmail: string, callback: (emails: Email[]) => void) => {
    if (!userEmail) return () => { };

    // Note: Firebase Realtime Database filtering needs an index on 'to' in rules
    // For now we will fetch 'emails' and filter client side if the dataset is small,
    // OR ideally we structure data as `user_emails/{sanitized_email}/{email_id}`

    const sanitizedEmail = userEmail.replace(/\./g, ','); // Firebase keys can't contain '.'
    const userInboxRef = ref(db, `inboxes/${sanitizedEmail}`);

    return onValue(userInboxRef, (snapshot) => {
        const data = snapshot.val();
        const loadedEmails: Email[] = [];
        if (data) {
            Object.entries(data).forEach(([key, value]: [string, any]) => {
                loadedEmails.push({
                    id: key,
                    ...value,
                    date: value.date || Date.now()
                });
            });
        }
        // Sort by date desc
        loadedEmails.sort((a, b) => b.date - a.date);
        callback(loadedEmails);
    });
};

// Subscribe to sent emails
export const subscribeToSent = (userEmail: string, callback: (emails: Email[]) => void) => {
    if (!userEmail) return () => { };
    const sanitizedEmail = userEmail.replace(/\./g, ',');
    const userSentRef = ref(db, `sent/${sanitizedEmail}`);

    return onValue(userSentRef, (snapshot) => {
        const data = snapshot.val();
        const loadedEmails: Email[] = [];
        if (data) {
            Object.entries(data).forEach(([key, value]: [string, any]) => {
                loadedEmails.push({
                    id: key,
                    ...value,
                    date: value.date || Date.now()
                });
            });
        }
        loadedEmails.sort((a, b) => b.date - a.date);
        callback(loadedEmails);
    });
};

// Send an email
export const sendEmail = async (from: string, to: string, subject: string, body: string) => {
    const emailData = {
        from,
        to,
        subject,
        body,
        date: serverTimestamp(),
        read: false
    };

    // 1. Add to recipient's inbox
    const recipientSanitized = to.replace(/\./g, ',');
    const inboxRef = ref(db, `inboxes/${recipientSanitized}`);
    await push(inboxRef, emailData);

    // 2. Add to sender's sent folder
    const senderSanitized = from.replace(/\./g, ',');
    const sentRef = ref(db, `sent/${senderSanitized}`);
    await push(sentRef, emailData);
};
