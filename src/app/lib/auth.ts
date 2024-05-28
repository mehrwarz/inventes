'use server'
import { cookies } from 'next/headers';
import { encrypt, decrypt } from "./Functions"

class auth {
    checkSession: (session: any) => boolean;
    getSession: (key: any) => any;
    createSession: (user: any) => string;

    constructor() {
        // method to create a session and store sesstion in cookies and return the session Id = creation.
        this.createSession = (user: any) => {
            const sessionId = encrypt(user.id);
            const userSession = encrypt(user);
            cookies().set('session', userSession, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60, // One hour
                path: '/',
            });
            return Date.now().toString();
        }
        // Method to get the session data out of the cookies.

        this.getSession = (key: any) => {
            const session = cookies().get('session');
            if (session) {
                return decrypt(session);
            }
            return null;
        }
        // Method to check if the session is valid.
        this.checkSession = (session: any) => {
            if (session) {
                return true;
            }
            return false;
        }
    }
}

