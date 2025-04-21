import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  username: string;
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Intentar recuperar el usuario y token del localStorage al iniciar
const loadState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    const userJSON = localStorage.getItem('user');
    const user = userJSON ? JSON.parse(userJSON) : null;
    
    return {
      user,
      token,
      isAuthenticated: !!token,
    };
  } catch (e) {
    console.error('Error loading auth state:', e);
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;