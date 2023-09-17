/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";



const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()


    async function signup(email, password) {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // User is signed up
        } catch (error) {
            console.error('Error signing up:', error.message);
            throw error; // Rethrow the error to handle it in the component that calls signup
        }
    }

    async function login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // User is signed up
        } catch (error) {
            console.error('Error signing up:', error.message);
            throw error; // Rethrow the error to handle it in the component that calls signup
        }
    }

    function logout() {
        return signOut()
    }




    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

    )
}

