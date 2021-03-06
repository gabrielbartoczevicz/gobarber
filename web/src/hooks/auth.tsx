import React, { createContext, useCallback, useState, useContext } from 'react';

import client from '../services/client';

interface User {
  id: string;
  avatar_url?: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface Credentials {
  email: string;
  password: string;
}

interface Context {
  user: User;
  signIn(c: Credentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<Context>({} as Context);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@gobarber/token');
    const user = localStorage.getItem('@gobarber/user');

    if (token && user) {
      client.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: Credentials) => {
    const res = await client.post('/sessions', {
      email,
      password,
    });

    const { token, user } = res.data;

    localStorage.setItem('@gobarber/token', token);
    localStorage.setItem('@gobarber/user', JSON.stringify(user));

    client.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback((): void => {
    localStorage.removeItem('@gobarber/token');
    localStorage.removeItem('@gobarber/user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      });
      localStorage.setItem('@gobarber/user', JSON.stringify(user));
    },
    [data],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): Context {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
