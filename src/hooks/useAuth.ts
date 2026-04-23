import { useState, useEffect, useCallback, useMemo } from "react";

interface LocalUser {
  id: number;
  name: string;
  email: string;
  role: "client" | "admin";
  phone?: string;
}

interface AuthState {
  user: LocalUser | null;
  isLoading: boolean;
}

const DEFAULT_ADMIN: LocalUser = {
  id: 1,
  name: "Admin Chelato",
  email: "admin@chelato.com.uy",
  role: "admin",
  phone: "+598 99 123 456",
};

const DEFAULT_CLIENT: LocalUser = {
  id: 2,
  name: "Juan Perez",
  email: "juan@email.com",
  role: "client",
  phone: "+598 99 654 321",
};

function loadUsers(): Record<string, LocalUser> {
  const stored = localStorage.getItem("chelato_users");
  if (stored) return JSON.parse(stored);
  const defaults: Record<string, LocalUser> = {
    "admin@chelato.com.uy": DEFAULT_ADMIN,
    "juan@email.com": DEFAULT_CLIENT,
  };
  localStorage.setItem("chelato_users", JSON.stringify(defaults));
  return defaults;
}

function loadSession(): LocalUser | null {
  const stored = localStorage.getItem("chelato_session");
  return stored ? JSON.parse(stored) : null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: loadSession(),
    isLoading: false,
  });

  const login = useCallback((email: string, password: string): boolean => {
    const users = loadUsers();
    const user = users[email.toLowerCase()];
    if (!user) return false;
    // Accept any password for demo
    localStorage.setItem("chelato_session", JSON.stringify(user));
    setState({ user, isLoading: false });
    return true;
  }, []);

  const register = useCallback((name: string, email: string, password: string, role: "client" | "admin" = "client"): boolean => {
    const users = loadUsers();
    const key = email.toLowerCase();
    if (users[key]) return false;
    const newUser: LocalUser = {
      id: Date.now(),
      name,
      email: key,
      role,
    };
    users[key] = newUser;
    localStorage.setItem("chelato_users", JSON.stringify(users));
    localStorage.setItem("chelato_session", JSON.stringify(newUser));
    setState({ user: newUser, isLoading: false });
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("chelato_session");
    setState({ user: null, isLoading: false });
    window.location.reload();
  }, []);

  const isAdmin = state.user?.role === "admin";

  return useMemo(
    () => ({
      user: state.user,
      isAuthenticated: !!state.user,
      isLoading: state.isLoading,
      isAdmin,
      login,
      register,
      logout,
    }),
    [state.user, state.isLoading, isAdmin, login, register, logout]
  );
}
