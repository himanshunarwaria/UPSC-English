import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { registerUser, initializeUserProgress, setLoggedInUserId } from '../services/userTrackingService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading, null = logged out

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        registerUser(firebaseUser.uid, {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        })
        initializeUserProgress(firebaseUser.uid)
        setLoggedInUserId(firebaseUser.uid)
        setUser(firebaseUser)
      } else {
        setLoggedInUserId(null)
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
