// NOTE: Added local login auth store. Do not refactor core app logic.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Fixed user credentials for security
const VALID_USERS = [
    { username: 'thanh', password: 'thanh123' },
    { username: 'xuan', password: 'muipun123' }
];

interface User {
    username: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: (username: string, password: string) => {
                // Validate credentials against fixed users
                const validUser = VALID_USERS.find(
                    user => user.username === username && user.password === password
                );

                if (validUser) {
                    set({
                        user: { username: validUser.username },
                        isAuthenticated: true
                    });
                    return true;
                }

                return false;
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false
                });
                // Clear localStorage
                localStorage.removeItem('auth-storage');
            },

            checkAuth: () => {
                const state = get();
                return state.isAuthenticated && state.user !== null;
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);