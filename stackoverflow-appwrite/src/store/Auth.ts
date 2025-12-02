import { create } from "zustand";
import { Immer } from "immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "../models/client/config";
import { immer } from "zustand/middleware/immer";
import env from "../app/env";

export interface UserPrefs {
    reputation: number

}

interface IAuthStore {
    session: Models.Session | null;
    jwt: string | null
    user: Models.User<UserPrefs> | null
    hydrated: boolean

    setHydrated(): void;
    verifySession(): Promise<void>;
    login(
        email: string,
        password: string
    ): Promise<
        {
            success: boolean;
            error?: AppwriteException | null;
        }>
    CreateAccount(
        name: string,
        email: string,
        password: string
    ): Promise<
        {
            success: boolean;
            error?: AppwriteException | null;
        }>
    logout(): Promise<void>
}


export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,
            setHydrated() {
                set({ hydrated: true })
            },

            async verifySession() {
                try {
                    const session = await account.getSession("current")
                    const user = await account.get<UserPrefs>()
                    const { jwt } = await account.createJWT()
                    set({ session, user, jwt })
                } catch (error) {
                    set({ session: null, user: null, jwt: null })
                }
            },
            async login(email: string, password: string) {
                try {
                    // Delete any existing session first
                    try {
                        await account.deleteSession("current")
                    } catch (e) {
                        // No existing session, continue
                    }

                    const session = await account.createEmailPasswordSession(email, password)
                    const user = await account.get<UserPrefs>()
                    
                    // Skip JWT and prefs update to avoid authorization errors
                    set({ session, user, jwt: null })
                    return { success: true }
                } catch (error) {
                    console.log('Login failed:', error)
                    // Clear any persisted session data on login failure
                    set({ session: null, user: null, jwt: null })
                    return {
                        success: false,
                        error: error instanceof AppwriteException ?
                            error : null,
                    }
                }
            },
            async CreateAccount(name: string, email: string, password: string) {
                try {
                    // Check if there's already an active session and delete it
                    try {
                        const existingSession = await account.getSession("current")
                        if (existingSession) {
                            await account.deleteSession("current")
                        }
                    } catch (e) {
                        // No existing session, continue
                    }

                    await account.create(ID.unique(), email, password, name)
                    return { success: true }

                } catch (error) {
                    console.log(error)
                    return {
                        success: false,
                        error: error instanceof AppwriteException ?
                            error : null,
                    }
                }

            },
            async logout() {
                try {
                    await account.deleteSessions()
                    set({ session: null, jwt: null, user: null })
                } catch (error) {
                    console.log(error)
                }

            },


        })),
        {
            name: "auth",
            partialize: (state) => ({
                session: state.session,
                user: state.user,
                jwt: state.jwt
            }),
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error && state) {
                        state.setHydrated()
                    }
                }
            }
        }
    )
)