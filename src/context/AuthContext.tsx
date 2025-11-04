import  { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "../api/axios";
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

export const AuthProvider = ({ children, sessionCheckUrl = "/users/session/" }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const refresh = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(sessionCheckUrl, {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                },
            });
            if (res.status !== 200) {
                // treat non-2xx as unauthenticated but capture message if present
                const message =
                    (res.data && (res.data.detail || res.data.message)) ||
                    res.statusText ||
                    `HTTP ${res.status}`;
                setAuthenticated(false);
                setUser(null);
                setError(message);
                return;
            }

            const data = res.data;
            if (data?.authenticated) {
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

  useEffect(() => {
    refresh();
  }, []);


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