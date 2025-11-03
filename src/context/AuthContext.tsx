import  { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
    username: string;
    email: string;
};

type AuthState = {
    user: User | null;
    authenticated: boolean;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
    /**
     * URL of the session-check endpoint. Defaults to the Django view endpoint.
     * Make sure to include credentials (cookies) on the request so Django session auth works.
     */
    sessionCheckUrl?: string;
};

export const AuthProvider = ({ children, sessionCheckUrl = "/api/users/sessions/" }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(sessionCheckUrl, {
                method: "GET",
                credentials: "include", // include cookies for Django session auth
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!res.ok) {
                // treat non-2xx as unauthenticated but capture message if present
                const text = await res.text().catch(() => "");
                setAuthenticated(false);
                setUser(null);
                setError(text || `HTTP ${res.status}`);
                return;
            }

            const data = await res.json();
            if (data.authenticated) {
                setAuthenticated(true);
                setUser(data.user ?? null);
            } else {
                setAuthenticated(false);
                setUser(null);
            }
        } catch (err: any) {
            setAuthenticated(false);
            setUser(null);
            setError(err?.message ?? "Network error");
        } finally {
            setLoading(false);
        }
    };



    return (
        <AuthContext.Provider value={{ user, authenticated, loading, error, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthState => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
};