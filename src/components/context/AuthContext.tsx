'use client';

// import "@/drizzle/envConfig";
import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { actionProps, AuthContextProps, initialStateProps } from './types';

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const reducer = (state: initialStateProps, action: actionProps) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, loading, error } = state;
  const router = useRouter();

  const fetchUser = async () => {
    try {
      console.log('BASE_URL', process.env.BASE_URL);
      const { data } = await axios.get(`/api/auth/status`);
      dispatch({ type: 'SET_USER', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_USER', payload: null });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.post(`/login`, {
        email,
        password,
      });
      dispatch({ type: 'SET_USER', payload: response.data.user });
      router.push('/dashboard');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: true });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await axios.get(`/logout`);
      dispatch({ type: 'SET_USER', payload: null });
      router.push('/login');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: true });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
