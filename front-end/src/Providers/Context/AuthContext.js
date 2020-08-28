import { createContext } from 'react';
import jwt from 'jwt-decode';

export const getToken = () => localStorage.getItem('token') ? localStorage.getItem('token') : '';

export const getUser = token => {
    try {
        return jwt(token)
    } catch (error) {
        localStorage.removeItem('token');
        return null
    }
}


const AuthContext = createContext({
    user: null,
    // isLogged: false,
    setUser: () => {}
});

export default AuthContext
