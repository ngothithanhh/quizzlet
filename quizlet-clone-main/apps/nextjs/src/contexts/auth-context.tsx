"use client";

import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  clearTokens,
  getAccessToken,
  getUserFromToken,
  setTokens,
  type UserInfo,
} from "~/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/quizzlet";

interface AuthState {
  user: UserInfo | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => undefined,
  logout: async () => undefined,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate auth state from stored tokens on mount
  useEffect(() => {
    const userInfo = getUserFromToken();
    setUser(userInfo);
    setIsLoading(false);
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken);
    const userInfo = getUserFromToken();
    setUser(userInfo);
  }, []);

  const logout = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      try {
        await fetch(`${BACKEND_URL}/api/auth/logout?token=${token}`, {
          method: "POST",
        });
      } catch {
        // ignore network errors on logout
      }
    }
    clearTokens();
    setUser(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthState => useContext(AuthContext);

export default AuthProvider;
