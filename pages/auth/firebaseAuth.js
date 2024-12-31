import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import firebaseApp from "../../firebase";
import React from 'react';

const auth = getAuth(firebaseApp);

export const signIn = (username, password) => {
    const email = `${username}@gmail.com`;
    return signInWithEmailAndPassword(auth, email, password);
  };


export const logout = () => {
    return signOut(auth);
  };
  